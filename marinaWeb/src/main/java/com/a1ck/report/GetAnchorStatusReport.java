package com.a1ck.report;

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

public class GetAnchorStatusReport extends HttpServlet { 
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	public Connection connectionDest = null;
	
    public GetAnchorStatusReport() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	
	@SuppressWarnings("unchecked") 
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
		
		try{

			logger.debug(" ***** Start getAnchorStatusReport *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sMarinaId = "";
			String sStartDT  = "";
			String sEndDT    = "";
			String sRows     = "";
			String sPage     = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getAnchorStatusReport jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getAnchorStatusReport DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getAnchorStatusReport json:" + json); 

	            sMarinaId = (String)json.get("__marina_id");
	            sStartDT  = (String)json.get("__from");
	            sEndDT    = (String)json.get("__to");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getAnchorStatusReport sStartDT:" + sStartDT);
				logger.debug("getAnchorStatusReport sEndDT:" + sEndDT);
			} 
			
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT A.MARINA_ID, A.ANCHOR_ID, C.ANCHOR_NM, A.BOAT_ID, B.BOAT_NM, A.ENTER_DT, A.LEAVE_DT \n ";
			sQuery += "   FROM TB_ANCHOR_HIST A, TB_BOAT B, TB_ANCHOR C  \n ";
			sQuery += "  WHERE 1 = 1  \n ";
			sQuery += "    AND A.MARINA_ID = " + sMarinaId + " \n ";
			sQuery += "    AND A.MARINA_ID = B.MARINA_ID  \n ";
			sQuery += "    AND A.BOAT_ID   = B.BOAT_ID  \n ";
			sQuery += "    AND A.MARINA_ID = C.MARINA_ID  \n ";
			sQuery += "    AND A.ANCHOR_ID = C.ANCHOR_ID  \n ";
			sQuery += "    AND ( A.ENTER_DT BETWEEN '" + sStartDT + "010101' AND '"  + sEndDT + "235959' OR  \n ";
			sQuery += "          A.LEAVE_DT BETWEEN '" + sStartDT + "010101' AND '"  + sEndDT + "235959' )	 \n ";
			sQuery += "  ORDER BY A.ENTER_DT, A.LEAVE_DT \n ";
			
			logger.debug("getAnchorStatusReport sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				sQuery  = " S A.ENTER_DT, A.LEAVE_DT \n ";

				
				datas.put("MARINA_ID"   , rs.getString("MARINA_ID"));	
				datas.put("ANCHOR_ID"   , rs.getString("ANCHOR_ID"));	
				datas.put("ANCHOR_NM"   , rs.getString("ANCHOR_NM"));	
				datas.put("BOAT_ID"   	, rs.getString("BOAT_ID"));	
				datas.put("BOAT_NM"   	, rs.getString("BOAT_NM"));	

				if (!StringUtils.isEmpty(rs.getString("ENTER_DT"))) 
					datas.put("ENTER_DT" , rs.getString("ENTER_DT"));	
				else
					datas.put("ENTER_DT" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("LEAVE_DT"))) 
					datas.put("LEAVE_DT" , rs.getString("LEAVE_DT"));	
				else
					datas.put("LEAVE_DT" , " " ); 
				
				
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
			logger.debug("getAnchorStatusReport :" + jsonobj.toString() ); 
			
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