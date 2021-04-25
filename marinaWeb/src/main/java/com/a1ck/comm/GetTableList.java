package com.a1ck.comm;

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

public class GetTableList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
	public Connection connectionDest = null;
	
    public GetTableList() {
//    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("getTableList ***** Start GetTableList *****"); 
			
			String sQuery  = null;  
			int    nCount = 0;
			
			String sGb       = "";
			String sTableId  = "";
			String sTableNm  = "";
			String sUseYn    = "";	
			String sRows  = "";
			String sPage  = "";
			String sServerId = "";
			String sServerNm = "";
			//String sExpPath ="";
			//String sExpZipYN ="";
			
			String jsonParam = request.getParameter("param");
			
			if(jsonParam != null){
				JSONParser parser = new JSONParser();
				JSONObject json = (JSONObject) parser.parse(jsonParam.toString());

	            logger.debug("getTableList json:" + json); 
	              
	            sGb      = (String)json.get("__gb");
	            sTableId = (String)json.get("__table_id");
	            sTableNm = (String)json.get("__table_nm");
	            sUseYn    = (String)json.get("__use_yn");
	            sRows    = (String)json.get("__rows");
	            sPage    = (String)json.get("__page");
	            
	            sServerId    = (String)json.get("__server_id");
	            sServerNm    = (String)json.get("__server_nm");
	           // sExpPath     = (String)json.get("__exp_path");
	           // sExpZipYN    = (String)json.get("__exp_zip_yn");
	            
				logger.debug("getTableList sGb:" + sGb);
				logger.debug("getTableList sTableId:" + sTableId);
				logger.debug("getTableList sTableNm:" + sTableNm);
				logger.debug("getServerList sUseYn:" + sUseYn);
				logger.debug("getTableList nRows:" + sRows);
				logger.debug("getTableList nPage:" + sPage);
				
				logger.debug("getTableList nPage:" + sServerId);
				logger.debug("getTableList nPage:" + sServerNm);

				response.setContentType("application/x-json charset=UTF-8");
			}
			
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			if( StringUtils.equals(sGb, "A") || StringUtils.equals(sGb, "T") ) {
				
				sQuery  = " SELECT T.TABLE_ID, T.TABLE_CD, T.TABLE_NM, T.SAVE_PREQ_CD, T.SAVE_PREQ, T.DESCRIPTION, T.USE_YN , C.DETAIL_NM AS SAVE_PREQ_NM ,S.SERVER_ID,S.SERVER_NM, T.EXP_PATH, T.EXP_ZIP_YN \n ";
				sQuery += "   FROM TB_TABLE_INFO T LEFT OUTER JOIN TB_CODE_DETAIL C ON T.SAVE_PREQ_CD = C.DETAIL_CD AND 'SAVE_PREQ_CD' = C.GROUP_CD AND 'Y' = C.USE_YN \n ";
				sQuery += "      LEFT OUTER JOIN TB_SERVER S ON T.SERVER_ID = s.SERVER_ID ";
				sQuery += "  WHERE 1 = 1    \n ";
				
				if( !StringUtils.equals(sUseYn, "A")) {
					sQuery += "    AND T.USE_YN like '%" + sUseYn + "%'  \n ";
				}
				
				if( !StringUtils.equals(sTableId, "*") ) {
					sQuery += "    AND T.TABLE_ID = '" + sTableId + "' \n";
				}
				
				if( !StringUtils.equals(sTableNm, "*") && !StringUtils.equals(sTableNm, "")) {
					sQuery += "    AND T.TABLE_NM LIKE '%" + sTableNm + "%' \n";
				}
				
				sQuery += "  ORDER BY T.TABLE_NM \n ";
				
			} else {
				sQuery  = " SELECT C.TABLE_ID, C.ATTR_SEQ, C.ATTR_CD, C.ATTR_NM, C.ATTR_TYPE_CD, D.DETAIL_NM AS ATTR_TYPE_NM, C.ATTR_SIZE, C.DECIMAL_SIZE, C.ATTR_NULL_YN, C.USE_YN  AS ATTR_USE_YN  \n ";
				sQuery += "   FROM TB_TABLE_INFO I LEFT OUTER JOIN TB_TABLE_ATTR C ON I.TABLE_ID = C.TABLE_ID  AND 'Y' = C.USE_YN LEFT OUTER JOIN TB_CODE_DETAIL D ON C.ATTR_TYPE_CD = D.DETAIL_CD AND 'ATTR_TYPE_CD' = D.GROUP_CD \n ";
				sQuery += "  WHERE 1 = 1   \n ";
				sQuery += "    AND I.USE_YN   = 'Y'  \n ";
				sQuery += "    AND I.TABLE_ID = '" + sTableId + "' \n";
				sQuery += "  ORDER BY C.ATTR_SEQ \n ";				
			}
			logger.debug("getTableList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				if( StringUtils.equals(sGb, "A") || StringUtils.equals(sGb, "T") ) {
					datas.put("TABLE_ID"   , rs.getString("TABLE_ID"));	
					datas.put("TABLE_CD"   , rs.getString("TABLE_CD"));	
					datas.put("TABLE_NM"   , rs.getString("TABLE_NM"));	
					datas.put("USE_YN"     , rs.getString("USE_YN"));	
	
					if (!StringUtils.isEmpty(rs.getString("SAVE_PREQ_CD"))) 
						datas.put("SAVE_PREQ_CD" , rs.getString("SAVE_PREQ_CD"));	
					else
						datas.put("SAVE_PREQ_CD" , " " );
					
					if (!StringUtils.isEmpty(rs.getString("SAVE_PREQ_NM"))) 
						datas.put("SAVE_PREQ_NM" , rs.getString("SAVE_PREQ_NM"));	
					else
						datas.put("SAVE_PREQ_NM" , " " );
					
					//logger.debug("email:[" + rs.getString("MAIL") + "]");
					if (!StringUtils.isEmpty(rs.getString("SAVE_PREQ"))) 
						datas.put("SAVE_PREQ"     , rs.getString("SAVE_PREQ"));	
					else
						datas.put("SAVE_PREQ"     , " " );
					
					if (!StringUtils.isEmpty(rs.getString("DESCRIPTION"))) 
						datas.put("DESCRIPTION"     , rs.getString("DESCRIPTION"));	
					else
						datas.put("DESCRIPTION"     , " " );

					if (!StringUtils.isEmpty(rs.getString("SERVER_ID"))) 
						datas.put("SERVER_ID"     , rs.getString("SERVER_ID"));	
					else
						datas.put("SERVER_ID"     , " " );
					
					if (!StringUtils.isEmpty(rs.getString("SERVER_NM"))) 
						datas.put("SERVER_NM"     , rs.getString("SERVER_NM"));	
					else
						datas.put("SERVER_NM"     , " " );					
					
					if (!StringUtils.isEmpty(rs.getString("EXP_PATH"))) 
						datas.put("EXP_PATH"     , rs.getString("EXP_PATH"));	
					else
						datas.put("EXP_PATH"     , " " );	
					
					if (!StringUtils.isEmpty(rs.getString("EXP_ZIP_YN"))) 
						datas.put("EXP_ZIP_YN"     , rs.getString("EXP_ZIP_YN"));	
					else
						datas.put("EXP_ZIP_YN"     , " " );						
					
				} else  {

//					datas.put("TABLE_ID"    , rs.getString("TABLE_ID"));	
					datas.put("ATTR_CD"     , rs.getString("ATTR_CD"));	
					datas.put("ATTR_NM"     , rs.getString("ATTR_NM"));	
					datas.put("ATTR_SEQ"    , rs.getString("ATTR_SEQ"));	
					datas.put("ATTR_TYPE_CD", rs.getString("ATTR_TYPE_CD"));	
					datas.put("ATTR_SIZE"   , rs.getString("ATTR_SIZE"));	
					datas.put("DECIMAL_SIZE", rs.getString("DECIMAL_SIZE"));	
					datas.put("ATTR_NULL_YN", rs.getString("ATTR_NULL_YN"));	
					datas.put("ATTR_USE_YN" , rs.getString("ATTR_USE_YN"));	
					
					if (!StringUtils.isEmpty(rs.getString("ATTR_TYPE_NM"))) 
						datas.put("ATTR_TYPE_NM" , rs.getString("ATTR_TYPE_NM"));	
					else
						datas.put("ATTR_TYPE_NM" , " " );					
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
				
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("getTableList :" + jsonobj.toString() ); 
			
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