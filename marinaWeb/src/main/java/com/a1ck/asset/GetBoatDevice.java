package com.a1ck.asset;

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

public class GetBoatDevice extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	public Connection connectionDest = null;
	
    public GetBoatDevice() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	
	@SuppressWarnings("unchecked") 
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
		
		try{

			logger.debug("getBoatDevice ***** Start GetBoatDevice *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sMarinaId  = "";
			String sMachineId = "";
			String sRows      = "";
			String sPage      = "";

				
  			String Obj = request.getParameter("param");
			
			logger.debug("getBoatDevice jsonParam:" + Obj);
			
			if(Obj != null){
				
				logger.debug("getBoatDevice DEBUG"); 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(Obj.toString());

	            logger.debug("getBoatDevice json:" + json); 

	            sMarinaId   = (String)json.get("__marina_id");
	            sMachineId 	= (String)json.get("__machine_id");
	            sRows       = (String)json.get("__rows");
	            sPage       = (String)json.get("__page");
	            
	            
	            response.setContentType("application/x-json charset=UTF-8");
				logger.debug("getBoatDevice sMarinaId:" + sMarinaId);
				logger.debug("getBoatDevice sMachineId:" + sMachineId);
				logger.debug("getBoatDevice nRows:" + sRows);
				logger.debug("getBoatDevice nPage:" + sPage);
			} 
			
			connectionDest = conMgr.getConnection();
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT B.MARINA_ID, a.BOAT_ID, a.BOAT_NM, b.MACHINE_ID \n ";
			sQuery += "   FROM tb_boat_device b  left outer join tb_boat a on b.marina_id = a.marina_id AND b.boat_id = a.boat_id \n ";
			sQuery += "  WHERE b.marina_id =  " + sMarinaId + " \n";

			if( !StringUtils.equals(sMachineId, "") && !StringUtils.equals(sMachineId, null) )  {
				sQuery += "    AND b.MACHINE_ID = '" + sMachineId + "' \n";
			}			
			sQuery += "  ORDER BY b.MACHINE_ID \n ";
			
			logger.debug("getBoatDevice sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("MARINA_ID"   	, rs.getString("MARINA_ID"));	
				datas.put("MACHINE_ID"   	, rs.getString("MACHINE_ID"));	

				if (!StringUtils.isEmpty(rs.getString("BOAT_ID"))) 
					datas.put("BOAT_ID" , rs.getString("BOAT_ID"));	
				else
					datas.put("BOAT_ID" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("BOAT_NM"))) 
					datas.put("BOAT_NM" , rs.getString("BOAT_NM"));	
				else
					datas.put("BOAT_NM" , " " );
				
				seriesArray.add(datas);
				jsonobj.put("rows"  ,seriesArray);   
			
				nCount++;
			}
			
			if (nCount> 0 ) {
				int total = nCount / Integer.parseInt(sRows);
				
				jsonobj.put("records" , nCount  );  
				jsonobj.put("page"    , Integer.parseInt(sPage)); 
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
			logger.debug("getBoatDevice :" + jsonobj.toString() ); 
			
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