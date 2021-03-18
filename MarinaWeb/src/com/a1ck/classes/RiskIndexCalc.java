package com.a1ck.classes;


import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Vector;

import org.apache.log4j.Logger;

import com.a1ck.quarts.CronJobStatus;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;


public class RiskIndexCalc {
 
	class RiskIndexClass { 
		int seq;
		String itemcode ;
		String itemName ;
		int weight; 
		int compVal;
	}
	
	public Logger logger = Logger.getLogger(this.getClass().getName()+".class");	
	ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
	
	public Connection connectionMng    = null; 
	public Connection connectionDest   = null; 

	public String sQuery = null;
	public Statement mStatment;
	
	public String sBaseDate     = null;
	public String gsCurrTime = null;
	
	int nWeightSum = 0;
	
	UtilClass  utilClass = null;

	CronJobStatus  cronJobStatus = null;
	
	Vector<RiskIndexClass> vt = null; 

	public RiskIndexCalc() throws Exception {
		
		logger.debug( "Start RiskIndexCalcTest!!!!!................");

		vt = new Vector<RiskIndexClass>(); 
		
		RiskIndexCalcTest_run();

	}

	private int RiskIndexCalcTest_baseDate() throws SQLException {

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
	
	
	private int RiskIndexCalcTest_process() throws SQLException {

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
	
	private void RiskIndexCalcTest_run() throws Exception {

		int nRtn = 0;
		
		UtilClass  utilClass = new UtilClass();

		gsCurrTime = utilClass.getCurrentTime();

		logger.error("gsCurrTime:" + gsCurrTime);
	
		try {

			connectionMng = conMgr.getConnection(); 
			connectionDest = conMgr.getConnection(); 
			
			
			cronJobStatus = new CronJobStatus();
			
			cronJobStatus.SetJobStart(connectionMng, "RiskIndex", gsCurrTime);
			
			connectionDest.setAutoCommit(false);
	
			nRtn = RiskIndexCalcTest_baseDate();
	
			if (nRtn >= 0 ) { 
				//nRtn = RiskIndexCalcTest_5percent();      // 원천 데이터 5% 생성
				//logger.debug("원천 데이터 5% 생성작업이 완료되었습니다.");
			}
			else {
				connectionDest.rollback();
				logger.error("기준일자를 가져오지 못했습니다.");
				return ;
			}
			
			Thread.sleep(1000 * 10); //10초 대기
				
			nRtn = RiskIndexCalcTest_process();      // 조직 Head 정보 생성
			if (nRtn >= 0 ) {
				logger.debug("정보 생성이 완료되었습니다.");
			} else {
				connectionDest.rollback();
				logger.error("정보를 생성시 오류가 발생했습니다.");
				return;
			}

			connectionDest.commit();
			
			cronJobStatus.SetJobEnd(connectionMng, "RiskIndex", gsCurrTime);
			
		
		} catch (Exception e) {
			try {
				cronJobStatus.SetJobStatus(connectionMng, "RiskIndex", gsCurrTime,"E",e.getMessage());
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		} finally {
			if (connectionDest != null)
				try {
					conMgr.freeConnection(connectionDest);
				} catch (Exception e) {
					logger.error(e.getMessage());
					e.printStackTrace();
				} 
			if (connectionMng != null)
				try {
					conMgr.freeConnection(connectionMng);
				} catch (Exception e) {
					logger.error(e.getMessage());
					e.printStackTrace();
				} 
		}
		
		logger.info("=== 기준일자 " + sBaseDate + "의 작업이 모두 완료되었습니다. ===");
		
	}

	public static void main(String[] args) throws Exception {

		//RiskIndexCalcTestRun RiskIndexCalcTestRun = new RiskIndexCalcTestRun();
		//RiskIndexCalcTestRun_run(args[0]);		
		;;
	}

}

