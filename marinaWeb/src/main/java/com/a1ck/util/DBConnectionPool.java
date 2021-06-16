package com.a1ck.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.Vector;

//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;

public class DBConnectionPool{
	private int checkedOut;
	private Vector freeConnections = new Vector();
	private int maxConn;
	private String name;
	private String password;
	private String url;
	private String user;

	public static final int DEFAULT_MAX_CON=50;

	//private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	
	public DBConnectionPool(String name, String url, String user, String password, int maxConn) {
		this.name = name;
		this.url = url;
		this.user = user;
		this.password = password;
		this.maxConn = maxConn;

		if(this.maxConn <= 0) {
			this.maxConn = DEFAULT_MAX_CON;
		}
	}

	public synchronized Connection getConnection() throws DBPoolException {
		Connection conn = null;

		
		while(freeConnections.size() <= 0) {
			
			if(checkedOut < maxConn) {
				conn = newConnection();
			break;
			}

			try { //저장되어 있는 Connection이 없을경우 Connection이 반환될때 까지 기다린다.
				wait();
			}
			catch (InterruptedException ex){}
		}

		if(conn == null) {
			conn = (Connection) freeConnections.firstElement();
			freeConnections.removeElementAt(0);
			try {
				if(conn.isClosed()) {
					conn = newConnection();
				}  
			} catch (SQLException ex){ conn = newConnection(); }
		}

		if(conn != null) {
			checkedOut++;
		} else {
			throw new DBPoolException("Can't obtain DB Connection");
		}
		return conn;
	}

	private Connection newConnection() {
		
		Connection conn = null;
		try {
			if(user == null) {
				conn = DriverManager.getConnection(url);
			} else {
				conn = DriverManager.getConnection(url, user, password);
			} 
		} catch (SQLException ex){ return null; }
		return conn;
	}

	public synchronized void returnConnection(Connection conn) { //connection을 벡터의 맨 마지막에 삽입한다.
		freeConnections.addElement(conn);
		checkedOut--;
		notifyAll();
	}

	public synchronized void close() {
		Enumeration allConnections = freeConnections.elements();
		while (allConnections.hasMoreElements()){
			Connection conn = (Connection) allConnections.nextElement();  
			try {
				conn.close();
			} catch (SQLException ex){}
		}
		freeConnections.removeAllElements();
	}

};

