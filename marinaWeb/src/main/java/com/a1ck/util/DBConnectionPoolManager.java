package com.a1ck.util;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Properties;
import java.util.Vector;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class DBConnectionPoolManager {
	private static DBConnectionPoolManager instance = null;
	private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");

	private Vector drivers = new Vector();
	private Hashtable pools = new Hashtable();
	
    protected String poolName, dbServer, dbName, port, userID, passwd;
    protected int maxConn,initConn, maxWait;
    private String configFile;	

	public static synchronized DBConnectionPoolManager getInstance(String poolName) throws DBPoolException {
		if(instance == null) {
			synchronized(DBConnectionPoolManager.class) {
				if(instance == null) {
					instance = new DBConnectionPoolManager(poolName);
				}
			}
		}
		return instance;
	} 

	private DBConnectionPoolManager(String poolName) throws DBPoolException {
		init(poolName);
	}

	private void init(String poolName) throws DBPoolException {

		Properties dbProps = new Properties();
		String JDBCDriver = "";
        String JDBCDriverType = "";
        String url = "";
		   
        UtilClass   utilClass = new UtilClass();
		   
        try {
			
        	
	        // Property파일 디렉토리 지정
	        configFile = "db.properties";
	        
	        /**
	        String javaHome = System.getenv("JAVA_HOME");
	        System.out.println("==>javaHome:"+javaHome);
	        
	        String classPath = System.getenv("CLASS_PATH");
	        System.out.println("==>classPath:"+classPath);
	        
	        String osName = System.getProperty("os.name");
	        System.out.println("==>osName:"+osName);
	        
	       	String userDir = System.getProperty("user.dir");
	        System.out.println("==>userDir:"+userDir); 
	        
	        **/
	        	
	        
	        dbServer = utilClass.GetCommProperty(configFile, poolName, "dbServer");
			port     = utilClass.GetCommProperty(configFile, poolName, "port"    );
	        dbName   = utilClass.GetCommProperty(configFile, poolName, "dbName"  );
	        userID   = utilClass.GetCommProperty(configFile, poolName, "userID"  );
	        passwd   = utilClass.GetCommProperty(configFile, poolName, "passwd"  );
	        maxConn  = Integer.parseInt(utilClass.GetCommProperty(configFile, poolName, "maxConn" ));
	        initConn = Integer.parseInt(utilClass.GetCommProperty(configFile, poolName, "initConn"));
	        maxWait  = Integer.parseInt(utilClass.GetCommProperty(configFile, poolName, "maxWait" ));

	        /********
			logger.debug("ConnectionManager :: dbServer :" + dbServer);
	        logger.debug("ConnectionManager :: port     :" + port);
	        logger.debug("ConnectionManager :: dbName   :" + dbName);
	        logger.debug("ConnectionManager :: userID   :" + userID);
	        logger.debug("ConnectionManager :: passwd   :" + passwd);
	        logger.debug("ConnectionManager :: maxConn  :" + maxConn);
	        logger.debug("ConnectionManager :: initConn :" + initConn);
	        logger.debug("ConnectionManager :: maxWait  :" + maxWait);
	        ****/
	        
			if ( StringUtils.equalsIgnoreCase(poolName,"mysql")) {			
				
				JDBCDriver = "com.mysql.jdbc.Driver";
		        JDBCDriverType = "jdbc:mysql";
		        url = JDBCDriverType + "://" + dbServer + ":" + port + "/" + dbName ;
//		        url = JDBCDriverType + "://" + dbServer + ":" + port + "/" + dbName + "?useUnicode=true&characterEncoding=UTF-8&characterSetResults=UTF-8";
			} else if ( StringUtils.equalsIgnoreCase(poolName,"oracle")) {
				JDBCDriver = "oracle.jdbc.OracleDriver";
		        JDBCDriverType = "jdbc:oracle:thin"; 
		        url = JDBCDriverType + ":@" + dbServer + ":" + port + "/" + dbName;
			} else if ( StringUtils.equalsIgnoreCase(poolName,"mssql")) {
				JDBCDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
		        JDBCDriverType = "jdbc:sqlserver";
		        url = JDBCDriverType + "://" + dbServer + ":" + port + ";DatabaseName=" + dbName;
			} else if ( StringUtils.equalsIgnoreCase(poolName,"postgresql")) {
				JDBCDriver = "org.postgresql.Driver";
		        JDBCDriverType = "jdbc:postgresql";
		        url = JDBCDriverType + "://" + dbServer + ":" + port + "/" + dbName;
			}
			
			//logger.error("ConnectionManagerAll4 :: JDBCDriver :" + JDBCDriver);
			//logger.error("ConnectionManagerAll4 :: url :" + url);
		}
		catch (Exception e){ throw new DBPoolException(e.getMessage()); }

		try{
			Driver driver = (Driver)Class.forName(JDBCDriver).newInstance();
			DriverManager.registerDriver(driver);
			drivers.addElement(driver);
		} 
		catch (ClassNotFoundException ex) { throw new DBPoolException("Cant's find JDBC Driver class"+ex.getMessage()); }
		catch (InstantiationException ex) { throw new DBPoolException("Cant's find JDBC Driver class"+ex.getMessage()); }
		catch (SQLException ex) { throw new DBPoolException("Cant's find JDBC Driver class"+ex.getMessage()); }
		catch (Exception ex) { throw new DBPoolException("Cant's find JDBC Driver class"+ex.getMessage()); }
		
		DBConnectionPool pool = new DBConnectionPool(poolName, url, userID, passwd, maxConn);
		pools.put(poolName, pool);
	}
	
	public Connection getConnection(String name) throws DBPoolException {
		DBConnectionPool pool = (DBConnectionPool) pools.get(name);
		if(pool != null) {
			return pool.getConnection();
		} else {
			throw new DBPoolException("Not exist pool name:"+name);
		}
	}

	public void freeConnection(String name, Connection con) {
		DBConnectionPool pool = (DBConnectionPool) pools.get(name);
		if(pool != null) { pool.returnConnection(con); }
	}

	public synchronized void close() {
		Enumeration allPools = pools.elements();
		while (allPools.hasMoreElements()){
			DBConnectionPool pool = (DBConnectionPool) allPools.nextElement();
			pool.close();
		}

		Enumeration allDrivers = drivers.elements();
		while (allDrivers.hasMoreElements()){
			Driver driver = (Driver) allDrivers.nextElement();
		try {
			DriverManager.deregisterDriver(driver);
		}
		catch (SQLException ex){}
		}
	}

};

