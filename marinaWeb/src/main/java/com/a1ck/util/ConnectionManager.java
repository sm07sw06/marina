package com.a1ck.util;


import java.sql.Connection;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;

public abstract class ConnectionManager {
	
	//private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	
    protected DBConnectionPoolManager connMgr;
    protected String poolName;
    
    public ConnectionManager(String pool) { 
        poolName = pool;
    }
    
    public Connection getConnection() throws DBPoolException {
        return (connMgr.getConnection(poolName));
    }
    
    public void freeConnection(Connection conn) {
        connMgr.freeConnection(poolName, conn);
    }
    
}