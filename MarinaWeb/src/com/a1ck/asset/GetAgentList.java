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


public class GetAgentList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
	public Connection connectionDest = null;
	
    public GetAgentList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getAgentList ***** Start GetAgentList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sServerId = "";
			String sAgentId  = "";
			String sUseYn    = "";					
			String sRows  = "";
			String sPage  = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getAgentList json:" + json); 
	              
	            sServerId = (String)json.get("__server_id");
	            sAgentId  = (String)json.get("__agent_id");
	            sUseYn    = (String)json.get("__use_yn");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");

				logger.debug("getAgentList sServerId:" + sServerId);
				logger.debug("getAgentList sAgentId:" + sAgentId);
				logger.debug("getServerList sUseYn:" + sUseYn);
				logger.debug("getAgentList nRows:" + sRows);
				logger.debug("getAgentList nPage:" + sPage);
			}
			
			logger.debug("getAgentList sServerId:" + sServerId);
			
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = "\nSELECT A.AGENT_ID, A.AGENT_NM, A.AGENT_PORT, A.SERVER_ID, S.SERVER_NM, A.ACCOUNT_CD, a.PASSWORD, A.PATH, A.DESCRIPTION, A.RUN_CD, C.DETAIL_NM as RUN_NM, A.USE_YN\n ";
			sQuery += "   FROM MDDB.TB_AGENT A LEFT OUTER JOIN MDDB.TB_CODE_DETAIL C ON A.RUN_CD = C.DETAIL_CD AND 'RUN_CD' = C.GROUP_CD , MDDB.TB_SERVER S \n ";
			sQuery += "  WHERE 1 = 1    \n ";
			sQuery += "    AND A.SERVER_ID = S.SERVER_ID  \n ";
			
			if( !StringUtils.equals(sUseYn, "A")) {
				sQuery += "    AND A.USE_YN like '%" + sUseYn + "%'  \n ";
			}
						
			if( !StringUtils.equals(sServerId, "*")) {
				sQuery += "    AND A.SERVER_ID = " + sServerId + " \n";
			}
			if( !StringUtils.equals(sAgentId, "*")) {
				sQuery += "    AND A.AGENT_ID = " + sAgentId + " \n";
			}
			
			sQuery += "  ORDER BY A.AGENT_NM \n ";
			
			logger.debug("getAgentList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("SERVER_ID"   , rs.getString("SERVER_ID"));	
				datas.put("AGENT_ID"     , rs.getString("AGENT_ID"));
				datas.put("AGENT_NM"    , rs.getString("AGENT_NM"));					
				datas.put("AGENT_PORT"    , rs.getString("AGENT_PORT"));					

				if (!StringUtils.isEmpty(rs.getString("SERVER_NM"))) 
					datas.put("SERVER_NM" , rs.getString("SERVER_NM"));	
				else
					datas.put("SERVER_NM" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("ACCOUNT_CD"))) 
					datas.put("ACCOUNT_CD" , rs.getString("ACCOUNT_CD"));	
				else
					datas.put("ACCOUNT_CD" , " " );
				
				//logger.debug("email:[" + rs.getString("MAIL") + "]");
				if (!StringUtils.isEmpty(rs.getString("PASSWORD"))) 
					datas.put("PASSWORD"     , rs.getString("PASSWORD"));	
				else
					datas.put("PASSWORD"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("PATH"))) 
					datas.put("PATH" , rs.getString("PATH"));	
				else
					datas.put("PATH" , " " );
				
				//logger.debug("email:[" + rs.getString("MAIL") + "]");
				if (!StringUtils.isEmpty(rs.getString("DESCRIPTION"))) 
					datas.put("DESCRIPTION"     , rs.getString("DESCRIPTION"));	
				else
					datas.put("DESCRIPTION"     , " " );
				
				if (!StringUtils.isEmpty(rs.getString("RUN_CD"))) 
					datas.put("RUN_CD" , rs.getString("RUN_CD"));	
				else
					datas.put("RUN_CD" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("RUN_NM"))) 
					datas.put("RUN_NM" , rs.getString("RUN_NM"));	
				else
					datas.put("RUN_NM" , " " );
				
				//logger.debug("email:[" + rs.getString("MAIL") + "]");
				if (!StringUtils.isEmpty(rs.getString("USE_YN"))) 
					datas.put("USE_YN"     , rs.getString("USE_YN"));	
				else
					datas.put("USE_YN"     , " " );
				
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
			logger.debug("getAgentList :" + jsonobj.toString() ); 
			
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