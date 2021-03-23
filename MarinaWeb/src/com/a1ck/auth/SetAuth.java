package com.a1ck.auth;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class SetAuth extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetAuth() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
			logger.debug("SetAuth start.............:");
			
			resp.setContentType("text/html;charset=UTF-8");
			   
			String sUserGb   = req.getParameter("user_gb").trim();
			String sUserId   = req.getParameter("user_id").trim();
			String jsonParam = req.getParameter("param").trim();

			JSONArray jsonArray = null;
			JSONObject json = null;
			Connection connectionDest = null;
			Statement stmt = null;
			
			try {
				logger.debug("getAuth jsonParam:" + jsonParam + "==>" + jsonParam.length()); 

				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		

				if((jsonParam.length()) > 0 && (jsonParam != null)){
					
					JSONParser parser = new JSONParser();
					jsonArray = (JSONArray) parser.parse(jsonParam.toString());
	
		            logger.debug("getAuth jsonArray:" + jsonArray); 
		            
		            resp.setContentType("application/x-json charset=UTF-8");
	    				
				    String updateSql      = "DELETE FROM TB_EMP_AUTH \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND EMP_GB_ID = " + sUserGb + " \n ";
					updateSql = updateSql + "   AND EMP_ID =  " + sUserId + "  \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetUserGroup sql:" + updateSql);
					stmt.execute(updateSql);
					
					for(int i = 0;i < jsonArray.size() ;i++) {
						
						json = (JSONObject)jsonArray.get(i);
						
						logger.debug("getAuth json:" + json); 
						
						String insertSql = "INSERT INTO TB_EMP_AUTH  \n";
						insertSql = insertSql + "VALUES (  '" + sUserGb + "'," + sUserId + ", " +  json.get("menu_id") + " )";
		
						stmt = connectionDest.createStatement();
						logger.debug("SetUserGroup sql:" + insertSql);
						stmt.execute(insertSql);
						
					}
					stmt.close();		   
					connectionDest.commit();
							            
				} else {
				    String updateSql      = "DELETE FROM TB_EMP_MEMBER \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND EMP_GB_ID = " + sUserGb + " \n ";
					updateSql = updateSql + "   AND EMP_ID =  " + sUserId + "  \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetUserGroup sql:" + updateSql);
					stmt.execute(updateSql);
					stmt.close();		   
					connectionDest.commit();
					
				}
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
