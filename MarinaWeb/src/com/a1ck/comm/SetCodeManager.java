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

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;


public class SetCodeManager extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
    
    public SetCodeManager() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}
    
    UtilClass  utilClass = new UtilClass();

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetCodeManager start.............:");

           String sGroupCd     	  	 = "";
           String sGroupNm     	  	 = "";
           String sDetailCd    	  	 = "";
           String sDetailNm    	  	 = "";
           String sUseYn        	 = "";
           String sCrud          	 = "";

		   JSONObject jsonobj = new JSONObject();

 		   resp.setContentType("text/html;charset=UTF-8");
		   
 		   String jsonParam = req.getParameter("param");
			
			try {

				logger.debug("getUserList jsonParam:" + jsonParam); 
				
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("getUserList json:" + json); 
		              
		            sGroupCd  = (String)json.get("__group_cd");
		            sGroupNm  = (String)json.get("__group_nm");
		            sDetailCd = (String)json.get("__detail_cd");
		            sDetailNm = (String)json.get("__detail_nm");
		            sUseYn    = (String)json.get("__use_yn");
 		            sCrud     = (String)json.get("__crud");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (org.json.simple.parser.ParseException e) {
				e.printStackTrace();
			}
			
			
			logger.debug("SetCodeManager :sGroupCd  :" + sGroupCd   );
			logger.debug("SetCodeManager :sGroupNm  :" + sGroupNm   );
			logger.debug("SetCodeManager :sDetailCd :" + sDetailCd  );
			logger.debug("SetCodeManager :sDetailNm :" + sDetailNm  );
			logger.debug("SetCodeManager :sUseYn    :" + sUseYn     );
			logger.debug("SetCodeManager :sCrud     :" + sCrud      );
			   
			Connection connectionDest = null;
			Statement stmt = null;

			try {
				
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);	
			   
			   if(sCrud.equals("C")) {
				    String insertSql = "\nINSERT INTO TB_CODE_GROUP (GROUP_CD, GROUP_NM, USE_YN )  \n";
					insertSql = insertSql + "VALUES ( '"+sGroupCd.toUpperCase() +"','"+sGroupNm+"','"+sUseYn+"' ) \n";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetCodeManager sql:" + insertSql);
					
					stmt.execute(insertSql);
					
					stmt.close();
			   } else if(sCrud.equals("D")) {
				   
				   		connectionDest.setAutoCommit(false);
				   
					    String deleteSql    = "\nDELETE FROM TB_CODE_GROUP \n";
						deleteSql = deleteSql + " WHERE GROUP_CD =   '" + sGroupCd + "'   \n ";
			
						stmt = connectionDest.createStatement();
						
						logger.debug("SetCodeManager sql:" + deleteSql);
						
						stmt.execute(deleteSql);

					    deleteSql    = "\nDELETE FROM TB_CODE_DETAIL \n";
						deleteSql = deleteSql + " WHERE GROUP_CD  = '" + sGroupCd  + "'   \n ";
			
						logger.debug("SetCodeManager sql:" + deleteSql);
						
						stmt.execute(deleteSql);
						stmt.close();
						
					   connectionDest.commit();
			   
			   } else if(sCrud.equals("U")) {
				    String updateSql      = "\nUPDATE TB_CODE_GROUP \n";
				    updateSql = updateSql + "     SET GROUP_NM  = '" + sGroupNm + "'   \n ";
					updateSql = updateSql + "        ,USE_YN    = '" + sUseYn   + "'   \n ";
					updateSql = updateSql + "   WHERE GROUP_CD = '" + sGroupCd  + "'   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetCodeManager sql:" + updateSql);
					stmt.execute(updateSql);
					logger.debug("SetCodeManager sql:" + updateSql);
					stmt.close();			   
			  } else  if(sCrud.equals("CD")) {
					    String insertSql = "\nINSERT INTO TB_CODE_DETAIL (GROUP_CD, DETAIL_CD, DETAIL_NM, USE_YN )  \n";
						insertSql = insertSql + "VALUES ( '" + sGroupCd.toUpperCase() + "','"+sDetailCd+"','"+sDetailNm+"','"+sUseYn+"' ) \n";
			
						stmt = connectionDest.createStatement();
						
						logger.debug("SetCodeManager sql:" + insertSql);
						
						stmt.execute(insertSql);
						
						stmt.close();
				   } else if(sCrud.equals("DD")) {
						    String deleteSql    = "\nDELETE FROM TB_CODE_DETAIL \n";
							deleteSql = deleteSql + " WHERE GROUP_CD  = '" + sGroupCd  + "'   \n ";
							deleteSql = deleteSql + "   AND DETAIL_CD = '" + sDetailCd + "'   \n ";
				
							stmt = connectionDest.createStatement();
							
							logger.debug("SetCodeManager sql:" + deleteSql);
							
							stmt.execute(deleteSql);
							stmt.close();
				  } else if(sCrud.equals("UD")) {
					    String updateSql      = "\nUPDATE TB_CODE_DETAIL \n";
					    updateSql = updateSql + "     SET DETAIL_NM  = '" + sDetailNm + "'   \n ";
						updateSql = updateSql + "        ,USE_YN    = '" + sUseYn   + "'   \n ";
						updateSql = updateSql + " WHERE GROUP_CD  = '" + sGroupCd  + "'   \n ";
						updateSql = updateSql + "   AND DETAIL_CD = '" + sDetailCd + "'   \n ";

						stmt = connectionDest.createStatement();
						logger.debug("SetCodeManager sql:" + updateSql);
						stmt.execute(updateSql);
						logger.debug("SetCodeManager sql:" + updateSql);
						stmt.close();			   
				  }
			   
			   connectionDest.commit();
				jsonobj.put("result"  , "OK");
				jsonobj.put("msg"     , "���������� ó�� �Ǿ����ϴ�.");
				jsonobj.put("genKey"  , 0);
				
			} catch (SQLException se) {
				try {
					connectionDest.rollback();
					jsonobj.put("result"  , "NOTOK");
					jsonobj.put("msg"     , utilClass.getDbMsg(se.getSQLState()));   
					jsonobj.put("genKey"  , 0);
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
				logger.debug("error :" + se.getSQLState() );			
			} catch (Exception e) {
				try {
					connectionDest.rollback();
					jsonobj.put("result"  , "NOTOK");
					jsonobj.put("msg"     , e.getMessage());  
					jsonobj.put("genKey"  , 0);
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
		   	
		   resp.setContentType("text/plain");
		   resp.setCharacterEncoding("UTF-8");
		   resp.getWriter().write(jsonobj.toString()); 	
	}


	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
	}
			
		 
}
