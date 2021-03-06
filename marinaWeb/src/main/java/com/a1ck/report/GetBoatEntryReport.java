package com.a1ck.report;

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

public class GetBoatEntryReport extends HttpServlet { 
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	public Connection connectionDest = null;
	
    public GetBoatEntryReport() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	
	@SuppressWarnings("unchecked") 
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
		
		try{

			logger.debug("getBoatEntryReport ***** Start GetAnchorList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sMarinaId = "";
			String sBoatId   = "";
			String sBoatNm   = "";
			String sStartDT  = "";
			String sEndDT    = "";
			String sRows     = "";
			String sPage     = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getBoatEntryReport jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getBoatEntryReport DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getBoatEntryReport json:" + json); 

	            sMarinaId = (String)json.get("__marina_id");
	            sBoatId   = (String)json.get("__boat_id");
	            sBoatNm   = (String)json.get("__boat_nm");
	            sStartDT  = (String)json.get("__from");
	            sEndDT    = (String)json.get("__to");
	            sRows   = (String)json.get("__rows");
	            sPage   = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getBoatEntryReport sMarinaId:" + sMarinaId);
				logger.debug("getBoatEntryReport sBoatId:" + sBoatId);
				logger.debug("getBoatEntryReport sBoatNm:" + sBoatNm);
				logger.debug("getBoatEntryReport sStartDT:" + sStartDT);
				logger.debug("getBoatEntryReport sEndDT:" + sEndDT);
			} 
			
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT A.MARINA_ID, A.BOAT_ID, B.BOAT_NM, A.SEND_TIME, A.BOATINOUT,C.DETAIL_NM AS BOATINOUT_NM \n ";
			sQuery += "   FROM TB_BOAT_HIST A, TB_BOAT B, TB_CODE_DETAIL C  \n ";
			sQuery += "  WHERE 1 = 1  \n ";
			sQuery += "    AND A.MARINA_ID = B.MARINA_ID \n ";
			sQuery += "    AND A.BOAT_ID   = B.BOAT_ID  \n ";
			sQuery += "    AND C.GROUP_CD  = 'BOATINOUT' \n ";
			sQuery += "    AND A.BOATINOUT = C.DETAIL_CD \n ";
			sQuery += "    AND A.MARINA_ID = " + sMarinaId + " \n ";
			sQuery += "    AND A.SEND_TIME BETWEEN  '" + sStartDT + "010101' AND '"  + sEndDT + "235959' \n ";
			
			if( !StringUtils.equals(sBoatId, "") && !StringUtils.equals(sBoatId, null) )  {
				sQuery += "    AND b.boat_id = %" + sBoatId + "% \n";
			}
			if( !StringUtils.equals(sBoatNm, "") && !StringUtils.equals(sBoatNm, null) )  {
				sQuery += "    AND b.boat_nm LIKE '%" + sBoatNm + "%' \n";
			}
			sQuery += "  ORDER BY a.send_time LIMIT 300\n ";
			
			logger.debug("getBoatEntryReport sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("MARINA_ID"    , rs.getString("MARINA_ID"));	
				datas.put("BOAT_ID"   	 , rs.getString("BOAT_ID"));	
				datas.put("BOAT_NM"   	 , rs.getString("BOAT_NM"));	
				datas.put("SEND_TIME"    , rs.getString("SEND_TIME"));	
				datas.put("BOATINOUT_NM" , rs.getString("BOATINOUT_NM"));	

				if (!StringUtils.isEmpty(rs.getString("BOATINOUT_NM"))) 
					datas.put("BOATINOUT_NM" , rs.getString("BOATINOUT_NM"));	
				else
					datas.put("BOATINOUT_NM" , " " );
				
				
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
			logger.debug("getBoatEntryReport :" + jsonobj.toString() ); 
			
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