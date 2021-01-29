package com.a1ck.comm;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
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

public class SetTable extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    public SetTable() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetTable start.............:");

		   String sTableId    	= "";
		   String sTableCd      = "";
		   String sTableNm      = "";
		   String sSavePreqCd   = "";
		   String sSavePreq 	= "";
		   String sDescription 	= "";
		   String sUseYn  		= "";

		   String sAttrCd  		= "";
		   String sAttrNm  		= "";
		   String sAttrSize  	= "";
		   String sDecimalSize  = "";
		   String sAttrTypeCd  	= "";
		   String sAttrUseYn  	= "";
		   String sAttrNullYn  	= "";
		   String sAttrSeq    	= "";

		   String sCrud        	= "";
		   String sServerId     = "";
		   
		   String sExpPath      = "";
		   String sExpZipYN     = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {

				logger.debug("getTableList jsonParam:" + jsonParam); 
				
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("getTableList json:" + json); 
		              
		            sCrud   	 = (String)json.get("crud");
		            sTableId 	 = (String)json.get("table_id");
		            sTableCd 	 = (String)json.get("table_cd");
		            sTableNm 	 = (String)json.get("table_nm");
		            sSavePreqCd  = (String)json.get("save_preq_cd");
		            sSavePreq 	 = (String)json.get("save_preq");
		            sServerId    = (String)json.get("server_id");
		            sExpPath     = (String)json.get("exp_path");
		            sExpZipYN    = (String)json.get("exp_zip_yn");
		            		
		            if(sCrud.equals("C") || sCrud.equals("D") || sCrud.equals("U")) {
			            if(sSavePreq.equals("") )
			            	sSavePreq = "0";
		            }
		            sDescription = (String)json.get("description");
		            sUseYn       = (String)json.get("use_yn");

		            sAttrCd 	 = (String)json.get("attr_cd");
		            sAttrNm 	 = (String)json.get("attr_nm");
		            sAttrSize 	 = (String)json.get("attr_size");
		            sDecimalSize = (String)json.get("decimal_size");
		            sAttrTypeCd  = (String)json.get("attr_type_cd");
		            sAttrUseYn   = (String)json.get("attr_use_yn");
		            sAttrNullYn  = (String)json.get("attr_null_yn");
		            sAttrSeq     = (String)json.get("attr_seq");
		            
		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		   logger.debug("sTableId     :" + sTableId );
		   logger.debug("sTableCd     :" + sTableCd );
		   logger.debug("sTableNm     :" + sTableNm );
		   logger.debug("sSavePreqCd  :" + sSavePreqCd );
		   logger.debug("sSavePreq    :" + sSavePreq );
		   logger.debug("sDescription :" + sDescription );
		   logger.debug("sUseYn       :" + sUseYn );

		   logger.debug("sAttrCd      :" + sAttrCd );
		   logger.debug("sAttrNm      :" + sAttrNm );
		   logger.debug("sAttrSize    :" + sAttrSize );
		   logger.debug("sDecimalSize :" + sDecimalSize );
		   logger.debug("sAttrTypeCd  :" + sAttrTypeCd );
		   logger.debug("sAttrUseYn   :" + sAttrUseYn );
		   logger.debug("sAttrNullYn  :" + sAttrNullYn );

		   logger.debug("sCrud        :" + sCrud );

			Connection connectionDest = null;
			Statement stmt = null;
			ResultSet keySet = null;
			int genKey = 0;
			
			try {
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		
				
			   if(sCrud.equals("C")) {
				    String insertSql = "INSERT INTO TB_TABLE_INFO (TABLE_CD, TABLE_NM, SAVE_PREQ_CD, SAVE_PREQ, DESCRIPTION, USE_YN,SERVER_ID, EXP_PATH, EXP_ZIP_YN) \n";
					insertSql = insertSql + "VALUES ( '" + sTableCd + "', '" + sTableNm + "', '" + sSavePreqCd + "', " + sSavePreq + ", '" + sDescription + "', 'Y' , " + sServerId + " , '" + sExpPath + "' , '" + sExpZipYN + "')";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetTable sql:" + insertSql);
					
					stmt.execute(insertSql, Statement.RETURN_GENERATED_KEYS);
					
					keySet = stmt.getGeneratedKeys();
					genKey = 0;
					
					if(keySet.next()){
						genKey=(int) keySet.getLong(1);
					}
					
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "UPDATE TB_TABLE_INFO \n";
				    updateSql = updateSql + "   SET USE_YN  = 'N'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND TABLE_ID =   " + sTableId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetTable sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
			   } else if(sCrud.equals("U")) {
				    String updateSql      = "UPDATE TB_TABLE_INFO \n";
				    updateSql = updateSql + "   SET TABLE_CD     = '" + sTableCd     + "'   \n ";
					updateSql = updateSql + "      ,TABLE_NM     = '" + sTableNm     + "'   \n ";
					updateSql = updateSql + "      ,SAVE_PREQ_CD = '" + sSavePreqCd  + "'   \n ";
					updateSql = updateSql + "      ,SAVE_PREQ    =  " + sSavePreq    + "    \n ";
					updateSql = updateSql + "      ,DESCRIPTION  = '" + sDescription + "'   \n ";
					updateSql = updateSql + "      ,USE_YN       = '" + sUseYn       + "'   \n ";
					updateSql = updateSql + "      ,SERVER_ID    =  " + sServerId    + "   \n ";
					updateSql = updateSql + "      ,EXP_PATH     = '" + sExpPath     + "'   \n ";
					updateSql = updateSql + "      ,EXP_ZIP_YN   = '" + sExpZipYN    + "'   \n ";					
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND TABLE_ID =   " + sTableId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetTable sql:" + updateSql);
					stmt.execute(updateSql);

					stmt.close();	
			   } else if(sCrud.equals("AC")) {
				    String insertSql = "INSERT INTO TB_TABLE_ATTR (TABLE_ID, ATTR_CD, ATTR_NM, ATTR_TYPE_CD, ATTR_SIZE, DECIMAL_SIZE, ATTR_NULL_YN, ATTR_SEQ, USE_YN) \n";
					insertSql = insertSql + "VALUES ( '" + sTableId + "', '" + sAttrCd + "', '" + sAttrNm + "', '" + sAttrTypeCd + "', " + sAttrSize + ", " + sDecimalSize + ", '" + sAttrNullYn + "', 0, 'Y' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetTable sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
			   } else if(sCrud.equals("AD")) {
				    String updateSql      = "UPDATE TB_TABLE_ATTR \n";
				    updateSql = updateSql + "   SET USE_YN  = 'N'   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND TABLE_ID =   " + sTableId  + "   \n ";
					updateSql = updateSql + "   AND ATTR_CD  =  '" + sAttrCd   + "'  \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetTable sql:" + updateSql);
					stmt.execute(updateSql);
					
					stmt.close();			   
			   } else if(sCrud.equals("AU")) {
				    String updateSql      = "UPDATE TB_TABLE_ATTR \n";
				    updateSql = updateSql + "   SET ATTR_NM       = '" + sAttrNm      + "'  \n ";
					updateSql = updateSql + "      ,ATTR_TYPE_CD  = '" + sAttrTypeCd  + "'  \n ";
					updateSql = updateSql + "      ,ATTR_SIZE     =  " + sAttrSize    + "   \n ";
					updateSql = updateSql + "      ,DECIMAL_SIZE  =  " + sDecimalSize + "   \n ";
					updateSql = updateSql + "      ,ATTR_NULL_YN  = '" + sAttrNullYn  + "'  \n ";
					updateSql = updateSql + "      ,ATTR_SEQ      = 0   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND TABLE_ID =   " + sTableId  + "   \n ";
					updateSql = updateSql + "   AND ATTR_CD  =  '" + sAttrCd   + "'  \n "; 

					stmt = connectionDest.createStatement();
					logger.debug("SetTable sql:" + updateSql);
					stmt.execute(updateSql);

					stmt.close();	
			   } else if(sCrud.equals("RN")) {
				    String updateSql      = "UPDATE TB_TABLE_ATTR \n";
				    updateSql = updateSql + "   SET ATTR_SEQ  = " + sAttrSeq  + "   \n ";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND TABLE_ID =   " + sTableId  + "   \n ";
					updateSql = updateSql + "   AND ATTR_CD  =  '" + sAttrCd   + "'  \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetTable sql:" + updateSql);
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
				jsonobj.put("genKey"  , genKey);	
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
