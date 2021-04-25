package com.a1ck.auth;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;



public class SetLogin extends HttpServlet {
    private static final long serialVersionUID = 1L; 
    ResultSet rs;
    Statement stmt;
 
    //public static Logger logger = Logger.getLogger("DashBoard"); 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
	public Connection connectionDest = null;
	
   // public SetLogin() {
   // 	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	//}

	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("SetLogin ***** Start SetLogin *****"); 
			
			String sQueryUpdate  = null;
			int    nRtn = 0;
			
		    UtilClass  utilClass = new UtilClass();

		    String sUserid  = request.getParameter("username").trim();
			String sPwd    = request.getParameter("password").trim();

			logger.debug("SetLogin sUserid :" + sUserid); 
			logger.debug("SetLogin sPwd   :" + sPwd); 
			
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQueryUpdate  = " UPDATE TB_DMZ_EMP_A1CK \n ";
			sQueryUpdate += "    SET PASSWORD = '" + utilClass.encryptSHA256(sPwd) + "' \n ";
			sQueryUpdate += "  WHERE 1 = 1 \n ";
			sQueryUpdate += "    AND SABUN     = '" + sUserid + "' \n";
			logger.debug("SetLogin sQueryUpdate:" + sQueryUpdate); 
			nRtn = stmt.executeUpdate (sQueryUpdate);
				
			JSONObject jsonobj = new JSONObject();			
			if (nRtn != 0 ) {
				jsonobj.put("result" , "OK"      );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			} else {  
				jsonobj.put("result" , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			}
				
			logger.debug(jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("SetLogin :" + jsonobj.toString() ); 
			
			stmt.close();
			conMgr.freeConnection(connectionDest);

		} catch(Exception e){
			e.printStackTrace();
		} finally {
			try{
				if(stmt != null)
					stmt.close();
				if(connectionDest != null)
					conMgr.freeConnection(connectionDest);
			}catch(Exception e){
				e.printStackTrace();
			}
		}

    }
 
}