package com.a1ck.comm;

import java.io.IOException;
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


public class GetCodeManager extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;

    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
	public Connection connectionDest = null;
	
    public GetCodeManager() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings({ "unchecked", "static-access" })
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{
			
			logger.debug("getCodeManager ***** Start GetCodeManager *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sGroupCd  = "";
			String sGroupNm  = "";
			String sUseYn    = "";
			String sCrud     = "";
			String sRows     = "";
			String sPage     = "";			
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){ 
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getCodeManager json:" + json); 
	              
	            sGroupCd  = (String)json.get("__group_cd");
	            sGroupNm  = (String)json.get("__group_nm");
	            sUseYn    = (String)json.get("__use_yn"  );
	            sCrud     = (String)json.get("__crud"    );
	            sRows     = (String)json.get("__rows");
	            sPage     = (String)json.get("__page");
	            
	            response.setContentType("application/x-json charset=UTF-8");

				logger.debug("getCodeManager sGroupCd:" + sGroupCd);
				logger.debug("getCodeManager sGroupNm:" + sGroupNm);
				logger.debug("getCodeManager sUseYn  :" + sUseYn);
				logger.debug("getCodeManager sCrud:" + sCrud);
				logger.debug("getCodeManager nRows:" + sRows);
				logger.debug("getCodeManager nPage:" + sPage);
			}
			
		    UtilClass  utilClass = new UtilClass();
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();

			 if(sCrud.equals("R")) {
		    	sQuery =          "\nSELECT GROUP_CD, GROUP_NM, USE_YN \n";
				sQuery = sQuery + "    FROM MDDB.TB_CODE_GROUP \n";
				sQuery = sQuery + "   WHERE 1 = 1 \n";
				sQuery = sQuery + "   ORDER BY GROUP_CD \n";
			 } else if(sCrud.equals("RD")) {
			    	sQuery =          "\nSELECT GROUP_CD, DETAIL_CD, DETAIL_NM, USE_YN \n";
					sQuery = sQuery + "    FROM MDDB.TB_CODE_DETAIL 						\n";
					sQuery = sQuery + "   WHERE 1 = 1 							\n";
					sQuery = sQuery + "     AND GROUP_CD = '" + sGroupCd + "' 	\n";
					sQuery = sQuery + "   ORDER BY DETAIL_CD \n";
			 }
			 
			logger.debug("getCodeManager sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();

				if(sCrud.equals("R")) {
					datas.put("GROUP_CD"   		, utilClass.nvl(rs.getString("GROUP_CD")));
					datas.put("GROUP_NM"   		, utilClass.nvl(rs.getString("GROUP_NM")));
					datas.put("USE_YN"   		, utilClass.nvl(rs.getString("USE_YN")));
				} else if(sCrud.equals("RD")) {
					datas.put("GROUP_CD"   		, utilClass.nvl(rs.getString("GROUP_CD")));
					datas.put("DETAIL_CD"   	, utilClass.nvl(rs.getString("DETAIL_CD")));
					datas.put("DETAIL_NM"   	, utilClass.nvl(rs.getString("DETAIL_NM")));
					datas.put("USE_YN"   		, utilClass.nvl(rs.getString("USE_YN")));
				}
			
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
				
			logger.debug(jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			//logger.debug("getCodeManager :" + jsonobj.toString() ); 
			
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