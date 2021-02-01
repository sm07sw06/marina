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
import org.apache.log4j.Logger;
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
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
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
			String sRows     = "";
			String sPage     = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getBoatList jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getBoatList DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getBoatList json:" + json); 

	            sBoatId = (String)json.get("__sector_id");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getBoatList sBoatId:" + sBoatId);
				logger.debug("getBoatList nRows:" + sRows);
				logger.debug("getBoatList nPage:" + sPage);
			} 
			
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT A.BOAT_ID, A.BOAT_NM, A.USER_ID, B.USER_NM, A.BOAT_STATUS,C.DETAIL_NM \n ";
			sQuery += "   FROM BOAT A,TB_USER_INFO B,TB_CODE_DETAIL C \n ";
			sQuery += "  WHERE A.USER_ID     = B.USER_ID \n ";
			sQuery += "    AND A.BOAT_STATUS = C.DETAIL_CD  \n ";
			sQuery += "    AND C.GROUP_CD    = 'BOAT_STATUS';  \n ";
			/*
			if( !StringUtils.equals(sBoatId, "*")) {
				sQuery += "    AND S.SECTOR_ID = " + sBoatId + " \n";
			}
			*/
			sQuery += "  ORDER BY S.SECTOR_NM \n ";
			
			logger.debug("getBoatList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("SECTOR_ID"   	, rs.getString("SECTOR_ID"));	
				datas.put("SECTOR_NM"   	, rs.getString("SECTOR_NM"));	
				datas.put("SECTOR_DESC"   	, rs.getString("SECTOR_DESC"));	

				if (!StringUtils.isEmpty(rs.getString("GPSX1"))) 
					datas.put("GPSX1" , rs.getString("GPSX1"));	
				else
					datas.put("GPSX1" , "0" );
				
				if (!StringUtils.isEmpty(rs.getString("GPSX2"))) 
					datas.put("GPSX2" , rs.getString("GPSX2"));	
				else
					datas.put("GPSX2" , "0" );
				
				if (!StringUtils.isEmpty(rs.getString("GPSY1"))) 
					datas.put("GPSY1" , rs.getString("GPSY1"));	
				else
					datas.put("GPSY1" , "0" );
				
				if (!StringUtils.isEmpty(rs.getString("GPSY2"))) 
					datas.put("GPSY2" , rs.getString("GPSY2"));	
				else
					datas.put("GPSY2" , "0" );
				
				
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