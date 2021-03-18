package com.a1ck.classes;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.a1ck.quarts.CronJobStatus;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.DBPoolException;
import com.a1ck.util.UtilClass;

public class DaemonScan2 {

	private static Logger logger = Logger.getLogger(DaemonScan2.class);
	static ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
	
	private static ArrayList<JobClass>  jobClassList  = new ArrayList<JobClass>(); 
	private static Connection connectionMng    = null; 
	private static Connection connectionDest   = null; 

	static UtilClass  utilClass = null;
	static CronJobStatus  cronJobStatus = null;
	
	static class FileClass {
		String file, date, extend;
		long filesize;
		
		public String getFile() {
			return file;
		}
		public void setFile(String file) {
			this.file = file;
		}
		public String getDate() {
			return date;
		}
		public void setDate(String date) {
			this.date = date;
		}
		public String getExtend() {
			return extend;
		}
		public void setExtend(String extend) {
			this.extend = extend;
		}
		public long getFilesize() {
			return filesize;
		}
		public void setFilesize(long filesize) {
			this.filesize = filesize;
		} 
		
	}

	static class JobClass {
		String jobId, jobCd, jobNm, serverId, tableId, filterYn, sourcePath, sourceFile;

		public String getJobId() {
			return jobId;
		}

		public void setJobId(String jobId) {
			this.jobId = jobId;
		}

		public String getJobCd() {
			return jobCd;
		}

		public void setJobCd(String jobCd) {
			this.jobCd = jobCd;
		}

		
		
		public String getJobNm() {
			return jobNm;
		}

		public void setJobNm(String jobNm) {
			this.jobNm = jobNm;
		}

		public String getServerId() {
			return serverId;
		}

		public void setServerId(String serverId) {
			this.serverId = serverId;
		}

		public String getTableId() {
			return tableId;
		}

		public void setTableId(String tableId) {
			this.tableId = tableId;
		}

		public String getFilterYn() {
			return filterYn;
		}

		public void setFilterYn(String filterYn) {
			this.filterYn = filterYn;
		}

		public String getSourcePath() {
			return sourcePath;
		}

		public void setSourcePath(String sourcePath) {
			this.sourcePath = sourcePath;
		}

		public String getSourceFile() {
			return sourceFile;
		}

		public void setSourceFile(String sourceFile) {
			this.sourceFile = sourceFile;
		}
	}
    
	public static void main(String[] args) {

		int nMaxPool   = 20;
		int nFileCount = 0 ;
		String sDaemonStat = "0";
		
		utilClass = new UtilClass();

		try {			
			
			connectionDest = conMgr.getConnection();

			cronJobStatus = new CronJobStatus();
		
			for(;;) {
				
				sDaemonStat = GetDaemonStatus(connectionDest);
				String sStat  = sDaemonStat.split(";")[0];
				int nDelay = Integer.parseInt(sDaemonStat.split(";")[1]);
				
//				logger.debug("GetDaemonStatus :: sDaemonStat:" + sDaemonStat);
//				logger.debug("GetDaemonStatus :: sStat:" + sStat);
//				logger.debug("GetDaemonStatus :: nDelay:" + nDelay);
				
				if ( StringUtils.equalsIgnoreCase(sStat, "0") || StringUtils.equalsIgnoreCase(sStat, "2")) {
					logger.debug("Scan 데몬이 작동 중지(대기) 상태 입니다. ");
					continue;
				}
			
				nFileCount = ProcessFetch(connectionDest);
	
				if(nFileCount < nMaxPool) nMaxPool = nFileCount;
				
				// ExecutorService 인터페이스 구현객체 Executors 정적메서드를 통해 최대 스레드 개수가 2인 스레드 풀 생성 
				//ExecutorService executorService = Executors.newFixedThreadPool(20);
				ExecutorService executorService = Executors.newCachedThreadPool();
				
				Iterator<JobClass> iter = jobClassList.iterator();
				while (iter.hasNext()) {
					
					JobClass s = iter.next();
					
					final JobClass ss = s ;
					
					Runnable runnable = new Runnable() {
	
						@Override
						public void run() {
							try {
								connectionMng = conMgr.getConnection();
							} catch (DBPoolException e2) {
								// TODO Auto-generated catch block
								e2.printStackTrace();
							}
							try {
								cronJobStatus.SetJobStart(connectionMng, ss.getJobCd(), utilClass.getCurrentTime());
								processSub(connectionMng,ss);
								cronJobStatus.SetJobEnd  (connectionMng, ss.getJobCd(), utilClass.getCurrentTime());						
							} catch (Exception e) {
								try {
									cronJobStatus.SetJobStatus(connectionMng, s.getJobCd(), utilClass.getCurrentTime(), "E", "_"+e.getMessage());
								} catch (Exception e1) {
									e1.printStackTrace();
								}
								e.printStackTrace();
							}
							conMgr.freeConnection(connectionMng);
						}
					};
					
					//스레드풀에게 작업 처리 요청
					executorService.execute(runnable);
	
					//ExecutorService의 모든 작업 이후 다른 thread 호출을 1초 동안 차단합니다. 
					try {
						executorService.awaitTermination(1, TimeUnit.SECONDS);
					} catch (InterruptedException e) {
						e.printStackTrace();
					} 
				} // while (iter.hasNext())
	
				//스레드풀 종료
				executorService.shutdown();
				
				//ExecutorService 종료되었는지 확인.  
				while(!executorService.isTerminated()) {
					;;
				}
				logger.info( "[!]모든 Thread가 종료되었습니다.");  
				
				//ExecutorService의 모든 작업 이후 다른 thread 호출을  차단합니다. 
				try {
					Thread.sleep(1000 * nDelay);  
				} catch (InterruptedException e) {
					e.printStackTrace();
				} 					
				
			}// for(;;)
			
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
	}		
		
	
    @SuppressWarnings("unused")
	public static String GetDaemonStatus(Connection connection) throws SQLException {
    
    	Statement stmt = null;
    	ResultSet rs   = null;
    	String    sSelectQuery = null;
    	String    sDelayTime   = "0";
    	
		int nCnt      = 0;
		
		String sDaemonStat = "0";

		//logger.info( "[!]"대몬 상태를 확인합니다...");

		try {	
			stmt = connection.createStatement();
			
			sSelectQuery  = " SELECT DAEMON_ID, DAEMON_NM, DAEMON_STAT_CD, DELAY_TIME \n ";
			sSelectQuery += "   FROM TB_DAEMON  \n ";
			sSelectQuery += "  WHERE USE_YN = 'Y' \n ";
			sSelectQuery += "    AND DAEMON_NM = 'DaemonScan' \n ";
				
			//logger.debug("sQuery3 :" + sSelectQuery );
			
			rs = stmt.executeQuery(sSelectQuery); 
	
	        while(rs.next()){

	        	sDaemonStat = rs.getString("DAEMON_STAT_CD");
	        	sDelayTime  = rs.getString("DELAY_TIME");
	        	nCnt++;
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
			sSelectQuery += "   FROM TB_JOB  \n ";
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
	
    @SuppressWarnings("unused")
	public static void processSub(Connection connection, JobClass jobClass) {
    	
    	ArrayList<FileClass> fileClassList = new ArrayList<FileClass>(); 
    	
    	int nFileCnt = 0;
    	int nJobSeq  = 0;

    	logger.debug("No.:[" + jobClass.getJobId() + "::"  + jobClass.getServerId() + "::" + jobClass.getTableId()  + "::" + jobClass.getSourcePath() + "::" + jobClass.getSourceFile()+ "]" );
    	
    	nFileCnt = SearchInfoList(fileClassList, jobClass.getSourcePath(),"*");

        for(FileClass str:fileClassList) { 
        	
        	//logger.debug("No.:"  + jobClass.getJobCd()  + "[" + str.getFilesize()  + "]" + str.getFile() );
        	
        	try {
 				nJobSeq = ProcessScanner(connection, jobClass.getJobId(), jobClass.getSourcePath() + "\\" + str.getFile() );

				if("Y".equals(jobClass.getFilterYn())) {
					ProcessFilter (connection,  nJobSeq );
				}
				ProcessLoader (connection,  nJobSeq );

			} catch (SQLException e) {
				e.printStackTrace();
			} catch (Exception e) {
				e.printStackTrace();
			}
        }	
        
		try {
			Thread.sleep(1000 * 30);  //30초
		} catch (InterruptedException e) {
			e.printStackTrace();
		}         
        
		logger.debug("processSub ::"  + jobClass.getJobCd()  + " finished...." );
    }

	public static int ProcessScanner(Connection connection, String sJobId,  String sSourceFile) throws SQLException {
		int rtn   = 0;
		String gsCurrTime = null;
		
		try {	
			gsCurrTime = utilClass.getCurrentTime();
			rtn = SetScannerStat(connection, "S", Integer.parseInt(sJobId), 0, gsCurrTime, sSourceFile); 

			gsCurrTime = utilClass.getCurrentTime();
			SetScannerStat(connection, "E", Integer.parseInt(sJobId), rtn,  gsCurrTime, "");
			// To do
			SetScannerStat(connection, "F", Integer.parseInt(sJobId), rtn,  gsCurrTime, "");
    	} catch (Exception e) {
			   e.printStackTrace();
			   logger.error("error :" + e.getMessage() );
			   return -1;
		}		

		return rtn;
	}
	
	public static int ProcessFilter(Connection connection, int nJobSeq) throws SQLException {
		String gsCurrTime = null;
		
		try {	
			gsCurrTime = utilClass.getCurrentTime();
			SetFilterStat(connection, "S", nJobSeq,  gsCurrTime); 
			
			gsCurrTime = utilClass.getCurrentTime();
			SetFilterStat(connection, "E", nJobSeq,  gsCurrTime);
			// To do 
			gsCurrTime = utilClass.getCurrentTime();
			SetFilterStat(connection, "F", nJobSeq,  gsCurrTime);
    	} catch (Exception e) {
			   e.printStackTrace();
			   logger.error("error :" + e.getMessage() );
			   return -1;
		}		

		return 0;
	}	
	
	
	public static int ProcessLoader(Connection connection, int nJobSeq) throws SQLException {
		String gsCurrTime = null;
		
		try {	
			gsCurrTime = utilClass.getCurrentTime();
			SetLoaderStat(connection, "S", nJobSeq,  gsCurrTime); 
			//Thread.sleep(1000 * 1);  //2초
			
			gsCurrTime = utilClass.getCurrentTime();
			SetLoaderStat(connection, "E", nJobSeq,  gsCurrTime);
			//Thread.sleep(1000 * 1);  //2초
			
			gsCurrTime = utilClass.getCurrentTime();
			SetLoaderStat(connection, "F", nJobSeq,  gsCurrTime);
    	} catch (Exception e) {
			   e.printStackTrace();
			   logger.error("error :" + e.getMessage() );
			   return -1;
		}		

		return 0;
	}	
	
    public static int SearchInfoList(ArrayList<FileClass> fileClassList, String sSourceDir, String ext) {
    	
		SearchInfo(fileClassList, sSourceDir, ext);

        FileClassCompare fileClassCompare = new FileClassCompare();
        
        Collections.sort(fileClassList, fileClassCompare);

        return fileClassList.size();
	}
    
    
	
	public static void SearchInfo(ArrayList<FileClass> fileClassList, String sSourceDir, String ext) {

		File dir = new File(sSourceDir); 
		File[] fileList = dir.listFiles(); 
		long nSize = 0;
 		try{
			for(int i = 0 ; i < fileList.length ; i++){
				File file = fileList[i]; 
				if(file.isFile()){
					FileClass fileClass = new FileClass();
					String sExt = file.getName().substring( file.getName().lastIndexOf( "." ) + 1 );
					fileClass.setExtend(sExt);

					if(ext.equals(sExt) || ext.equals("*")) {
						fileClass.setFile(file.getAbsolutePath() );
						fileClass.setDate(file.lastModified()+"");
						//logger.debug("File:" + fileClass.getFile());
						
						if(file.length() <= 1024) {
							nSize = 1;
						} else { 
							nSize = file.length()/1024;
						}
						fileClass.setFilesize(nSize);
						fileClassList.add(fileClass);
					}
					
					
				} else if(file.isDirectory()){
					// 서브디렉토리가 존재하면 재귀적 방법으로 다시 탐색
					SearchInfo(fileClassList, file.getCanonicalPath().toString(), ext); 
				}
			}
		} catch (IOException e) {
			;;
		}  
 
		return ;
	}
	

	static class FileClassCompare implements Comparator<FileClass> { 
		@Override 
		public int compare(FileClass a, FileClass b) { 
			String as = a.getDate();
			String bs = b.getDate();

			return bs.compareTo(as); 
		} 
	}
	
	
	public static int SetScannerStat(Connection conn, String stat, int jobId ,int jobSeq , String JobTm, String SourceFile) {
		
		String insertSql = ""  ;
		String updateSql = ""  ;
		Statement stmt   = null;
		ResultSet keySet = null;
		int genKey = 0;		
		
		try {

			if ( StringUtils.equalsIgnoreCase(stat,"S")) {
				insertSql = "INSERT INTO TB_JOB_HISTORY (JOB_ID, JOB_TM, SOURCE_file, SOURCE_SIZE, SCAN_REG_TM, SCAN_STAT_CD) \n";
				insertSql = insertSql + "SELECT " + jobId + ", '" + JobTm + "', '" + SourceFile + "', 10000000 ,'" + utilClass.getCurrentTime()  + "','S' ";
	
				stmt = conn.createStatement();
				
//				logger.debug("SetScannerStat sql:" + insertSql);
				
				stmt.execute(insertSql, Statement.RETURN_GENERATED_KEYS);

				keySet = stmt.getGeneratedKeys();
				genKey = 0;
				
				if(keySet.next()){
					genKey=(int) keySet.getLong(1);
					jobSeq = genKey;
				}
			
			} else if ( StringUtils.equalsIgnoreCase(stat,"F")) {
				updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
				updateSql += "     SET SCAN_END_TM = '" + JobTm + "' \n";
				updateSql += "        ,SCAN_STAT_CD = 'F' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("setScannerStart sql:" + updateSql);
				stmt.execute(updateSql);

			} else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
				updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
				updateSql += "     SET SCAN_MSG_CD = '000' \n";
				updateSql += "        ,SCAN_MSG    = 'Error' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("SetScannerStat sql:" + updateSql);
				stmt.execute(updateSql);
			}
			
			stmt.close();
			
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
		return jobSeq;
	}
	
	public static int SetFilterStat(Connection conn, String stat, int jobSeq , String JobTm) {
		
		String updateSql = ""  ;
		Statement stmt   = null;
		
		try {

			if ( StringUtils.equalsIgnoreCase(stat,"S")) {
				updateSql  = "\nUPDATE TB_JOB_HISTORY \n";
				updateSql += "     SET FILTER_REG_TM = '" + JobTm + "' \n";
				updateSql += "        ,FILTER_STAT_CD = 'S' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("setScannerStart sql:" + updateSql);
				stmt.execute(updateSql);
				
			} else if ( StringUtils.equalsIgnoreCase(stat,"F")) {
				updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
				updateSql += "     SET FILTER_END_TM = '" + JobTm + "' \n";
				updateSql += "        ,FILTER_STAT_CD = 'F' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("setScannerStart sql:" + updateSql);
				stmt.execute(updateSql);

			} else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
				updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
				updateSql += "     SET FILTER_MSG_CD = '000' \n";
				updateSql += "        ,FILTER_MSG    = 'Error' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("SetScannerStat sql:" + updateSql);
				stmt.execute(updateSql);
			}
			
			stmt.close();
			
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
		return 0;
	}
	
	
	public static int SetLoaderStat(Connection conn, String stat, int jobSeq , String JobTm) {
		
		String updateSql = ""  ;
		Statement stmt   = null;
		
		try {

			if ( StringUtils.equalsIgnoreCase(stat,"S")) {
				updateSql  = "\nUPDATE TB_JOB_HISTORY \n";
				updateSql += "     SET LOAD_REG_TM = '" + JobTm + "' \n";
				updateSql += "        ,LOAD_STAT_CD = 'S' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("SetLoaderStat sql:" + updateSql);
				stmt.execute(updateSql);
				
			} else if ( StringUtils.equalsIgnoreCase(stat,"F")) {
				updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
				updateSql += "     SET LOAD_END_TM = '" + JobTm + "' \n";
				updateSql += "        ,LOAD_STAT_CD = 'F' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("SetLoaderStat sql:" + updateSql);
				stmt.execute(updateSql);

			} else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
				updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
				updateSql += "     SET LOAD_MSG_CD = '000' \n";
				updateSql += "        ,LOAD_MSG    = 'Error' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("SetLoaderStat sql:" + updateSql);
				stmt.execute(updateSql);
			}
			
			stmt.close();
			
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
		return 0;
	}
	
	
}
