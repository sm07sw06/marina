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

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;


public class SetAnchorDevice extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetAnchorDevice() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

    UtilClass  utilClass = new UtilClass();
    
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetAnchorDevice start.............:");

		   ResultSet rs;
		    
		   String sMarinaId   = "";
		   String sAnchorId   = "";
		   String sAnchorNm   = "";
		   String sMachineId  = "";
		   String sMachineRefId  = "";
		   String sLeftRight  = "";
		   String sCrud       = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("SetAnchorDevice json:" + json); 
		              
		            sMarinaId   = (String)json.get("marina_id");
		            sAnchorId   = (String)json.get("anchor_id");
		            sAnchorNm   = (String)json.get("anchor_nm");
		            sMachineId  = (String)json.get("machine_id");
		            sMachineRefId  = (String)json.get("machine_ref_id");
		            sLeftRight  = (String)json.get("left_right");
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

					String insertSql = "INSERT INTO TB_ANCHOR_LIDAR ( MARINA_ID, MACHINE_ID, LEFT_RIGHT, ANCHOR_ID, MACHINE_REF_ID) \n";
				    
					if( StringUtils.equals(sAnchorId, "") || StringUtils.equals(sAnchorId, null) )  {
						sAnchorId = "0";
					}
					insertSql = insertSql + "VALUES ( " + sMarinaId + ", '" + sMachineId + "', '" + sLeftRight + "', " + sAnchorId + ", '" + sMachineRefId + "' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetAnchorDevice sql:" + insertSql);
					
					stmt.execute(insertSql);

					
					String  sQuery  = " SELECT count(*) as NCNT \n ";
							sQuery += "   FROM TB_ANCHOR_DEVICE \n ";
							sQuery += "  WHERE 1 = 1 \n ";
							sQuery += "    AND MARINA_ID  =   " + sMarinaId  + "   \n ";
							sQuery += "    AND MACHINE_ID =  '" + sMachineId  + "'   \n ";

					logger.debug("getBoatDevice sQuery1:" + sQuery); 
					
					rs = stmt.executeQuery(sQuery);
					int nCount = 0;
			        while(rs.next()){
			        	nCount = rs.getInt("NCNT");	
			        }
					
			        if(nCount <= 0 ) {
					    insertSql = "INSERT INTO TB_ANCHOR_DEVICE ( MARINA_ID, MACHINE_ID) \n";
					    
						if( StringUtils.equals(sAnchorId, "") || StringUtils.equals(sAnchorId, null) )  {
							sAnchorId = "0";
						}
						insertSql = insertSql + "VALUES ( " + sMarinaId + ", '" + sMachineId + "' )";
			
						stmt = connectionDest.createStatement();
						
						logger.debug("SetAnchorDevice sql:" + insertSql);
						
						stmt.execute(insertSql);

			        }
					
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "DELETE FROM TB_ANCHOR_LIDAR \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MARINA_ID =   " + sMarinaId  + "   \n ";
					updateSql = updateSql + "   AND MACHINE_ID =   '" + sMachineId  + "'   \n ";
					updateSql = updateSql + "   AND LEFT_RIGHT =   '" + sLeftRight  + "'   \n ";
					
					stmt = connectionDest.createStatement();
					logger.debug("SetAnchorDevice sql:" + updateSql);
					stmt.execute(updateSql);
					
					String sQuery  = " SELECT count(*) as NCNT \n ";
					sQuery += "   FROM TB_ANCHOR_LIDAR \n ";
					sQuery += "  WHERE 1 = 1 \n ";
					sQuery += "    AND MARINA_ID  =   " + sMarinaId  + "   \n ";
					sQuery += "    AND MACHINE_ID =  '" + sMachineId  + "'   \n ";

					logger.debug("getBoatDevice sQuery1:" + sQuery); 
					
					rs = stmt.executeQuery(sQuery);
					int nCount = 0;
			        while(rs.next()){
			        	nCount = rs.getInt("NCNT");	
			        }
					
			        if(nCount <= 0 ) {
					    updateSql      = "DELETE FROM TB_ANCHOR_DEVICE \n";
						updateSql = updateSql + " WHERE 1 = 1 \n ";
						updateSql = updateSql + "   AND MARINA_ID =   " + sMarinaId  + "   \n ";
						updateSql = updateSql + "   AND MACHINE_ID =   '" + sMachineId  + "'   \n ";
						
						logger.debug("SetAnchorDevice sql:" + updateSql);
						stmt.execute(updateSql);
			        }
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE TB_ANCHOR_LIDAR \n";
				    updateSql = updateSql + "   SET ANCHOR_ID   	= " + sAnchorId  	+ " \n ";
				    updateSql = updateSql + "      ,MACHINE_REF_ID   	= '" + sMachineRefId  	+ "' \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND MARINA_ID  =    " + sMarinaId   + "   \n ";
					updateSql = updateSql + "   AND MACHINE_ID =   '" + sMachineId  + "'  \n ";
					updateSql = updateSql + "   AND LEFT_RIGHT =   '" + sLeftRight  + "'  \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetAnchorDevice sql:" + updateSql);
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
