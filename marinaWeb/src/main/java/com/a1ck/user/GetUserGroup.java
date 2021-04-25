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

public class GetUserGroup extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	
	public Connection connectionDest = null;
	
    public GetUserGroup() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getUserGroupList ***** Start GetUserGroupList *****"); 

			ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sGb       = "";
			String sUserGroupId  = "";
			String sUserGroupNm  = "";
			String sRows  = "";
			String sPage  = "";
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getUserGroupList json:" + json); 
	              
	            sGb      = (String)json.get("__gb");
	            sUserGroupId = (String)json.get("__userGroup_id");
	            sUserGroupNm = (String)json.get("__userGroup_nm");
	            sRows    = (String)json.get("__rows");
	            sPage    = (String)json.get("__page");
	            
				logger.debug("getUserGroupList sGb:" + sGb);
				logger.debug("getUserGroupList sUserGroupId:" + sUserGroupId);
				logger.debug("getUserGroupList sUserGroupNm:" + sUserGroupNm);
				logger.debug("getUserGroupList nRows:" + sRows);
				logger.debug("getUserGroupList nPage:" + sPage);

				response.setContentType("application/x-json charset=UTF-8");
			}
			
			connectionDest = conMgr.getConnection(); 

			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			if( StringUtils.equals(sGb, "A") ) {
				
				sQuery  = " SELECT EMP_GRP_ID as USER_GRP_ID, EMP_GRP_NM AS USER_GRP_NM, DESCRIPTION, '' AS USER_ID, '' AS USER_NM , USE_YN \n ";
				sQuery += "   FROM TB_EMP_GROUP\n ";
				sQuery += "  WHERE 1 = 1    \n ";
				
				if( !StringUtils.equals(sUserGroupId, "*") ) {
					sQuery += "    AND EMP_GRP_ID = '" + sUserGroupId + "' \n";
				}
				
				if( !StringUtils.equals(sUserGroupNm, "*") && !StringUtils.equals(sUserGroupNm, "")) {
					sQuery += "    AND EMP_GRP_NM LIKE '%" + sUserGroupNm + "%' \n";
				}
				
				sQuery += "  ORDER BY EMP_GRP_NM \n ";
			} else if( StringUtils.equals(sGb, "B") ) {
					
					sQuery  = " SELECT I.USER_ID, I.USER_NM,'' AS USER_GRP_ID,'' AS USER_GRP_NM,'' AS DESCRIPTION, '' as USE_YN  \n ";
					sQuery += "   FROM TB_USER_INFO I       \n ";
					sQuery += "  WHERE I.USE_YN != 'D'  \n ";
					sQuery += "    AND NOT EXISTS (SELECT 1 FROM TB_EMP_MEMBER M WHERE I.USER_ID = M.EMP_ID AND M.EMP_GRP_ID = " + sUserGroupId + " )   \n ";
					sQuery += "  ORDER BY I.USER_NM \n ";
			} else if( StringUtils.equals(sGb, "C") ) {
				
				sQuery  = " SELECT I.USER_ID, I.USER_NM,'' AS USER_GRP_ID,'' AS USER_GRP_NM,'' AS DESCRIPTION , '' as USE_YN\n ";
				sQuery += "   FROM TB_USER_INFO I, TB_EMP_MEMBER M     \n ";
				sQuery += "  WHERE I.USE_YN != 'D'  \n ";
				sQuery += "    AND I.USER_ID = M.EMP_ID AND M.EMP_GRP_ID = " + sUserGroupId + "    \n ";
				sQuery += "  ORDER BY I.USER_NM \n ";
			}
			logger.debug("getUserGroupList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				if (!StringUtils.isEmpty(rs.getString("USER_ID"))) 
					datas.put("USER_ID" , rs.getString("USER_ID"));	
				else
					datas.put("USER_ID" , " " );						

				if (!StringUtils.isEmpty(rs.getString("USER_NM"))) 
					datas.put("USER_NM" , rs.getString("USER_NM"));	
				else
					datas.put("USER_NM" , " " );	
				
				if (!StringUtils.isEmpty(rs.getString("USER_GRP_ID"))) 
					datas.put("USER_GRP_ID" , rs.getString("USER_GRP_ID"));	
				else
					datas.put("USER_GRP_ID" , " " );						

				if (!StringUtils.isEmpty(rs.getString("USER_GRP_NM"))) 
					datas.put("USER_GRP_NM" , rs.getString("USER_GRP_NM"));	
				else
					datas.put("USER_GRP_NM" , " " );						

				if (!StringUtils.isEmpty(rs.getString("DESCRIPTION"))) 
					datas.put("DESCRIPTION" , rs.getString("DESCRIPTION"));	
				else
					datas.put("DESCRIPTION" , " " );						

				if (!StringUtils.isEmpty(rs.getString("USE_YN"))) 
					datas.put("USE_YN" , rs.getString("USE_YN"));	
				else
					datas.put("USE_YN" , " " );						
				
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
				
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("getUserGroupList :" + jsonobj.toString() ); 
			
			stmt.close();
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