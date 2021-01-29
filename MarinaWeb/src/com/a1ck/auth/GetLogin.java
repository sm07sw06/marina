package com.a1ck.auth;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;



public class GetLogin extends HttpServlet implements HttpSessionListener {

	private static final long serialVersionUID = 1L;
    Connection con;
    ResultSet rs;
    Statement stmt;
 
//    public static Logger logger = Logger.getLogger("DashBoard");  
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
	public Connection connectionDest = null;
	
    /*public GetLogin() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}*/

    static private int activeSessions;
    
    public static int getActiveSessions() {
         return activeSessions;
     }

	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("GetLogin ***** Start GetLogin *****"); 
			
			String sQuery  = null;
			String sPassword = "";
			int    nCount = 0;
			
			String sUserid = request.getParameter("username").trim();
			String sPwd   = request.getParameter("password").trim();

			String userid     	= ""; 
			String username		= "";
			String orgCd		= "";
			String orgNm		= "";
			String picture		= "";
			String retireYmd	= "";
			String stateCd      = "";
			String approwait    = "";
			
			HttpSession session = request.getSession(true);
			session.setMaxInactiveInterval(60*30);  //�꽭�뀡 �쑀�슚�떆媛� : (60珥�*30) �썑 濡쒓렇�븘�썐 //�뵒�뤃�듃 30遺�
			
			logger.debug("GetLogin userid:" + sUserid); 
			logger.debug("GetLogin password :" + sPwd); 
			 
		    UtilClass  utilClass = new UtilClass();
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = "\nSELECT U.USER_CD, U.USER_NM, E.DEPT_CD, E.DEPT_NM, E.RETIRE_DT, E.STATE_CD, U.PASSWORD, U.APPROWAITCNT, U.PICTURE  \n ";
			sQuery += "   FROM TB_USER_INFO U LEFT OUTER JOIN TB_EMP E ON E.USER_CD = E.USER_CD AND E.STATE_CD = '1' \n ";
//			sQuery += "                    LEFT OUTER JOIN AE_INBOX B ON E.USER_ID = B.USER_ID \n ";
			sQuery += "  WHERE 1 = 1 \n ";
			sQuery += "    AND U.USER_CD = '" + sUserid + "' \n ";
			
 			logger.debug("GetLogin sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject() ;
	        JSONArray  seriesArray = new JSONArray();	
			
	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				userid    	= rs.getString("USER_CD"); 
				username	= rs.getString("USER_NM");
				orgCd		= rs.getString("DEPT_CD");
				orgNm		= rs.getString("DEPT_NM");
				picture		= rs.getString("PICTURE");
				retireYmd	= rs.getString("RETIRE_DT");
				stateCd		= rs.getString("STATE_CD");
				approwait	= rs.getString("APPROWAITCNT");
				
				datas.put("userid"    , userid);	
				datas.put("username"  , username);	
				datas.put("orgCd  "   , orgCd);	
				datas.put("orgNm"     , orgNm);	
				datas.put("stateCd"   , stateCd);
				datas.put("approwait" , approwait);	 

				if (!StringUtils.isEmpty(picture)) 
					datas.put("picture" , picture);	
				else
					datas.put("picture" , " " );

				if (!StringUtils.isEmpty(retireYmd)) 
					datas.put("retireYmd"  , retireYmd);	
				else
					datas.put("retireYmd"  , " " );

				seriesArray.add(datas);
				jsonobj.put("data"  ,seriesArray); 
				
				sPassword = rs.getString("PASSWORD");
				
				nCount++;
			}
			
			logger.debug("GetLogin :: sPwd:" + sPwd );
			logger.debug("GetLogin :: sPassword:" + sPassword );
			String pwd = utilClass.encryptSHA256(sPwd);
			logger.debug("GetLogin ::  pwd:" + pwd);

			if (nCount> 0 ) { 
				
//				logger.debug("GetLogin :: sPwd:" + sPwd );
//				logger.debug("GetLogin :: sPassword:" + sPassword );
//				String pwd = utilClass.encryptSHA256(sPwd);
//				logger.debug("GetLogin ::  pwd:" + pwd);
				
				
				// 1111 : 0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c
				
				if ( StringUtils.equalsIgnoreCase(pwd,sPassword)) { 
					jsonobj.put("result" , "success" );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
					session.setAttribute("userid"    , userid    ); 
					session.setAttribute("username"  , username  ); 
					session.setAttribute("orgCd"     , orgCd    ); 
					session.setAttribute("orgNm"     , orgNm    ); 
					session.setAttribute("picture"   , picture  ); 
					session.setAttribute("retireYmd" , retireYmd); 
					session.setAttribute("stateCd"   , stateCd  );
					session.setAttribute("approwait" , approwait);
					//logger.debug("userid server:"+userid);
				} else {
					jsonobj.put("result" , "invalid" );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
				}

				// If you validate the user you may set the user cookies/sessions here
				//#setcookie("logged_in", "user_id");
				//#$_SESSION["logged_user"] = "user_id";
			
				// Set the redirect url after successful login
				//$resp['redirect_url'] = '';
			
			} else {  
					jsonobj.put("result" , "NotFound");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			}
				
			//logger.debug(jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("GetLogin :" + jsonobj.toString() ); 
			
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

	@Override
	public void sessionCreated(HttpSessionEvent arg0) {
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent arg0) {
	}
 
}