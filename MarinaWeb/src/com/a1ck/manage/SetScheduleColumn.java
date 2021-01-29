package com.a1ck.manage;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class SetScheduleColumn extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
    public SetScheduleColumn() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetScheduleColumn start.............:");
		   
		   ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		   
		   String  sJobId     	  = "";           
		   String  sColId        = "";          
		   String  sColCd        = "";          
		   String  sColNm        = "";          
		   String  sColTypeCd    = "";         
		   String  sColLen       = "";          
		   String  sColSeq       = "";          
		   String  sColDateYn    = "";         
		   String  sColEncYn     = "";   
           String sCrud          	 = "";
			ResultSet keySet = null;
			int genKey = 0;
            
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {

				logger.debug("setScheduleColumn jsonParam:" + jsonParam); 
				
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("setScheduleColumn json:" + json); 
		              
		            sJobId         	  	 = (String)json.get("job_id");
		            sColId         	  	 = (String)json.get("col_id");
		            sColCd         	  	 = (String)json.get("col_cd");
		            sColNm         	  	 = (String)json.get("col_nm");
		            sColTypeCd     	  	 = (String)json.get("col_type_cd");
		            sColLen        	  	 = (String)json.get("col_len");
		            sColSeq        	  	 = (String)json.get("col_seq");
		            sColDateYn     	  	 = (String)json.get("col_date_yn");
		            sColEncYn      	  	 = (String)json.get("col_enc_yn");
 		            sCrud          	 	 = (String)json.get("crud");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (org.json.simple.parser.ParseException e) {
				e.printStackTrace();
			}
			
			  logger.debug("SetScheduleColumn :sJobId             :" + sJobId             + " \n");
			  logger.debug("SetScheduleColumn :sColId             :" + sColId             + " \n");
			  logger.debug("SetScheduleColumn :sColCd             :" + sColCd             + " \n");
			  logger.debug("SetScheduleColumn :sColNm             :" + sColNm             + " \n");
			  logger.debug("SetScheduleColumn :sColTypeCd         :" + sColTypeCd         + " \n");
			  logger.debug("SetScheduleColumn :sColLen            :" + sColLen            + " \n");
			  logger.debug("SetScheduleColumn :sColSeq            :" + sColSeq            + " \n");
			  logger.debug("SetScheduleColumn :sColDateYn         :" + sColDateYn         + " \n");
			  logger.debug("SetScheduleColumn :sColEncYn          :" + sColEncYn          + " \n");
			  logger.debug("SetScheduleColumn :sCrud            :" + sCrud            + " \n");
		   
				Connection connectionDest = null;
				Statement stmt = null;
				
			try {
				
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);	
			   
			   if(sCrud.equals("C")) {
				    String insertSql = "\nINSERT INTO TB_SCHEDULE_COL(JOB_ID, COL_CD, COL_NM, COL_TYPE_CD, COL_LEN, COL_SEQ, COL_DATE_YN, COL_ENC_YN ) \n";
					insertSql = insertSql + "VALUES ( "+sJobId+",'"+sColCd+"','"+sColNm+"','"+sColTypeCd+"',"+sColLen+","+sColSeq+",'"+sColDateYn+"','"+sColEncYn+"' ) \n";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetScheduleColumn sql:" + insertSql);
					
					stmt.execute(insertSql, Statement.RETURN_GENERATED_KEYS);
					keySet = stmt.getGeneratedKeys();
					genKey = 0;
					
					if(keySet.next()){
						genKey=(int) keySet.getLong(1);
					}
					
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
					    String deleteSql = "DELETE FROM TB_SCHEDULE_COL \n";
					    deleteSql = deleteSql + " WHERE JOB_ID = " + sJobId + "   \n ";
					    deleteSql = deleteSql + "   and COL_ID = " + sColId + "   \n ";
			
						stmt = connectionDest.createStatement();
						
						logger.debug("SetScheduleColumn sql:" + deleteSql);
						
						stmt.execute(deleteSql);
						stmt.close();
			  } else  if(sCrud.equals("U")) {
				    String updateSql      = "\nUPDATE TB_SCHEDULE_COL \n";
				    updateSql = updateSql + "   SET COL_CD   	= '" + sColCd  	+ "'   \n ";
					updateSql = updateSql + "      ,COL_NM   	= '" + sColNm  	+ "'   \n ";
					updateSql = updateSql + "      ,COL_TYPE_CD = '" + sColTypeCd  	+ "'   \n ";
					updateSql = updateSql + "      ,COL_LEN   	=  " + sColLen  	+ "   \n ";
					updateSql = updateSql + "      ,COL_SEQ   	=  " + sColSeq  	+ "   \n ";
					updateSql = updateSql + "      ,COL_DATE_YN = '" + sColDateYn  	+ "'   \n ";
					updateSql = updateSql + "      ,COL_ENC_YN  = '" + sColEncYn  	+ "'   \n ";
					updateSql = updateSql + " WHERE JOB_ID = " + sJobId + "   \n ";
					updateSql = updateSql + "   and COL_ID = " + sColId + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetScheduleColumn sql:" + updateSql);
					stmt.execute(updateSql);
					logger.debug("SetScheduleColumn sql:" + updateSql);
					stmt.close();			   
			   } else if(sCrud.equals("RN")) {
				    String updateSql      = "UPDATE TB_SCHEDULE_COL \n";
				    updateSql = updateSql + "   SET COL_SEQ  = " + sColSeq  + "   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND JOB_ID =   " + sJobId  + "  \n ";
					updateSql = updateSql + "   AND COL_ID  =  " + sColId  + "  \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetScheduleColumn sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
			   }
		   
			   connectionDest.commit();
			   
			} catch (Exception e) {
				try {
					connectionDest.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
				e.printStackTrace();
				logger.debug("error :" + e.getMessage() );				
			} finally {
				try{
					if(stmt != null)
						stmt.close();
					if(connectionDest != null)
						conMgr.freeConnection(connectionDest);
				}catch(Exception e){
					e.printStackTrace();
					logger.debug("error :" + e.getMessage() );				

				}
			}
				   
		   JSONObject jsonobj = new JSONObject();
		   try {
				jsonobj.put("result"  , "OK");
				jsonobj.put("genKey"  , genKey);				
			} catch (Exception e) {
				logger.error(e.getMessage());
				e.printStackTrace();
			}
		   	
		   resp.setContentType("text/plain");
		   resp.setCharacterEncoding("UTF-8");
		   resp.getWriter().write(jsonobj.toString()); 	
	}


	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
	}
			
		 
}
