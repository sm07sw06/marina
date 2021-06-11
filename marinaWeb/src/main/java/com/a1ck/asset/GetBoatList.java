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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.CodeClass;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;

public class GetBoatList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	public Connection connectionDest = null;
	
    public GetBoatList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	
	@SuppressWarnings("unchecked") 
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
		
		try{

			logger.debug("getBoatList ***** Start GetBoatList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sBoatId = "";
			String sBoatNm = "";
			String sRows   = "";
			String sPage   = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getBoatList jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getBoatList DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getBoatList json:" + json); 

	            sBoatId = (String)json.get("__boat_id");
	            sBoatNm = (String)json.get("__boat_nm");
	            sRows   = (String)json.get("__rows");
	            sPage   = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getBoatList sBoatId:" + sBoatId);
				logger.debug("getBoatList sBoatNm:" + sBoatNm);
				logger.debug("getBoatList nRows:" + sRows);
				logger.debug("getBoatList nPage:" + sPage);
			} 
			
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT A.MARINA_ID, A.BOAT_ID, A.BOAT_NM, A.USER_ID, B.USER_NM, A.BOAT_STATUS,C.DETAIL_NM,A.BOAT_DESC  \n ";
			sQuery += "   FROM TB_BOAT A LEFT OUTER JOIN TB_USER_INFO B ON A.USER_ID = B.USER_ID  \n ";
			sQuery += "                  LEFT OUTER JOIN TB_CODE_DETAIL C on A.BOAT_STATUS = C.DETAIL_CD AND C.GROUP_CD = 'BOAT_STATUS' \n ";
			sQuery += "  WHERE 1 = 1 \n ";

			if( !StringUtils.equals(sBoatId.trim(), "") && !StringUtils.equals(sBoatId.trim(), null) )  {
				sQuery += "    AND A.BOAT_ID = '" + sBoatId + "' \n";
			} else if( !StringUtils.equals(sBoatNm, "") && !StringUtils.equals(sBoatNm, null) ) {
					sQuery += "    AND A.BOAT_NM like '%" + sBoatNm + "%' \n";
			}			
			sQuery += "  ORDER BY A.BOAT_NM \n ";
			
			logger.debug("getBoatList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("BOAT_ID"   	, rs.getString("BOAT_ID"));	
				datas.put("MARINA_ID"   	, rs.getString("MARINA_ID"));	
				datas.put("BOAT_NM"   	, rs.getString("BOAT_NM"));	
				datas.put("USER_ID"   	, rs.getString("USER_ID"));	 
				datas.put("USER_NM"   	, rs.getString("USER_NM"));	

				if (!StringUtils.isEmpty(rs.getString("BOAT_STATUS"))) 
					datas.put("BOAT_STATUS" , rs.getString("BOAT_STATUS"));	
				else
					datas.put("BOAT_STATUS" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("DETAIL_NM"))) 
					datas.put("DETAIL_NM" , rs.getString("DETAIL_NM"));	
				else
					datas.put("DETAIL_NM" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("BOAT_DESC"))) 
					datas.put("BOAT_DESC" , rs.getString("BOAT_DESC"));	
				else
					datas.put("BOAT_DESC" , " " );
				
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
			logger.debug("getBoatList :" + jsonobj.toString() ); 
			
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