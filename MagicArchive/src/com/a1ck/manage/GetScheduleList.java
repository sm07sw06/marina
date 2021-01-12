package com.a1ck.manage;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;

public class GetScheduleList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;

    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
	public Connection connectionDest = null;
	
    public GetScheduleList() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings({ "unchecked", "static-access" })
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		
		try{
			
			logger.debug("getScheduleList ***** Start GetScheduleList *****" + request.getRequestURI()); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sJobId  = "";
			String sJobNm  = "";
			String sRows   = "";
			String sPage   = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){ 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getScheduleList json:" + json); 
	              
	            sJobId    = (String)json.get("__job_id");
	            sJobNm    = (String)json.get("__job_nm");
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");

				logger.debug("getScheduleList sJobId:" + sJobId);
				logger.debug("getScheduleList sJobNm:" + sJobNm);
				logger.debug("getScheduleList nRows:" + sRows);
				logger.debug("getScheduleList nPage:" + sPage);
			}
			
		    UtilClass  utilClass = new UtilClass();
		    connectionDest = conMgr.getConnection(); 

			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();

	    	sQuery =          "\nSELECT S.JOB_ID, S.JOB_CD, S.JOB_NM, S.DEST_SERVER, S.JOB_SCHEDULE, S.JOB_SCHEDULE  as JOB_SCHEDULE_ORG, S.SRC_IP, S.SRC_PORT, S.SRC_DBMS_CD, S.SRC_DB, S.SRC_USER, S.SRC_PASSWD \n";
			sQuery = sQuery + "        ,S.SRC_SQL, S.DEST_IP, S.DEST_PORT, S.DEST_DBMS_CD, S.DEST_DB, S.DEST_USER, S.DEST_PASSWD, S.JOB_METHOD_CD, S.DEST_TABLE, S.DESCRIPTION \n";
			sQuery = sQuery + "        ,S.JOB_CLASS, S.JOB_TYPE_CD, S.JOB_PATH, S.SAVE_PREQ_CD, S.SAVE_PREQ, S.USE_YN, S.SELECT_YN, C1.DETAIL_NM AS JOB_METHOD_NM \n";
			sQuery = sQuery + "        ,C2.DETAIL_NM AS JOB_TYPE_NM, C3.DETAIL_NM AS SRC_DBMS_NM, C4.DETAIL_NM AS DEST_DBMS_NM, C5.DETAIL_NM||' ('||S.SAVE_PREQ ||')'  SAVE_PREQ_NM \n";
			sQuery = sQuery + "    FROM MDDB.TB_SCHEDULE S LEFT OUTER JOIN MDDB.TB_CODE_DETAIL C1 ON S.JOB_METHOD_CD = C1.DETAIL_CD AND C1.GROUP_CD ='JOB_METHOD_CD' \n";
			sQuery = sQuery + "                    LEFT OUTER JOIN MDDB.TB_CODE_DETAIL C2 ON S.JOB_TYPE_CD   = C2.DETAIL_CD AND C2.GROUP_CD ='JOB_TYPE_CD'   \n";
			sQuery = sQuery + "                    LEFT OUTER JOIN MDDB.TB_CODE_DETAIL C3 ON S.SRC_DBMS_CD   = C3.DETAIL_CD AND C3.GROUP_CD ='DBMS_CD'       \n";
			sQuery = sQuery + "                    LEFT OUTER JOIN MDDB.TB_CODE_DETAIL C4 ON S.DEST_DBMS_CD  = C4.DETAIL_CD AND C4.GROUP_CD ='DBMS_CD'  		\n";
			sQuery = sQuery + "                    LEFT OUTER JOIN MDDB.TB_CODE_DETAIL C5 ON S.SAVE_PREQ_CD  = C5.DETAIL_CD AND C5.GROUP_CD ='SAVE_PREQ_CD'  \n";
			sQuery = sQuery + "   WHERE 1 = 1 \n";
//			sQuery = sQuery + "     AND USE_YN ='Y' \n";
			
			if( !StringUtils.equals(sJobId, "*")) {
				sQuery += "    AND S.JOB_ID = " + sJobId + " \n";
			} else if( !StringUtils.equals(sJobNm, "") || !StringUtils.equals(sJobNm, null)) {
				sQuery += "    AND S.JOB_NM like '%" + sJobNm + "%' \n";
			}

			sQuery = sQuery + "   ORDER BY S.JOB_NM \n";
			
			logger.debug("getScheduleList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("JOB_ID"   		, utilClass.nvl(rs.getString("JOB_ID")));
				datas.put("JOB_CD"   		, utilClass.nvl(rs.getString("JOB_CD")));
				datas.put("JOB_NM"   		, utilClass.nvl(rs.getString("JOB_NM")));
				datas.put("DEST_SERVER"    	, utilClass.nvl(rs.getString("DEST_SERVER")));
				datas.put("JOB_SCHEDULE"   	, utilClass.nvl(rs.getString("JOB_SCHEDULE")));
				datas.put("JOB_SCHEDULE_ORG", utilClass.nvl(rs.getString("JOB_SCHEDULE_ORG")));
				datas.put("SRC_IP"   		, utilClass.nvl(rs.getString("SRC_IP")));
				datas.put("SRC_PORT"   		, utilClass.nvl(rs.getString("SRC_PORT")));
				datas.put("SRC_DBMS_CD"   	, utilClass.nvl(rs.getString("SRC_DBMS_CD")));
				datas.put("SRC_DB"   		, utilClass.nvl(rs.getString("SRC_DB")));
				datas.put("SRC_USER"   		, utilClass.nvl(rs.getString("SRC_USER")));
				datas.put("SRC_PASSWD"   	, utilClass.nvl(rs.getString("SRC_PASSWD")));
				datas.put("SRC_SQL"   		, utilClass.nvl(rs.getString("SRC_SQL")));
				datas.put("DEST_IP"   		, utilClass.nvl(rs.getString("DEST_IP")));
				datas.put("DEST_PORT"   	, utilClass.nvl(rs.getString("DEST_PORT")));
				datas.put("DEST_DBMS_CD"   	, utilClass.nvl(rs.getString("DEST_DBMS_CD")));
				datas.put("DEST_DB"   		, utilClass.nvl(rs.getString("DEST_DB")));
				datas.put("DEST_USER"   	, utilClass.nvl(rs.getString("DEST_USER")));
				datas.put("DEST_PASSWD"   	, utilClass.nvl(rs.getString("DEST_PASSWD")));
				datas.put("JOB_METHOD_CD"  	, utilClass.nvl(rs.getString("JOB_METHOD_CD")));
				datas.put("DEST_TABLE"   	, utilClass.nvl(rs.getString("DEST_TABLE")));
				datas.put("JOB_CLASS"   	, utilClass.nvl(rs.getString("JOB_CLASS")));
				datas.put("JOB_TYPE_CD"   	, utilClass.nvl(rs.getString("JOB_TYPE_CD")));
				datas.put("JOB_PATH"   		, utilClass.nvl(rs.getString("JOB_PATH")));
				datas.put("SAVE_PREQ_CD"   	, utilClass.nvl(rs.getString("SAVE_PREQ_CD")));
				datas.put("SAVE_PREQ"   	, utilClass.nvl(rs.getString("SAVE_PREQ")));
				datas.put("USE_YN"   		, utilClass.nvl(rs.getString("USE_YN")));
				datas.put("SELECT_YN"  		, utilClass.nvl(rs.getString("SELECT_YN")));
				datas.put("SRC_DBMS_NM"   	, utilClass.nvl(rs.getString("SRC_DBMS_NM")));
				datas.put("DEST_DBMS_NM"   	, utilClass.nvl(rs.getString("DEST_DBMS_NM")));
				datas.put("JOB_METHOD_NM"  	, utilClass.nvl(rs.getString("JOB_METHOD_NM")));
				datas.put("JOB_TYPE_NM"   	, utilClass.nvl(rs.getString("JOB_TYPE_NM")));
				datas.put("SAVE_PREQ_NM"   	, utilClass.nvl(rs.getString("SAVE_PREQ_NM")));
				datas.put("DESCRIPTION"   	, utilClass.nvl(rs.getString("DESCRIPTION")));

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
			//logger.debug("getScheduleList :" + jsonobj.toString() ); 
			
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