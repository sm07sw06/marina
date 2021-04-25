package com.a1ck.util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

import javax.servlet.http.HttpServlet;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.a1ck.util.CodeClass.CodeDetail;

public class CodeController extends HttpServlet {
	
	private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");

	private static final long serialVersionUID = -6108753779473516316L;

	public CodeController() throws DBPoolException {

		ConnectionManager conMgr = null;
		conMgr = new ConnectionManagerAll4("postgresql");
		
		String sQuery  = null;
		
	    ResultSet rs;

	    String sGroupCdOld  = ""; 
	    String sGroupCdNew  = "";
	    String sDetailCdNew = "";
	    String sDetailNmNew = "";
	    
	    int    nPos = 0;
	    Connection connectionDest = null;
	    Statement stmt = null;

	    ArrayList<CodeDetail> _CODE_LIST = null;
	    
	    _CODE_LIST = new ArrayList<CodeDetail>();
		
		try {

			connectionDest = conMgr.getConnection(); // pool dhlee

			stmt = connectionDest.createStatement();
			
			sQuery  = " SELECT GROUP_CD, DETAIL_CD, DETAIL_NM  \n ";
			sQuery += "   FROM TB_CODE_DETAIL  \n ";
			sQuery += "  ORDER BY GROUP_CD, DETAIL_CD \n ";
			
			//logger.debug("CodeController sQuery1:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);
	
	        while(rs.next()){
				
	    		sGroupCdNew  = rs.getString("GROUP_CD" );
	        	sDetailCdNew = rs.getString("DETAIL_CD");
	        	sDetailNmNew = rs.getString("DETAIL_NM");

	        	if((nPos != 0) && ( !StringUtils.equals(sGroupCdOld, sGroupCdNew))) {
	        		
 	        		if( _CODE_LIST != null && _CODE_LIST.size() > 0 ) {
		    		    CodeClass.getHashMap().put(sGroupCdOld, _CODE_LIST);			    		    
		    		    _CODE_LIST = new ArrayList<CodeDetail>();
		    		    _CODE_LIST.clear();
 	        		}
	        	}


	        	CodeDetail codeDetail = new CodeDetail();
				codeDetail.setGrpCD (sGroupCdNew );
				codeDetail.setCode  (sDetailCdNew);
				codeDetail.setCodeNm(sDetailNmNew);

				_CODE_LIST.add(codeDetail);
				
				sGroupCdOld = sGroupCdNew;
				nPos++;
			}
	        CodeClass.getHashMap().put(sGroupCdOld, _CODE_LIST);	
 	        
        	String sServerId = "";
        	String sServerNm = "";
        	
			sQuery  = " SELECT S.SERVER_ID, S.SERVER_NM \n ";
			sQuery += "   FROM TB_SERVER S  \n ";
			sQuery += "  WHERE S.USE_YN ='Y'   \n ";
			sQuery += "  ORDER BY S.SERVER_NM  \n ";
			
			logger.debug("CodeController sQuery2:" + sQuery); 
			
			rs = stmt.executeQuery(sQuery);
	
	        while(rs.next()){
				
	        	sServerId = rs.getString("SERVER_ID");
	        	sServerNm = rs.getString("SERVER_NM");
	        	
	        	CodeClass.getHashMapServer().put(sServerId, sServerNm);	
			}
			
	        stmt.close();
	        
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try{
				if(stmt != null)
					stmt.close();
				if(connectionDest != null) {
					//connectionDest.close();
					conMgr.freeConnection(connectionDest); // pool dhlee
				}
			}catch(Exception e){
				e.printStackTrace();
			}
		}

	}

}
