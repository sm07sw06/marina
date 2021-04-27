package com.a1ck.asset;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;


public class SetAnchor extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetAnchor() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

    UtilClass  utilClass = new UtilClass();
    
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetAnchor start.............:");

		   String sMarinaId     = "";
		   String sAnchorId     = "";
		   String sAnchorNm     = "";
		   String sSectorId     = "";
		   String sBoatId       = "";
		   String sAnchorStatus = "";
		   String sCrud         = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("SetAnchor json:" + json); 
		              
		    		sMarinaId      = (String)json.get("marina_id");
		    		sAnchorId      = (String)json.get("anchor_id");
		    		sAnchorNm      = (String)json.get("anchor_nm");
		    		sSectorId  	   = (String)json.get("sector_id");
		            sAnchorStatus  = (String)json.get("anchor_status");
		            sBoatId  	   = (String)json.get("boat_id");
		            sCrud      	   = (String)json.get("crud");
		            
		            logger.debug("SetAnchor sMarinaId:[" + sMarinaId + "]");
		            logger.debug("SetAnchor sAnchorId:[" + sAnchorId + "]");
		            logger.debug("SetAnchor sAnchorNm:[" + sAnchorNm + "]");
		            logger.debug("SetAnchor sSectorId:[" + sSectorId + "]");
		            logger.debug("SetAnchor sAnchorStatus:[" + sAnchorStatus + "]");
		            logger.debug("SetAnchor sBoatId:[" + sBoatId + "]");
		            logger.debug("SetAnchor sCrud:[" + sCrud + "]");
		            
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
				    String insertSql = "INSERT INTO TB_ANCHOR (MARINA_ID, SECTOR_ID, BOAT_ID, ANCHOR_STATUS, ANCHOR_NM) \n";
					insertSql = insertSql + "VALUES ( " + sMarinaId + ", " + sSectorId + ", " + sBoatId + ", '" + sAnchorStatus + "', '" + sAnchorNm + "' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetAnchor sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "DELETE FROM TB_ANCHOR \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MARINA_ID = " + sMarinaId  + " \n ";
					updateSql = updateSql + "   AND ANCHOR_ID = " + sAnchorId  + " \n ";

					
					stmt = connectionDest.createStatement();
					logger.debug("SetAnchor sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE TB_ANCHOR \n";
				    updateSql = updateSql + "   SET ANCHOR_NM     = '" + sAnchorNm     + "'   \n ";
					updateSql = updateSql + "      ,SECTOR_ID 	  =  " + sSectorId     + "    \n ";
					if( !StringUtils.equals(sBoatId.trim(), "") && !StringUtils.equals(sBoatId.trim(), null) )  {
						updateSql = updateSql + "      ,BOAT_ID 	  =  " + sBoatId       + "     \n ";
					}
					updateSql = updateSql + "      ,ANCHOR_STATUS = '" + sAnchorStatus + "'    \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MARINA_ID = " + sMarinaId  + " \n ";
					updateSql = updateSql + "   AND ANCHOR_ID =   " + sAnchorId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetAnchor sql:" + updateSql);
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
