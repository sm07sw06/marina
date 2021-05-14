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

public class GetUserStatusReport extends HttpServlet { 
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	public Connection connectionDest = null;
	
    public GetUserStatusReport() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	
	@SuppressWarnings("unchecked") 
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
		
		try{

			logger.debug("***** Start GetUserStatusReport *****"); 
			
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
			
			logger.debug("getUserStatusReport jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getUserStatusReport DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getUserStatusReport json:" + json); 

	            sMarinaId = (String)json.get("__marina_id");
	            sBoatId   = (String)json.get("__boat_id");
	            sBoatNm   = (String)json.get("__boat_nm");
	            sStartDT  = (String)json.get("__from");
	            sEndDT    = (String)json.get("__to");
	            sRows   = (String)json.get("__rows");
	            sPage   = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getUserStatusReport sMarinaId:" + sMarinaId);
				logger.debug("getUserStatusReport sBoatId:" + sBoatId);
				logger.debug("getUserStatusReport sBoatNm:" + sBoatNm);
				logger.debug("getUserStatusReport sStartDT:" + sStartDT);
				logger.debug("getUserStatusReport sEndDT:" + sEndDT);
			} 
			
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT a.marina_id, a.send_time, a.boatinout, c.detail_nm as boatinout_nm, a.anchor_id,b.anchor_nm \n ";
			sQuery += "   FROM tb_unreg_boatdata a, tb_anchor b, tb_code_detail c  \n ";
			sQuery += "  WHERE 1 = 1  \n ";
			sQuery += "    AND a.anchor_id = b.anchor_id \n ";
			sQuery += "    AND a.boatinout = c.detail_cd  \n ";
			sQuery += "    AND C.GROUP_CD  = 'BOATINOUT' \n ";
			sQuery += "    AND A.MARINA_ID = " + sMarinaId + " \n ";
			sQuery += "    AND A.SEND_TIME BETWEEN  '" + sStartDT + "010101' AND '"  + sEndDT + "235959' \n ";
			
			sQuery += "  ORDER BY a.send_time LIMIT 300\n ";
			
			logger.debug("getUserStatusReport sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("MARINA_ID"    , rs.getString("MARINA_ID"));	
				datas.put("SEND_TIME"    , rs.getString("SEND_TIME"));	

				if (!StringUtils.isEmpty(rs.getString("ANCHOR_NM"))) 
					datas.put("ANCHOR_NM" , rs.getString("ANCHOR_NM"));	
				else
					datas.put("ANCHOR_NM" , " " );
				
				
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
			logger.debug("getUserStatusReport :" + jsonobj.toString() ); 
			
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