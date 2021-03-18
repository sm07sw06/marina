package com.a1ck.asset;

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

public class GetServerCombo extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
	public Connection connectionDest = null;
	
    public GetServerCombo() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getServerCombo ***** Start GetServerCombo *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sServerId = "";
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getServerCombo json:" + json); 
	              
	            sServerId = (String)json.get("__server_id");
	            response.setContentType("application/x-json charset=UTF-8");
			}
			
			logger.debug("getServerCombo sServerId:" + sServerId);
			
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT S.SERVER_ID, S.SERVER_NM \n ";
			sQuery += "   FROM  TB_SERVER S  \n ";
			sQuery += "  WHERE 1 = 1    \n ";
			sQuery += "    AND S.USE_YN = 'Y'  \n ";
			
			if( !StringUtils.equals(sServerId, "*")) {
				sQuery += "    AND S.SERVER_ID = " + sServerId + " \n";
			}
			sQuery += "  ORDER BY S.SERVER_NM \n ";
			
			logger.debug("getServerCombo sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("SERVER_ID"   , rs.getString("SERVER_ID"));	
				datas.put("SERVER_NM"   , rs.getString("SERVER_NM"));
				
				seriesArray.add(datas);
				jsonobj.put("data"  ,seriesArray);   
			
				nCount++;
			}
			
			if (nCount> 0 ) {
				jsonobj.put("result" , "OK"      );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
				jsonobj.put("count"  , nCount    );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			} else {  
				jsonobj.put("result" , "NOTFOUND");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
				jsonobj.put("count"  , 0         );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			}
				
			//logger.debug(jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("getServerCombo :" + jsonobj.toString() ); 
			
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