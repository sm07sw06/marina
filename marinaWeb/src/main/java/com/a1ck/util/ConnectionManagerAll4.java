package com.a1ck.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ConnectionManagerAll4 extends ConnectionManager {

	private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	
	public ConnectionManagerAll4(String poolName)  {

		super(poolName);   

		try {
			connMgr = DBConnectionPoolManager.getInstance(poolName);
		} catch (DBPoolException e) {
			e.printStackTrace(); 
		}
	}
	
}
