package com.a1ck.quarts;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class CronImplementsQuartz implements Job {
	
	public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
		
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
    	
    	//logger.debug("Entering1...." );  

    	JobDataMap dataMap = jobExecutionContext.getJobDetail().getJobDataMap();
    	//logger.debug("Entering...." + dataMap.toString());  
    	String jobSays = dataMap.getString("class");
 
    	//logger.debug("Entering...." + jobSays);  

    	CronScheduleDbmsConnector cronScheduleDbmsConnector = new CronScheduleDbmsConnector(jobSays);
    	cronScheduleDbmsConnector.submit(jobSays);  
    }


}
 