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

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;


public class GetCodeList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	
	public Connection connectionDest = null;
	
    //public GetCodeList() {
    //	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	//}

	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
			//logger.debug("GetCodeList ***** Start GetCodeList *****"); 
			
			String sQuery  = null;
			int    nCount = 0;
			
			String sClass = request.getParameter("class").trim();
			String sCode  = request.getParameter("code").trim();

			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT GROUP_CD, DETAIL_CD, DETAIL_NM  \n ";
			sQuery += "   FROM TB_CODE_DETAIL  \n ";
			sQuery += "  WHERE GROUP_CD = '" + sClass + "'  \n ";
			
			if( !StringUtils.equals(sCode, "*")) {
				sQuery += "    AND DETAIL_CD = '" + sCode + "' \n";
			}
			sQuery += "  ORDER BY DETAIL_CD \n ";
			
			//logger.debug("GetCodeList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("idx"       , nCount + 1);	
				datas.put("_CODE_"      , rs.getString("DETAIL_CD"));	
				datas.put("_NAME_"      , rs.getString("DETAIL_NM"));	
				
				seriesArray.add(datas);
				jsonobj.put("data"  ,seriesArray);   
			
				nCount++;
			}
			
			if (nCount> 0 ) {
				jsonobj.put("result" , "OK"      );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
				jsonobj.put("count"  , nCount    );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			} else {  
				jsonobj.put("result" , "NOTFOUND");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
				jsonobj.put("count"  , 0         );  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			}
				
			//logger.debug(jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			//logger.debug("GetCodeList :" + jsonobj.toString() ); 
			
			stmt.close();
//			connectionDest.close();
			conMgr.freeConnection(connectionDest);

		} catch(Exception e){
			e.printStackTrace();
		} finally {
			try{
				if(stmt != null)
					stmt.close();
				if(connectionDest != null)
					connectionDest.close();
			}catch(Exception e){
				e.printStackTrace();
			}
		}

    }
 
}