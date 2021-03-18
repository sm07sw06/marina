package com.a1ck.manage;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.json.simple.JSONObject;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;

public class SetItemList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public static Logger logger = Logger.getLogger("DashBoard");
	
    public SetItemList() {
    	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		   logger.debug("SetItemList start.............:");

		   ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
		   
		   resp.setContentType("text/html;charset=UTF-8");
		   
		   String sItemCode  = req.getParameter("ITEMCODE");
		   String sItemName  = req.getParameter("ITEMNAME");
		   String sUseYn     = req.getParameter("USEYN");
		   int    nWeight    = Integer.parseInt(req.getParameter("WEIGHT"));
		   int    nItemOrder = Integer.parseInt(req.getParameter("ITEMORDER"));  //Integer.parseInt
		   String sGubun     = req.getParameter("GUBUN");
		   
		   String[] sRgb       = req.getParameterValues("RGB");
		   String[] sDelVal    = req.getParameterValues("DELVAL");
		   String[] nRiskVal   = req.getParameterValues("RISKVAL");
		   String[] nFromVal   = req.getParameterValues("FROMVAL");
		   String[] nToVal     = req.getParameterValues("TOVAL");
	        
		   logger.debug("SetItemList :" + sItemCode + ", " + sItemName + '(' + sRgb.length + ')');

			Connection connectionDest = null;
			Statement stmt = null;
			
			try {
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);		
				
				logger.debug("SetItemList sGubun:" + sGubun);				
			   
			   if(sGubun.equals("A")) {
				    String insertSql = "INSERT INTO AE_RISKINDEX_ITEMVAL (ITEMCODE, ITEMNAME, WEIGHT, USEYN, ITEM_ORDER) \n";
					insertSql = insertSql + "VALUES ( UPPER('" + sItemCode + "'), '" + sItemName + "', " + nWeight + ", '" + sUseYn + "', " + nItemOrder + " )";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetItemList sql:" + insertSql);
					
					stmt.execute(insertSql);
					stmt.close();
					
					for(int i=0; i < sRgb.length; i++)	{
					    insertSql = "INSERT INTO AE_RISKINDEX_RANGE (ITEMCODE, RISKSEQ, RISKVAL,  RGB, FROMVAL, TOVAL) \n";
						insertSql = insertSql + "VALUES ( '" + sItemCode + "', " + (i+1) + ", " + nRiskVal[i] + ", '" + sRgb[i] + "', " + nFromVal[i] + ", " + nToVal[i] + " )";
			
						stmt = connectionDest.createStatement();
						logger.debug("SetItemList sql:" + insertSql);
						stmt.execute(insertSql);
						stmt.close();				
					}
				
			   } else if(sGubun.equals("D")) {
				    String updateSql      = "DELETE FROM  AE_RISKINDEX_ITEMVAL \n";
					updateSql = updateSql + " WHERE ITEMCODE =   '" + sItemCode  + "'   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetItemList sql:" + updateSql);
					stmt.execute(updateSql);
					logger.debug("SetItemList sql:" + updateSql);
					
				    updateSql      = "DELETE FROM  AE_RISKINDEX_RANGE \n";
					updateSql = updateSql + " WHERE ITEMCODE =   '" + sItemCode  + "'   \n ";

					logger.debug("SetItemList sql:" + updateSql);
					stmt.execute(updateSql);
					logger.debug("SetItemList sql:" + updateSql);
					stmt.close();			   
					
			   } else {
				    String updateSql      = "UPDATE AE_RISKINDEX_ITEMVAL \n";
				    updateSql = updateSql + "   SET ITEMNAME   = '" + sItemName  + "'   \n ";
					updateSql = updateSql + "      ,WEIGHT     =  " + nWeight    + "    \n ";
					updateSql = updateSql + "      ,USEYN      = '" + sUseYn     + "'   \n ";
					updateSql = updateSql + "      ,ITEM_ORDER =  " + nItemOrder + "    \n ";
					updateSql = updateSql + " WHERE ITEMCODE =   '" + sItemCode  + "'   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetItemList sql:" + updateSql);
					stmt.execute(updateSql);
					logger.debug("SetItemList sql:" + updateSql);
					stmt.close();			   
					
					logger.debug("SetItemList count:" + sRgb.length);
					
					updateSql      = "DELETE FROM AE_RISKINDEX_RANGE \n";
					updateSql = updateSql + " WHERE ITEMCODE =  '" + sItemCode    + "'  \n ";
					stmt = connectionDest.createStatement();
					logger.debug("SetItemList sql:" + updateSql);
					stmt.execute(updateSql);
					stmt.close();	

					for(int i=0; i < sRgb.length; i++)	{
						
						logger.debug("SetItemList sDelVal:" + sDelVal[i]);
						if(!sDelVal[i].equals("Y")) {
							
						    String insertSql = "INSERT INTO AE_RISKINDEX_RANGE (ITEMCODE, RISKSEQ, RISKVAL,  RGB, FROMVAL, TOVAL) \n";
							insertSql = insertSql + "VALUES ( '" + sItemCode + "', " + (i+1) + ", " + nRiskVal[i] + ", '" + sRgb[i] + "', " + nFromVal[i] + ", " + nToVal[i] + " )";
				
							stmt = connectionDest.createStatement();
							logger.debug("SetItemList sql:" + insertSql);
							stmt.execute(insertSql);
							stmt.close();				
						}
					}
			   }
			   connectionDest.commit();
			   
			} catch (Exception e) {
				try {
					connectionDest.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
				e.printStackTrace();
				logger.debug("error :" + e.getMessage() );				
			} finally {
				try{
					if(stmt != null)
						stmt.close();
					if(connectionDest != null)
						conMgr.freeConnection(connectionDest);
				}catch(Exception e){
					e.printStackTrace();
					logger.debug("error :" + e.getMessage() );				

				}
			}
				   
		   JSONObject jsonobj = new JSONObject();
		   try {
				jsonobj.put("result"  , "OK");
			} catch (Exception e) {
				logger.error(e.getMessage());
				e.printStackTrace();
			}
		   
		   resp.setContentType("text/plain");
		   resp.setCharacterEncoding("UTF-8");
		   resp.getWriter().write(jsonobj.toString()); 	
	}


	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
	}
		
	
	
		 
}
