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

public class GetAnchorDevice extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	public Connection connectionDest = null;
	
    public GetAnchorDevice() {
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
			
			sQuery  = " SELECT ad.machine_id, ad.marina_id, ad.positionx, ad.positiony, ad.gate_class, ad.set_order, al.left_right, al.anchor_id, al.machine_ref_id,a.anchor_nm \n ";
			sQuery += "   FROM tb_anchor_device ad, tb_anchor_lidar al   left outer join tb_anchor a on al.anchor_id = a.anchor_id and al.marina_id = a.marina_id  \n ";
			sQuery += "  WHERE ad.marina_id = al.marina_id \n";
			sQuery += "    AND ad.machine_id = al.machine_id \n";
			sQuery += "    AND ad.marina_id =  " + sMarinaId + " \n";

			if( !StringUtils.equals(sMachineId, "") && !StringUtils.equals(sMachineId, null) )  {
				sQuery += "    AND ad.MACHINE_ID LIKE '%" + sMachineId + "%' \n";
			}			
			sQuery += "  ORDER BY ad.MACHINE_ID,al.left_right \n ";
			
			logger.debug("getBoatDevice sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("MARINA_ID"   	, rs.getString("MARINA_ID"));	
				datas.put("MACHINE_ID" , rs.getString("MACHINE_ID"));	

				if (!StringUtils.isEmpty(rs.getString("LEFT_RIGHT"))) 
					datas.put("LEFT_RIGHT" , rs.getString("LEFT_RIGHT"));	
				else
					datas.put("LEFT_RIGHT" , " " );

				if (!StringUtils.isEmpty(rs.getString("ANCHOR_ID"))) 
					datas.put("ANCHOR_ID" , rs.getString("ANCHOR_ID"));	
				else
					datas.put("ANCHOR_ID" , " " );

				if (!StringUtils.isEmpty(rs.getString("MACHINE_REF_ID"))) 
					datas.put("MACHINE_REF_ID" , rs.getString("MACHINE_REF_ID"));	
				else
					datas.put("MACHINE_REF_ID" , " " );

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