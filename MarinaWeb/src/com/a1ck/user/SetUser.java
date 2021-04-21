package com.a1ck.user;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;

public class SetUser extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    // upload settings
    private static final int MEMORY_THRESHOLD   = 1024 * 1024 * 1;  // 1MB
    private static final int MAX_FILE_SIZE      = 1024 * 1024 * 5;  // 5MB
    private static final int MAX_REQUEST_SIZE   = 1024 * 1024 * 10; // 10MB
    
    public SetUser() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
			ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 

		   req.setCharacterEncoding("utf-8");
	       resp.setContentType("text/html;charset=utf-8");
	
		   logger.debug("SetUser start.............:");

		   String sUserId    	= "";
		   String sUserNm       = "";
		   String sUserCd       = "";
		   String sTelephone 	= "";
		   String sPassword 	= "";
		   String sPasswordorg 	= "";
		   String sEmail     	= "";
		   String sApprowaitcnt = "";
		   String sUseYn        = "";
		   String sCrud        	= "";
		   String sPic			= "";
		   String pwd           = "";
		   
		   File f_midir = null;
		   
		   HashMap map = new HashMap();
		   UtilClass   utilClass = new UtilClass();
		   ResultSet keySet = null;
		   int genKey = 0;
		   String sUpDir = null;
		   
			try {
				sUpDir = utilClass.GetManagerProperty("DIRS","upload_dir");
			} catch (Exception e2) {
				e2.printStackTrace();
			}
		   
		   boolean isMultipart = ServletFileUpload.isMultipartContent(req);
		   
			if (isMultipart) {
				logger.debug("SetEmp : isMultipart ");
				
				
				f_midir = new File(sUpDir);//폴더가 없다면 자동으로 생성 시킨다
				boolean file_result =  f_midir.mkdirs();
				
				logger.debug(f_midir.getAbsoluteFile());
				logger.debug(f_midir.getAbsolutePath());
				
		        // configures upload settings
				DiskFileItemFactory factory = new DiskFileItemFactory();
		        // sets memory threshold - beyond which files are stored in disk
		        factory.setSizeThreshold(0);
		        factory.setSizeThreshold(MEMORY_THRESHOLD);
		        // sets temporary location to store files
		        factory.setRepository(f_midir);

		        // Create a new file upload handler
		        ServletFileUpload upload = new ServletFileUpload(factory);
		        // sets maximum size of upload file
		        upload.setFileSizeMax(MAX_FILE_SIZE);
		        // sets maximum size of request (include file + form data)
		        upload.setSizeMax(MAX_REQUEST_SIZE);
		        
		        try {
		        	List items = upload.parseRequest(req);
					Iterator iter = items.iterator();//열거형 반복 시작
					
					map = utilClass.getFileUpload(iter, f_midir);
					logger.debug(map.toString())    ;
					
					
		        } 
		        catch (Exception e) 
		        {
		        	e.printStackTrace();
		        }
			}

            sUserId      = (String)map.get("F_USER_ID");
            sUserNm 	 = (String)map.get("F_USER_NM");
            sUserCd 	 = (String)map.get("F_USER_CD");
            sTelephone 	 = (String)map.get("F_TELEPHONE");
            sPassword 	 = (String)map.get("F_PASSWORD");
            sPasswordorg = (String)map.get("F_PASSWORDORG");
            sEmail 	     = (String)map.get("F_EMAIL");
            sUseYn       = (String)map.get("F_USE_YN");
            sPic         = (String)map.get("filename");
            sCrud   	 = (String)map.get("CRUD");

			logger.debug("SetUser sUserId:" +sUserId);
			logger.debug("SetUser sUserNm:" + sUserNm);
			logger.debug("SetUser sUserCd:" + sUserCd);
			logger.debug("SetUser sTelephone:" + sTelephone );
			logger.debug("SetUser sPassword:" + sPassword);
			logger.debug("SetUser sPasswordorg:" + sPasswordorg);
			logger.debug("SetUser sEmail:" + sEmail);
			logger.debug("SetUser sUseYn:" + sUseYn);
			logger.debug("SetUser sPic:" + sPic);
			logger.debug("SetUser sCrud:" + sCrud);
			
			if(!sCrud.equals("") && !sCrud.equals(null)) {
				pwd = utilClass.encryptSHA256(sPassword);
			}
			
			Connection connectionDest = null;
			Statement stmt = null;
			
			try {
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		
				
			   if(sCrud.equals("C")) {
				    String insertSql = "INSERT INTO TB_USER_INFO (USER_CD, USER_NM, PASSWORD, TELEPHONE, EMAIL,APPROWAITCNT, USE_YN, PICTURE) \n";
					insertSql = insertSql + "VALUES ( '" + sUserCd + "', '" + sUserNm + "', '" + pwd + "', '" + sTelephone + "', '" + sEmail + "',0, 'Y' , '" + sPic + "' )";
//					insertSql = insertSql + "VALUES ( '" + sUserCd + "', '" + sUserNm + "', '" + pwd + "', '" + sTelephone + "', '" + sEmail + "',0, 'Y' , '" + f_midir.getAbsoluteFile() + "\\" + sPic + "' )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetUser sql:" + insertSql);
					
					stmt.execute(insertSql);
					/**
					stmt.execute(insertSql, Statement.RETURN_GENERATED_KEYS);
					keySet = stmt.getGeneratedKeys();
					genKey = 0;
					
					if(keySet.next()){
						genKey=(int) keySet.getLong(1);
					}
					**/
					stmt.close();
					
			   } else if(sCrud.equals("D")) {
				    String updateSql      = "DELETE FROM TB_USER_INFO \n";
					updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND USER_ID =   " + sUserId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetUser sql:" + updateSql);
					stmt.execute(updateSql);

					stmt.close();	
			   } else if(sCrud.equals("U")) {
				   
				    String updateSql      = "UPDATE TB_USER_INFO \n";
				    updateSql = updateSql + "   SET USER_NM    = '" + sUserNm     + "'   \n ";
				    if(!sPassword.equals(sPasswordorg)) {
				    	updateSql = updateSql + "      ,PASSWORD   = '" + pwd         + "'   \n ";
				    }
				    updateSql = updateSql + "      ,TELEPHONE  = '" + sTelephone  + "'   \n ";
				    updateSql = updateSql + "      ,USE_YN  = '" + sUseYn  + "'   \n ";
				    updateSql = updateSql + "      ,EMAIL      = '" + sEmail      + "'   \n ";
					
				    if (StringUtils.isNotEmpty(sPic)) {
				    	//updateSql = updateSql + "      ,PICTURE    = '" + f_midir.getAbsoluteFile() + "\\" + sPic + "' \n ";
				    	updateSql = updateSql + "      ,PICTURE    = '" + sPic + "' \n ";
			   		}
					
				    updateSql = updateSql + " WHERE 1 = 1 \n ";
					updateSql = updateSql + "   AND USER_ID =   " + sUserId  + "   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetUser sql:" + updateSql);
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
