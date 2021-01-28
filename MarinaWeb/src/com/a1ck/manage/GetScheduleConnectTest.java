package com.a1ck.manage;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;

public class GetScheduleConnectTest extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
	private String gsClassName = null;
	private String gsUrl = null;
	private String gsId  = null;
	private String gsPwd = null;
	
	private Connection conn = null;    

	public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
    @SuppressWarnings("unused")
	private Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName(gsClassName);
        
        conn = DriverManager.getConnection(gsUrl, gsId, gsPwd);
        return conn;
    }
    
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
			
			super.doGet(req, resp);			
			logger.debug(" test doGet start....");
    }

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.debug(" test doPost start....");	
		
		boolean bOk = false;
		String sConnectString = null;
		String sDriveName = null;
		
		String sSrcDbms = request.getParameter("F_SRC_DBMS_CD");
		String sSrcIp   = request.getParameter("F_SRC_IP");
		String sSrcPort = request.getParameter("F_SRC_PORT");
		String sSrcDb   = request.getParameter("F_SRC_DB");
		String sSrcUser = request.getParameter("F_SRC_USER");
		String sSrcPass = request.getParameter("F_SRC_PASSWD");

		logger.debug("GetScheduleConnectTest sSrcDbms: " + sSrcDbms);
		logger.debug("GetScheduleConnectTest sSrcIp  : " + sSrcIp);
		logger.debug("GetScheduleConnectTest sSrcPort: " + sSrcPort);
		logger.debug("GetScheduleConnectTest sSrcDb  : " + sSrcDb);
		logger.debug("GetScheduleConnectTest sSrcUser: " + sSrcUser);
		logger.debug("GetScheduleConnectTest sSrcPass: " + sSrcPass);
		
        if (sSrcDbms.equals("1")) {  //oracle
        	sConnectString = "jdbc:oracle:thin:@" + sSrcIp + ":" + sSrcPort + ":" + sSrcDb;
        	sDriveName = "oracle.jdbc.driver.OracleDriver";
        } else if (sSrcDbms.equals("2")) { //mysql
        	sConnectString = "jdbc:mysql://" + sSrcIp + ":" + sSrcPort + "/" + sSrcDb;
            sDriveName = "com.mysql.jdbc.Driver";
        } else if (sSrcDbms.equals("4")) { //sqlserver
        	sConnectString = "jdbc:sqlserver://" + sSrcIp + ":" + sSrcPort + ";DatabaseName=" + sSrcDb;
            sDriveName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
        } else if (sSrcDbms.equals("5")) { //postgres
        	sConnectString = "jdbc:postgresql://" + sSrcIp + ":" + sSrcPort + "/" + sSrcDb;
            sDriveName = "org.postgresql.Driver";
        }
		
        logger.debug("GetScheduleConnectTest sConnectString: " + sConnectString);
        
		JSONObject jsonobj = new JSONObject();
		
        try {

            Class.forName(sDriveName);
            
            conn = DriverManager.getConnection(sConnectString, sSrcUser, sSrcPass);
        
	    	bOk = true;

			if (bOk) 
				jsonobj.put( "result", "OK");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			else
				jsonobj.put("result"  , "Not Connect");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤

			logger.debug("GetScheduleConnectTest : " + jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
		    	
        } catch (SQLException e) {
            e.printStackTrace();
			logger.error(e.getMessage());
        } catch (ClassNotFoundException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			jsonobj.put("result"  , "Not Connect");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
		} finally {
            if(conn!=null){try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
				logger.error(e.getMessage());
			}}
        }
	}
 
	
	
}