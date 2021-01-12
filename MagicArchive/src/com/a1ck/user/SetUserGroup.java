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
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class SetUserGroup extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
    public SetUserGroup() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetUserGroup start.............:");

		   ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		   
		   String sUserGrpId    = "";
		   String sUserGrpNm    = "";
		   String sDescription 	= "";
		   String sUseYn     	= "";
		   String sCrud        	= "";

		   Connection connectionDest = null;
		   Statement stmt = null;
		
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {

				logger.debug("getUserGroupList jsonParam:" + jsonParam); 
				
				if((jsonParam.length()) > 2 && (jsonParam != null)){
					
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("getUserGroupList json:" + json); 
		              
		            sUserGrpId 	 = (String)json.get("user_grp_id");
		            sUserGrpNm 	 = (String)json.get("user_grp_nm");
		            sDescription = (String)json.get("description");
		            sUseYn   	 = (String)json.get("use_yn");

		            sCrud   	 = (String)json.get("crud");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			
				logger.debug("sUserGrpId     :" + sUserGrpId );
				logger.debug("sUserGrpNm     :" + sUserGrpNm );
				logger.debug("sDescription     :" + sDescription );
	
			   	logger.debug("sCrud        :" + sCrud );
				
			   	connectionDest = conMgr.getConnection(); 
				connectionDest.setAutoCommit(false);		
				
			   if(sCrud.equals("C")) {
				    String insertSql = "INSERT INTO MDDB.TB_USER_GROUP (USER_GRP_NM) \n";
					insertSql = insertSql + "VALUES ( '" + sUserGrpNm + " )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetUserGroup sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
			   } else if(sCrud.equals("U")) {
				    String updateSql      = "UPDATE MDDB.TB_USER_GROUP \n";
				    updateSql = updateSql + "   SET USER_GRP_NM     = '" + sUserGrpNm     + "'   \n ";
				    updateSql = updateSql + "      ,DESCRIPTION     = '" + sDescription     + "'   \n ";
				    updateSql = updateSql + "      ,USE_YN          = '" + sUseYn    + "'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND USER_GRP_ID =   " + sUserGrpId  + "   \n ";

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
