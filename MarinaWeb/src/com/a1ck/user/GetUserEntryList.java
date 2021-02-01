package com.a1ck.user;

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
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class GetUserEntryList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
	public Connection connectionDest = null;
	
    public GetUserEntryList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = null ;
		
		try{

			conMgr = new ConnectionManagerAll4("postgresql");
			
			logger.debug("getUserEntryList ***** Start GetUserEntryList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sUserCd = "";
			String sUserNm = "";
			String sFrom   = "";
			String sTo     = "";
			String sRows   = "";
			String sPage   = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getUserEntryList jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getUserEntryList DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getUserEntryList json:" + json); 

	            sUserCd = (String)json.get("__user_cd");
	            sUserNm = (String)json.get("__user_nm");
	            sFrom   = (String)json.get("__from");
	            sTo     = (String)json.get("__to");
	            sRows   = (String)json.get("__rows");
	            sPage   = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getUserEntryList sUserCd:" + sUserCd);
				logger.debug("getUserEntryList sUserNm:" + sUserNm);
				logger.debug("getUserEntryList sFrom  :" + sFrom);
				logger.debug("getUserEntryList sTo    :" + sTo);
				logger.debug("getUserEntryList nRows:" + sRows);
				logger.debug("getUserEntryList nPage:" + sPage);
			} 
			
		    connectionDest = conMgr.getConnection(); 

			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT a.REG_DATE, b.DVC_NM, a.USER_NM, a.STATUS \n ";
			sQuery += "   FROM ate_hist a, face_device b \n ";
			sQuery += "  WHERE a.dvc_id = b.dvc_id   \n ";
			
			if( !StringUtils.equals(sUserCd, "") && !StringUtils.equals(sUserCd, null) )  {
				sQuery += "    AND a.USER_CD = '" + sUserCd + "' \n";
			} else if( !StringUtils.equals(sUserNm, "") && !StringUtils.equals(sUserNm, null) ) {
					sQuery += "    AND a.USER_NM like '%" + sUserNm + "%' \n";
			}
			
			sQuery += "  ORDER BY a.reg_date  \n ";
			
			logger.debug("getUserEntryList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("REG_DATE"   	, rs.getString("REG_DATE"));	
				datas.put("DVC_NM"   	, rs.getString("DVC_NM"  ));	
				datas.put("USER_NM"     , rs.getString("USER_NM" ));	
				datas.put("STATUS"   	, rs.getString("STATUS"  ));	
				
				seriesArray.add(datas);
				jsonobj.put("rows"  ,seriesArray);   
			
				nCount++;
			}
			
			if (nCount> 0 ) {
				int total = nCount / Integer.parseInt(sRows);
				
				jsonobj.put("records" , nCount  );  
				jsonobj.put("page"    , Integer.parseInt(sPage)      ); 
				jsonobj.put("total"   , total     );  
				jsonobj.put("result"  , "OK"      );  
			} else {  
				jsonobj.put("result"  , "NOTFOUND");  
			}
				
			//logger.debug(jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("getUserEntryList :" + jsonobj.toString() ); 
			
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