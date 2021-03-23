package com.a1ck.user;

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


public class SetUserGroupMember extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
    public SetUserGroupMember() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings({ "unchecked", "null" })
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
			logger.debug("SetUserGroupMember start.............:");
			
			ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
			
			resp.setContentType("text/html;charset=UTF-8");
			   
			String sUserGrpId = req.getParameter("user_grp_id").trim();
			String jsonParam  = req.getParameter("param").trim();

			JSONArray jsonArray = null;
			JSONObject json = null;
			Connection connectionDest = null;
			Statement stmt = null;
			
			try {
				logger.debug("getUserGroupList jsonParam:" + jsonParam + ":" + jsonParam.length()); 

				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		

				if((jsonParam.length()) > 0 && (jsonParam != null)){
					
					JSONParser parser = new JSONParser();
					jsonArray = (JSONArray) parser.parse(jsonParam.toString());
	
		            logger.debug("getUserGroupList jsonArray:" + jsonArray); 
		            
		            resp.setContentType("application/x-json charset=UTF-8");
	    				
				    String updateSql      = "DELETE FROM TB_EMP_MEMBER \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND EMP_GRP_ID =   " + sUserGrpId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetUserGroup sql:" + updateSql);
					stmt.execute(updateSql);
					
					for(int i = 0;i < jsonArray.size() ;i++) {
						
						json = (JSONObject)jsonArray.get(i);
						
						//logger.debug("getUserGroupList json:" + json); 
						
						String insertSql = "INSERT INTO TB_EMP_MEMBER  \n";
						insertSql = insertSql + "VALUES ( '" + (String)json.get("user_id") + "' , '" + sUserGrpId + "' )";
		
						stmt = connectionDest.createStatement();
						logger.debug("SetUserGroup sql:" + insertSql);
						stmt.execute(insertSql);
						
					}
					stmt.close();		   
					connectionDest.commit();
							            
				} else {
				    String updateSql      = "DELETE FROM TB_EMP_MEMBER \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND EMP_GRP_ID =   " + sUserGrpId  + "   \n ";

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
