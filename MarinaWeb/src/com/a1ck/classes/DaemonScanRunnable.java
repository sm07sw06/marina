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

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.a1ck.classes.DaemonScanClasses.FileClass;
import com.a1ck.classes.DaemonScanClasses.JobClass;
import com.a1ck.quarts.CronJobStatus;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.DBPoolException;
import com.a1ck.util.UtilClass;


public 	class DaemonScanRunnable implements  Runnable {

	private static Logger logger = Logger.getLogger(DaemonScanRunnable.class);
	static ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
	
	private static Connection connection    = null; 
	private static Connection connectionMng = null; 

	static UtilClass  utilClass = null;
	static CronJobStatus  cronJobStatus = null;
	
	private JobClass jobClass__;
		
 	public DaemonScanRunnable(JobClass jobClass) {
		this.jobClass__ = jobClass;
		utilClass = new UtilClass();
	}
	
	@Override
	public void run() {
		
		//while(!Thread.currentThread().isInterrupted()){
			try {
				processSub(jobClass__);
			} catch (Exception e) {
				e.printStackTrace();
			}
		//}
	}
	
	public static void processSub(JobClass jobClass) {
		
		ArrayList<FileClass> fileClassList = null;; 
		try {
			connection    = conMgr.getConnection();
			connectionMng = conMgr.getConnection();
		} catch (DBPoolException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
		
		int nJobSeq  = 0;
		int nCount   = 0;
		
		logger.debug("Job [" + jobClass.getJobId() + "::"  + jobClass.getServerId() + "::" + jobClass.getTableId()  + "::" + jobClass.getSourcePath() + "::" + jobClass.getSourceFile()+ "]" );
		
		try {
			
			fileClassList = new ArrayList<FileClass>(); 
			fileClassList.clear();
			logger.debug("..count1 :::"  + fileClassList.size() );

			cronJobStatus = new CronJobStatus();
			cronJobStatus.SetJobStart(connectionMng , jobClass.getJobCd(), utilClass.getCurrentTime());

			nCount = SearchInfoList(fileClassList, jobClass.getSourcePath(),"*");
			logger.debug("..count3 :::"  + fileClassList.size() + ":::" + nCount);
			
		    for(FileClass str:fileClassList) { 
		    	
		    	logger.debug("..DATA:"  + jobClass.getJobCd()  + "[" + str.getFilesize()  + "]" + str.getFile() );

				nJobSeq = ProcessScanner(connection, jobClass.getJobId(), jobClass.getSourcePath() + "\\" + str.getFile() );

				if("Y".equals(jobClass.getFilterYn())) {
					ProcessFilter (connection,  nJobSeq );
				}
				
				ProcessLoader (connection,  nJobSeq );
		
		    }	
			
		    cronJobStatus.SetJobEnd  (connectionMng , jobClass.getJobCd(), utilClass.getCurrentTime());						
			
			if (connection != null)
				try {
					conMgr.freeConnection(connection);
				} catch (Exception e) {
					logger.error(e.getMessage());
					e.printStackTrace();
				} 
			
		} catch (Exception e) {
			try {
				cronJobStatus.SetJobStatus(connectionMng, jobClass.getJobCd(), utilClass.getCurrentTime(), "E", "ERROR");
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}         
	    
		if (connectionMng != null)
			try {
				conMgr.freeConnection(connectionMng);
			} catch (Exception e) {
				logger.error(e.getMessage());
				e.printStackTrace();
			} 
		
		logger.debug("processSub ::"  + jobClass.getJobCd()  + " finished...." );
	}


	public static int ProcessScanner(Connection connection, String sJobId,  String sSourceFile) throws SQLException {
		int jobSeq   = 0;
		String gsCurrTime = null;
		
		try {	
			gsCurrTime = utilClass.getCurrentTime();
			jobSeq = SetScannerStat(connection, "S", Integer.parseInt(sJobId), 0, gsCurrTime, sSourceFile); 

			// To do
			
			
			
			SetScannerStat(connection, "F", Integer.parseInt(sJobId), jobSeq,  gsCurrTime, "");
    	} catch (Exception e) {
			   e.printStackTrace();
			   gsCurrTime = utilClass.getCurrentTime();
			   SetScannerStat(connection, "E", Integer.parseInt(sJobId), jobSeq,  gsCurrTime, "");
			   logger.error("error :" + e.getMessage() );
			   return -1;
		}		

		return jobSeq;
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
				insertSql = "INSERT INTO MDDB.TB_JOB_HISTORY (JOB_ID, JOB_TM, SOURCE_file, SOURCE_SIZE, SCAN_REG_TM, SCAN_STAT_CD) \n";
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
				updateSql  = "\nUPDATE MDDB.TB_JOB_HISTORY  \n";
				updateSql += "     SET SCAN_END_TM = '" + JobTm + "' \n";
				updateSql += "        ,SCAN_STAT_CD = 'F' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("setScannerStart sql:" + updateSql);
				stmt.execute(updateSql);

			} else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
				updateSql  = "\nUPDATE MDDB.TB_JOB_HISTORY  \n";
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
				updateSql  = "\nUPDATE MDDB.TB_JOB_HISTORY \n";
				updateSql += "     SET FILTER_REG_TM = '" + JobTm + "' \n";
				updateSql += "        ,FILTER_STAT_CD = 'S' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("setScannerStart sql:" + updateSql);
				stmt.execute(updateSql);
				
			} else if ( StringUtils.equalsIgnoreCase(stat,"F")) {
				updateSql  = "\nUPDATE MDDB.TB_JOB_HISTORY  \n";
				updateSql += "     SET FILTER_END_TM = '" + JobTm + "' \n";
				updateSql += "        ,FILTER_STAT_CD = 'F' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("setScannerStart sql:" + updateSql);
				stmt.execute(updateSql);

			} else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
				updateSql  = "\nUPDATE MDDB.TB_JOB_HISTORY  \n";
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
				updateSql  = "\nUPDATE MDDB.TB_JOB_HISTORY \n";
				updateSql += "     SET LOAD_REG_TM = '" + JobTm + "' \n";
				updateSql += "        ,LOAD_STAT_CD = 'S' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("SetLoaderStat sql:" + updateSql);
				stmt.execute(updateSql);
				
			} else if ( StringUtils.equalsIgnoreCase(stat,"F")) {
				updateSql  = "\nUPDATE MDDB.TB_JOB_HISTORY  \n";
				updateSql += "     SET LOAD_END_TM = '" + JobTm + "' \n";
				updateSql += "        ,LOAD_STAT_CD = 'F' \n";
				updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
	
				stmt = conn.createStatement();
				
//				logger.debug("SetLoaderStat sql:" + updateSql);
				stmt.execute(updateSql);

			} else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
				updateSql  = "\nUPDATE MDDB.TB_JOB_HISTORY  \n";
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
	