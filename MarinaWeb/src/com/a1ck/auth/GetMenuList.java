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
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;

public class GetMenuList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
	public Connection connectionDest = null;
	
    public GetMenuList() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}	
	
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		try{
			
			String sQuery  = null;
			String sResult = "NOTFOUND";
			String sUserCd = "";
			
			String jsonParam = request.getParameter("param");
			
			logger.debug("getCodeManager jsonParam:" + jsonParam); 
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getMenuList json:" + json); 
	              
	            sUserCd   = (String)json.get("user_cd");
	            
	            response.setContentType("application/x-json charset=UTF-8");
			}
			
			connectionDest = conMgr.getConnection();
			 
			stmt = connectionDest.createStatement();

            logger.debug("getMenuList sUserCd:" + sUserCd); 

			if ( StringUtils.equalsIgnoreCase(sUserCd,"*") || StringUtils.equalsIgnoreCase(sUserCd,"admin")) { 
	   			sQuery  = "\n";
	   			sQuery += " SELECT DISTINCT MENU_CD, MENU_NM, MENU_URL, MENU_ORDER, MENU_ID, MENU_DESC, UP_MENU_ID \n";
	   			sQuery += "   FROM ( \n";
	   			sQuery += "         SELECT lpad(M.MENU_CD,5,'0') MENU_CD ,M.MENU_NM, M.MENU_URL, M.MENU_ORDER, M.MENU_ID, M.MENU_DESC, M.UP_MENU_ID   \n";
	   			sQuery += "           FROM TB_MENU M  \n";
	   			sQuery += "        ) T1																			\n";
	   			sQuery += "  ORDER BY 4     														            \n";
			}	else {
	   			sQuery  = "\n";
	   			sQuery += " SELECT DISTINCT MENU_CD, MENU_NM, MENU_URL, MENU_ORDER, MENU_ID, MENU_DESC, UP_MENU_ID \n";
	   			sQuery += "   FROM ( \n";
	   			sQuery += "         SELECT lpad(M.MENU_CD,5,'0') MENU_CD ,M.MENU_NM, M.MENU_URL, M.MENU_ORDER, M.MENU_ID, M.MENU_DESC, M.UP_MENU_ID   \n";
	   			sQuery += "           FROM TB_MENU M  \n";
	   			sQuery += "          WHERE M.menu_id in (select menu_id from TB_EMP_AUTH a , TB_USER_INFO i where '1' = A.EMP_GB and A.EMP_ID = I.USER_ID  and  I.USER_CD = '" + sUserCd + "')		\n";
	   			sQuery += "          UNION ALL																	\n";
	   			sQuery += "         SELECT lpad(M.MENU_CD,5,'0') MENU_CD ,M.MENU_NM, M.MENU_URL, M.MENU_ORDER, M.MENU_ID, M.MENU_DESC, M.UP_MENU_ID   \n";
	   			sQuery += "           FROM TB_MENU M  \n";
	   			sQuery += "          WHERE M.menu_id in (select menu_id from TB_EMP_AUTH a , TB_USER_INFO i, TB_EMP_MEMBER U where '2' = A.EMP_GB and A.EMP_ID = I.USER_ID  and U.EMP_GRP_ID = A.EMP_ID and  I.USER_CD = '" + sUserCd + "')		\n";
	   			sQuery += "        ) T1																			\n";
	   			sQuery += "  ORDER BY 4     														            \n";
	   			
	   			
			}
		    logger.debug("GetMenuList\n" + sQuery);
			
			rs = stmt.executeQuery(sQuery);

	        JSONObject item;
	        JSONArray items = new JSONArray();
	        
			while(rs.next()){
				item = new JSONObject(); 
				item.put("MENU_CD"    , rs.getString("MENU_CD"   ));
				item.put("MENU_NM"    , rs.getString("MENU_NM"   ));
				item.put("MENU_URL"   , rs.getString("MENU_URL"  ));
				item.put("MENU_ID"    , rs.getString("MENU_ID"   ));
				item.put("MENU_DESC"  , rs.getString("MENU_DESC" ));
				item.put("MENU_ORDER" , rs.getString("MENU_ORDER"));
				item.put("UP_MENU_ID" , rs.getString("UP_MENU_ID"));
				
				items.add(item);
				sResult = "OK";				
			}

			JSONObject jsonobj = new JSONObject();

			jsonobj.put("result" , sResult); 
			jsonobj.put("menuData", items); 
			
			//
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());

        	logger.debug(jsonobj.toString());
			
			stmt.close();
			//connectionDest.close();
			conMgr.freeConnection(connectionDest);
		} catch(Exception e){
			e.printStackTrace();
        	logger.error(e.getMessage());
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