package com.a1ck.util;

import org.apache.log4j.Logger;

public class ConnectionManagerAll4 extends ConnectionManager {

	public Logger logger = Logger.getLogger(this.getClass().getName()+".class");
	
	public ConnectionManagerAll4(String poolName)  {
//	public ConnectionManagerAll4(String poolName) throws DBPoolException  {

		super(poolName);   
//		super(poolName.toLowerCase());   

		try {
			connMgr = DBConnectionPoolManager.getInstance(poolName);
		} catch (DBPoolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace(); 
		}
		//connMgr.init(poolName);
	}
	
}
