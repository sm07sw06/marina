package com.a1ck.page;


import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;



public class GetChartLinePage extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
	public Connection connectionDest = null;
	
    public GetChartLinePage() {
    	
    	//PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "\\log4j.properties");
	}

   static private int activeSessions;
    
    public static int getActiveSessions() {
         return activeSessions;
     } 
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getChartList ***** Start GetChartList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			
			String sRows  = "";
			String sPage  = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());   	             

	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");	

			}
			
			System.out.println("getChartPage" ); 
			
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " select substr(a.job_tm,1,4) as sYear, b.table_nm as tableName , round(sum(a.source_size)/1024/1024/1024/1024,3) as sSrcSize  ";
			sQuery += " from mddb.tb_job_history a,  ";
			sQuery += " mddb.tb_table_info b    ";
			sQuery += " where a.table_id = b.table_id    ";  
			sQuery += " GROUP BY substr(a.job_tm,1,4) ,tableName    ";
			sQuery += " ORDER BY substr(a.job_tm,1,4) ,tableName		 ";		
			
			logger.debug("getChartList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
	        	
				JSONObject datas = new JSONObject();
				
				datas.put("sYear"       , rs.getString("sYear"));	
				datas.put("sSrcSize"       , rs.getString("sSrcSize"));			
				datas.put("tableName", rs.getString("tableName"));	
				
				seriesArray.add(datas);
				jsonobj.put("rows"  ,seriesArray);   
			
				nCount++;
			}
			
			if (nCount> 0 ) {
				int total = nCount ;
				
				jsonobj.put("records" , nCount  );  
				//jsonobj.put("page"    , Integer.parseInt(sPage)      ); 
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
			//logger.debug("getChartList :" + jsonobj.toString() ); 
			
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
/*
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{
			
			
			//System.out.println("#############");
			logger.debug("getEmpList ***** Start GetEmpList *****"); 
			//System.out.println("#############");
			
			String sQuery  = null;  
			int    nCount = 0;
			
			//String sDvc_id = "";
			//String sDvc_name  = "";
			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
	            JSONObject json = new JSONObject(jsonParam.toString());
	            logger.debug("getEmpList json:" + json); 
	              
	           // sDvc_id = (String)json.get("dvc_id");
	            //sDvc_name  = (String)json.get("dvc_name");
	           // sOrgCd = (String)json.get("orgcd");
	            response.setContentType("application/x-json charset=UTF-8");
			}
			
			//System.out.println("getEmpList sSabun:" + sAdmin_id); 
			String a = "";
			String b = "";
			String c = "";
			String d = "";
			String e = "";
			
		    		
		    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
			
		    
		    
		    
		    
		    
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			//sQuery  = " SELECT dvc_id, dvc_name,  dvc_node_f, dvc_node_s, dvc_node_t, dvc_ip, dvc_serverip,dvc_use_yn, \n ";
			//sQuery += " dvc_mac,dvc_subnet,dvc_gw,dvc_dns1,dvc_dns2, \n" ;
			//sQuery += " dvc_serverport,dvc_net_eth_wifi,dvc_spray_time,mdfy_dttm \n";
			//sQuery += "   FROM ekeeper.tb_dvc_info \n ";
			//sQuery += "          WHERE 1 = 1 \n ";
			sQuery  = "SELECT substr(reg_time,12,2)||'시' as ctime, \n ";
			sQuery += "round(avg(to_number( dvc_temp  ,'9999'))) as dvc_temp_avg,  \n ";
			sQuery += "round(avg(to_number( dvc_humi  ,'9999'))) as dvc_humi_avg, \n ";
			sQuery += "round(avg(to_number( dvc_dust  ,'9999'))) as dvc_dust_avg, \n ";
			sQuery += "round(avg(to_number( dvc_air   ,'9999'))) as dvc_air_avg, \n ";
			sQuery += "round(sum(to_number( dvc_spray ,'9999'))) as dvc_spray_avg    \n ";
			sQuery += "FROM ekeeper.tb_sensor_hist   \n ";
			sQuery += "where to_char(now(),'YYYY-MM-DD') = substr(reg_time,1,10)  \n ";
			sQuery += "group by  substr(reg_time,12,2) order by substr(reg_time,12,2)  \n ";

			System.out.println("#### get user list " + sQuery);
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 결과의 성공여부를 확인
	        
	        //String ctime ="", dvc_temp ="",dvc_humi ="",dvc_dust="",dvc_air="",dvc_spray="";
	        while(rs.next()){
	        	JSONObject datas = new JSONObject();
	        	
	        	datas.put("idx"       , nCount + 1);	        	
	        	if (!StringUtils.isEmpty(rs.getString("ctime"))) datas.put("ctime"  , rs.getString("ctime"));	else datas.put("ctime"  , " " );		
				if (!StringUtils.isEmpty(rs.getString("dvc_temp_avg"))) datas.put("dvc_temp_avg"  , rs.getString("dvc_temp_avg"));	else datas.put("dvc_temp_avg"  , "0" );		
				if (!StringUtils.isEmpty(rs.getString("dvc_humi_avg"))) datas.put("dvc_humi_avg"  , rs.getString("dvc_humi_avg"));	else datas.put("dvc_humi_avg"  , "0" );		
				if (!StringUtils.isEmpty(rs.getString("dvc_dust_avg"))) datas.put("dvc_dust_avg"  , rs.getString("dvc_dust_avg"));	else datas.put("dvc_dust_avg"  , "0" );		
				if (!StringUtils.isEmpty(rs.getString("dvc_air_avg"))) datas.put("dvc_air_avg"  , rs.getString("dvc_air_avg"));	else datas.put("dvc_air_avg"  , "0" );		
				if (!StringUtils.isEmpty(rs.getString("dvc_spray_avg"))) datas.put("dvc_spray_avg"  , rs.getString("dvc_spray_avg"));	else datas.put("dvc_spray_avg"  , "0" );		
				       	
	 	      	seriesArray.put(datas);
				jsonobj.put("data"  ,seriesArray);  			
				nCount++;	
			}
	        
	        for(int i=nCount ; nCount < 24;++i)
	        {
	        	JSONObject datas = new JSONObject();	        	
	        	datas.put("idx"       , nCount + 1);	
	        	
	        	String ct = String.format("%02d", nCount);
	        	datas.put("ctime" ,ct);
	        	datas.put("dvc_temp_avg"  , "0" );	
	        	datas.put("dvc_humi_avg"  , "0" );	
	        	datas.put("dvc_dust_avg"  , "0" );	
	        	datas.put("dvc_air_avg"  , "0" );	
	        	datas.put("dvc_spray_avg"  , "0" );
	        	seriesArray.put(datas);
				jsonobj.put("data"  ,seriesArray);  
				nCount++;
	        }
	        
	        
	        if (nCount> 0 ) {
				jsonobj.put("result" , "OK"      );  // 결과의 성공여부를 확인
				jsonobj.put("count"  , nCount    );  // 결과의 성공여부를 확인
			} else {  
				jsonobj.put("result" , "NOTFOUND");  // 결과의 성공여부를 확인
				jsonobj.put("count"  , 0         );  // 결과의 성공여부를 확인
			}
	       
	        
			//logger.debug(jsonobj.toString());

			//응답을 하기 위한 준비 작업
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			//logger.debug("getEmpList :" + jsonobj.toString() ); 
			
			stmt.close();
			connectionDest.close();

		} catch(Exception e){
			e.printStackTrace();
		} finally {
			try{
				if(stmt != null)
					stmt.close();
				if(con != null)
					con.close();
			}catch(Exception e){
				e.printStackTrace();
			}
		}
*/
    }
 
}