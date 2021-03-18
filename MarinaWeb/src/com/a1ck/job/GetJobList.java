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

public class GetJobList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
	public Connection connectionDest = null;
	
    public GetJobList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 

		
		try{

			logger.debug("getJobList ***** Start GetJobList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sServerId = "";
			String sJobId  = "";
			String sJobNm  = "";
			String sUseYn    = "";			
			String sRows   = "";
			String sPage   = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getJobList json:" + json); 
	              
	            sServerId = (String)json.get("__server_id");
	            sJobId    = (String)json.get("__job_id");
	            sJobNm    = (String)json.get("__job_nm");
	            sUseYn    = (String)json.get("__use_yn");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");

				logger.debug("getJobList sServerId:" + sServerId);
				logger.debug("getJobList sJobId:" + sJobId);
				logger.debug("getJobList sJobNm:" + sJobNm);
				logger.debug("getServerList sUseYn:" + sUseYn);
				logger.debug("getJobList nRows:" + sRows);
				logger.debug("getJobList nPage:" + sPage);
			}
			
			logger.debug("getJobList sServerId:" + sServerId);
			
		    connectionDest = conMgr.getConnection(); 

			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = "\nSELECT J.SERVER_ID, J.JOB_ID, J.JOB_NM, J.TABLE_ID, J.SOURCE_PATH, J.SOURCE_FILE, J.INFO_PATH, J.INFO_FILE,J.JOB_LOG_PATH, J.JOB_TM, J.SEPARATOR, J.SCHEDULE_YN, J.SOURCE_DEL_YN, J.LAST_COL_YN , J.JOB_CD, J.USE_YN, S.SERVER_NM, T.TABLE_CD, T.TABLE_NM \n ";
			sQuery += "   FROM TB_JOB_MST J LEFT OUTER JOIN TB_TABLE_INFO T ON J.TABLE_ID = T.TABLE_ID  \n ";
			sQuery += "       , TB_SERVER S  \n ";
			sQuery += "  WHERE 1 = 1    \n ";
			sQuery += "    AND J.SERVER_ID = S.SERVER_ID  \n ";
			
			if( !StringUtils.equals(sUseYn, "A")) {
				sQuery += "    AND J.USE_YN = '" + sUseYn + "'  \n ";
			}
			
			if( !StringUtils.equals(sServerId, "*")) {
				sQuery += "    AND J.SERVER_ID = " + sServerId + " \n";
			}
			
			if( !StringUtils.equals(sJobId, "*")) {
				sQuery += "    AND J.JOB_ID = " + sJobId + " \n";
			} else if( !StringUtils.equals(sJobNm, "") || !StringUtils.equals(sJobNm, null)) {
				sQuery += "    AND J.JOB_NM like '%" + sJobNm + "%' \n";
			}
			
			sQuery += "  ORDER BY J.JOB_NM \n ";
			
			logger.debug("getJobList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("SERVER_ID"   , rs.getString("SERVER_ID"));	
				datas.put("SERVER_NM"   , rs.getString("SERVER_NM"));	
				datas.put("JOB_ID"      , rs.getString("JOB_ID"));
				datas.put("JOB_CD"      , rs.getString("JOB_CD"));
				datas.put("JOB_NM"      , rs.getString("JOB_NM"));					
				datas.put("TABLE_ID"    , rs.getString("TABLE_ID"));					

				if (!StringUtils.isEmpty(rs.getString("SOURCE_PATH"))) 
					datas.put("SOURCE_PATH" , rs.getString("SOURCE_PATH"));	
				else
					datas.put("SOURCE_PATH" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("SOURCE_FILE"))) 
					datas.put("SOURCE_FILE" , rs.getString("SOURCE_FILE"));	
				else
					datas.put("SOURCE_FILE" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("INFO_PATH"))) 
					datas.put("INFO_PATH" , rs.getString("INFO_PATH"));	
				else
					datas.put("INFO_PATH" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("INFO_FILE"))) 
					datas.put("INFO_FILE" , rs.getString("INFO_FILE"));	
				else
					datas.put("INFO_FILE" , " " );
					
				if (!StringUtils.isEmpty(rs.getString("JOB_LOG_PATH"))) 
					datas.put("JOB_LOG_PATH" , rs.getString("JOB_LOG_PATH"));	
				else
					datas.put("JOB_LOG_PATH" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("JOB_TM"))) { 
					if(rs.getString("JOB_TM").length() == 3) {
						datas.put("JOB_TM" , "0" + rs.getString("JOB_TM"));
						
					} else {
						datas.put("JOB_TM" , rs.getString("JOB_TM"));
					}
				} else
					datas.put("JOB_TM"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("SEPARATOR"))) 
					datas.put("SEPARATOR" , rs.getString("SEPARATOR"));	
				else
					datas.put("SEPARATOR" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("SCHEDULE_YN"))) 
					datas.put("SCHEDULE_YN"     , rs.getString("SCHEDULE_YN"));	
				else
					datas.put("SCHEDULE_YN"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("SOURCE_DEL_YN"))) 
					datas.put("SOURCE_DEL_YN" , rs.getString("SOURCE_DEL_YN"));	
				else
					datas.put("SOURCE_DEL_YN" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("LAST_COL_YN"))) 
					datas.put("LAST_COL_YN" , rs.getString("LAST_COL_YN"));	
				else
					datas.put("LAST_COL_YN" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("USE_YN"))) 
					datas.put("USE_YN"     , rs.getString("USE_YN"));	
				else
					datas.put("USE_YN"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("TABLE_CD"))) 
					datas.put("TABLE_CD"     , rs.getString("TABLE_CD"));	
				else
					datas.put("TABLE_CD"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("TABLE_NM"))) 
					datas.put("TABLE_NM"     , rs.getString("TABLE_NM"));	
				else
					datas.put("TABLE_NM"     , " " );
				
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

	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("getJobList :" + jsonobj.toString() ); 
			
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