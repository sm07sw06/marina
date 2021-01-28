package com.a1ck.api;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;

import com.a1ck.quarts.CronJobStatus;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;

@Path("/demo")
public class DemoPage {
	
	public Logger logger = Logger.getLogger(this.getClass().getName()+".class");	
	
	public Connection connectionMng    = null; 
	public Connection connectionDest   = null; 

	public String sQuery = null;
	public Statement mStatment;
	
	public String sBaseDate  = null; 
	public String gsCurrTime = null;
	
	ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 

	private int RiskIndexCalc_baseDate() throws SQLException {

		logger.debug( "RiskIndexCalcTest_baseDate start...");
		
		mStatment = connectionDest.createStatement();
		sQuery = "SELECT now()+ interval '-1 day' ";
		
		ResultSet mResultSet = mStatment.executeQuery(sQuery);
		while (mResultSet.next()) {
			sBaseDate = mResultSet.getString(1);
		}
		mStatment.close();

		logger.debug("기준일자는 " + sBaseDate + "일 입니다.");

		logger.debug( "RiskIndexCalcTest_baseDate end...");
		
		return 0;		
	}
	
	
	private int RiskIndexCalc_process() throws SQLException {

		mStatment = connectionDest.createStatement();
		sQuery = "SELECT now()+ interval '-1 day' ";
		
		ResultSet mResultSet = mStatment.executeQuery(sQuery);
		while (mResultSet.next()) {
			sBaseDate = mResultSet.getString(1);
		}
		mStatment.close();

		logger.debug("기준일자2는 " + sBaseDate + "일 입니다.");

		logger.debug( "RiskIndexCalcTest_process end...");
		
		return 0;		
	}
	
	
	@SuppressWarnings("unchecked")
	@GET
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	@Path("/riskCalc/{id}")
	/*
	 * 3.공기질 센서 마지막 데이터 요청
	 * id : 공지질센서 id
	 */
	public String getRiskCalc(@PathParam("id") String id) {
		
		logger.debug("" );
		logger.debug("" );
		logger.debug("" );
		logger.debug("Argument ======= : /riskCalc/{id}"  );
		logger.debug("== id  :[" + id  + "]");
		logger.debug("============================================== "    );
		
		UtilClass  utilClass = new UtilClass();
		CronJobStatus  cronJobStatus = null;
		JSONObject jsonobj = new JSONObject();
		
		gsCurrTime = utilClass.getCurrentTime();
		int nRtn = 0;
		
		logger.error("gsCurrTime:" + gsCurrTime);
		

		try {
			
			//conMgr = new ConnectionManagerAll4("postgresql"); 
			
			connectionMng = conMgr.getConnection(); 
			connectionDest = conMgr.getConnection(); 
			
			cronJobStatus = new CronJobStatus();
	        
			cronJobStatus.SetJobStart(connectionMng, "RiskIndex", gsCurrTime);
			
			connectionDest.setAutoCommit(false);
	
			nRtn = RiskIndexCalc_baseDate();
	
			if (nRtn >= 0 ) { 
				Thread.sleep(1000 * 10); //10초 대기
				
				nRtn = RiskIndexCalc_process();      // 조직 Head 정보 생성
				if (nRtn >= 0 ) {
					logger.debug("정보 생성이 완료되었습니다.");
				} else {
					connectionDest.rollback();
					logger.error("정보를 생성시 오류가 발생했습니다.");
					jsonobj.put("result"  ,"ERROR");
				}
	
				connectionDest.commit();
				
				cronJobStatus.SetJobEnd(connectionMng, "RiskIndex", gsCurrTime);
				
				jsonobj.put("result"  ,"OK");
			}
			else {
				connectionDest.rollback();
				logger.error("기준일자를 가져오지 못했습니다.");
				jsonobj.put("result"  ,"ERROR");
			}
		} catch (Exception e) {
			jsonobj.put("result"  ,"ERROR");
			e.printStackTrace();
		} finally {
			try{
				if(connectionMng != null)
					conMgr.freeConnection(connectionMng);
				if(connectionDest != null)
					conMgr.freeConnection(connectionDest);
			}catch(Exception e){
				e.printStackTrace();
			}
		}

		return jsonobj.toString();
	}

	
	
}
