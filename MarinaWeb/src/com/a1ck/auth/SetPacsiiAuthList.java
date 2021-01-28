package com.a1ck.auth;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;



public class SetPacsiiAuthList extends HttpServlet {
    private static final long serialVersionUID = 1L; 
    Connection con;
    ResultSet rs;
    Statement stmt;
 
    public static Logger logger = Logger.getLogger("DashBoard"); 
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
	public Connection connectionDest = null;
	
    public SetPacsiiAuthList() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("SetPacsiiAuthList ***** Start SetPacsiiAuthList *****"); 
			
			String sQueryDelete  = null;
			String sQueryInsert  = null;
			int    nRtn = 0;
			
		    UtilClass  utilClass = new UtilClass();

		    String sData  = request.getParameter("jdata").trim();
			//logger.debug("SetPacsiiAuthList sData:" + sData); 

			String sDate  = request.getParameter("sdate").trim();
			//logger.debug("SetPacsiiAuthList sDate :" + sDate); 
			
			String eDate  = request.getParameter("edate").trim();
			//logger.debug("SetPacsiiAuthList eDate :" + eDate); 
		
			JSONParser parser = new JSONParser();
			Object obj = parser.parse(sData);
			JSONObject jo = (JSONObject) obj;
			
			String sabun    = utilClass.nvl_trim(jo.get("sabun"   ).toString());
			String systemId = utilClass.nvl_trim(jo.get("systemId").toString());
			String authId   = utilClass.nvl_trim(jo.get("authId"  ).toString());
			String descript = utilClass.nvl_trim(jo.get("descript").toString());
			String statusNm = utilClass.nvl_trim(jo.get("statusNm").toString());
//			String statusNm = utilClass.nvl_trim(jo.getString("statusNm"  ));
			String sdate    = utilClass.getDate2String(sDate);
			String edate    = utilClass.getDate2String(eDate);
			
			logger.debug("SetPacsiiAuthList sabun :" + sabun); 
			logger.debug("SetPacsiiAuthList systemId :" + systemId); 
			logger.debug("SetPacsiiAuthList authId :" + authId); 
			logger.debug("SetPacsiiAuthList descript :" + descript); 
			logger.debug("SetPacsiiAuthList statusNm :" + statusNm); 
			logger.debug("SetPacsiiAuthList sdate :" + sdate); 
			logger.debug("SetPacsiiAuthList edate :" + edate); 
			
			connectionDest = conMgr.getConnection(); 
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			if( StringUtils.equals(statusNm, "�궘�젣")) {
			
				sQueryDelete  = " DELETE FROM AE_AUTH_PACSII \n ";
				sQueryDelete += "  WHERE 1 = 1 \n ";
				sQueryDelete += "    AND SABUN     = '" + sabun + "' \n";
				sQueryDelete += "    AND SYSTEM_ID =  " + systemId + " \n";
				sQueryDelete += "    AND AUTH_ID   = '" + authId + "' \n";
				logger.debug("SetPacsiiAuthList sQueryDelete:" + sQueryDelete); 
				nRtn = stmt.executeUpdate (sQueryDelete);
				
			} else if( StringUtils.equals(statusNm, "異붽�")) {
				
				sQueryInsert  = " INSERT INTO AE_AUTH_PACSII ( SABUN,SYSTEM_ID,AUTH_ID,DESCRIPT,STATUS,START_YMD,END_YMD ) \n ";
				sQueryInsert += " VALUES ( '" + sabun + "', " + systemId + ", '" + authId + "', '" + descript + "', '" + statusNm + "', '" + sdate + "', '" + edate + "') \n";
				logger.debug("SetPacsiiAuthList sQueryInsert:" + sQueryInsert); 
				nRtn = stmt.executeUpdate (sQueryInsert);
			}			

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
			logger.debug("SetPacsiiAuthList :" + jsonobj.toString() ); 
			
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