package com.a1ck.quarts;

import java.sql.Connection;
import java.sql.PreparedStatement;

import org.apache.log4j.Logger;

public class CronJobStatus {
	
	public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
    
	public CronJobStatus() throws Exception {
		super(); 

	}

	public void SetJobStart(Connection connectionMng, String job_cd,  String dataTime ) throws Exception
	{
		
		logger.debug("SetJobStart::job_cd  :" + job_cd );
		//logger.debug("SetJobStart::job_cd  :" + job_cd );
		//logger.debug("SetJobStart::dataTime:" + dataTime );
		
		try
		{
			String insertSql = "\nINSERT INTO MDDB.TB_JOB_STATUS (JOB_CD, JOB_STATUS_CD, JOB_MSG, JOB_START,  lastupdatetime)  \n";
			insertSql = insertSql + " SELECT  ?,  'S', 'JOB STARTED', to_timestamp(?,'yyyymmddhh24miss'),  now() ";

			PreparedStatement pstmt = connectionMng.prepareStatement(insertSql);
			pstmt.setString(1, job_cd  );						
			pstmt.setString(2, dataTime);	
			
			//logger.debug("SetJobStatus ::" + insertSql );
			
			pstmt.executeUpdate(); 
			pstmt.close();
			 
//			//logger.debug("SetStartJob:" );
		}
		catch (Exception e)
		{ 
			logger.error(e.getMessage());
			throw e;		
		}	
	}

	public void SetJobEnd(Connection connectionMng, String job_cd, String dataTime ) throws Exception
	{

		logger.debug("SetJobEnd::job_cd  :" + job_cd );
		//logger.debug("SetJobEnd::job_cd  :" + job_cd );
		//logger.debug("SetJobEnd::dataTime:" + dataTime );
		
		try
		{
			String updateSql = "\nUPDATE MDDB.TB_JOB_STATUS   \n";
			updateSql = updateSql + "  SET JOB_STATUS_CD = 'F'  			\n";   
			updateSql = updateSql + "     ,JOB_MSG    = 'JOB COMPLETED' \n";   
			updateSql = updateSql + "     ,JOB_END    = now()           \n";   
			updateSql = updateSql + "WHERE 1 = 1 						\n";   
			updateSql = updateSql + "  AND JOB_CD     = ?  				\n";   
			updateSql = updateSql + "  AND JOB_START  = to_timestamp(?,'yyyymmddhh24miss')  \n";   
			
			PreparedStatement pstmt = connectionMng.prepareStatement(updateSql);
			pstmt.setString(1, job_cd);						
			pstmt.setString(2, dataTime);
			
			//logger.debug("SetJobStatus ::" + updateSql );
			
			pstmt.executeUpdate(); 
			pstmt.close();
			
//			//logger.debug("SetEndJob:" );
		}
		catch (Exception e)
		{
			throw e;		
		}	
	}
	
	public void SetJobStatus(Connection connectionMng, String job_cd, String dataTime, String status, String msg) throws Exception
	{
		//logger.debug("SetJobStatus::status  :" + status );
		//logger.debug("SetJobStatus::msg     :" + msg );
		//logger.debug("SetJobStatus::job_cd  :" + job_cd );
		//logger.debug("SetJobStatus::dataTime:" + dataTime );
		
		try
		{
			
			////logger.debug("SetJobStatus:" + dataTime );
			//System.out.println("SetJobStatus:" + dataTime );
			
			String updateSql = "\nUPDATE MDDB.TB_JOB_STATUS \n";
			updateSql = updateSql + "  SET JOB_STATUS_CD = ? \n";   
			updateSql = updateSql + "     ,JOB_MSG    = ? \n";   
			updateSql = updateSql + "WHERE 1 = 1 		  \n";   
			updateSql = updateSql + "  AND JOB_CD     = ? \n";   
			updateSql = updateSql + "  AND JOB_START  = to_timestamp(?,'yyyymmddhh24miss')  \n";   
			
			PreparedStatement pstmt = connectionMng.prepareStatement(updateSql);
			pstmt.setString(1, status  );						
			pstmt.setString(2, msg     );						
			pstmt.setString(3, job_cd  );						
			pstmt.setString(4, dataTime);	 
			
			//logger.debug("SetJobStatus ::" + updateSql );
			
			pstmt.executeUpdate(); 
			pstmt.close();
    		 
			//logger.debug("SetJobStatus:" );
		}
		catch (Exception e)
		{
			throw e;		
		}	
	}
		
}

