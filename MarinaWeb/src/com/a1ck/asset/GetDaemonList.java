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

public class GetDaemonList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
	public Connection connectionDest = null;
	
    public GetDaemonList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getDaemonList ***** Start GetDaemonList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sDaemonId  = "";
			String sUseYn    = "";			
			String sRows  = "";
			String sPage  = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getDaemonList json:" + json); 
	              
	            sDaemonId = (String)json.get("__daemon_id");
	            sUseYn    = (String)json.get("__use_yn");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
				logger.debug("getDaemonList sDaemonId:" + sDaemonId);
				logger.debug("getServerList sUseYn:" + sUseYn);
				logger.debug("getDaemonList nRows:" + sRows);
				logger.debug("getDaemonList nPage:" + sPage);

				response.setContentType("application/x-json charset=UTF-8");

			}
			
			logger.debug("getDaemonList sDaemonId:" + sDaemonId);
			
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT D.DAEMON_ID, D.DAEMON_NM, D.DAEMON_IP, D.DAEMON_PORT, D.DAEMON_DESC, D.DAEMON_STAT_CD, D.DAEMON_RESTART_YN, D.USE_YN, C.DETAIL_NM AS DAEMON_STAT_NM \n ";
			sQuery += "   FROM TB_DAEMON D LEFT OUTER JOIN TB_CODE_DETAIL C ON D.DAEMON_STAT_CD = C.DETAIL_CD AND 'DAEMON_STAT_CD' = C.GROUP_CD \n ";
			sQuery += "  WHERE 1 = 1    \n ";
			
			if( !StringUtils.equals(sUseYn, "A")) {
				sQuery += "    AND D.USE_YN like '%" + sUseYn + "%'  \n ";
			}
			
			if( !StringUtils.equals(sDaemonId, "*")) {
				sQuery += "    AND D.DAEMON_ID = " + sDaemonId + " \n";
			}
			
			sQuery += "  ORDER BY D.DAEMON_ID \n ";
			
			logger.debug("getDaemonList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
	        	
				JSONObject datas = new JSONObject();
				
				datas.put("DAEMON_ID"       , rs.getString("DAEMON_ID"));	
				datas.put("DAEMON_NM"       , rs.getString("DAEMON_NM"));
				datas.put("DAEMON_IP"       , rs.getString("DAEMON_IP"));					
				datas.put("DAEMON_PORT"     , rs.getString("DAEMON_PORT"));					
				datas.put("DAEMON_STAT_CD"  , rs.getString("DAEMON_STAT_CD"));					
				datas.put("DAEMON_STAT_NM"  , rs.getString("DAEMON_STAT_NM"));					
				datas.put("AUTO_RESTART_YN" , rs.getString("DAEMON_RESTART_YN"));					
				datas.put("USE_YN"          , rs.getString("USE_YN"));					

				if (!StringUtils.isEmpty(rs.getString("DAEMON_DESC"))) 
					datas.put("DAEMON_DESC" , rs.getString("DAEMON_DESC"));	
				else
					datas.put("DAEMON_DESC" , " " );

				datas.put("START"      , "0");					
				datas.put("STOP"       , "0");					

				
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
			logger.debug("getDaemonList :" + jsonobj.toString() ); 
			
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