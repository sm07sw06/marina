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

public class GetAnchorList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	public Connection connectionDest = null;
	
    public GetAnchorList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	
	@SuppressWarnings("unchecked") 
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
		
		try{

			logger.debug("getAnchorList ***** Start GetAnchorList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sAnchorId = "";
			String sAnchorNm = "";
			String sRows     = "";
			String sPage     = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getAnchorList jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getAnchorList DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getAnchorList json:" + json); 

	            sAnchorId = (String)json.get("__anchor_id");
	            sAnchorNm = (String)json.get("__anchor_Nm");
	            sRows   = (String)json.get("__rows");
	            sPage   = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getAnchorList sAnchorId:" + sAnchorId);
				logger.debug("getAnchorList sAnchorNm:" + sAnchorNm);
			} 
			
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT A.ANCHOR_ID, A.ANCHOR_NM, B.SECTOR_ID, B.SECTOR_NM, C.BOAT_ID, C.BOAT_NM, A.ANCHOR_STATUS, D.DETAIL_NM AS ANCHOR_STATUS_NM \n ";
			sQuery += "   FROM TB_ANCHOR A LEFT OUTER JOIN TB_ANCHOR_SECTOR B ON A.SECTOR_ID = B.SECTOR_ID \n ";
			sQuery += "                    LEFT OUTER JOIN TB_BOAT C ON A.BOAT_ID = C.BOAT_ID, \n ";
			sQuery += "        TB_CODE_DETAIL D \n ";
			sQuery += "  WHERE A.ANCHOR_STATUS = D.DETAIL_CD  \n ";
			sQuery += "    AND D.GROUP_CD = 'ANCHOR_STATUS'  \n ";
			
			if( !StringUtils.equals(sAnchorId, "") && !StringUtils.equals(sAnchorId, null) )  {
				sQuery += "    AND A.ANCHOR_ID = '" + sAnchorId + "' \n";
			} else if( !StringUtils.equals(sAnchorNm, "") && !StringUtils.equals(sAnchorNm, null) ) {
					sQuery += "    AND A.ANCHOR_NM like '%" + sAnchorNm + "%' \n";
			}		
			
			sQuery += "  ORDER BY A.ANCHOR_NM \n ";
			
			logger.debug("getAnchorList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("ANCHOR_ID"   	, rs.getString("ANCHOR_ID"));	
				datas.put("ANCHOR_NM"   	, rs.getString("ANCHOR_NM"));	
				datas.put("SECTOR_ID"   	, rs.getString("SECTOR_ID"));	
				datas.put("SECTOR_NM"   	, rs.getString("SECTOR_NM"));	

				if (!StringUtils.isEmpty(rs.getString("BOAT_ID"))) 
					datas.put("BOAT_ID" , rs.getString("BOAT_ID"));	
				else
					datas.put("BOAT_ID" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("BOAT_NM"))) 
					datas.put("BOAT_NM" , rs.getString("BOAT_NM"));	
				else
					datas.put("BOAT_NM" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("ANCHOR_STATUS_NM"))) 
					datas.put("ANCHOR_STATUS" , rs.getString("ANCHOR_STATUS"));	
				else
					datas.put("ANCHOR_STATUS" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("ANCHOR_STATUS_NM"))) 
					datas.put("ANCHOR_STATUS_NM" , rs.getString("ANCHOR_STATUS_NM"));	
				else
					datas.put("ANCHOR_STATUS_NM" , " " );
				
				
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
			logger.debug("getAnchorList :" + jsonobj.toString() ); 
			
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