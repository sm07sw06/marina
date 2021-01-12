package com.a1ck.quarts;

import static org.quartz.CronScheduleBuilder.cronSchedule;

import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

import com.a1ck.util.UtilClass;
import com.a1ck.util.UtilClass.ClassIni;
import com.a1ck.util.UtilClass.ClassSchedule;
	
public class CronQuartzScheduler implements ServletContextListener  {
	ServletContext sc = null;
	
	public Logger logger = Logger.getLogger(this.getClass().getName()+".class");

	static JobDetail jobdetail; 
	static CronTrigger crontrigger; 

	static boolean bDev = false;
	   
	static String cronJob = null; 
	static String sCronFileName = null;
	
	UtilClass  utilClass = null;
	ClassIni classIni = null;
	
	private void init_env() 
	{
		/*try {
        	String strIP = Inet4Address.getLocalHost().getHostAddress();
			logger.debug("IP Head:" + strIP.substring(0,3));
        } catch (UnknownHostException e2) {
			e2.printStackTrace();
			logger.error("sCronFileName:" + e2.getMessage());
		} catch (SecurityException e1) {
			e1.printStackTrace();
			logger.error("sCronFileName:" + e1.getMessage());
		}*/
	}

	public void CronQuartzInit() throws SchedulerException {

		utilClass = new UtilClass();
		
		SchedulerFactory schfa = new StdSchedulerFactory();
		Scheduler sch = schfa.getScheduler();
		
		init_env();
		
		try {
			
			ArrayList<ClassSchedule> arryList =  utilClass.getIniSchedule();
			
			String job_id       = null;
			String job_schedule = null;
			
			int i = 0;
			for(i=0;i<arryList.size();i++) {				
				job_id       = arryList.get(i).getJob_cd();
				job_schedule = arryList.get(i).getJob_schedule();

				logger.info("**** schedule(" + job_id + ") : " + job_schedule);
				
				jobdetail = JobBuilder.newJob(CronImplementsQuartz.class).withIdentity("cronjob" + i, "crongroup1" ).usingJobData("class", job_id).build();
				crontrigger = (CronTrigger) TriggerBuilder.newTrigger().withIdentity("trigger" + i, "crongroup1" ).withSchedule(cronSchedule(job_schedule)).build();
				sch.scheduleJob(jobdetail, crontrigger);
			}
			sch.start();

		} catch (Exception e) {
				logger.error("CronQuartzScheduler: " + e.getMessage());
				e.getStackTrace();
			    System.err.println(e); 
			    System.exit(1);
			}
	}
	
	
	public void contextInitialized(ServletContextEvent e)
	{
        sc = e.getServletContext();
		sc.setAttribute("Data", "Value");
		
		try {

			CronQuartzInit();

			/*// Grab the Scheduler instance from the Factory
            Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();

            // and start it off
            scheduler.start();

         // define the job and tie it to our HelloJob class
            JobDetail job = newJob(CronImplementsQuartz.class)
    	    .withIdentity("job1", "group1")
    	    .build();

	    	CronTrigger trigger = newTrigger()
	    	    .withIdentity("trigger1", "group1")
	    	    .withSchedule(cronSchedule("0/20 * * * * ?"))
	    	    .build();

            // Tell quartz to schedule the job using our trigger
            scheduler.scheduleJob(job, trigger);            
            */
           // scheduler.shutdown();

        } catch (SchedulerException se) {
            se.printStackTrace();
        }
		
	}

	public void contextDestroyed(ServletContextEvent e) 
	{
		sc.setAttribute("Data", null);
	}

	

}