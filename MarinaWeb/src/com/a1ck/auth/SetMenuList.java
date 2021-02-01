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
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;


public class SetMenuList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetMenuList() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}
 
    UtilClass  utilClass = new UtilClass(); 
    
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetMenu start.............:");

		   String sMenuId    = "";
		   String sMenuNm    = "";
		   String sMenuCd    = "";
		   String sMenuUrl   = "";
		   String sMenuDesc  = "";
		   String sMenuOrder = "";
		   String sUpMenuId  = "";
		   String sCrud        = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		             logger.debug("SetMenu json:" + json); 
		              
		            sMenuId    = (String)json.get("menu_id");
		            sMenuNm    = (String)json.get("menu_nm");
		            sMenuCd    = (String)json.get("menu_cd");
		            sMenuUrl   = (String)json.get("menu_url");
		            sMenuDesc  = (String)json.get("menu_desc");
		            sMenuOrder = (String)json.get("menu_order");
		            sUpMenuId  = (String)json.get("up_menu_id");
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
//				    String insertSql = "INSERT INTO TB_MENU (MENU_NM, MENU_CD, MENU_URL, MENU_DESC, MENU_ORDER, UP_MENU_ID) \n";
//					insertSql = insertSql + "VALUES ( '" + sMenuNm + "', '" + sMenuCd + "', '" + sMenuUrl + "', '" + sMenuDesc + "', 0 , null )";
				    String insertSql = "INSERT INTO TB_MENU (MENU_NM, MENU_URL, MENU_DESC, MENU_ORDER, UP_MENU_ID) \n";
					insertSql = insertSql + "VALUES ( '" + sMenuNm + "', '" + sMenuUrl + "', '" + sMenuDesc + "', " + sMenuOrder + " , null )";
					stmt = connectionDest.createStatement();
					logger.debug("SetMenu sql:" + insertSql);
					stmt.execute(insertSql);

					String updateSql      = "update TB_MENU set menu_cd = menu_id \n";
					updateSql = updateSql + "  where menu_id = (SELECT last_value  from menu_menu_id_seq)   \n ";
					stmt = connectionDest.createStatement();
					logger.debug("SetMenu sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();
			   } else if(sCrud.equals("D")) {
					String updateSql      = "DELETE FROM TB_MENU \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MENU_ID =   " + sMenuId  + "   \n ";
					
					stmt = connectionDest.createStatement();
					logger.debug("SetMenu sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE TB_MENU \n";
				    updateSql = updateSql + "   SET MENU_NM       = '" + sMenuNm  + "'   \n ";
					updateSql = updateSql + "      ,MENU_CD    = '" + sMenuCd    + "'    \n ";
					updateSql = updateSql + "      ,MENU_URL   = '" + sMenuUrl    + "'    \n ";
					updateSql = updateSql + "      ,MENU_DESC  = '" + sMenuDesc    + "'    \n ";
 					updateSql = updateSql + "      ,MENU_ORDER =  " + sMenuOrder    + "    \n ";
//					updateSql = updateSql + "      ,UP_MENU_ID = '" + sUpMenuId    + "'    \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MENU_ID =   " + sMenuId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetMenu sql:" + updateSql);
					stmt.execute(updateSql);

					stmt.close();	

			   }
			   connectionDest.commit();
			} catch (SQLException se) {
				try {
					connectionDest.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
				se.printStackTrace();
				logger.error("error :" + utilClass.getDbMsg(se.getSQLState()) );				
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
