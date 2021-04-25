package com.a1ck.asset;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class SetAgent extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetAgent() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetAgent start.............:");

           String sServerId  = "";
           String sAgentId   = "";
           String sAgentNm   = "";
           String  sAgentPort = "";
           String sAccountCd = "";
           String sPassword  = "";
           String sPath      = "";
           String sDescription  ="";
           String sRunCd     = "";
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
		              
		            sServerId  = (String)json.get("server_id");
		            sAgentId   = (String)json.get("agent_id");
		            sAgentNm   = (String)json.get("agent_nm");
		            sAgentPort = (String)json.get("agent_port");
		            sAccountCd = (String)json.get("account_cd");
		            sPassword  = (String)json.get("password");
		            sPath      = (String)json.get("path");
		            sDescription  = (String)json.get("description");
		            sRunCd     = (String)json.get("run_cd");
		            sUseYn     = (String)json.get("use_yn");
		            sCrud      = (String)json.get("crud");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
		   logger.debug("sServerCd :" + sServerId );
		   logger.debug("sAccountCd :" + sAccountCd );
		   logger.debug("sDescription :" + sDescription );
		   logger.debug("sCrud :" + sCrud );

			Connection connectionDest = null;
			Statement stmt = null;
			
			try {
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		
				
			   if(sCrud.equals("C")) {
				    String insertSql = "INSERT INTO TB_AGENT (AGENT_NM, AGENT_PORT, SERVER_ID, ACCOUNT_CD, PASSWORD, PATH, RUN_CD, USE_YN, DESCRIPTION) \n";
					insertSql = insertSql + "VALUES ( '" + sAgentNm + "', " + sAgentPort + ", " + sServerId + ", '" + sAccountCd + "', '" + sPassword + "','" + sPath + "', '" + sRunCd + "', '" + sUseYn + "', '" + sDescription + "' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetAgent sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "DELETE FROM TB_AGENT \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND SERVER_ID =   " + sServerId + "   \n ";
					updateSql = updateSql + "   AND AGENT_ID   =  " + sAgentId  + "   \n "; 

					stmt = connectionDest.createStatement();
					logger.debug("SetAgent sql:" + updateSql); 
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE TB_AGENT \n";
				    updateSql = updateSql + "   SET AGENT_NM    = '" + sAgentNm     + "'    \n ";
					updateSql = updateSql + "      ,AGENT_PORT  =  " + sAgentPort   + "     \n ";
					updateSql = updateSql + "      ,ACCOUNT_CD  = '" + sAccountCd   + "'    \n ";
					updateSql = updateSql + "      ,PASSWORD    = '" + sPassword    + "'    \n ";
					updateSql = updateSql + "      ,PATH        = '" + sPath        + "'    \n ";
					updateSql = updateSql + "      ,DESCRIPTION = '" + sDescription + "'    \n ";
					updateSql = updateSql + "      ,RUN_CD      = '" + sRunCd       + "'    \n ";
					updateSql = updateSql + "      ,USE_YN      = '" + sUseYn        + "'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND SERVER_ID =   " + sServerId  + "   \n ";
					updateSql = updateSql + "   AND AGENT_ID  =   " + sAgentId   + "   \n "; 

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
