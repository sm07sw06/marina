package com.a1ck.manage;

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

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;

public class GetItemRange extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;

    public static Logger logger = Logger.getLogger("DashBoard");
	
	public Connection connectionDest = null;
	
    public GetItemRange() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		
		try{
			
			String sQuery  = null;
			boolean bOk    = false;

			logger.debug("GetItemRange starting............");

			String sItemCode = request.getParameter("ITEMCODE").trim();		// 議고쉶 �떆�옉�씪�옄	
		    
			connectionDest = conMgr.getConnection(); 
			 
			JSONObject jsonobj = new JSONObject();

			// 議고쉶 湲곌컙�쓣 湲곗��쑝濡� �떆�뒪�뀥蹂� 諛쒖깮�븳 怨좎븘ID瑜� select
			// 1. �떖�젰 �뀒�씠釉붽낵 怨좎븘ID�뀒�씠釉붿쓣 Cartesian �뿰寃고븯�뿬 �쟾泥� ���긽�쓣 �깮�꽦
			// 2. 怨좎븘ID�뀒�씠釉붿뿉�꽌 議고쉶 湲곌컙�쓽 �떆�뒪�뀥蹂� 嫄댁닔瑜� �깮�꽦
			// 3. (1)怨� (2)瑜� 議곗씤�븯�뿬 異쒕젰
			Statement stmt = connectionDest.createStatement();
	    	sQuery =          " SELECT ITEMCODE, RISKSEQ, RISKVAL, nvl(RGB,'FF0000') RGB, FROMVAL, TOVAL, 'N' DELVAL ,'R' STAT\n";
			sQuery = sQuery + "   FROM AE_RISKINDEX_RANGE \n";
			sQuery = sQuery + "  WHERE ITEMCODE = '" + sItemCode + "' \n";
			sQuery = sQuery + "  ORDER BY FROMVAL \n";
			
			logger.debug("GetItemRange sQuery1:" + sQuery);
			
			rs = stmt.executeQuery(sQuery);
	        
	        JSONArray  items        = new JSONArray();
	        JSONObject series       = null;
 
			while(rs.next()){
				series       = new JSONObject();
				series.put("ITEMCODE"  	, rs.getString("ITEMCODE")); 
				series.put("RISKSEQ"    , rs.getInt("RISKSEQ")); 
				series.put("RISKVAL"    , rs.getInt("RISKVAL")); 
				series.put("RGB"     	, rs.getString("RGB"));   
				series.put("FROMVAL"	, rs.getInt("FROMVAL"));
				series.put("TOVAL"		, rs.getInt("TOVAL"));  
				series.put("DELVAL"     , rs.getString("DELVAL")); 
				series.put("STAT"       , rs.getString("STAT")); 
				items.add( series );
				bOk = true;
			}
			jsonobj.put("data"  , items); 
			if (bOk) 
				jsonobj.put("result"  , "OK");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			else
				jsonobj.put("result"  , "NOTFOUND");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤

			logger.debug("GetItemRange : " + jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());        
			
			//out.close();
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