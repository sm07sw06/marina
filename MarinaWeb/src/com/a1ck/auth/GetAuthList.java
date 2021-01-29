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
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class GetAuthList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
	public Connection connectionDest = null;
	
    public GetAuthList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getAuthList ***** Start GetAuthList *****"); 
			
			String sQuery  = null;  
			int    nCount  = 0;
			
			String sGb     = "";
			String sUserGb = "";
			String sUserId = "";
//			String sUserCd = "";
			String sUserNm = "";
			String sRows   = "";
			String sPage   = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getAuthList json:" + json); 
	              
	            sGb     = (String)json.get("__gb");
	            sUserGb = (String)json.get("__user_gb");
	            sUserId = (String)json.get("__user_id");
//	            sUserCd = (String)json.get("__user_cd");
	            sUserNm = (String)json.get("__user_nm");
	            sRows   = (String)json.get("__rows"   );
	            sPage   = (String)json.get("__page"   );
	            
	            response.setContentType("application/x-json charset=UTF-8");

				logger.debug("getAuthList sGb    :" + sGb    );
				logger.debug("getAuthList sUserGb:" + sUserGb);
				logger.debug("getAuthList sUserId:" + sUserId);
//				logger.debug("getAuthList sUserCd:" + sUserCd);
				logger.debug("getAuthList sUserNm:" + sUserNm);
				logger.debug("getAuthList nRows  :" + sRows  );
				logger.debug("getAuthList nPage  :" + sPage  );
			}
			
		    connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			if( StringUtils.equals(sGb, "A")) {
				
	   			sQuery  = "\n";
	   			sQuery += " SELECT DISTINCT USER_ID,USER_NM \n";
	   			sQuery += "   FROM ( \n";
	   			sQuery += "         SELECT I.USER_ID, I.USER_NM    		\n";
	   			sQuery += "           FROM TB_USER_INFO I   				\n";
	   			sQuery += "          WHERE I.USE_YN ='Y'         		\n";
	   			sQuery += "            AND '1' = '" + sUserGb + "' 		\n";
	   			sQuery += "          UNION ALL							\n";
	   			sQuery += "         SELECT I.USER_GRP_ID, I.USER_GRP_NM \n";
	   			sQuery += "           FROM TB_USER_GROUP I   				\n";
	   			sQuery += "          WHERE I.USE_YN ='Y'         		\n";
	   			sQuery += "            AND '2' = '" + sUserGb + "' 		\n";
	   			sQuery += "        ) T1									\n";
	   			sQuery += "  ORDER BY 2     							\n";
	
	//			if( !StringUtils.equals(sServerId, "*")) {
	//				sQuery += "    AND A.SERVER_ID = " + sServerId + " \n";
	//			}
			}
			else if( StringUtils.equals(sGb, "B")) {
				if( StringUtils.equals(sUserGb, "1")) {
		   			sQuery  = "\n";
		   			sQuery += " SELECT MENU_ID,MENU_NM,MENU_URL \n";
		   			sQuery += "   FROM TB_MENU M \n";
		   			sQuery += "  WHERE M.MENU_ID NOT IN ( SELECT MENU_ID FROM TB_USER_AUTH A WHERE A.USER_GB = '1' AND A.USER_ID = " + sUserId + " )  \n";
		   			sQuery += "  ORDER BY 2     							\n";
				} else {
		   			sQuery  = "\n";
		   			sQuery += " SELECT MENU_ID,MENU_NM,MENU_URL \n";
		   			sQuery += "   FROM TB_MENU M \n";
		   			sQuery += "  WHERE M.MENU_ID NOT IN ( SELECT MENU_ID FROM TB_USER_AUTH A WHERE A.USER_GB = '2' AND A.USER_ID = " + sUserId + " )  \n";
		   			sQuery += "  ORDER BY 2     							\n";
				}
			}
			else if( StringUtils.equals(sGb, "C")) {
	   			sQuery  = "\n";
	   			sQuery += " SELECT DISTINCT MENU_ID, MENU_CD, MENU_NM, MENU_URL, MENU_ORDER \n";
	   			sQuery += "   FROM ( \n";
	   			sQuery += "         SELECT M.MENU_ID, lpad(M.MENU_CD,5,'0') MENU_CD ,M.MENU_NM, M.MENU_URL, M.MENU_ORDER   \n";
	   			sQuery += "           FROM TB_MENU M, TB_USER_AUTH A, TB_USER_INFO I	   								    \n";
	   			sQuery += "          WHERE A.USER_ID = I.USER_ID AND I.USER_ID = " + sUserId + "	            \n";
	   			sQuery += "            AND A.MENU_ID = M.MENU_ID												\n";
	   			sQuery += "            AND '" + sUserGb + "' = A.USER_GB										\n";
	   			sQuery += "          UNION ALL																	\n";
	   			sQuery += "         SELECT M.MENU_ID, lpad(M.MENU_CD,5,'0') MENU_CD ,M.MENU_NM, M.MENU_URL, M.MENU_ORDER	\n";
	   			sQuery += "           FROM TB_MENU M, TB_USER_AUTH A, TB_USER_MEMBER U, TB_USER_INFO I							\n";
	   			sQuery += "          WHERE U.USER_ID = I.USER_ID AND U.USER_GRP_ID = " + sUserId + "				\n";
	   			sQuery += "            AND A.MENU_ID = M.MENU_ID												\n";
	   			sQuery += "            AND U.USER_GRP_ID = A.USER_ID											\n";
	   			sQuery += "            AND '" + sUserGb + "' = A.USER_GB										\n";
	   			sQuery += "        ) T1																			\n";
	   			sQuery += "  ORDER BY 4     														            \n";
			}
			logger.debug("getAuthList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				if( StringUtils.equals(sGb, "A")) {				
					datas.put("USER_ID"    , rs.getString("USER_ID"));					
					datas.put("USER_NM"    , rs.getString("USER_NM"));					
				} else if( StringUtils.equals(sGb, "B")) {
					datas.put("MENU_ID"    , rs.getString("MENU_ID"));					
					datas.put("MENU_NM"    , rs.getString("MENU_NM"));					
					datas.put("MENU_URL"   , rs.getString("MENU_URL"));					
				} else if( StringUtils.equals(sGb, "C")) {		
					datas.put("MENU_ID"    , rs.getString("MENU_ID"));					
					datas.put("MENU_CD"    , rs.getString("MENU_CD"));					
					datas.put("MENU_NM"    , rs.getString("MENU_NM"));					
					datas.put("MENU_URL"   , rs.getString("MENU_URL"));					
					datas.put("MENU_ORDER" , rs.getString("MENU_ORDER"));					
				}
				
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
			logger.debug("getAuthList :" + jsonobj.toString() ); 
			
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