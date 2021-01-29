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


public class GetJobHistory extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
	public Connection connectionDest = null;
	
    public GetJobHistory() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		
		try{

			logger.debug("getJobHistory ***** Start GetJobHistory *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sServerId = "";
			String sJobId  = "";
			String sJobNm  = "";
			String sJobTmFrom  = "";
			String sJobTmTo    = "";
			String sStat   = "";
			String sRows   = "";
			String sPage   = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){ 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getJobHistory json:" + json); 
	              
	            sServerId = (String)json.get("__server_id");
	            sJobId    = (String)json.get("__job_id");
	            sJobNm    = (String)json.get("__job_nm");
	            sJobTmFrom = (String)json.get("__job_tm_from");
	            sJobTmTo   = (String)json.get("__job_tm_to");
	            sStat     = (String)json.get("__stat");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");

				logger.debug("getJobHistory sServerId:" + sServerId);
				logger.debug("getJobHistory sJobId:" + sJobId);
				logger.debug("getJobHistory sJobNm:" + sJobNm);
				logger.debug("getJobHistory nRows:" + sRows);
				logger.debug("getJobHistory nPage:" + sPage);
				logger.debug("getJobHistory nPage:" + sStat);				
				
			}
			
			logger.debug("getJobHistory sServerId:" + sServerId);
			
		    connectionDest = conMgr.getConnection(); 

			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = "\nSELECT J.JOB_NM, H.JOB_ID,H.JOB_TM,H.SOURCE_FILE,H.SOURCE_SIZE,H.SCAN_RECORD,H.SCAN_REG_TM,H.SCAN_END_TM,H.SCAN_STAT_CD,H.SCAN_MSG_CD,H.SCAN_MSG \n ";
			sQuery += "        ,H.FILTER_REG_TM,H.FILTER_END_TM,H.FILTER_STAT_CD,H.FILTER_MSG_CD,H.FILTER_MSG,H.LOAD_REG_TM,H.LOAD_END_TM,H.LOAD_STAT_CD,H.LOAD_MSG_CD,H.LOAD_MSG  \n ";
			sQuery += "        ,C1.DETAIL_NM AS SCAN_STAT_NM, C2.DETAIL_NM AS FILTER_STAT_NM , C3.DETAIL_NM AS LOAD_STAT_NM, J.SERVER_ID  \n ";
			sQuery += "   FROM TB_JOB_HISTORY H LEFT OUTER JOIN TB_CODE_DETAIL C1 ON H.SCAN_MSG_CD = C1.DETAIL_CD AND 'SCAN_STAT_CD'   = C1.GROUP_CD  \n ";
			sQuery += "                      LEFT OUTER JOIN TB_CODE_DETAIL C2 ON H.SCAN_MSG_CD = C2.DETAIL_CD AND 'FILTER_STAT_CD' = C2.GROUP_CD  \n ";
			sQuery += "                      LEFT OUTER JOIN TB_CODE_DETAIL C3 ON H.SCAN_MSG_CD = C3.DETAIL_CD AND 'LOAD_STAT_CD'   = C3.GROUP_CD  \n ";
			sQuery += "       ,TB_JOB_MST J       \n ";
			sQuery += "  WHERE H.JOB_ID = J.JOB_ID \n ";
			
			if( !StringUtils.equals(sServerId, "*")) {
				sQuery += "    AND J.SERVER_ID = " + sServerId + " \n";
			}
			logger.debug("Select stat " + sStat);
			if( !StringUtils.equals(sJobId, "*")) {
				sQuery += "    AND J.JOB_ID = " + sJobId + " \n";
			} else if( !StringUtils.equals(sJobNm, "") || !StringUtils.equals(sJobNm, null)) {
				sQuery += "    AND H.JOB_TM >= '" + sJobTmFrom + "0000' \n ";
				sQuery += "    AND H.JOB_TM <= '" + sJobTmTo   + "1259' \n ";
				sQuery += "    AND J.JOB_NM like '%" + sJobNm  + "%' \n";
				
				if( StringUtils.equals(sStat, "O")) {
					sQuery += "    AND (H.SCAN_STAT_CD   = 'S' OR H.SCAN_STAT_CD   = '' ) \n ";
					/*sQuery += "    AND (H.FILTER_STAT_CD = 'S' OR H.FILTER_STAT_CD = '' ) \n ";*/
					sQuery += "    AND (H.LOAD_STAT_CD   = 'S' OR H.LOAD_STAT_CD   = '' ) \n ";
				} else if( StringUtils.equals(sStat, "E")) {
					sQuery += "    AND ( H.SCAN_STAT_CD = 'E' OR H.FILTER_STAT_CD = 'E' OR H.LOAD_STAT_CD = 'E' ) \n ";
				}
				
			}
			
			sQuery += "  ORDER BY H.JOB_TM DESC \n ";
			
			logger.debug("getJobHistory sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("SERVER_ID"   , rs.getString("SERVER_ID"));	
				datas.put("JOB_ID"   , rs.getString("JOB_ID"));	
				datas.put("JOB_TM"   , rs.getString("JOB_TM"));	
				datas.put("JOB_NM"   , rs.getString("JOB_NM"));	
				datas.put("SOURCE_FILE"      , rs.getString("SOURCE_FILE"));
				datas.put("SOURCE_SIZE"      , rs.getString("SOURCE_SIZE"));					
				datas.put("SCAN_RECORD"      , rs.getString("SCAN_RECORD"));					

				if (!StringUtils.isEmpty(rs.getString("SCAN_REG_TM"))) 
					datas.put("SCAN_REG_TM" , rs.getString("SCAN_REG_TM"));	
				else
					datas.put("SCAN_REG_TM" , " " );
				if (!StringUtils.isEmpty(rs.getString("SCAN_END_TM"))) 
					datas.put("SCAN_END_TM" , rs.getString("SCAN_END_TM"));	
				else
					datas.put("SCAN_END_TM" , " " );
				if (!StringUtils.isEmpty(rs.getString("SCAN_STAT_CD"))) 
					datas.put("SCAN_STAT_CD"     , rs.getString("SCAN_STAT_CD"));	
				else
					datas.put("SCAN_STAT_CD"     , " " );
				if (!StringUtils.isEmpty(rs.getString("SCAN_MSG_CD"))) 
					datas.put("SCAN_MSG_CD" , rs.getString("SCAN_MSG_CD"));	
				else
					datas.put("SCAN_MSG_CD" , " " );
				if (!StringUtils.isEmpty(rs.getString("SCAN_MSG"))) 
					datas.put("SCAN_MSG"     , rs.getString("SCAN_MSG"));	
				else
					datas.put("SCAN_MSG"     , " " );
				

				if (!StringUtils.isEmpty(rs.getString("FILTER_REG_TM"))) 
					datas.put("FILTER_REG_TM" , rs.getString("FILTER_REG_TM"));	
				else
					datas.put("FILTER_REG_TM" , " " );
				if (!StringUtils.isEmpty(rs.getString("FILTER_END_TM"))) 
					datas.put("FILTER_END_TM" , rs.getString("FILTER_END_TM"));	
				else
					datas.put("FILTER_END_TM" , " " );
				if (!StringUtils.isEmpty(rs.getString("FILTER_STAT_CD"))) 
					datas.put("FILTER_STAT_CD"     , rs.getString("FILTER_STAT_CD"));	
				else
					datas.put("FILTER_STAT_CD"     , " " );
				if (!StringUtils.isEmpty(rs.getString("FILTER_MSG_CD"))) 
					datas.put("FILTER_MSG_CD" , rs.getString("FILTER_MSG_CD"));	
				else
					datas.put("FILTER_MSG_CD" , " " );
				if (!StringUtils.isEmpty(rs.getString("FILTER_MSG"))) 
					datas.put("FILTER_MSG"     , rs.getString("FILTER_MSG"));	
				else
					datas.put("FILTER_MSG"     , " " );

				if (!StringUtils.isEmpty(rs.getString("LOAD_REG_TM"))) 
					datas.put("LOAD_REG_TM" , rs.getString("LOAD_REG_TM"));	
				else
					datas.put("LOAD_REG_TM" , " " );
				if (!StringUtils.isEmpty(rs.getString("LOAD_END_TM"))) 
					datas.put("LOAD_END_TM"     , rs.getString("LOAD_END_TM"));	
				else
					datas.put("LOAD_END_TM"     , " " );
				if (!StringUtils.isEmpty(rs.getString("LOAD_STAT_CD"))) 
					datas.put("LOAD_STAT_CD" , rs.getString("LOAD_STAT_CD"));	
				else
					datas.put("LOAD_STAT_CD" , " " );
				if (!StringUtils.isEmpty(rs.getString("LOAD_MSG_CD"))) 
					datas.put("LOAD_MSG_CD"     , rs.getString("LOAD_MSG_CD"));	
				else
					datas.put("LOAD_MSG_CD"     , " " );
				if (!StringUtils.isEmpty(rs.getString("LOAD_MSG"))) 
					datas.put("LOAD_MSG" , rs.getString("LOAD_MSG"));	
				else
					datas.put("LOAD_MSG" , " " );

				if (!StringUtils.isEmpty(rs.getString("SCAN_STAT_NM"))) 
					datas.put("SCAN_STAT_NM" , rs.getString("SCAN_STAT_NM"));	
				else
					datas.put("SCAN_STAT_NM" , " " );
				if (!StringUtils.isEmpty(rs.getString("FILTER_STAT_NM"))) 
					datas.put("FILTER_STAT_NM" , rs.getString("FILTER_STAT_NM"));	
				else
					datas.put("FILTER_STAT_NM" , " " );
				if (!StringUtils.isEmpty(rs.getString("LOAD_STAT_NM"))) 
					datas.put("LOAD_STAT_NM"     , rs.getString("LOAD_STAT_NM"));	
				else
					datas.put("LOAD_STAT_NM"     , " " );

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
			logger.debug("getJobHistory :" + jsonobj.toString() ); 
			
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