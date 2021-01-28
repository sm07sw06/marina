package com.a1ck.job;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;

public class GetJobMonitor extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
	public Connection connectionDest = null;
	
    public GetJobMonitor() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		
		try{

			logger.debug("getJobMonitor ***** Start GetJobMonitor *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sServerId = "";
			String sJobTmFrom  = "";
			String sJobTmTo    = "";
			String sStat   = "";
			String sRows   = "";
			String sPage   = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){ 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getJobMonitor json:" + json); 
	              
	            sJobTmFrom = (String)json.get("__job_tm_from");
	            sJobTmTo   = (String)json.get("__job_tm_to");
	            sStat      = (String)json.get("__stat");
	            sRows      = (String)json.get("__rows");
	            sPage      = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");

				logger.debug("getJobMonitor nRows:" + sRows);
				logger.debug("getJobMonitor nPage:" + sPage);
			}
			
			logger.debug("getJobMonitor sServerId:" + sServerId);
			
		    connectionDest = conMgr.getConnection(); 

			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			if( StringUtils.equals(sStat, "A")) {
				
				sQuery  = "\nSELECT STEP, SUM(C1) AS TARGET, SUM(C2) AS FINISH, SUM(C3) AS ERROR, SUM(C4) AS RESTART, MAX(DETAIL_NM) as STEP_NM \n ";
				sQuery += "  FROM ( \n ";
				sQuery += "		  SELECT '1' AS STEP,COUNT(*) AS C1, 0 AS C2, 0 AS C3, 0 AS C4 \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND (SCAN_STAT_CD != '' ) \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '1',0, COUNT(*),0 , 0  \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND SCAN_STAT_CD = '99' \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '1',0, 0, COUNT(*) ,0  \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND SCAN_STAT_CD != '99' \n ";
				sQuery += "			 AND SCAN_MSG_CD = 'E' \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '1',0, 0,0, COUNT(*)  \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND SCAN_STAT_CD = '44' \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '2',COUNT(*), 0, 0,0 \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND SCAN_STAT_CD = '99'      \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '2',0, COUNT(*),0 ,0 \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND SCAN_STAT_CD = '99'      \n ";
				sQuery += "			 AND FILTER_STAT_CD = '99' \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '2',0, 0, COUNT(*) ,0 \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND SCAN_STAT_CD    = '99'     \n ";
				sQuery += "			 AND FILTER_STAT_CD != '99' \n ";
				sQuery += "			 AND FILTER_MSG_CD   = 'E'   \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '2',0, 0,0, COUNT(*)  \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND FILTER_STAT_CD = '44' \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '3',COUNT(*), 0, 0,0   \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND FILTER_STAT_CD = '99'      \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '3',0, COUNT(*),0 ,0 \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND FILTER_STAT_CD = '99' \n ";
				sQuery += "			 AND LOAD_STAT_CD = '99'      \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '3',0, 0, COUNT(*),0  \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND FILTER_STAT_CD = '99'      \n ";
				sQuery += "			 AND LOAD_STAT_CD != '99' \n ";
				sQuery += "			 AND LOAD_MSG_CD = 'E' \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "		UNION ALL \n ";
				sQuery += "		  SELECT '3',0, 0,0, COUNT(*)  \n ";
				sQuery += "			FROM MDDB.TB_JOB_HISTORY \n ";
				sQuery += "		   WHERE 1 = 1 \n ";
				sQuery += "			 AND LOAD_STAT_CD = '44' \n ";
				sQuery += "          AND JOB_TM >= '" + sJobTmFrom + "0000' AND JOB_TM <= '" + sJobTmTo + "2359' \n ";
				sQuery += "     ) AS T1 , CODEDETAIL T2\n ";
				sQuery += "WHERE T1.STEP = T2.DETAIL_CD AND T2.GROUP_CD ='STEP' \n ";
				sQuery += "GROUP BY STEP \n ";
				sQuery += "ORDER BY STEP \n ";
			} else if( StringUtils.equals(sStat, "B")) {
				sQuery  = "\nSELECT MAX(LICENSE) LICENSE, SUM(SOURCE_SIZE) SOURCE_SIZE, (MAX(LICENSE) - SUM(SOURCE_SIZE)) FREE_SIZE, CEIL(SUM(SOURCE_SIZE) / MAX(LICENSE) * 100) AS RATE \n ";
				sQuery += "  FROM MDDB.TB_JOB_HISTORY , CONFIG \n ";
			} else if( StringUtils.equals(sStat, "C")) {
				sQuery  = "\nSELECT S.SERVER_NM, H.SOURCE_FILE, H.JOB_TM, H.SCAN_END_TM, H.FILTER_END_TM, H.LOAD_END_TM, H.SCAN_MSG||' '||H.FILTER_MSG||' '||H.LOAD_MSG AS MSG \n ";
				sQuery += "    FROM MDDB.TB_JOB_HISTORY H,JOB J, SERVER S \n ";
				sQuery += "   WHERE J.SERVER_ID = S.SERVER_ID  \n ";
				sQuery += "     AND H.JOB_ID = J.JOB_ID  \n ";
				sQuery += "     AND H.JOB_TM >= '" + sJobTmFrom + "' \n "; 
				sQuery += "     AND H.JOB_TM <= '" + sJobTmTo + "' \n ";  
				sQuery += "  ORDER BY H.JOB_TM DESC  \n ";
			}
			
			logger.debug("getJobMonitor sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤

	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				if( StringUtils.equals(sStat, "A")) {
					datas.put("STEP"   	, rs.getString("STEP"));	
					datas.put("STEP_NM" , rs.getString("STEP_NM"));	
					datas.put("TARGET"  , rs.getString("TARGET"));	
					datas.put("FINISH"  , rs.getString("FINISH"));	
					datas.put("ERROR"   , rs.getString("ERROR"));	
					datas.put("RESTART" , rs.getString("RESTART"));
				} else if( StringUtils.equals(sStat, "B")) {
					datas.put("SOURCE_SIZE", rs.getString("SOURCE_SIZE"));	
					datas.put("FREE_SIZE"  , rs.getString("FREE_SIZE"));	
					datas.put("LICENSE"    , rs.getString("LICENSE"));	
					datas.put("RATE"       , rs.getString("RATE"));	
				} else if( StringUtils.equals(sStat, "C")) {
					datas.put("SERVER_NM"    , rs.getString("SERVER_NM"));	
					datas.put("JOB_TM"       , rs.getString("JOB_TM"));	
					datas.put("SOURCE_FILE"  , rs.getString("SOURCE_FILE"));	
					datas.put("SCAN_END_TM"  , rs.getString("SCAN_END_TM"));	
					datas.put("FILTER_END_TM", rs.getString("FILTER_END_TM"));	
					datas.put("LOAD_END_TM"  , rs.getString("LOAD_END_TM"));	
					datas.put("MSG"          , rs.getString("MSG"));	
				}
				
				
				seriesArray.add(datas);
				jsonobj.put("rows"  ,seriesArray);   
			
				nCount++;
			}
			
			if (nCount> 0 ) {
				int total = nCount / Integer.parseInt(sRows);
				
				jsonobj.put("records" , nCount  );  
				jsonobj.put("page"    , Integer.parseInt(sPage)      ); 
				jsonobj.put("total"   , total     );  
				jsonobj.put("result"  , "OK"      );  
			} else {  
				jsonobj.put("result"  , "NOTFOUND");  
			}
				
			//logger.debug(jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("getJobMonitor :" + jsonobj.toString() ); 
			
			stmt.close();
			conMgr.freeConnection(connectionDest);

		} catch(Exception e){
			e.printStackTrace();
		} finally {
			try{
				if(stmt != null)
					stmt.close();
				if(connectionDest != null)
					conMgr.freeConnection(connectionDest);
			}catch(Exception e){
				e.printStackTrace();
			}
		}

    }
 
}