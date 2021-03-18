package com.a1ck.daemon;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.a1ck.quarts.CronJobStatus;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;
import com.a1ck.util.DBPoolException;
import com.a1ck.util.UtilClass;

public class ScanDaemon {

    private static Logger logger = Logger.getLogger(ScanDaemon.class);
    static ConnectionManager conMgr = new ConnectionManagerAll4("postgresql"); 
    
    private static ArrayList<JobClass>  jobClassList  = new ArrayList<JobClass>(); 
    private static Connection connectionMng    = null; 
    private static Connection connectionDest   = null; 

    static UtilClass  utilClass = null;
    static CronJobStatus  cronJobStatus = null;

     
    static class FileClass {
        String file, date, extend;
        long filesize;
        InfoClass infoClass;
        
        public InfoClass getInfoClass() {
			return infoClass;
		}
		public void setInfoClass(InfoClass infoClass) {
			this.infoClass = infoClass;
		}

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

    	long jobId, serverId, tableId;
    	String jobCd, jobNm, sourcePath, sourceFile, infoPath, infoFile, jobLogPath, jobTm, separator, scheduleYn, sourceDelYn, lastColYn, useYn;
		public long getJobId() {
			return jobId;
		}
		public void setJobId(long jobId) {
			this.jobId = jobId;
		}
		public long getServerId() {
			return serverId;
		}
		public void setServerId(long serverId) {
			this.serverId = serverId;
		}
		public long getTableId() {
			return tableId;
		}
		public void setTableId(long tableId) {
			this.tableId = tableId;
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
		public String getInfoPath() {
			return infoPath;
		}
		public void setInfoPath(String infoPath) {
			this.infoPath = infoPath;
		}
		public String getInfoFile() {
			return infoFile;
		}
		public void setInfoFile(String infoFile) {
			this.infoFile = infoFile;
		}
		public String getJobLogPath() {
			return jobLogPath;
		}
		public void setJobLogPath(String jobLogPath) {
			this.jobLogPath = jobLogPath;
		}
		public String getJobTm() {
			return jobTm;
		}
		public void setJobTm(String jobTm) {
			this.jobTm = jobTm;
		}
		public String getSeparator() {
			return separator;
		}
		public void setSeparator(String separator) {
			this.separator = separator;
		}
		public String getScheduleYn() {
			return scheduleYn;
		}
		public void setScheduleYn(String scheduleYn) {
			this.scheduleYn = scheduleYn;
		}
		public String getSourceDelYn() {
			return sourceDelYn;
		}
		public void setSourceDelYn(String sourceDelYn) {
			this.sourceDelYn = sourceDelYn;
		}
		public String getLastColYn() {
			return lastColYn;
		}
		public void setLastColYn(String lastColYn) {
			this.lastColYn = lastColYn;
		}
		public String getUseYn() {
			return useYn;
		}
		public void setUseYn(String useYn) {
			this.useYn = useYn;
		}

        
    }
    
    
    static class InfoClass {
    	
        long jobId, serverId, tableId, fileSize, fileCount;
        String  tableNm, fileName;
        
		public long getJobId() {
			return jobId;
		}
		public void setJobId(long jobId) {
			this.jobId = jobId;
		}
		public long getServerId() {
			return serverId;
		}
		public void setServerId(long serverId) {
			this.serverId = serverId;
		}
		public long getTableId() {
			return tableId;
		}
		public void setTableId(long tableId) {
			this.tableId = tableId;
		}
		public long getFileSize() {
			return fileSize;
		}
		public void setFileSize(long fileSize) {
			this.fileSize = fileSize;
		}
		public long getFileCount() {
			return fileCount;
		}
		public void setFileCount(long fileCount) {
			this.fileCount = fileCount;
		}
		public String getTableNm() {
			return tableNm;
		}
		public void setTableNm(String tableNm) {
			this.tableNm = tableNm;
		}
		public String getFileName() {
			return fileName;
		}
		public void setFileName(String fileName) {
			this.fileName = fileName;
		}

        
    }
    
    
    public static void main(String[] args) {

        int nMaxPool   = 20;
        int nFileCount = 0 ;
        
        utilClass = new UtilClass();

        try {           
            
            logger.debug("ScanDaemon::main  start");
            
            connectionDest = conMgr.getConnection();
            logger.debug("ScanDaemon::main  connection database");

            cronJobStatus = new CronJobStatus();

            // 작업목록 읽어오기 JOB_MST
            nFileCount = ProcessFetch(connectionDest);
            logger.debug("nFileCount:"+nFileCount);
            
            // 작업목록에따른 pool사이즈 조정
            if(nFileCount < nMaxPool) nMaxPool = nFileCount;
            
            // ExecutorService 인터페이스 구현객체 Executors 정적메서드를 통해 최대 스레드 개수가 2인 스레드 풀 생성 
            ExecutorService executorService = Executors.newFixedThreadPool(20);
            
            //for(int j = 0; j < nMaxPool; j++) {
            Iterator<JobClass> iter = jobClassList.iterator();
            while  (iter.hasNext()) {
                
                JobClass job = iter.next();
                
                Runnable runnable = new Runnable() {

                    @Override
                    public void run() {
                        
                        try {
                            connectionMng = conMgr.getConnection();
                        } catch (DBPoolException e2) {
                            // 	
                            e2.printStackTrace();
                        }

                        String sCurrTime = null;

                        try {
                            sCurrTime = utilClass.getCurrentTime();
                            cronJobStatus.SetJobStart(connectionMng, job.getJobCd(), sCurrTime);

                            // 작업대상 파일 찾기 ( info파일을 찾아서 원본 파일 존재하는지 확인)
                            processSub(connectionMng, job);
                            
                            //logger.debug("[총 스레드 개수:" + poolSize + "] 작업 스레드 이름: "+threadName);
                            cronJobStatus.SetJobEnd(connectionMng, job.getJobCd(), sCurrTime);                        
                        } catch (Exception e) {
                            try {
                            	logger.debug("오류: "+e.getMessage()+ " ");
                                cronJobStatus.SetJobStatus(connectionMng, job.getJobCd(), sCurrTime,"E",e.getMessage()+ " ");
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
                //executorService.submit(runnable);

                //ExecutorService의 모든 작업 이후 다른 thread 호출을 1초 동안 차단합니다. 
                try {
                    executorService.awaitTermination(1, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } 
            }

            //스레드풀 종료
            executorService.shutdown();
            
            //ExecutorService 종료되었는지 확인.  
            while(!executorService.isTerminated()) {
                ;;
            }
            logger.info("모든 Thread가 종료되었습니다."); 
            
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
        
    
    /*
     * 작업목록 읽어오기 JOB_MST
     */
    public static int ProcessFetch(Connection connection) throws SQLException {
    
        logger.debug("ScanDaemon::ProcessFetch  start..");

        Statement stmt = null;
        ResultSet rs   = null;
        String    sSelectQuery = null;
        
        int nCnt      = 0;
        
        long   nJobId 		= 0;
        long   nServerId 	= 0;
        long   nTableId 	= 0;
        String sJobCd		= null;
        String sJobNm		= null;
        String sSourcePath	= null;
        String sSourceFile	= null;
        String sInfoPath	= null;
        String sInfoFile	= null;
        String sJobLogPath	= null;
        String sJobTm		= null;
        String sSeparator	= null;
        String sScheduleYn	= null;
        String sSourceDelYn	= null;
        String sLastColYn	= null;
        

        try {   
            stmt = connection.createStatement();
            
            sSelectQuery  = " SELECT JOB_ID,SERVER_ID,TABLE_ID,JOB_CD,JOB_NM,SOURCE_PATH,SOURCE_FILE,INFO_PATH,INFO_FILE,JOB_LOG_PATH,JOB_TM,SEPARATOR,SCHEDULE_YN,SOURCE_DEL_YN,LAST_COL_YN  \n ";
            sSelectQuery += "   FROM TB_JOB_MST  \n ";
            sSelectQuery += "  WHERE USE_YN = 'Y' \n ";
                
            logger.debug("sQuery3 :" + sSelectQuery );
            
            rs = stmt.executeQuery(sSelectQuery); 
    
            while(rs.next()){

                nJobId 		 = rs.getLong  ("JOB_ID");
                nServerId 	 = rs.getLong  ("SERVER_ID");
                nTableId 	 = rs.getLong  ("TABLE_ID");
                sJobCd 		 = rs.getString("JOB_CD");
                sJobNm 		 = rs.getString("JOB_NM");
                sSourcePath  = rs.getString("SOURCE_PATH");
                sSourceFile  = rs.getString("SOURCE_FILE");
                sInfoPath 	 = rs.getString("INFO_PATH");
                sInfoFile 	 = rs.getString("INFO_FILE");
                sJobLogPath  = rs.getString("JOB_LOG_PATH");
                sJobTm 		 = rs.getString("JOB_TM");
                sSeparator 	 = rs.getString("SEPARATOR");
                sScheduleYn  = rs.getString("SCHEDULE_YN");
                sSourceDelYn = rs.getString("SOURCE_DEL_YN");
                sLastColYn 	 = rs.getString("LAST_COL_YN");
                nCnt++;

                JobClass jobClass    = new JobClass();
                jobClass.jobId 		= nJobId 		;	
                jobClass.serverId 	= nServerId 	;
                jobClass.tableId 	= nTableId 		;
                jobClass.jobCd 		= sJobCd		;
                jobClass.jobNm 		= sJobNm		;
                jobClass.sourcePath = sSourcePath	;
                jobClass.sourceFile = sSourceFile	;
                jobClass.infoPath 	= sInfoPath		;
                jobClass.infoFile 	= sInfoFile		;
                jobClass.jobLogPath = sJobLogPath	;
                jobClass.jobTm 		= sJobTm		;
                jobClass.separator 	= sSeparator	;
                jobClass.scheduleYn = sScheduleYn	;
                jobClass.sourceDelYn = sSourceDelYn	;
                jobClass.lastColYn 	= sLastColYn	;
                jobClassList.add(jobClass);
                
                logger.debug("nJobId      :" + nJobId  );
                logger.debug("nServerId   :" + nServerId  );
                logger.debug("nTableId    :" + nTableId  );
                logger.debug("sJobCd      :" + sJobCd  );
                logger.debug("sJobNm      :" + sJobNm  );
                logger.debug("sSourcePath :" + sSourcePath  );
                logger.debug("sSourceFile :" + sSourceFile  );
                logger.debug("sInfoPath   :" + sInfoPath  );
                logger.debug("sInfoFile   :" + sInfoFile  );
                logger.debug("sJobLogPath :" + sJobLogPath  );
                logger.debug("sJobTm      :" + sJobTm  );
                logger.debug("sSeparator  :" + sSeparator  );
                logger.debug("sScheduleYn :" + sScheduleYn  );
                logger.debug("sSourceDelYn:" + sSourceDelYn  );
                logger.debug("sLastColYn  :" + sLastColYn  );

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
        
        // info 파일 찾기
        nFileCnt = SearchInfoList(fileClassList, jobClass);
        logger.debug("SearchInfoList Count:" + nFileCnt );

        if (nFileCnt > 0 ) { 	
        	
	        for(FileClass str:fileClassList) {
	            
	            logger.debug("file :["  + jobClass.getJobCd() +"]" + str.getFile()  + ":" + str.getDate()  + "(" + str.getFilesize()  + ")");
	            
	            try {
	            	// 원본 파일 찾기
	                nJobSeq = ProcessScanner(connection, str, jobClass );
	
	            	// 상태기록
//	                nJobSeq = ProcessScanner(connection, jobClass, str );
	
	            } catch (SQLException e) {
	                e.printStackTrace();
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	        }   
        }
        
        /****
        try {
            Thread.sleep(1000 * 60 * 2);  //2분
        } catch (InterruptedException e) {
            e.printStackTrace();
        }    
        ****/     
        
        logger.debug("processSub ::"  + jobClass.getJobCd()  + " finished...." );
    }

    public static int CheckJobHistory(Connection connection, JobClass jobClass, FileClass fileClass,String sSourceFile) throws SQLException {
        logger.debug("ScanDaemon::CheckJobHistory  start..");

        PreparedStatement pstmt = null;
        ResultSet rs   = null;
        String    sSelectQuery = null;
       
        long   nServerId   = 0;
        long   nJobId      = 0;
        long   nSourceSize = 0;
        String sSourceDttm = null;
        int    nCount      = -1;
        
        logger.debug("sSourceFile :" + sSourceFile );
        
        nServerId   = jobClass.getServerId();
        nJobId      = jobClass.getJobId();
        sSourceDttm = fileClass.getDate();
        nSourceSize = fileClass.getFilesize();        

        try {   
            
            sSelectQuery  = " SELECT COUNT(*) as Count \n ";
            sSelectQuery += "   FROM TB_JOB_history  \n ";
            sSelectQuery += "  WHERE SERVER_ID = " + nServerId + " \n ";
            sSelectQuery += "    AND JOB_ID = " + nJobId + " \n ";
            sSelectQuery += "    AND SOURCE_FILE = '" + sSourceFile + "' \n ";
            sSelectQuery += "    AND SOURCE_FILE_DTTM = '" + sSourceDttm + "' \n ";
            sSelectQuery += "    AND SOURCE_SIZE = " + nSourceSize + " \n ";
            
            pstmt = connection.prepareStatement(sSelectQuery);
            
            logger.debug("sQuery3 :" + sSelectQuery );
            //logger.debug("sQuery3 nServerId:" + nServerId );
            //logger.debug("sQuery3 nJobId:" + nJobId );
            //logger.debug("sQuery3 sSourceFile:" + sSourceFile );
            //logger.debug("sQuery3 sSourceDttm:" + sSourceDttm );
            //logger.debug("sQuery3 nSourceSize:" + nSourceSize );
/***
            pstmt.setLong  (1,nServerId);
            pstmt.setLong  (2,nJobId);
            pstmt.setString(3,sSourceFile);
            pstmt.setString(4,sSourceDttm);
            pstmt.setLong  (5,nSourceSize);
            ***/
            rs = pstmt.executeQuery(); 
    
            while(rs.next()){
            	nCount      = rs.getInt("Count");
            }
            logger.debug("nCount :" + nCount  );
            
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try{
                if(pstmt != null)
                    pstmt.close();
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        
        return nCount;
    }
    
    
	/*
	 *  원본 파일 찾기
	 */
    public static int ProcessScanner(Connection connection, FileClass fileClass, JobClass jobClass) throws SQLException {
        int rtn   = 0;
        int nChk = 0;
        
        String gsCurrTime = null;
//        String fileNameOnly = fileClass.getFile().substring(0, fileClass.getFile().lastIndexOf( "." ) );
        String sSourceExt = jobClass.getSourceFile().substring(jobClass.getSourceFile().lastIndexOf( "." ) + 1);
        String sSourceFile = fileClass.getFile().substring(0, fileClass.getFile().lastIndexOf( "." )) + "." + sSourceExt;
        String sSourceFullFile = jobClass.getSourcePath() + "\\" + sSourceFile ;

        logger.debug("sSourceExt      :" + sSourceExt + "::" + fileClass.getFile().lastIndexOf( "." ) + 1);
        logger.debug("sSourceFile     :" + sSourceFile );
        logger.debug("sSourceFullFile :" + sSourceFullFile );

        /***
        //fileClass.setFile(sSourceFile);
        
        logger.debug("jobClass.getSourceFile()      :" + jobClass.getSourceFile() );
        ***/
       // long   nJobId = jobClass.getJobId();
        
        try {   
        	
        	// 원본 파일 존재여부 확인 (생성일자, 크기)  
        	 nChk = CheckSourceFile(fileClass, sSourceFile, sSourceFullFile);

            if(nChk == 0) {
	            // job_history 파일에 같은 파일이 존재 하면 SKIP 
	        	nChk = CheckJobHistory(connection, jobClass, fileClass, sSourceFile);
	            logger.debug("history 중복여부:" + nChk );
	
	        	// Layout Check 
	            //nChk = CheckLayout(connection,jobClass, fileClass);
	            //logger.debug("Layout heck:" + nFileCnt );
	            
	            if(nChk == 0) {
	            	logger.debug("____debug_________");
		            gsCurrTime = utilClass.getCurrentTime();
		            try {   
		            	// job_history 파일에 row 생성
		            	rtn = SetScannerStat(connection, "S", jobClass, 0, gsCurrTime, fileClass); 
		            	logger.debug("____debug_________:" + rtn);

		            	if(rtn >= 0) {
			            	logger.debug("____debug_________");
		            		// info 파일 변경 info -> Tag
		            		try {
		            			String infoFromFile = jobClass.getInfoPath()+"\\" + fileClass.getInfoClass().getFileName();
		            			String infoToFile   = jobClass.getInfoPath()+"\\" + fileClass.getInfoClass().getFileName().substring(0, fileClass.getInfoClass().getFileName().lastIndexOf( "." ))+".tag";
		            			logger.debug("infoFromFile :" + infoFromFile );
		            			logger.debug("infoToFile   :" + infoToFile );
		            		    FileUtils.moveFile(FileUtils.getFile(infoFromFile), FileUtils.getFile(infoToFile));
		            		} catch (IOException e) {
		            		    e.printStackTrace();
		            		}		            		
		            	}
		            	
			            gsCurrTime = utilClass.getCurrentTime();
			            SetScannerStat(connection, "F", jobClass, rtn,  gsCurrTime, fileClass);
		            } catch (Exception e) {
		                e.printStackTrace();
		                gsCurrTime = utilClass.getCurrentTime();
		                SetScannerStat(connection, "E", jobClass, rtn,  gsCurrTime, fileClass);
		                logger.error("error :" + e.getMessage() );
		                return -1;
		            }
	            }
            }
        } catch (Exception e) {
               e.printStackTrace();
               logger.error("error :" + e.getMessage() );
               return -1;
        }       
        
        return rtn;
    }
    
   
    public static int CheckSourceFile(FileClass fileClass, String sSourcelFile, String sSourceFullFile)  {
    	
    	SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmmss");

        logger.debug("sSourceFullFile :" + sSourceFullFile );
        
    	//String fileNameOnly1 = FilenameUtils.getBaseName(fileClass.getFile());
    	File f = new File(sSourceFullFile);
    	logger.debug( "sSourceFullFile:" + sSourceFullFile);
    	
    	if(f.exists()) {
    		fileClass.setDate(sf.format(f.lastModified()));
    		fileClass.setFilesize(f.length());
    		fileClass.setFile(sSourcelFile);
    		return 0;
    	} else
    		return -1;
    }
    
    public static int SearchInfoList(ArrayList<FileClass> fileClassList, JobClass jobClass) {
        
    	String sSourceDir  = null;
    	String sInfoDir    = null;

    	sSourceDir  = jobClass.getSourcePath();
    	sInfoDir    = jobClass.getInfoPath();
    	
    	String sFileNameOnly = jobClass.getSourceFile().substring(0, jobClass.getSourceFile().lastIndexOf( "." ) );
    	
    	//logger.debug( "sSourceDir   :" + sSourceDir   );
    	//logger.debug( "sFileNameOnly:" + sFileNameOnly);
    	//logger.debug( "sInfoDir     :" + sInfoDir     );
    	
       	if ( StringUtils.isBlank(sInfoDir)) {
       		sInfoDir = sSourceDir;       
       		jobClass.setInfoPath(sInfoDir);
        }
    	
        SearchInfo(fileClassList, sInfoDir, sFileNameOnly, "info");

        FileClassCompare fileClassCompare = new FileClassCompare();
        
        Collections.sort(fileClassList, fileClassCompare);

        return fileClassList.size();
    }
    
    
    
    public static void SearchInfo(ArrayList<FileClass> fileClassList,  String sInfoDir,  String sSource,  String ext) {

        File dir = new File(sInfoDir); 
        
        File[] fileList = dir.listFiles(); 
        /***
        File[] fileList = dir.listFiles(new FileFilter() {
        	@Override
        	public boolean accept(File file) {
        		return file.getName().startsWith(sSource)|| file.isDirectory();
        	}
        }); 
        ***/
        
        long nSize = 0;
        
        String sExt = null;
        String sFileName = null;
        //String sFileOnly = null;        
        SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmmss");

        try{
            
            if (fileList != null ) { 
	            for(int i = 0 ; i < fileList.length ; i++){
	                File file = fileList[i]; 
	                if(file.isFile()) {
	                    FileClass fileClass = new FileClass();
	                    InfoClass infoClass = new InfoClass();
	                    
	                    sFileName = file.getName();
	                    //sFileOnly = sFileName.substring( 0, sFileName.lastIndexOf( "." ) );
	                    sExt = sFileName.substring( sFileName.lastIndexOf( "." ) + 1 );
                        //logger.debug("sSource :" + sSource );
                        //logger.debug("file.getAbsolutePath() :" + file.getAbsolutePath() );
                        //logger.debug("file.getName() :" + file.getName() );
                        //logger.debug("sFileFullName :" + sFileName );
                        //logger.debug("sFileOnly :" + sFileOnly );
                        //logger.debug("sExt  :" + sExt);
	                    fileClass.setExtend(sExt);
	
	                    if(ext.equals(sExt)) {
	                    	
	                    	Pattern p = Pattern.compile(sSource);
	                    	Matcher m = p.matcher(sFileName);
	                    	//source 파일명으로 구성된 파일인지 확인
	                    	if(m.find()) {
		                        fileClass.setFile(file.getName()) ;
		                        fileClass.setDate(sf.format(file.lastModified()));
		                        logger.debug("file found :" + file.getName() + " :: " + sf.format(file.lastModified()) );
		                        
		                        if(file.length() <= 1024) {
		                            nSize = 1;
		                        } else { 
		                            nSize = file.length() / 1024;
		                        }
		                        fileClass.setFilesize(nSize);
		                        infoClass.setFileName(sFileName);
		                        fileClass.setInfoClass(infoClass);
		                        
		                        fileClassList.add(fileClass);
	                    	}
	                    } else {
	                    	//logger.debug("file not found :" + file.getAbsolutePath());
	                    }
	                    
	                } else if(file.isDirectory()){
	                    // 서브디렉토리가 존재하면 재귀적 방법으로 다시 탐색
	                    SearchInfo(fileClassList, file.getCanonicalPath().toString(), sSource, ext); 
	                }
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
    
    
    public static int SetScannerStat(Connection conn, String stat, JobClass jobClass ,int jobSeq , String JobTm, FileClass fileClass ) { 
//    public static int SetScannerStat(Connection conn, String stat, JobClass jobClass ,int jobSeq , String JobTm, String SourceFile, String SourceFileDttm, long FileSize) { fileClass
        
        String insertSql = ""  ;
        String updateSql = ""  ;
        Statement stmt   = null;
        ResultSet keySet = null;
        int genKey = 0;     
        
        try {

            if ( StringUtils.equalsIgnoreCase(stat,"S")) {
                insertSql = "INSERT INTO TB_JOB_HISTORY (JOB_ID, MDFY_SEQ, SERVER_ID, TABLE_ID, JOB_TM, SOURCE_FILE, SOURCE_FILE_DTTM, SOURCE_SIZE, SCAN_REG_TM, SCAN_STAT_CD) \n";
                insertSql = insertSql + "SELECT " + jobClass.getJobId() + ", 0, " + jobClass.getServerId() + ", " + jobClass.getTableId() + ", '" + JobTm + "', '" + fileClass.getFile() + "', '" + fileClass.getDate() + "', " + fileClass.getFilesize() + " ,'" + utilClass.getCurrentTime()  + "','S' ";
    
                logger.debug("insertSql:" + insertSql);
                
                stmt = conn.createStatement();
                
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
    
                logger.debug("insertSql:" + updateSql);

                stmt = conn.createStatement();
                
//              logger.debug("setScannerStart sql:" + updateSql);
                stmt.execute(updateSql);

            } else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
                updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
                updateSql += "     SET SCAN_MSG_CD = '000' \n";
                updateSql += "        ,SCAN_MSG    = 'Error' \n";
                updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
    
                logger.debug("insertSql:" + updateSql);
                
                stmt = conn.createStatement();
                
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
                
//              logger.debug("setScannerStart sql:" + updateSql);
                stmt.execute(updateSql);
                
            } else if ( StringUtils.equalsIgnoreCase(stat,"F")) {
                updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
                updateSql += "     SET FILTER_END_TM = '" + JobTm + "' \n";
                updateSql += "        ,FILTER_STAT_CD = 'F' \n";
                updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
    
                stmt = conn.createStatement();
                
//              logger.debug("setScannerStart sql:" + updateSql);
                stmt.execute(updateSql);

            } else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
                updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
                updateSql += "     SET FILTER_MSG_CD = '000' \n";
                updateSql += "        ,FILTER_MSG    = 'Error' \n";
                updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
    
                stmt = conn.createStatement();
                
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
                
//              logger.debug("SetLoaderStat sql:" + updateSql);
                stmt.execute(updateSql);
                
            } else if ( StringUtils.equalsIgnoreCase(stat,"F")) {
                updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
                updateSql += "     SET LOAD_END_TM = '" + JobTm + "' \n";
                updateSql += "        ,LOAD_STAT_CD = 'F' \n";
                updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
    
                stmt = conn.createStatement();
                
//              logger.debug("SetLoaderStat sql:" + updateSql);
                stmt.execute(updateSql);

            } else if ( StringUtils.equalsIgnoreCase(stat,"E")) {
                updateSql  = "\nUPDATE TB_JOB_HISTORY  \n";
                updateSql += "     SET LOAD_MSG_CD = '000' \n";
                updateSql += "        ,LOAD_MSG    = 'Error' \n";
                updateSql += "   WHERE JOB_SEQ = " + jobSeq + " \n";
    
                stmt = conn.createStatement();
                
//              logger.debug("SetLoaderStat sql:" + updateSql);
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
