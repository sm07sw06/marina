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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class GetUserList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	
	public Connection connectionDest = null;
	
    public GetUserList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = null ;
		
		try{

			conMgr = new ConnectionManagerAll4("postgresql");
			
			logger.debug("getUserList ***** Start GetUserList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sUserCd = "";
			String sUserNm = "";
			String sRows   = "";
			String sPage   = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getUserList jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getUserList DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getUserList json:" + json); 

	            sUserCd = (String)json.get("__user_cd");
	            sUserNm = (String)json.get("__user_nm");
	            sRows   = (String)json.get("__rows");
	            sPage   = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getUserList sUserCd:" + sUserCd);
				logger.debug("getUserList sUserNm:" + sUserNm);
				logger.debug("getUserList nRows:" + sRows);
				logger.debug("getUserList nPage:" + sPage);
			} 
			
		    connectionDest = conMgr.getConnection(); 

			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT U.USER_ID, U.USER_NM, U.USER_CD, U.PASSWORD, U.PASSWORD as PASSWORDORG, U.TELEPHONE, U.EMAIL, U.APPROWAITCNT, E.DEPT_CD, E.DEPT_NM, E.RETIRE_DT, E.STATE_CD \n ";
			sQuery += "       ,C.DETAIL_NM AS STATE_NM, U.USE_YN, U.PICTURE  \n ";
			sQuery += "   FROM TB_USER_INFO U LEFT OUTER JOIN TB_EMP E ON U.USER_CD = E.EMP_CD \n ";
			sQuery += "                   LEFT OUTER JOIN TB_CODE_DETAIL C ON E.STATE_CD = C.DETAIL_CD AND 'STATE_CD' = C.GROUP_CD \n ";
			sQuery += "  WHERE 1 = 1    \n ";
			sQuery += "    AND U.USE_YN != 'D' \n";
			
			if( !StringUtils.equals(sUserNm, "") || !StringUtils.equals(sUserNm, null)) {
				sQuery += "    AND U.USER_NM like '%" + sUserNm + "%' \n";
			}
			
			sQuery += "  ORDER BY U.USER_NM \n ";
			
			logger.debug("getUserList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("USER_ID"   	, rs.getString("USER_ID"));	
				datas.put("USER_NM"   	, rs.getString("USER_NM"));	
				datas.put("USER_CD"     , rs.getString("USER_CD" ));	
				datas.put("USE_YN"   	, rs.getString("USE_YN"  ));	

				datas.put("PASSWORD"    , rs.getString("PASSWORD") );
				datas.put("PASSWORDORG" , rs.getString("PASSWORDORG") );
				
				if (!StringUtils.isEmpty(rs.getString("TELEPHONE"))) 
					datas.put("TELEPHONE"     , rs.getString("TELEPHONE"));	
				else
					datas.put("TELEPHONE"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("EMAIL"))) 
					datas.put("EMAIL"     , rs.getString("EMAIL"));	
				else
					datas.put("EMAIL"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("APPROWAITCNT"))) 
					datas.put("APPROWAITCNT"     , rs.getString("APPROWAITCNT"));	
				else
					datas.put("APPROWAITCNT"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("PICTURE"))) 
					datas.put("PICTURE"     , rs.getString("PICTURE"));	
				else
					datas.put("PICTURE"     , " " );
				
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
			logger.debug("getUserList :" + jsonobj.toString() ); 
			
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