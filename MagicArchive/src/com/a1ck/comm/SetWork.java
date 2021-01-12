package com.a1ck.comm;

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


public class SetWork extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetWork() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetWork start.............:");

		   String sServerId    = "";
		   String sWorkCd      = "";
		   String sWorkNm      = "";
		   String sAccountCd   = "";
		   String sDescription = "";
		   String sCrud        = "";
		   String sUseYn       = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
						json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("getWorkList json:" + json); 
		              
		            sServerId = (String)json.get("server_id");
		            sWorkCd = (String)json.get("work_cd");
		            sWorkNm = (String)json.get("work_nm");
		            sAccountCd = (String)json.get("account_cd");
		            sDescription = (String)json.get("description");
		            sUseYn   = (String)json.get("use_yn");
		            sCrud   = (String)json.get("crud");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
		   logger.debug("sServerCd :" + sServerId );
		   logger.debug("sWorkCd :" + sWorkCd );
		   logger.debug("sWorkNm :" + sWorkNm );
		   logger.debug("sAccountCd :" + sAccountCd );
		   logger.debug("sDescription :" + sDescription );
		   logger.debug("sUseYn :" + sUseYn );
		   logger.debug("sCrud :" + sCrud );

			Connection connectionDest = null;
			Statement stmt = null;
			
			try {
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		
				
			   if(sCrud.equals("C")) {
				    String insertSql = "INSERT INTO MDDB.TB_WORK (SERVER_ID, WORK_CD, WORK_NM, ACCOUNT_CD, DESCRIPTION, USE_YN ) \n";
					insertSql = insertSql + "VALUES ( " + sServerId + ", '" + sWorkCd + "', '" + sWorkNm + "', '" + sAccountCd + "', '" + sDescription + "','" + sUseYn + "' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetWork sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
					
				
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "UPDATE MDDB.TB_WORK \n";
				    updateSql = updateSql + "   SET USE_YN  = 'D'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND SERVER_ID =   " + sServerId  + "   \n ";
					updateSql = updateSql + "   AND WORK_CD   =  '" + sWorkCd  + "'   \n "; 

					stmt = connectionDest.createStatement();
					logger.debug("SetWork sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE MDDB.TB_WORK \n";
				    updateSql = updateSql + "   SET WORK_NM       = '" + sWorkNm  + "'   \n ";
					updateSql = updateSql + "      ,ACCOUNT_CD    = '" + sAccountCd    + "'    \n ";
					updateSql = updateSql + "      ,DESCRIPTION     = '" + sDescription     + "'   \n ";
					updateSql = updateSql + "      ,USE_YN     = '" + sUseYn     + "'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND SERVER_ID =   " + sServerId  + "   \n ";
					updateSql = updateSql + "   AND WORK_CD   =  '" + sWorkCd  + "'   \n "; 

					stmt = connectionDest.createStatement();
					logger.debug("SetWork sql:" + updateSql);
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
