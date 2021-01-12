package com.a1ck.auth;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
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
	public Connection connectionDest = null;
	
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		try{
			
			String sQuery  = null;
			String sResult = "NOTFOUND";
			String sUserCd = "";
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getAgentList json:" + json); 
	              
	            sUserCd = (String)json.get("user_cd");
	            
	            response.setContentType("application/x-json charset=UTF-8");
			}
			
			connectionDest = conMgr.getConnection();
			 
			stmt = connectionDest.createStatement();
   			sQuery  = "\n";
   			sQuery += " SELECT DISTINCT MENU_CD, MENU_NM, MENU_URL, MENU_ORDER \n";
   			sQuery += "   FROM ( \n";
   			sQuery += "         SELECT lpad(M.MENU_CD,5,'0') MENU_CD ,M.MENU_NM, M.MENU_URL, M.MENU_ORDER   \n";
   			sQuery += "           FROM MDDB.TB_MENU M, MDDB.TB_USER_AUTH A, MDDB.TB_USER_INFO I	   								    \n";
   			sQuery += "          WHERE A.USER_ID = I.USER_ID AND I.USER_CD = '" + sUserCd + "'	            \n";
   			sQuery += "            AND A.MENU_ID = M.MENU_ID												\n";
   			sQuery += "            AND '1'       = A.USER_GB												\n";
   			sQuery += "          UNION ALL																	\n";
   			sQuery += "         SELECT lpad(M.MENU_CD,5,'0') MENU_CD ,M.MENU_NM, M.MENU_URL, M.MENU_ORDER	\n";
   			sQuery += "           FROM MDDB.TB_MENU M, MDDB.TB_USER_AUTH A, MDDB.TB_USER_MEMBER U, MDDB.TB_USER_INFO I							\n";
   			sQuery += "          WHERE U.USER_ID = I.USER_ID AND I.USER_CD = '" + sUserCd + "'				\n";
   			sQuery += "            AND A.MENU_ID = M.MENU_ID												\n";
   			sQuery += "            AND U.USER_GRP_ID = A.USER_ID											\n";
   			sQuery += "            AND '2' = A.USER_GB														\n";
   			sQuery += "        ) T1																			\n";
   			sQuery += "  ORDER BY 4     														            \n";
			
			logger.debug("GetMenuList\n" + sQuery);
			
			rs = stmt.executeQuery(sQuery);

	        JSONObject item;
	        JSONArray items = new JSONArray();
	        
			while(rs.next()){
				item = new JSONObject(); 
				item.put("MENU_CD"  , rs.getString("MENU_CD" ));
				item.put("MENU_NM"  , rs.getString("MENU_NM" ));
				item.put("MENU_URL" , rs.getString("MENU_URL"));
				
				items.add(item);
				sResult = "OK";				
			}

			JSONObject jsonobj = new JSONObject();

			jsonobj.put("result" , sResult); // 寃곌낵臾� JSON �옉�꽦
			jsonobj.put("menuData", items); // 寃곌낵臾� JSON �옉�꽦
			
			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());

        	//logger.debug(jsonobj.toString());

			
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