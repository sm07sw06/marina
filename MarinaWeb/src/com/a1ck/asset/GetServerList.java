package com.a1ck.asset;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.CodeClass;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;

public class GetServerList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
	public Connection connectionDest = null;
	
    public GetServerList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	
	@SuppressWarnings("unchecked") 
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
		
		try{

			logger.debug("getServerList ***** Start GetServerList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sServerId = "";
			String sUseYn    = "";
			String sRows     = "";
			String sPage     = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getServerList jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getServerList DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getServerList json:" + json); 

	            sServerId = (String)json.get("__server_id");
	            sUseYn    = (String)json.get("__use_yn");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getServerList sServerId:" + sServerId);
				logger.debug("getServerList sUseYn   :" + sUseYn);
				logger.debug("getServerList nRows:" + sRows);
				logger.debug("getServerList nPage:" + sPage);
			} 
			
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT S.SERVER_ID, S.SERVER_NM, S.SERVER_CLASS_CD, S.SERVER_IP, S.SERVER_DESC, S.USE_YN, C.DETAIL_NM AS SERVER_CLASS_NM \n ";
			sQuery += "   FROM TB_SERVER S, TB_CODE_DETAIL C \n ";
			sQuery += "  WHERE 1 = 1    \n ";
			sQuery += "    AND S.SERVER_CLASS_CD = C.DETAIL_CD  \n ";
			sQuery += "    AND 'SERVER_CLASS_CD' = C.GROUP_CD   \n ";

			if( !StringUtils.equals(sUseYn, "A")) {
				sQuery += "    AND S.USE_YN like '%" + sUseYn + "%'  \n ";
			}
			
			if( !StringUtils.equals(sServerId, "*")) {
				sQuery += "    AND S.SERVER_ID = " + sServerId + " \n";
			}
			
			sQuery += "  ORDER BY S.SERVER_NM \n ";
			
			logger.debug("getServerList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("SERVER_ID"   	, rs.getString("SERVER_ID"));	
				datas.put("SERVER_NM"   	, rs.getString("SERVER_NM"));	
				datas.put("USE_YN"     		, rs.getString("USE_YN"  ));	

				if (!StringUtils.isEmpty(rs.getString("SERVER_CLASS_CD"))) 
					datas.put("SERVER_CLASS_CD" , rs.getString("SERVER_CLASS_CD"));	
				else
					datas.put("SERVER_CLASS_CD" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("SERVER_IP"))) 
					datas.put("SERVER_IP"     , rs.getString("SERVER_IP"));	
				else
					datas.put("SERVER_IP"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("SERVER_DESC"))) 
					datas.put("SERVER_DESC"     , rs.getString("SERVER_DESC"));	
				else
					datas.put("SERVER_DESC"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("SERVER_CLASS_NM"))) 
					datas.put("SERVER_CLASS_NM"     , rs.getString("SERVER_CLASS_NM"));	
				else
					datas.put("SERVER_CLASS_NM"     , " " );
				
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
			logger.debug("getServerList :" + jsonobj.toString() ); 
			
			stmt.close();
			//connectionDest.close();
			conMgr.freeConnection(connectionDest);

		} catch(Exception e){
			e.printStackTrace();
		} finally {
			try{
				if(stmt != null)
					stmt.close();
			}catch(Exception e){
				e.printStackTrace();
			}
		}

    }
	
 
}