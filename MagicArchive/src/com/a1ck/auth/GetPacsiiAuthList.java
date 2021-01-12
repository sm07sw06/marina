package com.a1ck.auth;

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

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;


public class GetPacsiiAuthList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;
 
    public static Logger logger = Logger.getLogger("DashBoard");  
    ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
    
	public Connection connectionDest = null;
	
    public GetPacsiiAuthList() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{

			logger.debug("GetPacsiiAuthList ***** Start GetPacsiiAuthList *****"); 
			
			String sQuery  = null;
			int    nCount = 0;
			
			String sUserid = "*";
			String sName  = "源��룞";

			//String sUserid = request.getParameter("sabun").trim();
			//String sName  = request.getParameter("name").trim();

			logger.debug("GetPacsiiAuthList sUserid:" + sUserid); 
			logger.debug("GetPacsiiAuthList sName :" + sName); 
			
		    UtilClass  utilClass = new UtilClass();
			connectionDest = conMgr.getConnection(); 
			
			Statement stmt = connectionDest.createStatement();
			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT S.SYSTEM_ID, S.SYSTEM_NM, D.DVC_ID, D.DVC_NAME, A.DESCRIPT, A.START_YMD, A.END_YMD END_YMD \n ";
			sQuery += "       ,decode(A.SABUN,null,'異붽�','�궘�젣') STATUS_NM ,'" + sUserid + "' SABUN, E.NAME_HAN \n ";
			sQuery += "   FROM AE_AUTH_PACSII A, AE_SYSTEM S, TB_DEVICE D \n ";
			sQuery += "       ,(SELECT * FROM DMZ_EMP_A1CK \n ";
			sQuery += "          WHERE 1 = 1 \n ";
			if( !StringUtils.equals(sUserid, "*")) {
				sQuery += "    AND SABUN = '" + sUserid + "' \n";
			}
			if( !StringUtils.equals(sName, "*")) {
				sQuery += "    AND NAME_HAN like '%" + sName + "%' \n";
			}
			sQuery += "  ) E \n ";
			sQuery += "  WHERE D.SYSTEM_ID = S.SYSTEM_ID    \n ";
			sQuery += "    AND D.SYSTEM_ID = A.SYSTEM_ID(+)     \n ";
			sQuery += "    AND D.DVC_ID    = A.AUTH_ID(+)   \n ";
			sQuery += "    AND A.SABUN     = E.SABUN(+)     \n ";
			
			sQuery += "  ORDER BY S.SYSTEM_ID,D.DVC_ID  \n ";
			
			logger.debug("GetPacsiiAuthList sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);

			JSONObject jsonobj = new JSONObject();
	        JSONArray  seriesArray = new JSONArray();	

	        jsonobj.put("result"  , "ERROR");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
	         
	        while(rs.next()){
				JSONObject datas = new JSONObject();
				
				datas.put("idx"       , nCount + 1);	
				datas.put("systemId"  , rs.getString("SYSTEM_ID"));	
				datas.put("systemNm"  , rs.getString("SYSTEM_NM"));	
				datas.put("authId"    , rs.getString("DVC_ID"   ));	
				datas.put("authNm"    , rs.getString("DVC_NAME" ));	
				datas.put("status"    , " " );

				if (!StringUtils.isEmpty(rs.getString("STATUS_NM"))) 
					datas.put("statusNm"  , rs.getString("STATUS_NM"));	
				else
					datas.put("statusNm" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("START_YMD"))) 
					datas.put("sdate"     , utilClass.getString2Date(rs.getString("START_YMD")));	
				else
					datas.put("sdate" , " " );
				
				if (!StringUtils.isEmpty(rs.getString("END_YMD"))) 
					datas.put("edate"     , utilClass.getString2Date(rs.getString("END_YMD")));	
				else
					datas.put("edate" , " " );

				if (!StringUtils.isEmpty(rs.getString("SABUN"))) 
					datas.put("sabun" , rs.getString("SABUN"));	
				else 
					datas.put("sabun" , " " );

				if (!StringUtils.isEmpty(rs.getString("NAME_HAN"))) 
					datas.put("name" , rs.getString("NAME_HAN"));	
				else
					datas.put("name" , " " );

				if (!StringUtils.isEmpty(rs.getString("DESCRIPT"))) 
					datas.put("descript" , rs.getString("DESCRIPT"));	
				else
					datas.put("descript" , " " );

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
				
			logger.debug(jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
			logger.debug("GetPacsiiAuthList :" + jsonobj.toString() ); 
			
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