package com.a1ck.quarts;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import com.a1ck.util.UtilClass;
import com.a1ck.util.UtilClass.ClassIni;
import com.a1ck.util.UtilClass.ClassIniCol;
import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;



public class CronScheduleDbmsConnector extends Thread {

	public Logger logger = Logger.getLogger(this.getClass().getName()+".class");

	public String gsClassName = null;
	
	public int    src_dbms_cd = 0;
	public String src_dbms = null;
	public String src_ip   = null;
	public String src_port = null;
	public String src_db   = null;
	public String src_user = null;   
	public String src_pass = null;
	public String src_used = null;
	public String src_selected = null;
	public String src_sql  = null; 
	public String src_type = null;
	public String src_class = null; 
	public String src_path = null;
   
	public int    dest_dbms_cd = 0;
	public String dest_dbms = null;
	public String dest_ip   = null;
	public String dest_port = null;
	public String dest_db   = null;
	public String dest_user = null;
	public String dest_pass = null;
	public String dest_method = null;
	public String dest_table  = null;
	public String save_preq_cd= null;
	public String save_preq = null;

	public String gsSelectColumns = null;
	public String gsWhere = null;
	public String gsBaseDate = null;
	public String gsCurrTime = null;

	public Connection connectionSrc    = null;
	public Connection connectionDest   = null;
	public Connection connectionManage = null;

	public String sDeleteInserWhere  = null;
	public boolean bDev = false;
	public boolean bCheckBaseDate = false;
	public boolean bCheckSeq  = false;
	
	public static final String USER_AGENT = "Mozilla/5.0";

	
	UtilClass  utilClass = null;
	ClassIni classIni = null;
	ConnectionManager conMgr = null; 
	
	//CronJobStatus  cronJobStatus = null;
	
	public CronScheduleDbmsConnector(String sClassName) {
		this.gsClassName = sClassName;
		utilClass = new UtilClass();
		conMgr = new ConnectionManagerAll4("postgresql"); 
	}
	
	public String getCurrentTime() {
		long time = System.currentTimeMillis(); 
		SimpleDateFormat dayTime = new SimpleDateFormat("yyyyMMddHHmmss");
		String sCurrTime = dayTime.format(new Date(time));

		return sCurrTime;		
	}	
	
	public String getDate(int nDay, String sDash) {
		Calendar cal = Calendar.getInstance(); 
		String sDay = null;
		
		cal.add(Calendar.DATE , nDay);
		String sYear  = Integer.toString(cal.get(Calendar.YEAR));
		String sMonth = Integer.toString(cal.get(Calendar.MONTH)+1);
		String sDate  = Integer.toString(cal.get(Calendar.DATE));
		
		if(sMonth.length() == 1) sMonth = "0" + sMonth;
		if(sDate.length() == 1)  sDate  = "0" + sDate;
		
		if(!sDash.equals(""))
			sDay = sYear + sDash + sMonth + sDash +  sDate;
		else
			sDay = sYear + sMonth + sDate;
		return sDay;		
	}	
	
	private void connectSrc(String sClassName)  throws Exception {
		
		String connString = null;
		
		try {
			
//			logger.debug(sClassName + ": src: " + src_dbms_cd);

			if(src_dbms_cd >= 6) return ; 

			switch (src_dbms_cd) {
				case 1:
					Class.forName("oracle.jdbc.OracleDriver");
					connString = "jdbc:oracle:thin:@" + src_ip + ":" + src_port + "/" + src_db;
					break;
				case 2:
					Class.forName("com.mysql.jdbc.Driver");
					connString = "jdbc:mysql://" + src_ip + ":" + src_port + "/" + src_db;
					break;
				case 3:
					Class.forName("com.ibm.db2.jcc.DB2Driver");
					connString = "jdbc:db2://" + src_ip + ":" + src_port + "/" + src_db;
					break;
				case 4:
					Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
					connString = "jdbc:sqlserver://" + src_ip + ":" + src_port + ";DatabaseName=" + src_db;
					break;
				case 5:
					Class.forName("org.postgresql.Driver");
					connString = "jdbc:postgresql://" + src_ip + ":" + src_port + "/" + src_db;
					break;
			}
//			logger.debug(sClassName + " src:" + connString );
			connectionSrc = DriverManager.getConnection(connString, src_user, src_pass);

		} catch (ClassNotFoundException e) {
			logger.error(sClassName + ":" + "Where is your src dbms JDBC Driver?");
			logger.error(sClassName + ":" + e.getMessage());
			e.printStackTrace(); //TRACE();
			throw e;
		} catch (SQLException e) {
			logger.error(sClassName + ":" + "src dbms Connection Failed! Check output console");
			logger.error(sClassName + ":" + e.getMessage());
			e.printStackTrace(); //TRACE();
			throw e;
		}

	}

	private void connectDest(String sClassName) throws ClassNotFoundException, SQLException {
		
		String connString = null;
		
		try {

//			logger.debug(sClassName + ":dest:" + dest_dbms_cd);
			
			if(dest_dbms_cd >= 6) return ; 

			switch (dest_dbms_cd) {
				case 1:
					Class.forName("oracle.jdbc.OracleDriver");
					connString = "jdbc:oracle:thin:@" + dest_ip + ":" + dest_port + "/" + dest_db;
					break;
				case 2:
					Class.forName("com.mysql.jdbc.Driver");
					connString = "jdbc:mysql://" + dest_ip + ":" + dest_port + "/" + dest_db;
					break;
				case 4:
					Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
					connString = "jdbc:sqlserver://" + dest_ip + ":" + dest_port + ";DatabaseName=" + dest_db;
					break;
				case 5:
					Class.forName("org.postgresql.Driver");
					connString = "jdbc:postgresql://" + dest_ip + ":" + dest_port + "/" + dest_db;
					break;
			}
//			logger.debug(sClassName + " dest:" + connString );

			connectionDest = DriverManager.getConnection(connString, dest_user, dest_pass);

		} catch (ClassNotFoundException e) {
			logger.error(sClassName + ":" + "Where is your dest dbms JDBC Driver?");
			logger.error(sClassName + ":" + e.getMessage());
			e.printStackTrace(); //TRACE();
			throw e;
		} catch (SQLException e) {
			logger.error(sClassName + ":" + "dest dbms Connection Failed! Check output console");
			logger.error(sClassName + ":" + e.getMessage());
			e.printStackTrace(); //TRACE();
			throw e;
		}
	}

	
	/*****
	 * meta column infomation
	 * 1~USERID~USERID~varchar2~20~N
	 * logger.debug(gsClassName + ":" + "array[0] : " + sArray[0]); // seq
	 * logger.debug(gsClassName + ":" + "array[1] : " + sArray[1]); // column id
	 * logger.debug(gsClassName + ":" + "array[2] : " + sArray[2]); // column name
	 * logger.debug(gsClassName + ":" + "array[3] : " + sArray[3]); // type
	 * logger.debug(gsClassName + ":" + "array[4] : " + sArray[4]); // length
	 * logger.debug(gsClassName + ":" + "array[5] : " + sArray[5]); // basedate yes/no
	 ****/
	private int getColumn(String sClassName) {
//		 		
		int i = 0;
		int j = 0;
		int k = 0;
		String sBaseDateCol       = null;
		
		gsSelectColumns = null;
		gsBaseDate      = null;
		gsWhere         = null;

		ArrayList<ClassIniCol> arryList =  utilClass.getIniCol(sClassName);

				
		String sColCdVar   = null;
		String sColTypeVar = null;
		String sColDateVar = null;

		bCheckBaseDate = false;
		bCheckSeq = false;
		for(int s=0; s<arryList.size(); s++) {

			 		
			sColCdVar   = arryList.get(s).getCol_cd();
			sColTypeVar = arryList.get(s).getCol_type();
			sColDateVar = arryList.get(s).getCol_date();

/*			logger.info(sClassName + "::sColIdVar:" + sColIdVar);
			logger.info(sClassName + "::sColNmVar:" + sColNmVar);
			logger.info(sClassName + "::sColTypeVar:" + sColTypeVar);
			logger.info(sClassName + "::sColDateVar:" + sColDateVar);*/
		
			if (s == 0)
				gsSelectColumns = sColCdVar;
			else
				gsSelectColumns = gsSelectColumns + " , " + sColCdVar;
			 		
			if (StringUtils.contains(StringUtils.lowerCase(sColTypeVar), "seq")) bCheckSeq = true;


			if (sColDateVar.equals("Y")) {
				sBaseDateCol = sColCdVar;
				bCheckBaseDate = true;
				if (StringUtils.contains(StringUtils.lowerCase(sColTypeVar), "char")) k = 1;
				else if (StringUtils.contains(StringUtils.lowerCase(sColTypeVar), "num")) k = 2;
				else if (StringUtils.contains(StringUtils.lowerCase(sColTypeVar), "int")) k = 2;
				else if (StringUtils.contains(StringUtils.lowerCase(sColTypeVar), "time")) k = 3;
				else if (StringUtils.contains(StringUtils.lowerCase(sColTypeVar), "date")) k = 3; 
				j++;
				
				sDeleteInserWhere = " WHERE " + sColCdVar + " > '%@@@%'";
				logger.info(sClassName + "::sDeleteInserWhere:" + sDeleteInserWhere);
			}
			 		
			i++;
		}
		 		
		if(!bCheckBaseDate && !StringUtils.equalsIgnoreCase(dest_method, "02") && !StringUtils.equalsIgnoreCase(dest_method, "01")) { //truncate , append
			logger.info(sClassName + "::" + "base date not found and not truncate and not append...");
			i = -1;
		} else if(j > 1) {
			logger.info(sClassName + "::" + "base date is one more...!!");
			i = -1;
		} else if(bCheckBaseDate) {
			String sQuery = null;
			logger.info(sClassName + "::" + "base date found ***");
			Statement mStatment;
			
			switch (dest_dbms_cd) {
			case 1: // oracle
				  if(k == 1) sQuery = "\nSELECT NVL(MAX(" + sBaseDateCol + "), ' '   ) FROM " + dest_table;
			      else if(k == 2) sQuery = "\nSELECT NVL(MAX(" + sBaseDateCol + "), 0     ) FROM " + dest_table;
			      else if(k == 3) sQuery = "\nSELECT NVL(MAX(" + sBaseDateCol + "), '1999-01-01 01:01:01') FROM " + dest_table;
				break;
			case 2: // mysql
				  if(k == 1) sQuery = "\nSELECT IFNULL(MAX(" + sBaseDateCol + "), ' '   ) FROM " + dest_table;
			      else if(k == 2) sQuery = "\nSELECT IFNULL(MAX(" + sBaseDateCol + "), 0     ) FROM " + dest_table;
			      else if(k == 3) sQuery = "\nSELECT IFNULL(MAX(" + sBaseDateCol + "), '1999-01-01 01:01:01') FROM " + dest_table;
				break;
			case 4: // mssql 
				  if(k == 1) sQuery = "\nSELECT isnull(MAX(" + sBaseDateCol + "), ' '   ) FROM " + dest_table;
			      else if(k == 2) sQuery = "\nSELECT isnull(MAX(" + sBaseDateCol + "), 0     ) FROM " + dest_table;
			      else if(k == 3) sQuery = "\nSELECT isnull(MAX(" + sBaseDateCol + "), '1999-01-01 01:01:01') FROM " + dest_table;
				break;
			case 5: // postgresql
				  if(k == 1) sQuery = "\nSELECT coalesce(MAX(" + sBaseDateCol + "), ' '   ) FROM " + dest_table;
			      else if(k == 2) sQuery = "\nSELECT coalesce(MAX(" + sBaseDateCol + "), 0     ) FROM " + dest_table;
			      else if(k == 3) sQuery = "\nSELECT coalesce(MAX(" + sBaseDateCol + "), '1999-01-01 01:01:01') FROM " + dest_table;
				break;
			}
	
			try {
				mStatment = connectionDest.createStatement();
				ResultSet mResultSet = mStatment.executeQuery(sQuery);
				while (mResultSet.next()) {
					gsBaseDate = mResultSet.getString(1);
				}
				mStatment.close();

			} catch (SQLException e) {
				e.printStackTrace(); //TRACE();
				logger.error(sClassName + ":" + e.getMessage());
			}
		} else {
			logger.info(sClassName + ":Basedate not set \n");
		}
		 		

		return i;
	}

	
	
	@SuppressWarnings("resource")
	private void getSourceData(String sClassName) {

		String sSelectSql  = null;
		String insertSql   = null;
		String truncateSql = null;
		String deleteSql   = null;		

		PreparedStatement pstmt = null;
		Statement stmtSrc  = null;
		ResultSet rsSrc  = null;

		int metaCount   = 0;
		int columnCount = 0;
		int rowCount    = 0;

//		 		
		
		try {
			connectionDest.setAutoCommit(false);
			
			columnCount = getColumn(sClassName);
			 		
			if(columnCount == -1) {
				logger.error(sClassName + ":" + "base date not found...!!");
				return; 
			} else {
				sSelectSql = src_sql;
			}
			 		
			sSelectSql = sSelectSql.replaceAll("%@@@%", gsBaseDate);
			sSelectSql = sSelectSql.replaceAll("~", "'");
			
			if(bCheckBaseDate) {
				sDeleteInserWhere = sDeleteInserWhere.replaceAll("%@@@%", gsBaseDate);
				sDeleteInserWhere = sDeleteInserWhere.replaceAll("~", "'");
				
	 			logger.debug(sClassName + "::" + "sDeleteInserWhere:" + sDeleteInserWhere);
			}

			stmtSrc   = connectionSrc.createStatement();
			rsSrc     = stmtSrc.executeQuery(sSelectSql);
			metaCount = rsSrc.getMetaData().getColumnCount();

			if (metaCount != columnCount) {
				logger.error(sClassName + ":" + "meta error:meta column count (" + metaCount + ") is differ SQL column count (" + columnCount + ").");
				return;
			}


	 		String sWhereDelete = null;
			if (StringUtils.trim( save_preq_cd ) != null && !StringUtils.equalsIgnoreCase(save_preq_cd, "0") && StringUtils.trim( save_preq_cd ).length() != 0) {				
				
				String sPeriodC = StringUtils.right(save_preq, 1);
				String sPeriodN = StringUtils.substring(save_preq, 0, StringUtils.length(save_preq)-1);
				
	 			logger.debug(sClassName + "::" + sPeriodC + "," + sPeriodN);
				
				sWhereDelete =" WHERE lastdatetime < case when '" + sPeriodC+ "' = 'M' then to_timestamp(add_months(sysdate,- " + sPeriodN+ ")) else to_timestamp( sysdate - " + sPeriodN+ " ) end";

				deleteSql = "\nDELETE FROM  " + dest_table + " " + sWhereDelete ;
				logger.debug(sClassName + "::" + ">deleteSql:"+deleteSql);
				pstmt = connectionDest.prepareStatement(deleteSql);
				pstmt.executeUpdate();
				pstmt.close();
			}
			
//			logger.debug(sClassName + "::sWhereDelete:" + deleteSql);
			
			//String sWhereDeleteInsert = null;
			if (StringUtils.equalsIgnoreCase(dest_method, "03")) { //deleteinsert
					truncateSql = "\nDELETE FROM  " + dest_table + " " + sDeleteInserWhere ;
					logger.debug(sClassName + "::" + ">deleteinsert:"+truncateSql);
					pstmt = connectionDest.prepareStatement(truncateSql);
					pstmt.executeUpdate();
					pstmt.close();
			} else if (StringUtils.equalsIgnoreCase(dest_method, "02")) { //truncate
//				logger.debug(sClassName + "::" + ">method starting....truncate/insert");
				truncateSql = "\nDELETE FROM  " + dest_table + " ";
 				logger.debug(sClassName + "::" + ">truncateSql:"+truncateSql);
				pstmt = connectionDest.prepareStatement(truncateSql);
				pstmt.executeUpdate();
				pstmt.close();
			}
			
 			logger.debug(sClassName + "::" + ">make insert sql");

			rowCount = 0;
			while (rsSrc.next()) {
				if(bCheckSeq) {
					insertSql = "\nINSERT INTO " + dest_table + " (" + gsSelectColumns + ") VALUES ( " + dest_table + "_seq.nextval ";
				} else {
					insertSql = "\nINSERT INTO " + dest_table + " (" + gsSelectColumns + ") VALUES ( ? ";
				}

				for (int j = 0; j < metaCount - 1; j++) {
					insertSql = insertSql + " , ? ";
				}
				insertSql = insertSql + ")";
	
				//logger.debug(sClassName + "::" + "metaCount:" + metaCount + " Insert1 Sql:" + insertSql);
				//logger.debug(sClassName + "::" + "Insert SQL:" + insertSql);
				
				pstmt = null;
				pstmt = connectionDest.prepareStatement(insertSql);

				int jj = 1;
				for (int j = 0; j < metaCount; j++) {
					
					 //logger.debug(sClassName +"1:"+j );

					 //logger.debug(sClassName + ":" + "column type :" + rsSrc.getMetaData().getColumnTypeName(j + 1) + ":"+ rsSrc.getString(j + 1));

					if(j == 9 || j == 15 ) {
						//logger.debug(sClassName + ":" + "ccccc1 type :" + rsSrc.getMetaData().getColumnType(j + 1) + ":"+ rsSrc.getMetaData().getColumnTypeName(j + 1));
						//logger.debug(sClassName + ":" + "ccccc2 type :" + rsSrc.getString(j + 1));
						pstmt.setString(jj , "-");
					} else if(j == 16) {
						//logger.debug(sClassName + ":" + "ccccc1 type :" + rsSrc.getMetaData().getColumnType(j + 1) + ":"+ rsSrc.getMetaData().getColumnTypeName(j + 1));
						//logger.debug(sClassName + ":" + "ccccc2 type :" + rsSrc.getString(j + 1));
						pstmt.setInt(jj , 0);
					} else if(bCheckSeq  && (j == 0)) {
						//logger.debug(sClassName + ":" + "ccccc1 type :" + rsSrc.getMetaData().getColumnType(j + 1) + ":"+ rsSrc.getMetaData().getColumnTypeName(j + 1));
						//logger.debug(sClassName + ":" + "ccccc2 type :" + rsSrc.getString(j + 1));
						jj--;
					} else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "char")) {
						pstmt.setString(jj , rsSrc.getString(j + 1));
					} else if (rsSrc.getMetaData().getColumnType(j+1) == 1111) {
						pstmt.setString(jj , rsSrc.getString(j + 1));
					} else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "var")) {
						pstmt.setString(jj , rsSrc.getString(j + 1)); 
					} else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "uniqueidentifier")) {
						pstmt.setString(jj , rsSrc.getString(j + 1));
					} else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "date"))
						pstmt.setTimestamp(jj , rsSrc.getTimestamp(j + 1));
					else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "time"))
						pstmt.setTimestamp(jj , rsSrc.getTimestamp(j + 1));
					else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "bigint"))
						pstmt.setLong(jj , rsSrc.getLong(j + 1));
					else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "int"))
						pstmt.setInt(jj , rsSrc.getInt(j + 1));
					else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "num"))
						pstmt.setInt(jj , rsSrc.getInt(j + 1));
					else if (StringUtils.contains(StringUtils.lowerCase(rsSrc.getMetaData().getColumnTypeName(j+1)), "double"))
						pstmt.setDouble(jj , rsSrc.getDouble(j + 1));
					else {
						logger.error(sClassName + ":" + "column type not found:" + rsSrc.getMetaData().getColumnType(j + 1) + ":"
								+ rsSrc.getMetaData().getColumnTypeName(j + 1));
						connectionDest.rollback();
						return;
					}
					jj++;
					//logger.debug(sClassName +"2:"+j );
				}

 				//logger.debug(sClassName + "::" + "Insert Sql2:" + insertSql);
				rowCount++;

				pstmt.executeUpdate();
				pstmt.close();
			}
			connectionDest.commit();
			logger.info(sClassName + "::@@@ ===>" + " process Count:" + rowCount);

		} catch (Exception e) {
			logger.error(sClassName + ":" + "SQLException:"+e.getMessage());
			e.printStackTrace(); //TRACE();
			try {
				connectionDest.rollback();
			} catch (SQLException e1) {
				logger.error(sClassName + ":" + e1.getMessage());
				e1.printStackTrace();
			}
		} finally {
			
		}

	}

	static boolean isPrintName(String name){
	    if (name.charAt(0) == '.') {
	        return false;
	    }
	    if (name.contains("svn")) {
	        return false;
	    }
	    return true;
	}

	public static int fileRename(String FileName, String str){
		int result = 0;

		File file_name =null; 
		File file_rename =null; 

		// String repository = FlexContext.getServletContext().getRealPath("/")+"upload/";
		if(FileName != null){
			file_name = new File(FileName);
			file_rename = new File(FileName + str);
			if(file_name.renameTo(file_rename)){
				result =1;
			}
		}
		return result;
	}
	
	private void getSourceFile(String sClassName,int depth, File file)  { 

 		logger.debug(gsClassName + ":" + "getSourceFilePath1:" + file.getPath());
		
	    String name = file.getName();

		try {
		    if (file.isDirectory()) { 
		        if(isPrintName(name)) {
		        	;
		        	 logger.debug(sClassName + ":" + "*" + file.getName() + "*");
		        }
		    }
		    else if(isPrintName(name)) {
		    	 logger.debug(sClassName + ":" + "file name:" +  file.getAbsolutePath());
	        	if(!file.getName().endsWith(".flag")){ 
	        		logger.debug(sClassName + ":" + "file name(" +  file.getAbsolutePath() + ") Converting..............");
	        	}
		    }
		    if (file.isDirectory()) { 
		        File[] filesList = file.listFiles(); 
		        for (int i = 0; i < filesList.length; i++){
		            getSourceFile(sClassName,depth + 4, filesList[i]);
		        } 
		    }
		} catch (Exception e) {
			logger.error(sClassName + ":" + e.getMessage());
			e.printStackTrace();
		}
	}
	

	/**
	 * 
	 * @param sClassName
	 * @param classFile
	 * @throws IOException
	 * ???�� class?�� ?��?��?��?�� 로직?�� ?��?��?��
	 * 
	 */
	private void getSourceAPI(String sClassName, String sAPIUrl, String jsonValue)  { 

 		logger.debug(sClassName + ":getSourceAPI:classFile:" + sAPIUrl   );
		
 		
 		String inputLine = null;
 		StringBuffer response = new StringBuffer();
 		
 		try {
			URL url = new URL(sAPIUrl + "/" + jsonValue);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("User-Agent", USER_AGENT);
			con.setConnectTimeout(1000 * 30); //30초
			con.setReadTimeout(1000 * 30);
			
			int responseCode = con.getResponseCode();
	        response = new StringBuffer();

	        logger.debug("\nSending 'GET' request to URL : " + url);
	        logger.debug("Response Code : " + responseCode);

	        Charset charset = Charset.forName("UTF-8");
	        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(),charset));

	        while ((inputLine = in.readLine()) != null) {
	            response.append(inputLine);
	        }
	        in.close();

	        logger.debug("조회결과 : " + response.toString());

			con.disconnect();
			logger.debug(sClassName + ":getSourceAPI:REST API END");
			
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
 		
		return ;
		
		  /**
	     * Post 방식
	     * Https
	     * @throws Exception
	     */
/*	    private void sendPostHttps() throws Exception {

	        String url = "https://selfsolve.apple.com/wcResults.do";
	        String urlParameters = "sn=C02G8416DRJM&cn=&locale=&caller=&num=12345";
	        URL obj = new URL(url);
	        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

	        //add reuqest header
	        con.setRequestMethod("POST");
	        con.setRequestProperty("User-Agent", USER_AGENT);
	        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
	        con.setConnectTimeout(10000);       //컨텍션타임아웃 10초
	        con.setReadTimeout(5000);           //컨텐츠조회 타임아웃 5총
	        // Send post request
	        con.setDoOutput(true);              //항상 갱신된내용을 가져옴.
	        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
	        wr.writeBytes(urlParameters);
	        wr.flush();
	        wr.close();

	        int responseCode = con.getResponseCode();
	        System.out.println("\nSending 'POST' request to URL : " + url);
	        System.out.println("Post parameters : " + urlParameters);
	        System.out.println("Response Code : " + responseCode);

	        Charset charset = Charset.forName("UTF-8");
	        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(),charset));
	        String inputLine;
	        StringBuffer response = new StringBuffer();

	        while ((inputLine = in.readLine()) != null) {
	            response.append(inputLine);
	        }
	        in.close();
	        System.out.println(response.toString());
	    }
*/

	    /**
	     * Post 방식
	     * Https
	     * @throws Exception
	     */
/*	    private void sendPost() throws Exception {

	        String url = "http://bobr2.tistory.com/";
	        String urlParameters = "?Param1=aaaa"
	                +"&Param2=bbbb";
	        URL obj = new URL(url);
	        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
	        //add reuqest header
	        con.setRequestMethod("POST");
	        con.setRequestProperty("User-Agent", USER_AGENT);
	        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
	        con.setConnectTimeout(10000);       //컨텍션타임아웃 10초
	        con.setReadTimeout(5000);           //컨텐츠조회 타임아웃 5총
	        // Send post request
	        con.setDoOutput(true);              //항상 갱신된내용을 가져옴.
	        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
	        wr.writeBytes(urlParameters);
	        wr.flush();
	        wr.close();

	        int responseCode = con.getResponseCode();
	        System.out.println("\nSending 'POST' request to URL : " + url);
	        System.out.println("Post parameters : " + urlParameters);
	        System.out.println("Response Code : " + responseCode);

	        Charset charset = Charset.forName("UTF-8");
	        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(),charset));
	        String inputLine;
	        StringBuffer response = new StringBuffer();

	        while ((inputLine = in.readLine()) != null) {
	            response.append(inputLine);
	        }
	        in.close();
	        System.out.println(response.toString());
	    }

*/
	}
	

	/**
	 * 
	 * @param sClassName
	 * @param classFile
	 * @throws IOException
	 * ???�� class?�� ?��?��?��?�� 로직?�� ?��?��?��
	 * 
	 */
	private void getSourceClass(String sClassName, String classFile)  { 

//		logger.debug(sClassName + ":getSourceClass:classFile:" + classFile   );
		
		@SuppressWarnings("rawtypes")
		Class newClass;
		try {
			//logger.debug(sClassName + ":getSourceClass:debug" );
			newClass = Class.forName(classFile);
			@SuppressWarnings("unused")
			Object obj = newClass.newInstance();
		} catch (ClassNotFoundException e) {
			logger.error(sClassName + ":" + e.getMessage());
			e.printStackTrace();
		} catch (InstantiationException e) {
			logger.error(sClassName + ":" + e.getMessage());
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			logger.error(sClassName + ":" + e.getMessage());
			e.printStackTrace();
		}
		return ;
		
	}
	
	
	private void init_env(String sClassName) {

		logger.setLevel(Level.ALL);

		try {
			String strIP = Inet4Address.getLocalHost().getHostAddress();
			if (strIP.substring(0, 3).equals("192")) {
				bDev = true;
			}
			
			classIni = utilClass.getIni(sClassName);			

			
			logger.debug(sClassName + ":getDest_dbms_cd   :" + classIni.getDest_dbms_cd()   );
			
			
			dest_ip     = classIni.getDest_ip();
			dest_dbms_cd = Integer.parseInt(classIni.getDest_dbms_cd());
			dest_dbms   = classIni.getDest_dbms();
			dest_port   = classIni.getDest_port();
			dest_db     = classIni.getDest_db();
			dest_user   = classIni.getDest_user();
			dest_pass   = classIni.getDest_passwd();
			dest_method = classIni.getJob_method_cd();
			dest_table  = classIni.getDest_table();
			save_preq   = classIni.getSave_preq();
			save_preq_cd= classIni.getSave_preq_cd();
			
			src_ip      = classIni.getSrc_ip();
			src_port    = classIni.getSrc_port();
			src_db      = classIni.getSrc_db();
			src_user    = classIni.getSrc_user();
			src_pass    = classIni.getSrc_passwd();
			src_dbms_cd = Integer.parseInt(classIni.getSrc_dbms_cd());
			src_dbms    = classIni.getSrc_dbms();
			src_used    = classIni.getUse_yn();
			src_selected= classIni.getJob_selected();
			src_sql     = classIni.getSrc_sql();
			src_path    = classIni.getJob_path();
			src_class   = classIni.getJob_class();
			src_type    = classIni.getJob_type_cd();
			
 			 
/* 			logger.debug(sClassName + ":----------------------------");
			logger.debug(sClassName + ":classIni:dest_ip     :" + dest_ip     );
			logger.debug(sClassName + ":classIni:dest_dbms   :" + dest_dbms   );
			logger.debug(sClassName + ":classIni:dest_port   :" + dest_port   );
			logger.debug(sClassName + ":classIni:dest_db     :" + dest_db     );
			logger.debug(sClassName + ":classIni:dest_user   :" + dest_user   );
			logger.debug(sClassName + ":classIni:dest_pass   :" + dest_pass   );
			logger.debug(sClassName + ":classIni:dest_method :" + dest_method );
			logger.debug(sClassName + ":classIni:dest_table  :" + dest_table  );
			logger.debug(sClassName + ":classIni:save_preq_cd:" + save_preq_cd);
			logger.debug(sClassName + ":classIni:save_preq   :" + save_preq   );
			logger.debug(sClassName + ":classIni:src_ip      :" + src_ip      );
			logger.debug(sClassName + ":classIni:src_port    :" + src_port    );
			logger.debug(sClassName + ":classIni:src_db      :" + src_db      );
			logger.debug(sClassName + ":classIni:src_user    :" + src_user    );
			logger.debug(sClassName + ":classIni:src_pass    :" + src_pass    );
			logger.debug(sClassName + ":classIni:src_dbms    :" + src_dbms    );
			logger.debug(sClassName + ":classIni:src_used    :" + src_used    );
			logger.debug(sClassName + ":classIni:src_selected:" + src_selected    );
			logger.debug(sClassName + ":classIni:src_sql     :" + src_sql     );
			logger.debug(sClassName + ":classIni:src_path    :" + src_path    );
			logger.debug(sClassName + ":classIni:src_class   :" + src_class   );
			logger.debug(sClassName + ":classIni:src_type    :" + src_type    );
			logger.debug(sClassName + ":----------------------------"); */
	 		 

		/*	
			if (StringUtils.equalsIgnoreCase(src_dbms, "oracle"))
				src_dbmsid = 1;
			else if (StringUtils.equalsIgnoreCase(src_dbms, "mysql"))
				src_dbmsid = 2;
			else if (StringUtils.equalsIgnoreCase(src_dbms, "db2"))
				src_dbmsid = 3;
			else if (StringUtils.equalsIgnoreCase(src_dbms, "mssql"))
				src_dbmsid = 4;
			else if (StringUtils.equalsIgnoreCase(src_dbms, "postgres"))
				src_dbmsid = 5;

			
			if (StringUtils.equalsIgnoreCase(dest_dbms, "oracle"))
				dest_dbmsid = 1;
			else if (StringUtils.equalsIgnoreCase(dest_dbms, "mysql"))
				dest_dbmsid = 2;
			else if (StringUtils.equalsIgnoreCase(dest_dbms, "mssql"))
				dest_dbmsid = 4;
			else if (StringUtils.equalsIgnoreCase(dest_dbms, "postgres"))
				dest_dbmsid = 5;

*/

			
		} catch (SecurityException e1) {
			logger.error(sClassName + ":" + e1.getMessage());
			e1.printStackTrace(); //TRACE();
		} catch (UnknownHostException e2) {
			logger.error(sClassName + ":" + e2.getMessage());
			e2.printStackTrace();
		}
		

		
	}

	public void run() {
		
		logger.info(gsClassName + ":" + "===> " + gsClassName + " job starting ==========================");
		
/*		try {
			Thread.sleep( 10 * 1000); //30�� ���
		} catch (InterruptedException e) {
			e.printStackTrace();
		}*/

		init_env(gsClassName);
 
		gsCurrTime = getCurrentTime();

		try {

			connectionManage =  conMgr.getConnection(); 
			
			if (!StringUtils.equalsIgnoreCase(src_selected, "y")) {
				logger.info(gsClassName + ":" + "selected row is not used.  skiped. (" + src_selected + " )");
				return;
			}

			if (StringUtils.equalsIgnoreCase(src_type, "03")) 
			{
				File file = new File(src_path);
				getSourceFile(gsClassName, 0 , file);
			}
			else if (StringUtils.equalsIgnoreCase(src_type, "02"))  
			{
				getSourceClass(gsClassName, src_class);
			}
			else if (StringUtils.equalsIgnoreCase(src_type, "04"))  
			{
				getSourceAPI(gsClassName, src_class, "111");
			}
			else
			{ 
				connectSrc(gsClassName);
				connectDest(gsClassName);
				getSourceData(gsClassName);
			}
			
			//cronJobStatus.SetEndJob(gsCurrTime, gsClassName);
			logger.debug(gsClassName + ":" + "================= END =========================");
		} catch (Exception e) {
			logger.error(gsClassName + ":" + e.getMessage());
			e.printStackTrace();
		} finally {
			if (connectionManage != null)
				try {
					connectionManage.close();
					conMgr.freeConnection(connectionManage);
				} catch (SQLException e) {
					logger.error(gsClassName + ":" + e.getMessage());
					e.printStackTrace();
				}
			if (connectionSrc != null)
				try {
					connectionSrc.close();
				} catch (SQLException e) {
					logger.error(gsClassName + ":" + e.getMessage());
					e.printStackTrace();
				}
			if (connectionDest != null)
				try {
					connectionDest.close();
				} catch (SQLException e) {
					logger.error(gsClassName + ":" + e.getMessage());
					e.printStackTrace();
				} 
		}

	}

	public void submit(String sClassName)   {
		logger.debug("Starting .........." + sClassName );
		
		Thread th = new CronScheduleDbmsConnector(sClassName);
		th.start();
	}

}
