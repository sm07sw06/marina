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
import com.a1ck.util.UtilClass;

public class GetItemList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    ResultSet rs;
    Statement stmt;

    public static Logger logger = Logger.getLogger("DashBoard");
	
	public Connection connectionDest = null;
	
    public GetItemList() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings({ "unchecked", "static-access" })
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		
		try{
			
			String sQuery  = null;
			boolean bOk = false;

			logger.debug("GetItemList starting............");

			//String sFromDate = request.getParameter("fromdate").trim();		// 議고쉶 �떆�옉�씪�옄	
		     
			UtilClass  utilClass = new UtilClass();
			connectionDest = conMgr.getConnection(); 
			 
			JSONObject jsonobj = new JSONObject();

			// 議고쉶 湲곌컙�쓣 湲곗��쑝濡� �떆�뒪�뀥蹂� 諛쒖깮�븳 怨좎븘ID瑜� select
			// 1. �떖�젰 �뀒�씠釉붽낵 怨좎븘ID�뀒�씠釉붿쓣 Cartesian �뿰寃고븯�뿬 �쟾泥� ���긽�쓣 �깮�꽦
			// 2. 怨좎븘ID�뀒�씠釉붿뿉�꽌 議고쉶 湲곌컙�쓽 �떆�뒪�뀥蹂� 嫄댁닔瑜� �깮�꽦
			// 3. (1)怨� (2)瑜� 議곗씤�븯�뿬 異쒕젰
			Statement stmt = connectionDest.createStatement();
	    	sQuery =          "SELECT ITEMCODE,  ITEMNAME,  WEIGHT, USEYN,  decode(USEYN,'Y','�궗�슜','誘몄궗�슜') USEYNDESC ,  ITEM_ORDER ITEMORDER \n";
			sQuery = sQuery + "  from TB_AE_RISKINDEX_ITEMVAL \n";
			sQuery = sQuery + " order by ITEM_ORDER desc \n";
			
			logger.debug("GetItemList sQuery1:" + sQuery);
			
			rs = stmt.executeQuery(sQuery);
	        
	        JSONArray  items        = new JSONArray();
	        JSONObject series       = null; 
 
			while(rs.next()){
				series       = new JSONObject();
				//logger.debug("GetItemList text:"+ rs.getString("text"));
				series.put("ITEMCODE"  , utilClass.nvl(rs.getString("ITEMCODE" )));  // data �빆紐⑹쓣 �늻�쟻�떆�궡  0,0,0,0,.......
				series.put("ITEMNAME"  , utilClass.nvl(rs.getString("ITEMNAME" )));  // data �빆紐⑹쓣 �늻�쟻�떆�궡  0,0,0,0,.......
				series.put("WEIGHT"    , utilClass.nvl2zero(rs.getString("WEIGHT"   )));  // data �빆紐⑹쓣 �늻�쟻�떆�궡  0,0,0,0,.......
				series.put("USEYN"     , utilClass.nvl(rs.getString("USEYN"    )));  // data �빆紐⑹쓣 �늻�쟻�떆�궡  0,0,0,0,.......
				series.put("USEYNDESC" , utilClass.nvl(rs.getString("USEYNDESC")));  // data �빆紐⑹쓣 �늻�쟻�떆�궡  0,0,0,0,.......
				series.put("ITEMORDER" , utilClass.nvl2zero(rs.getString("ITEMORDER"   )));  // data �빆紐⑹쓣 �늻�쟻�떆�궡  0,0,0,0,.......

				items.add( series ); 
				bOk = true;
			}
			
			jsonobj.put("data"  , items); 
			if (bOk) 
				jsonobj.put("result"  , "OK");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤
			else
				jsonobj.put("result"  , "NOTFOUND");  // 寃곌낵�쓽 �꽦怨듭뿬遺�瑜� �솗�씤

			logger.debug("GetItemList : " + jsonobj.toString());

			//�쓳�떟�쓣 �븯湲� �쐞�븳 以�鍮� �옉�뾽
	        response.setContentType("text/plain");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write(jsonobj.toString());
        
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