package com.a1ck.comm;

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


public class GetTableListPop extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
	public Connection connectionDest = null;
	
    public GetTableListPop() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getTableList ***** Start GetTableList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sGb       = "";
			String sTableId  = "";
			String sTableNm  = "";
			String sRows  = "";
			String sPage  = "";
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getTableList json:" + json); 
	              
	            sGb      = (String)json.get("__gb");
	            sTableId = (String)json.get("__table_id");
	            sTableNm = (String)json.get("__table_nm");
	            sRows    = (String)json.get("__rows");
	            sPage    = (String)json.get("__page");
	            
				logger.debug("getTableList sGb:" + sGb);
				logger.debug("getTableList sTableId:" + sTableId);
				logger.debug("getTableList sTableNm:" + sTableNm);
				logger.debug("getTableList nRows:" + sRows);
				logger.debug("getTableList nPage:" + sPage);

				response.setContentType("application/x-json charset=UTF-8");
			}
			
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
				
				sQuery  = " SELECT T.TABLE_ID, T.TABLE_CD, T.TABLE_NM \n ";
				sQuery += "   FROM TB_TABLE_INFO T  \n ";
				sQuery += "  WHERE 1 = 1    \n ";
				sQuery += "    AND T.USE_YN = 'Y'  \n ";
				
				if( !StringUtils.equals(sTableId, "*") ) {
					sQuery += "    AND T.TABLE_ID = '" + sTableId + "' \n";
				}
				
				if( !StringUtils.equals(sTableNm, "*") && !StringUtils.equals(sTableNm, "")) {
					sQuery += "    AND T.TABLE_NM LIKE '%" + sTableNm + "%' \n";
				}
				
				sQuery += "  ORDER BY T.TABLE_NM \n ";
				
	
			logger.debug("getTableList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 野껉퀗�궢占쎌벥 占쎄쉐�⑤벊肉ч겫占썹몴占� 占쎌넇占쎌뵥
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("TABLE_ID"   , rs.getString("TABLE_ID"));	
				datas.put("TABLE_CD"   , rs.getString("TABLE_CD"));	
				datas.put("TABLE_NM"   , rs.getString("TABLE_NM"));	

				seriesArray.add(datas);
				jsonobj.put("data"  ,seriesArray);   
			
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
				
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("getTableList :" + jsonobj.toString() ); 
			
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