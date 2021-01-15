package com.a1ck.asset;

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
import org.json.simple.parser.ParseException;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class SetServer extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetServer() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetServer start.............:");

		   String sServerId    = "";
		   String sServerNm      = "";
		   String sServerClassCd      = "";
		   String sServerIp   = "";
		   String sServerDesc = "";
		   String sUseYn = "";
		   String sCrud        = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            //logger.debug("SetServer json:" + json); 
		              
		            sServerId = (String)json.get("server_id");
		            sServerNm = (String)json.get("server_nm");
		            sServerClassCd = (String)json.get("server_class_cd");
		            sServerIp = (String)json.get("server_ip");
		            sServerDesc = (String)json.get("server_desc");
		            sUseYn  = (String)json.get("use_yn");
		            sCrud   = (String)json.get("crud");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
			Connection connectionDest = null;
			Statement stmt = null;
			
			try {
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		
				
			   if(sCrud.equals("C")) {
				    String insertSql = "INSERT INTO MDDB.TB_SERVER (SERVER_NM, SERVER_CLASS_CD, SERVER_IP, SERVER_DESC, USE_YN) \n";
					insertSql = insertSql + "VALUES ( '" + sServerNm + "', '" + sServerClassCd + "', '" + sServerIp + "', '" + sServerDesc + "', 'Y' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetServer sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "UPDATE MDDB.TB_SERVER \n";
				    updateSql = updateSql + "   SET USE_YN  = 'N'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND SERVER_ID =   " + sServerId  + "   \n ";

				    updateSql      = "DELETE FROM MDDB.TB_SERVER \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND SERVER_ID =   " + sServerId  + "   \n ";

					
					stmt = connectionDest.createStatement();
					logger.debug("SetServer sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE MDDB.TB_SERVER \n";
				    updateSql = updateSql + "   SET SERVER_NM       = '" + sServerNm  + "'   \n ";
					updateSql = updateSql + "      ,SERVER_CLASS_CD = '" + sServerClassCd    + "'    \n ";
					updateSql = updateSql + "      ,SERVER_IP       = '" + sServerIp    + "'    \n ";
					updateSql = updateSql + "      ,SERVER_DESC     = '" + sServerDesc    + "'    \n ";
					updateSql = updateSql + "      ,USE_YN          = '" + sUseYn     + "'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND SERVER_ID =   " + sServerId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetServer sql:" + updateSql);
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
				logger.error("error :" + e.getMessage() );				
			} finally {
				try{
					if(stmt != null)
						stmt.close();
					if(connectionDest != null)
						conMgr.freeConnection(connectionDest);
				}catch(Exception e){
					e.printStackTrace();
					logger.error("error :" + e.getMessage() );				

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
