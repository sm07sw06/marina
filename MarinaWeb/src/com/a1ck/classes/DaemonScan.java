package com.a1ck.classes;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.a1ck.classes.DaemonScanClasses.JobClass;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.UtilClass;

public class DaemonScan {

	private static Logger logger = Logger.getLogger(DaemonScan.class);
	static ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
	
	private static ArrayList<JobClass>  jobClassList  = null; 
	private static Connection connectionDest   = null; 

	static UtilClass  utilClass = null;
	
	public static void main(String[] args) {

		int nMaxPool   = 20;
		int nFileCount = 0 ;
		int nDelay = 0;
		String sDaemonStat = "0";
		
		utilClass = new UtilClass();

		for(;;) {

			try {			
				
				jobClassList  = new ArrayList<JobClass>(); 
				
				connectionDest = conMgr.getConnection();
				
				sDaemonStat = GetDaemonStatus(connectionDest);
				
				String sStat = sDaemonStat.split(";")[0];
				nDelay   = Integer.parseInt(sDaemonStat.split(";")[1]);
				
				if ( StringUtils.equalsIgnoreCase(sStat, "0") || StringUtils.equalsIgnoreCase(sStat, "2")) {
					logger.debug("Scan 데몬이 작동 중지(대기) 상태 입니다. ");
					try {
						logger.debug(nDelay + "대기 합니다. ");
						Thread.sleep(1000 * nDelay);
					} catch (InterruptedException e) {
						e.printStackTrace();
					} 						
					continue;
				}
			
				nFileCount = ProcessFetch(connectionDest);
	
				if(nFileCount < nMaxPool) nMaxPool = nFileCount;
				
				logger.debug("..count0 :::"  + jobClassList.size() );
				
				Iterator<JobClass> iter = jobClassList.iterator();
				while (iter.hasNext()) {
					
					JobClass s = iter.next();

					DaemonScanRunnable daemonScanRunnable = new DaemonScanRunnable(s);
					//Runnable 인터페이스를 상속 받은 tempCustomer를 이용해서 스레드를 생성 합니다.
		            Thread tempThread = new Thread(daemonScanRunnable, s.getJobCd());
		            //생성된 스레드를 실행 시킵니다.
		            tempThread.start();
		            
					//tempThread.interrupt();
					
				} // while (iter.hasNext())
	
				logger.info( "[!]모든 Thread가 종료되었습니다.");  
				
				//ExecutorService의 모든 작업 이후 다른 thread 호출을  차단합니다. 
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				if (connectionDest != null)
					try {
						conMgr.freeConnection(connectionDest);
					} catch (Exception e) {
						logger.error(e.getMessage());
						e.printStackTrace();
					} 
			}
			
			try {
				logger.debug(nDelay + "대기 합니다. ");
				Thread.sleep(1000 * nDelay);
			} catch (InterruptedException e) {
				e.printStackTrace();
			} 	
			
		}// for(;;)
	}		
		
	public static String GetDaemonStatus(Connection connection) throws SQLException {
    
    	Statement stmt = null;
    	ResultSet rs   = null;
    	String    sSelectQuery = null;
    	String    sDelayTime   = "0";
    	
		String sDaemonStat = "0";

		//logger.info( "[!]"대몬 상태를 확인합니다...");

		try {	
			stmt = connection.createStatement();
			
			sSelectQuery  = " SELECT DAEMON_ID, DAEMON_NM, DAEMON_STAT_CD, DELAY_TIME \n ";
			sSelectQuery += "   FROM MDDB.TB_DAEMON  \n ";
			sSelectQuery += "  WHERE USE_YN = 'Y' \n ";
			sSelectQuery += "    AND DAEMON_NM = 'DaemonScan' \n ";
				
			//logger.debug("sQuery3 :" + sSelectQuery );
			
			rs = stmt.executeQuery(sSelectQuery); 
	
	        while(rs.next()){

	        	sDaemonStat = rs.getString("DAEMON_STAT_CD");
	        	sDelayTime  = rs.getString("DELAY_TIME");
	        }
 			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try{
				if(stmt != null)
					stmt.close();
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		
		return sDaemonStat + ";" + sDelayTime;
	}
	
	public static int ProcessFetch(Connection connection) throws SQLException {
	    
    	Statement stmt = null;
    	ResultSet rs   = null;
    	String    sSelectQuery = null;
    	
		int nCnt      = 0;
		
		String sJobId    = null;
		String sServerId = null;
		String sTableId  = null;
		String sJobCd    = null;
		String sJobNm    = null;
		String sFilterYn = null;
		String sSourcePath = null;
		String sSourceFile = null;
		
		
		logger.info( "[!]대상작업을 검색합니다.............");

		try {	
			stmt = connection.createStatement();
			
			sSelectQuery  = " SELECT JOB_ID, JOB_CD, SERVER_ID, TABLE_ID, JOB_NM, SOURCE_PATH, SOURCE_FILE, FILTER_YN  \n ";
			sSelectQuery += "   FROM MDDB.TB_JOB  \n ";
			sSelectQuery += "  WHERE USE_YN = 'Y' \n ";
				
			//logger.debug("sQuery3 :" + sSelectQuery );
			
			rs = stmt.executeQuery(sSelectQuery); 
	
	        while(rs.next()){

	        	sJobId      = rs.getString("JOB_ID"     );
	        	sJobCd      = rs.getString("JOB_CD"     );
	        	sServerId   = rs.getString("SERVER_ID"  );
	        	sTableId    = rs.getString("TABLE_ID"   );
	        	sJobNm      = rs.getString("JOB_NM"     );
	        	sSourcePath = rs.getString("SOURCE_PATH");
	        	sSourceFile = rs.getString("SOURCE_FILE");
	        	sFilterYn   = rs.getString("FILTER_YN"  );
	        	nCnt++;

	        	JobClass jobClass    = new JobClass();
	        	jobClass.jobId      = sJobId;
	        	jobClass.jobCd      = sJobCd;
	        	jobClass.jobNm      = sJobNm;
	        	jobClass.serverId   = sServerId;
	        	jobClass.tableId    = sTableId;
	        	jobClass.filterYn   = sFilterYn;
	        	jobClass.sourcePath = sSourcePath;
	        	jobClass.sourceFile = sSourceFile;
	        	jobClassList.add(jobClass);

	        }
 			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try{
				if(stmt != null)
					stmt.close();
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		
		return nCnt;
	}


}
