package com.a1ck.asset;

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


public class SetDaemon extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetDaemon() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetDaemon start.............:");

           String sDaemonId   = "";
           String sDaemonNm   = "";
           String sDaemonIp   = "";
           String sDaemonPort = "";
           String sDaemonDesc = "";
           String sDaemonStatCd = "";
           String sAutoRestartYn  = "";
           String sUseYn  = "";
           String sCrud  = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("SetDaemon json:" + json); 
		              
		            sDaemonId   = (String)json.get("daemon_id");
		            sDaemonNm   = (String)json.get("daemon_nm");
		            sDaemonIp   = (String)json.get("daemon_ip");
		            sDaemonPort = (String)json.get("daemon_port");
		            sDaemonDesc = (String)json.get("daemon_desc");
		            sDaemonStatCd = (String)json.get("daemon_stat_cd");
		            sAutoRestartYn  = (String)json.get("auto_restart_yn");
		            sUseYn  = (String)json.get("use_yn");
		            sCrud   = (String)json.get("crud");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
			   logger.debug("sDaemonId :" + sDaemonId );
			   logger.debug("sDaemonNm :" + sDaemonNm );
			   logger.debug("sDaemonIp :" + sDaemonIp );
			   logger.debug("sDaemonPort :" + sDaemonPort );
			   logger.debug("sDaemonDesc :" + sDaemonDesc );
			   logger.debug("sDaemonStatCd :" + sDaemonStatCd );
			   logger.debug("sAutoRestartYn :" + sAutoRestartYn );
			   logger.debug("sUseYn :" + sUseYn );
			   logger.debug("sCrud :" + sCrud );


			Connection connectionDest = null;
			Statement stmt = null;
			ResultSet keySet = null;
			int genKey = 0;
			
			try {
				connectionDest = conMgr.getConnection(); 				
				
				connectionDest.setAutoCommit(false);		
				
				
			   if(sCrud.equals("C")) {
				    String insertSql = "INSERT INTO TB_DAEMON (DAEMON_NM, DAEMON_IP, DAEMON_PORT, DAEMON_DESC, DAEMON_STAT_CD, DAEMON_RESTART_YN, USE_YN) \n";
					insertSql = insertSql + "VALUES ( '" + sDaemonNm + "', '" + sDaemonIp + "', " + sDaemonPort + ", '" + sDaemonDesc + "', '" + sDaemonStatCd + "','" + sAutoRestartYn  + "', 'Y' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetDaemon sql:" + insertSql);
					
					stmt.execute(insertSql, Statement.RETURN_GENERATED_KEYS);
					
					keySet = stmt.getGeneratedKeys();
					genKey = 0;
					
					if(keySet.next()){
						genKey=(int) keySet.getLong(1);
					}
					
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "UPDATE TB_DAEMON \n";
				    updateSql = updateSql + "   SET USE_YN  = 'N'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND DAEMON_ID =   " + sDaemonId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetDaemon sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE TB_DAEMON \n";
				    updateSql = updateSql + "   SET DAEMON_NM       = '" + sDaemonNm      + "'   \n ";
					updateSql = updateSql + "      ,DAEMON_IP       = '" + sDaemonIp      + "'    \n ";
					updateSql = updateSql + "      ,DAEMON_PORT     =  " + sDaemonPort    + "    \n ";
					updateSql = updateSql + "      ,DAEMON_DESC     = '" + sDaemonDesc    + "'    \n ";
					updateSql = updateSql + "      ,DAEMON_STAT_CD  = '" + sDaemonStatCd  + "'    \n ";
					updateSql = updateSql + "      ,DAEMON_RESTART_YN = '" + sAutoRestartYn + "'    \n ";
					updateSql = updateSql + "      ,USE_YN          = '" + sUseYn         + "'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND DAEMON_ID =   " + sDaemonId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetDaemon sql:" + updateSql);
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
