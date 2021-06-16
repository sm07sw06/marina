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
import com.a1ck.util.UtilClass;


public class SetBoat extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetBoat() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

    UtilClass  utilClass = new UtilClass();
    
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetBoat start.............:");

		   String sMarinaId   = "";
		   String sBoatId     = "";
		   String sBoatNm     = "";
		   String sUserId     = "";
		   String sBoatDesc   = "";
		   String sBoatStatus = "";
		   String sCrud       = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("SetBoat json:" + json); 
		              
		            sMarinaId   = (String)json.get("marina_id");
		            sBoatId     = (String)json.get("boat_id");
		            sBoatNm     = (String)json.get("boat_nm");
		            sBoatDesc   = (String)json.get("boat_desc");
		            sBoatStatus = (String)json.get("boat_status");
		            sUserId     = (String)json.get("user_id");
		            sCrud       = (String)json.get("crud");
		            
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
				    String insertSql = "INSERT INTO TB_BOAT ( MARINA_ID, USER_ID, BOAT_NM, BOAT_STATUS, BOAT_DESC) \n";
					insertSql = insertSql + "VALUES (" + sMarinaId + ", " + sUserId + ", '" + sBoatNm + "', '" + sBoatStatus + "', '" + sBoatDesc + "' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetBoat sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
					
				
			   } else if(sCrud.equals("A")) {
				    String updateSql      = "DELETE FROM TB_BOATDATA_TEST \n";
					
					stmt = connectionDest.createStatement();
					logger.debug("SetBoat sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
			   } else if(sCrud.equals("B")) {
				    String updateSql      = "DELETE FROM TB_LIDARDATA_TEST \n";
					
					stmt = connectionDest.createStatement();
					logger.debug("SetBoat sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
					
					
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "DELETE FROM TB_BOAT \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MARINA_ID =   " + sMarinaId  + "   \n ";
					updateSql = updateSql + "   AND BOAT_ID =   " + sBoatId  + "   \n ";

					
					stmt = connectionDest.createStatement();
					logger.debug("SetBoat sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE TB_BOAT \n";
				    updateSql = updateSql + "   SET BOAT_NM   	= '" + sBoatNm  	+ "' \n ";
					updateSql = updateSql + "      ,BOAT_STATUS = '" + sBoatStatus  + "' \n ";
					updateSql = updateSql + "      ,BOAT_DESC 	= '" + sBoatDesc    + "' \n ";
					updateSql = updateSql + "      ,USER_ID 	=  " + sUserId      + "  \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MARINA_ID =   " + sMarinaId  + "   \n ";
					updateSql = updateSql + "   AND BOAT_ID =   " + sBoatId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetBoat sql:" + updateSql);
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
