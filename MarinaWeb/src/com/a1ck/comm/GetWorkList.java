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

public class GetWorkList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
	public Connection connectionDest = null;
	
    public GetWorkList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getWorkList ***** Start GetWorkList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sServerId = "";
			String sWrokCd = "";
			String sUseYn    = "";			
			String sRows  = "";
			String sPage  = "";
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getWorkList json:" + json); 
	              
	            sServerId = (String)json.get("__server_id");
	            sWrokCd   = (String)json.get("__work_cd");
	            sUseYn    = (String)json.get("__use_yn");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getServerList sServerId:" + sServerId);
				logger.debug("getServerList sWrokCd:" + sWrokCd);
				logger.debug("getServerList sUseYn:" + sUseYn);
				logger.debug("getServerList nRows:" + sRows);
				logger.debug("getServerList nPage:" + sPage);
				
			}
			
			logger.debug("getWorkList sServerId:" + sServerId);
			
		    connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT W.SERVER_ID, S.SERVER_NM, W.WORK_CD, W.WORK_NM, W.ACCOUNT_CD, W.DESCRIPTION , W.USE_YN  \n ";
			sQuery += "   FROM TB_WORK W, TB_SERVER S  \n ";
			sQuery += "  WHERE 1 = 1    \n ";
			sQuery += "    AND W.SERVER_ID = S.SERVER_ID  \n ";
			
			if( !StringUtils.equals(sServerId, "*")) {
				sQuery += "    AND W.SERVER_ID = " + sServerId + " \n";
			}
			if( !StringUtils.equals(sWrokCd, "*")) {
				sQuery += "    AND W.WORK_CD = '" + sWrokCd + "' \n";
			}

			if( !StringUtils.equals(sUseYn, "A")) {
				sQuery += "    AND W.USE_YN like '%" + sUseYn + "%'  \n ";
			}
			
			sQuery += "  ORDER BY W.WORK_NM \n ";
			
			logger.debug("getWorkList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("SERVER_ID"   , rs.getString("SERVER_ID"));	
				datas.put("SERVER_NM"   , rs.getString("SERVER_NM"));	
				datas.put("WORK_CD"     , rs.getString("WORK_CD"  ));	
				datas.put("WORK_NM"     , rs.getString("WORK_NM"  ));	
				datas.put("USE_YN"      , rs.getString("USE_YN"   ));	

				if (!StringUtils.isEmpty(rs.getString("ACCOUNT_CD"))) 
					datas.put("ACCOUNT_CD" , rs.getString("ACCOUNT_CD"));	
				else
					datas.put("ACCOUNT_CD" , " " );
				
				//logger.debug("email:[" + rs.getString("MAIL") + "]");
				if (!StringUtils.isEmpty(rs.getString("DESCRIPTION"))) 
					datas.put("DESCRIPTION"     , rs.getString("DESCRIPTION"));	
				else
					datas.put("DESCRIPTION"     , " " );
				
				seriesArray.add(datas);
				jsonobj.put("rows"  ,seriesArray);   
			
				nCount++;
			}
			
			if (nCount> 0 ) {
				jsonobj.put("result" , "OK"      );   
				int total = nCount / Integer.parseInt(sRows);
				
				jsonobj.put("records" , nCount  );  
				jsonobj.put("page"    , Integer.parseInt(sPage)      ); 
				jsonobj.put("total"   , total     ); 
			} else {  
				jsonobj.put("result" , "NOTFOUND");   
			}
				
			logger.debug(jsonobj.toString());

	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("getWorkList :" + jsonobj.toString() ); 
			
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