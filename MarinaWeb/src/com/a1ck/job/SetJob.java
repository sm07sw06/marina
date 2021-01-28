package com.a1ck.job;

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
import org.json.simple.parser.ParseException;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class SetJob extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
    public SetJob() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetAgent start.............:");

		   ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		   
           String sServerId  = "";
           String sJobId   = "";
           String sJobCd   = "";
           String sJobNm   = "";
           String sTableId = "";
           String sSourcePath = "";
           String sSourceFile  = "";
           String sInfoPath = "";
           String sInfoFile = "";
           String sJobLogPath = "";
           String sJobTm      = "";
           String sSeparator  ="";
           String sScheduleYn     = "";
           String sSource_delYn     = "";
           String sLast_colYn     = "";
           String sUseYn     = "";
           String sCrud      = "";
           
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("getAgentList json:" + json); 
		              
		            sServerId		= (String)json.get("server_id");
		            sJobId 			= (String)json.get("job_id"); 			
		            sJobCd 			= (String)json.get("job_cd"); 			
		            sJobNm			= (String)json.get("job_nm");
		            sTableId		= (String)json.get("table_id");
		            sSourcePath		= (String)json.get("source_path");
		            sSourceFile		= (String)json.get("source_file");
		            sInfoPath       = (String)json.get("info_path");
		            sInfoFile    	= (String)json.get("info_file");		 
		            sJobLogPath  	= (String)json.get("job_log_path");
		            sJobTm			= (String)json.get("job_tm");
		            sSeparator 		= (String)json.get("separator");
		            sScheduleYn 	= (String)json.get("schedule_yn");
		            sSource_delYn 	= (String)json.get("source_del_yn");
		            sLast_colYn		= (String)json.get("last_col_yn");
		            sUseYn    		= (String)json.get("use_yn");
		            sCrud      		= (String)json.get("crud");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
			   logger.debug("sServerId		 :" + sServerId		 	);
			   logger.debug("sJobId 		 :" + sJobId 			 );
			   logger.debug("sJobCd 		 :" + sJobCd 			 );
			   logger.debug("sJobNm			 :" + sJobNm			 );
			   logger.debug("sTableId		 :" + sTableId		 	);
			   logger.debug("sSourcePath	 :" + sSourcePath		 );
			   logger.debug("sSourceFile	 :" + sSourceFile		 );
			   logger.debug("sInfoPath       :" + sInfoPath		 );
			   logger.debug("sInfoFile       :" + sInfoFile		 );
			   logger.debug("sJobLogPath       :" + sJobLogPath		 );
			   
			   logger.debug("sJobTm			 :" + sJobTm			 );
			   logger.debug("sSeparator 	 :" + sSeparator 		 );                                                                                                                                                                                                                                                                                                                                                                                                                             
			   logger.debug("sScheduleYn 	 :" + sScheduleYn 	 	);
			   logger.debug("sSource_delYn 	 :" + sSource_delYn 	 );
			   logger.debug("sLast_colYn	 :" + sLast_colYn		 );
			   logger.debug("sUseYn    		 :" + sUseYn    		 );
			   logger.debug("sCrud      	 :" + sCrud      		 );


			Connection connectionDest = null;
			Statement stmt = null;
			ResultSet keySet = null;
			int genKey = 0;
			
			try {
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		
				
			   if(sCrud.equals("C")) {
				    String insertSql = "INSERT INTO MDDB.TB_JOB_MST (SERVER_ID, JOB_CD,JOB_NM, TABLE_ID, SOURCE_PATH, SOURCE_FILE, INFO_PATH, INFO_FILE, JOB_LOG_PATH, JOB_TM, SEPARATOR, SCHEDULE_YN, SOURCE_DEL_YN, LAST_COL_YN, USE_YN) \n";
					insertSql = insertSql + "VALUES ( '" + sServerId + "', '" + sJobCd + "', '" + sJobNm + "', '" + sTableId + "', '" + sSourcePath + "', '" + sSourceFile + "' , '" +  sInfoPath + "' , '"+  sInfoFile + "' , '"+ sJobLogPath +"', '" + sJobTm + "', '" + sSeparator + "', '" + sScheduleYn + "','" + sSource_delYn + "', '" + sLast_colYn + "', '" + sUseYn + "' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetAgent sql:" + insertSql);
					
					stmt.execute(insertSql, Statement.RETURN_GENERATED_KEYS);
					
					keySet = stmt.getGeneratedKeys();
					genKey = 0;
					
					if(keySet.next()){
						genKey=(int) keySet.getLong(1);
					}
					
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "UPDATE MDDB.TB_JOB_MST \n";
				    updateSql = updateSql + "   SET USE_YN  		= 'N'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND JOB_ID   =  " + sJobId  + "   \n "; 

					stmt = connectionDest.createStatement();
					logger.debug("SetAgent sql:" + updateSql); 
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE MDDB.TB_JOB_MST \n";
				    updateSql = updateSql + "   SET SERVER_ID  		= '" + sServerId + "'   \n ";
				    updateSql = updateSql + "      ,JOB_NM  		= '" + sJobNm + "'   \n ";
				    updateSql = updateSql + "      ,JOB_CD  		= '" + sJobCd + "'   \n ";
				    updateSql = updateSql + "      ,TABLE_ID  		= '" + sTableId + "'   \n ";
				    updateSql = updateSql + "      ,SOURCE_PATH  	= '" + sSourcePath + "'   \n ";
				    updateSql = updateSql + "      ,SOURCE_FILE  	= '" + sSourceFile + "'   \n ";
				    updateSql = updateSql + "      ,INFO_PATH= '" + sInfoPath          + "'   \n ";
				    updateSql = updateSql + "      ,INFO_FILE= '" + sInfoFile          + "'   \n ";
				    updateSql = updateSql + "      ,JOB_LOG_PATH= '" + sJobLogPath          + "'   \n ";						    
				    
				    updateSql = updateSql + "      ,SEPARATOR  		= '" + sSeparator + "'   \n ";
				    updateSql = updateSql + "      ,JOB_TM       	= '" + sJobTm + "'   \n ";
				    updateSql = updateSql + "      ,SCHEDULE_YN 	= '" + sScheduleYn + "'   \n ";
				    updateSql = updateSql + "      ,SOURCE_DEL_YN  	= '" + sSource_delYn + "'   \n ";
				    updateSql = updateSql + "      ,LAST_COL_YN 	= '" + sLast_colYn + "'   \n ";
				    updateSql = updateSql + "      ,USE_YN  		= '" + sUseYn + "'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND JOB_ID   =  " + sJobId  + "   \n "; 

					stmt = connectionDest.createStatement();
					logger.debug("SetAgent sql:" + updateSql); 
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
