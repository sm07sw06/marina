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


public class SetAnchorSector extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetAnchorSector() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

    UtilClass  utilClass = new UtilClass();
    
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetSector start.............:");

		   String sMarinaId   = "";
		   String sSectorId   = "";
		   String sSectorNm   = "";
		   String sSectorAreaCd = "";
		   String sGPSx1      = "";
		   String sGPSx2      = "";
		   String sGPSy1      = "";
		   String sGPSy2      = "";
		   String sSectorDesc = "";
		   String sCrud       = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("SetSector json:" + json); 
		              
		            sMarinaId   = (String)json.get("marina_id");
		            sSectorId   = (String)json.get("sector_id");
		            sSectorNm   = (String)json.get("sector_nm");
		            sSectorAreaCd   = (String)json.get("sectorarea_cd");
		            sGPSx1      = (String)json.get("gpsx1");
		            sGPSx2      = (String)json.get("gpsx2");
		            sGPSy1      = (String)json.get("gpsy1");
		            sGPSy2      = (String)json.get("gpsy2");
		            sSectorDesc = (String)json.get("sector_desc");
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
				    String insertSql = "INSERT INTO TB_ANCHOR_SECTOR (MARINA_ID, SECTOR_NM, SECTORAREA_CD, GPSX1, GPSX2, GPSY1, GPSY2, SECTOR_DESC) \n";
					insertSql = insertSql + "VALUES ( " + sMarinaId + ", '" + sSectorNm + "', '" + sSectorAreaCd + "', " + sGPSx1 + ", " + sGPSx2 + ", " + sGPSy1 + ", " + sGPSy2 + ", '" + sSectorDesc + "' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetSector sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "DELETE FROM TB_ANCHOR_SECTOR \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MARINA_ID =   " + sMarinaId  + "   \n ";
					updateSql = updateSql + "   AND SECTOR_ID =   " + sSectorId  + "   \n ";

					
					stmt = connectionDest.createStatement();
					logger.debug("SetSector sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE TB_ANCHOR_SECTOR \n";
				    updateSql = updateSql + "   SET SECTOR_NM   = '" + sSectorNm  + "'   \n ";
					updateSql = updateSql + "      ,SECTORAREA_CD = '" + sSectorAreaCd    + "'    \n ";
					updateSql = updateSql + "      ,GPSX1 		= " + sGPSx1    + "    \n ";
					updateSql = updateSql + "      ,GPSX2 		= " + sGPSx2    + "    \n ";
					updateSql = updateSql + "      ,GPSY1 		= " + sGPSy1    + "    \n ";
					updateSql = updateSql + "      ,GPSY2 		= " + sGPSy2    + "    \n ";
					updateSql = updateSql + "      ,SECTOR_DESC = '" + sSectorDesc    + "'    \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MARINA_ID =   " + sMarinaId  + "   \n ";
					updateSql = updateSql + "   AND SECTOR_ID =   " + sSectorId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetSector sql:" + updateSql);
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
