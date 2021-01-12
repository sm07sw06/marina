package com.a1ck.manage;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;

public class SetScheduleList extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
    public SetScheduleList() {
 //   	PropertyConfigurator.configure(System.getenv("CATALINA_HOME") + "/log4j.properties");
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		   logger.debug("SetScheduleList start.............:");
		   
		   ConnectionManager conMgr = new ConnectionManagerAll4("postgresql");
				   
           String sJobId     	 = "";
           String sJobCd     	 = "";
           String sJobNm     	 = "";
           String sJobSchedule   = "";
           String sSavePreq      = "";
           String sJobClass      = "";
           String sDescription   = "";
           String sSrcIp         = "";
           String sSrcPort       = "";
           String sSrcDb         = "";
           String sSrcUser       = "";
           String sSrcPasswd     = "";
           String sSrcSql        = "";
           String sDestIp        = "";
           String sDestPort      = "";
           String sDestDb        = "";
           String sDestUser      = "";
           String sDestPasswd    = "";
           String sDestTable     = "";
           String sJobPath       = "";
           String sSavePreqCd  	 = "";
           String sJobTypeCd   	 = "";
           String sJobMethodCd 	 = "";
           String sSrcDbmsCd   	 = "";
           String sDestDbmsCd  	 = "";
           String sUseYn         = "";
           String sSelectYn      = "";
           String sCrud        	 = "";
		   
 		   resp.setContentType("text/html;charset=UTF-8");
		   
			String jsonParam = req.getParameter("param");
			
			try {

				logger.debug("getUserList jsonParam:" + jsonParam); 
				
				if(jsonParam != null){
					JSONParser parser = new JSONParser();
					JSONObject json;
					json = (JSONObject) parser.parse(jsonParam.toString());
	
		            logger.debug("getUserList json:" + json); 
		              
		            sJobId         = (String)json.get("job_id"       );
		            sJobCd         = (String)json.get("job_cd"       );
		            sJobNm         = (String)json.get("job_nm"       );
		            sJobSchedule   = (String)json.get("job_schedule" );
		            sSavePreq      = (String)json.get("save_preq"    );
		            sJobClass      = (String)json.get("job_class"    );
		            sDescription   = (String)json.get("description"  );
		            sSrcIp         = (String)json.get("src_ip"       );
		            sSrcPort       = (String)json.get("src_port"     );
		            sSrcDb         = (String)json.get("src_db"       );
		            sSrcUser       = (String)json.get("src_user"     );
		            sSrcPasswd     = (String)json.get("src_passwd"   );
		            sSrcSql        = (String)json.get("src_sql"      );
		            sDestIp        = (String)json.get("dest_ip"      );
		            sDestPort      = (String)json.get("dest_port"    );
		            sDestDb        = (String)json.get("dest_db"      );
		            sDestUser      = (String)json.get("dest_user"    );
		            sDestPasswd    = (String)json.get("dest_passwd"  );
		            sDestTable     = (String)json.get("dest_table"   );
		            sJobPath       = (String)json.get("job_path"     );
		            sSavePreqCd    = (String)json.get("save_preq_cd" );
		            sJobTypeCd     = (String)json.get("job_type_cd"  );
		            sJobMethodCd   = (String)json.get("job_method_cd");
		            sSrcDbmsCd     = (String)json.get("src_dbms_cd"  );
		            sDestDbmsCd    = (String)json.get("dest_dbms_cd" );
		            sUseYn         = (String)json.get("use_yn"       );
		            sSelectYn      = (String)json.get("select_yn"    );
		            sCrud          = (String)json.get("crud"         );

		            resp.setContentType("application/x-json charset=UTF-8");
				}
			} catch (org.json.simple.parser.ParseException e) {
				e.printStackTrace();
			}
			
			  logger.debug("SetScheduleList :sJobId     	  :" + sJobId     	    + " \n");
			  logger.debug("SetScheduleList :sJobCd     	  :" + sJobCd     	    + " \n");
			  logger.debug("SetScheduleList :sJobNm     	  :" + sJobNm     	    + " \n");
			  logger.debug("SetScheduleList :sJobSchedule     :" + sJobSchedule     + " \n");
			  logger.debug("SetScheduleList :sSavePreq        :" + sSavePreq        + " \n");
			  logger.debug("SetScheduleList :sJobClass        :" + sJobClass        + " \n");
			  logger.debug("SetScheduleList :sDescription     :" + sDescription     + " \n");
			  logger.debug("SetScheduleList :sSrcIp           :" + sSrcIp           + " \n");
			  logger.debug("SetScheduleList :sSrcPort         :" + sSrcPort         + " \n");
			  logger.debug("SetScheduleList :sSrcDb           :" + sSrcDb           + " \n");
			  logger.debug("SetScheduleList :sSrcUser         :" + sSrcUser         + " \n");
			  logger.debug("SetScheduleList :sSrcPasswd       :" + sSrcPasswd       + " \n");
			  logger.debug("SetScheduleList :sSrcSql          :" + sSrcSql          + " \n");
			  logger.debug("SetScheduleList :sDestIp          :" + sDestIp          + " \n");
			  logger.debug("SetScheduleList :sDestPort        :" + sDestPort        + " \n");
			  logger.debug("SetScheduleList :sDestDb          :" + sDestDb          + " \n");
			  logger.debug("SetScheduleList :sDestUser        :" + sDestUser        + " \n");
			  logger.debug("SetScheduleList :sDestPasswd      :" + sDestPasswd      + " \n");
			  logger.debug("SetScheduleList :sDestTable       :" + sDestTable       + " \n");
			  logger.debug("SetScheduleList :sJobPath         :" + sJobPath         + " \n");
			  logger.debug("SetScheduleList :sSavePreqCd      :" + sSavePreqCd      + " \n");
			  logger.debug("SetScheduleList :sJobTypeCd       :" + sJobTypeCd       + " \n");
			  logger.debug("SetScheduleList :sJobMethodCd     :" + sJobMethodCd     + " \n");
			  logger.debug("SetScheduleList :sSrcDbmsCd       :" + sSrcDbmsCd       + " \n");
			  logger.debug("SetScheduleList :sDestDbmsCd      :" + sDestDbmsCd      + " \n");
			  logger.debug("SetScheduleList :sUseYn           :" + sUseYn           + " \n");
			  logger.debug("SetScheduleList :sSelectYn        :" + sSelectYn        + " \n");
			  logger.debug("SetScheduleList :sCrud            :" + sCrud            + " \n");
		   
				Connection connectionDest = null;
				Statement stmt = null;
				ResultSet keySet = null;
				int genKey = 0;

				
			try { 
				
				connectionDest = conMgr.getConnection(); 
				
				connectionDest.setAutoCommit(false);	
			   
			   if(sCrud.equals("C")) {
				    String insertSql = "\nINSERT INTO MDDB.TB_SCHEDULE(JOB_NM, JOB_SCHEDULE, SRC_IP, SRC_PORT, SRC_DBMS_CD, SRC_DB, SRC_USER, SRC_PASSWD \n";
					insertSql = insertSql + "   ,SRC_SQL, DEST_IP, DEST_PORT, DEST_DBMS_CD, DEST_DB, DEST_USER, DEST_PASSWD, JOB_METHOD_CD, DEST_TABLE ";
					insertSql = insertSql + "   ,JOB_CLASS, JOB_TYPE_CD, JOB_PATH, SAVE_PREQ_CD, SAVE_PREQ, USE_YN, DESCRIPTION, JOB_CD, SELECT_YN )  \n";
					insertSql = insertSql + "VALUES ( '"+sJobNm+"','"+sJobSchedule+"','"+sSrcIp+"',"+sSrcPort+",'"+sSrcDbmsCd+"','"+sSrcDb+"','"+sSrcUser+"','"+sSrcPasswd+"', \n";
					insertSql = insertSql + " '"+sSrcSql+"','"+sDestIp+"',"+sDestPort+",'"+sDestDbmsCd+"','"+sDestDb+"','"+sDestUser+"','"+sDestPasswd+"','"+sJobMethodCd+"','"+sDestTable+"', \n";
					insertSql = insertSql + " '"+sJobClass+"','"+sJobTypeCd+"','"+sJobPath+"','"+sSavePreqCd+"',"+sSavePreq+",'"+sUseYn+"','"+sDescription+"','"+sJobCd+"','"+sSelectYn+"' ) \n";
		
					stmt = connectionDest.createStatement();
					
					logger.debug("SetScheduleList sql:" + insertSql);
					
					stmt.execute(insertSql, Statement.RETURN_GENERATED_KEYS);
					
					keySet = stmt.getGeneratedKeys();
					genKey = 0;
					
					if(keySet.next()){
						genKey=(int) keySet.getLong(1);
					}
					
					
					stmt.close();
			   } else if(sCrud.equals("D")) {
				   
			   		connectionDest.setAutoCommit(false);  
			   
				    String      deleteSql = "\nDELETE FROM MDDB.TB_SCHEDULE \n";
					deleteSql = deleteSql + " WHERE JOB_ID =   '" + sJobId + "'   \n ";
		
					stmt = connectionDest.createStatement();
					
					
					logger.debug("SetScheduleList sql:" + deleteSql);
					
					stmt.execute(deleteSql);
	
				    deleteSql = "\nDELETE FROM MDDB.TB_SCHEDULE_COL \n";
					deleteSql = deleteSql + " WHERE JOB_ID =   '" + sJobId + "'   \n ";
		
					logger.debug("SetScheduleList sql:" + deleteSql);
					
					stmt.execute(deleteSql);
					
					stmt.close();
					
					connectionDest.commit(); 
					
			  } else {
				    String updateSql      = "\nUPDATE MDDB.TB_SCHEDULE \n";
				    updateSql = updateSql + "   SET JOB_NM        = '" + sJobNm       	+ "'   \n ";
					updateSql = updateSql + "      ,JOB_SCHEDULE  = '" + sJobSchedule   + "'   \n ";
					updateSql = updateSql + "      ,SRC_IP        = '" + sSrcIp     	+ "'   \n ";
					updateSql = updateSql + "      ,SRC_PORT      =  " + sSrcPort       + "    \n ";
					updateSql = updateSql + "      ,SRC_DBMS_CD   = '" + sSrcDbmsCd     + "'   \n ";
					updateSql = updateSql + "      ,SRC_DB        = '" + sSrcDb     	+ "'   \n ";
					updateSql = updateSql + "      ,SRC_USER      = '" + sSrcUser       + "'   \n ";
					updateSql = updateSql + "      ,SRC_PASSWD    = '" + sSrcPasswd     + "'   \n ";
					updateSql = updateSql + "      ,SRC_SQL       = '" + sSrcSql     	+ "'   \n ";
					updateSql = updateSql + "      ,DEST_IP       = '" + sDestIp       	+ "'   \n ";
					updateSql = updateSql + "      ,DEST_PORT     =  " + sDestPort     	+ "    \n ";
					updateSql = updateSql + "      ,DEST_DBMS_CD  = '" + sDestDbmsCd    + "'   \n ";
					updateSql = updateSql + "      ,DEST_DB       = '" + sDestDb       	+ "'   \n ";
					updateSql = updateSql + "      ,DEST_USER     = '" + sDestUser     	+ "'   \n ";
					updateSql = updateSql + "      ,DEST_PASSWD   = '" + sDestPasswd    + "'   \n ";
					updateSql = updateSql + "      ,JOB_METHOD_CD = '" + sJobMethodCd   + "'   \n ";
					updateSql = updateSql + "      ,DEST_TABLE    = '" + sDestTable     + "'   \n ";
					updateSql = updateSql + "      ,JOB_CLASS     = '" + sJobClass     	+ "'   \n ";
					updateSql = updateSql + "      ,JOB_TYPE_CD   = '" + sJobTypeCd     + "'   \n ";
					updateSql = updateSql + "      ,JOB_PATH      = '" + sJobPath      	+ "'   \n ";
					updateSql = updateSql + "      ,SAVE_PREQ_CD  = '" + sSavePreqCd    + "'   \n ";
					updateSql = updateSql + "      ,SAVE_PREQ     =  " + sSavePreq      + "    \n ";
					updateSql = updateSql + "      ,USE_YN        = '" + sUseYn    		+ "'   \n ";
					updateSql = updateSql + "      ,SELECT_YN     = '" + sSelectYn 		+ "'   \n ";
					updateSql = updateSql + "      ,DESCRIPTION   = '" + sDescription   + "'   \n ";
					updateSql = updateSql + "      ,JOB_CD        = '" + sJobCd  		+ "'   \n ";
					updateSql = updateSql + " WHERE JOB_ID = '" + sJobId + "'   \n ";

					stmt = connectionDest.createStatement();
					logger.debug("SetScheduleList sql:" + updateSql);
					stmt.execute(updateSql);
					logger.debug("SetScheduleList sql:" + updateSql);
					stmt.close();			   
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
				jsonobj.put("genKey"  , genKey);
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
