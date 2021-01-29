package com.a1ck.manage;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;


public class GetScheduleColumn extends HttpServlet {
    private static final long serialVersionUID = 1L;
    Connection con;
    ResultSet rs;
    PrintWriter out;
    Statement stmt;

    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
	public Connection connectionDest = null;
	
    public GetScheduleColumn() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings({ "unchecked", "static-access" })
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");  
		
		try{
			String sQuery  = null;  
			int    nCount = 0;
			
			String sJobId  = "";
			String sRows   = "";
			String sPage   = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){ 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            //logger.debug("getScheduleColumn json:" + json); 
	              
	            sJobId    = (String)json.get("__job_id");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");

				//logger.debug("getScheduleColumn sJobId:" + sJobId);
				//logger.debug("getScheduleColumn nRows:" + sRows);
				//logger.debug("getScheduleColumn nPage:" + sPage);
			}
			
			
		    UtilClass  utilClass = new UtilClass();
		    
		    connectionDest = conMgr.getConnection(); 

			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();

	    	sQuery =          "\nSELECT C.JOB_ID, C.COL_ID, C.COL_CD, C.COL_NM, C.COL_TYPE_CD, D.DETAIL_NM AS COL_TYPE_NM, C.COL_LEN, C.COL_SEQ, C.COL_DATE_YN, C.COL_ENC_YN \n";
			sQuery = sQuery + "    FROM TB_SCHEDULE_COL C LEFT OUTER JOIN TB_CODE_DETAIL D ON C.COL_TYPE_CD = D.DETAIL_CD AND D.GROUP_CD ='ATTR_TYPE_CD' \n";
			sQuery = sQuery + "        ,TB_SCHEDULE S \n";
			sQuery = sQuery + "   WHERE S.JOB_ID = C.JOB_ID \n";
			sQuery = sQuery + "     AND C.JOB_ID = " + sJobId + " \n";
			sQuery = sQuery + "   ORDER BY C.COL_SEQ \n";
			
			logger.debug("getScheduleColumn sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("JOB_ID"   		, utilClass.nvl(rs.getString("JOB_ID")));
				datas.put("COL_ID"   		, utilClass.nvl(rs.getString("COL_ID")));
				datas.put("COL_CD"   		, utilClass.nvl(rs.getString("COL_CD")));
				datas.put("COL_NM"   		, utilClass.nvl(rs.getString("COL_NM")));
				datas.put("COL_TYPE_CD"   	, utilClass.nvl(rs.getString("COL_TYPE_CD")));
				datas.put("COL_TYPE_NM"   	, utilClass.nvl(rs.getString("COL_TYPE_NM")));
				datas.put("COL_LEN"   		, utilClass.nvl(rs.getString("COL_LEN")));
				datas.put("COL_SEQ"   		, utilClass.nvl(rs.getString("COL_SEQ")));
				datas.put("COL_DATE_YN"   	, utilClass.nvl(rs.getString("COL_DATE_YN")));
				datas.put("COL_ENC_YN"   	, utilClass.nvl(rs.getString("COL_ENC_YN")));

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
			logger.debug("getScheduleColumn :" + jsonobj.toString() ); 
			
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

    }
 
	
	
}