package com.a1ck.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.ini4j.Ini;
import org.json.simple.JSONObject;

public class UtilClass {

	public Logger logger = Logger.getLogger(this.getClass().getName() + ".class");

	public String key = "MagicAriaA1ck";

	Aria aria = new Aria(key);

	public String GetCommProperty(String sPropertyFile, String sSection, String sProperty) 
	{
		
		String sResult = null;
		 
		Ini ini = null;
		
		try {
			String sDbmsConnPropName = getCommRootProperty(sPropertyFile); 

//	        logger.debug("getCommRootProperty :: sProperty:" + sProperty );
			
			ini = new Ini(new FileReader(sDbmsConnPropName));   
			sResult   = ini.get(sSection, sProperty);
		} catch (Exception e) {
			e.printStackTrace(); //TRACE();
			return sResult;	
		}
		
		return sResult;
	
	}
	
    public String getCommRootProperty(String sProperty) {
    	
        ClassLoader cl;
        cl = Thread.currentThread().getContextClassLoader();
        
        String envPath = null;
        String fileSeparator = System.getProperty("file.separator");
//        logger.debug("getCommRootProperty :: fileSeparator:" + fileSeparator );

        if( cl == null ) {
            cl = ClassLoader.getSystemClassLoader();
        }
        
        URL url = cl.getResource( sProperty );
        if (fileSeparator.equals("/")) {
        	envPath = url.getPath().substring(0, url.getPath().length());
        } else {
        	envPath = url.getPath().substring(1, url.getPath().length());
        }
        
        return envPath;
    }

    
	public String GetManagerProperty(String section, String property) throws Exception {

		// System.out.println("UtilClass:: GetManagerConnection" );

		String sResult = null;

		Ini ini = null;

		try {
			String sDbmsConnPropName = getUserRootProperty("db.properties");

			ini = new Ini(new FileReader(sDbmsConnPropName));
			sResult = ini.get(section, property);
		} catch (Exception e) {
			logger.error("GetManagerConnection ::" + e.getMessage());
			e.printStackTrace(); // TRACE();
			throw e;
		}

		return sResult;

	}

	public String getCurrentTime() {
		long time = System.currentTimeMillis();
		SimpleDateFormat dayTime = new SimpleDateFormat("yyyyMMddHHmmss");
		String sCurrTime = dayTime.format(new Date(time));

		//// logger.debug("Current Date: " + sCurrTime);
		// System.out.println("Current Date: " + sCurrTime);

		return sCurrTime;
	}

	public String getCurrentTime_Dash() {
		long time = System.currentTimeMillis();
		SimpleDateFormat dayTime = new SimpleDateFormat("yy/MM/dd/ HH:mm:ss");
		String sCurrTime = dayTime.format(new Date(time));

		//// logger.debug("Current Date: " + sCurrTime);
		// System.out.println("Current Date: " + sCurrTime);

		return sCurrTime;
	}

	public String getDate(int nDay, String sDash) {
		Calendar cal = Calendar.getInstance();
		String sDay = null;

		cal.add(Calendar.DATE, nDay);
		String sYear = Integer.toString(cal.get(Calendar.YEAR));
		String sMonth = Integer.toString(cal.get(Calendar.MONTH) + 1);
		String sDate = Integer.toString(cal.get(Calendar.DATE));

		if (sMonth.length() == 1)
			sMonth = "0" + sMonth;
		if (sDate.length() == 1)
			sDate = "0" + sDate;

		if (!sDash.equals(""))
			sDay = sYear + sDash + sMonth + sDash + sDate;
		else
			sDay = sYear + sMonth + sDate;
		return sDay;
	}

	public String getStringRight(String sSrc, String sDash, int nLen) {

		String sString = sDash + sSrc;
		// logger.debug("sString :" + sString);
		return sString.substring(sString.length() - nLen, sString.length());
	}

	/*
	 * 2017-02-10 => 20170210
	 */
	public String getDate2String(String sDash) {
		String sDay = null;

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date dDate;
		try {
			dDate = format.parse(sDash);
			format = new SimpleDateFormat("yyyyMMdd");
			sDay = format.format(dDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return sDay;
	}

	/*
	 * 20170210 => 2017-02-10
	 */
	public String getString2Date(String sDate) {
		String sDash = null;

		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
		Date dDate;
		try {
			dDate = format.parse(sDate);
			format = new SimpleDateFormat("yyyy-MM-dd");
			sDash = format.format(dDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return sDash;
	}

	public static String nvl(String val) {
		return val == null ? "" : val;
	}

	public String nvl2zero(String val) {
		return nvl(val, "0");
	}

	public String nvl(String val, String rep_val) {
		if (val == null) {
			if (null == rep_val) {
				val = "";
			} else {
				val = rep_val;
			}
		}
		return val;
	}

	public String nvl_trim(String val) {
		return nvl(val).trim();
	}

	public String nvl_trim(String val, String rep_val) {
		return nvl(val, rep_val).trim();
	}

	public String replace(String source, String pattern, String replace) {
		if (source != null) {
			final int len = pattern.length();
			StringBuffer sb = new StringBuffer();
			int found = -1;
			int start = 0;

			while ((found = source.indexOf(pattern, start)) != -1) {
				sb.append(source.substring(start, found));
				sb.append(replace);
				start = found + len;
			}

			sb.append(source.substring(start));

			return sb.toString();
		}

		return "";
	}

	public String getRight(String str, int size) {
		int tmpStringLength = str.length();

		if (size >= tmpStringLength) {
			return str;
		}

		return str.substring(tmpStringLength - size, str.length());
	}

	public String getLeft(String str, int size) {
		int tmpStringLength = str.length();

		if (size >= tmpStringLength) {
			return str;
		}

		return str.substring(0, size);
	}

	public String setLeftPad(String str, int width, char chPad) {
		StringBuffer paddedValue = new StringBuffer();

		for (int i = str.length(); i < width; i++) {
			paddedValue.append(chPad);
		}

		paddedValue.append(str);

		String returnValue = paddedValue.toString();
		returnValue = returnValue.substring(0, width);

		return returnValue;
	}

	public String setRightPad(String str, int width, char chPad) {
		if (str.length() >= width) {
			return str.substring(0, width);
		}

		StringBuffer paddingValue = new StringBuffer();
		for (int i = str.length(); i < width; i++) {
			paddingValue.append(chPad);
		}

		return str + paddingValue.toString();
	}

	public boolean isPattern(String sData, String sPattern) {
		for (int i = 0; i < sData.length(); i++) {
			if (sPattern.indexOf(sData.charAt(i)) < 0) {
				return false;
			}
		}
		return true;
	}

	public byte[] hexFromString(String hex) {
		int len = hex.length();
		int bufLen = (len + 1) / 2;
		byte[] buf = new byte[bufLen];

		int i = 0, j = 0;
		i = len % 2;
		if (i == 1) {
			buf[j++] = (byte) fromDigit(hex.charAt(i++));
		}
		while (i < len) {
			buf[j++] = (byte) ((fromDigit(hex.charAt(i++)) << 4) | fromDigit(hex.charAt(i++)));
		}
		return buf;
	}

	public int fromDigit(char ch) {
		if (ch >= '0' && ch <= '9') {
			return ch - '0';
		}
		if (ch >= 'A' && ch <= 'F') {
			return ch - 'A' + 10;
		}
		if (ch >= 'a' && ch <= 'f') {
			return ch - 'a' + 10;
		}

		throw new IllegalArgumentException("invalid hex digit '" + ch + "'");
	}

	/**
	 * Reads the contents of the given URL and returns it as a string.
	 * 
	 * @param url
	 * @return
	 */
	public String urlToString(URL url) throws IOException {
		StringBuffer sb = new StringBuffer("");
		InputStream is = url.openStream();
		int n = 0;
		do {
			n = is.read();
			if (n >= 0) {
				sb.append((char) n);
			}
		} while (n >= 0);
		is.close();
		return sb.toString();
	}

	public String makeRandomDigit() {
		String rtn = null;
		try {
			char[] retChar = new char[5];
			for (int i = 0; i < retChar.length; i++) {
				double randomDigit = Math.random() * (double) 25.0 % 25.0;
				retChar[i] = (char) (randomDigit + 65);
				if ((char) retChar[i] < 'A' || (char) retChar[i] > 'Z') {
					throw new Exception("Unexpected text : " + retChar[i]);
				}
			}
			rtn = new String(retChar);
		} catch (Exception e) {
			e.printStackTrace(System.out);
			return "";
		}
		return rtn;
	}

	public String readClob(String fileName, Writer writerArg) throws FileNotFoundException, IOException {

		@SuppressWarnings("resource")
		BufferedReader br = new BufferedReader(new FileReader(fileName));
		String nextLine = "";
		StringBuffer sb = new StringBuffer();
		while ((nextLine = br.readLine()) != null) {
			System.out.println("Writing: " + nextLine);
			writerArg.write(nextLine);
			sb.append(nextLine);
		}
		// Convert the content into to a string
		String clobData = sb.toString();

		// Return the data.
		return clobData;
	}

	public String encryptSHA256(String str) {
		String sha = "";
		try {
			MessageDigest sh = MessageDigest.getInstance("SHA-256");
			sh.update(str.getBytes());
			byte byteData[] = sh.digest();
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < byteData.length; i++) {
				sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
			}
			sha = sb.toString();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			System.out.println("Encrypt Error - NoSuchAlgorithmException");
			sha = null;
		}
		return sha;
	}

	public static boolean isGreat(String baseStr, String compareStr) {
		baseStr = nvl(baseStr);
		compareStr = nvl(compareStr);

		int compare = baseStr.compareTo(compareStr);

		if (compare > 0) {
			return true;
		} else {
			return false;
		}
	}

	public static boolean isGreatOrEqual(String baseStr, String compareStr) {
		baseStr = nvl(baseStr);
		compareStr = nvl(compareStr);

		if (isGreat(baseStr, compareStr) || baseStr.equals(compareStr)) {
			return true;
		} else {
			return false;
		}
	}

	public static boolean isSmall(String baseStr, String compareStr) {
		return !isGreat(baseStr, compareStr) && !nvl(baseStr).equals(compareStr);
	}

	public static boolean isSmallOrEqual(String baseStr, String compareStr) {
		baseStr = nvl(baseStr);
		compareStr = nvl(compareStr);

		if (isSmall(baseStr, compareStr) || baseStr.equals(compareStr)) {
			return true;
		} else {
			return false;
		}
	}

	public class ClassSchedule {
		String job_cd;
		String job_nm;
		String job_schedule;

		public String getJob_cd() {
			return job_cd;
		}

		public void setJob_cd(String job_cd) {
			this.job_cd = job_cd;
		}

		public String getJob_nm() {
			return job_nm;
		}

		public void setJob_nm(String job_nm) {
			this.job_nm = job_nm;
		}

		public String getJob_schedule() {
			return job_schedule;
		}

		public void setJob_schedule(String job_schedule) {
			this.job_schedule = job_schedule;
		}
	}

	public class ClassIni {
		String job_id;
		String job_schedule;

		String src_ip;
		String src_port;
		String src_dbms_cd;
		String src_dbms;
		String src_db;
		String src_user;
		String src_passwd;
		String src_sql;

		String dest_ip;
		String dest_port;
		String dest_dbms_cd;
		String dest_dbms;
		String dest_db;
		String dest_table;
		String dest_user;
		String dest_passwd;

		String job_method_cd;
		String save_preq_cd;
		String save_preq;

		String job_type_cd;
		String job_class;
		String job_path;
		String job_selected;

		String use_yn;

		public String getJob_id() {
			return job_id;
		}

		public void setJob_id(String job_id) {
			this.job_id = job_id;
		}

		public String getJob_schedule() {
			return job_schedule;
		}

		public void setJob_schedule(String job_schedule) {
			this.job_schedule = job_schedule;
		}

		public String getSrc_ip() {
			return src_ip;
		}

		public void setSrc_ip(String src_ip) {
			this.src_ip = src_ip;
		}

		public String getSrc_port() {
			return src_port;
		}

		public void setSrc_port(String src_port) {
			this.src_port = src_port;
		}

		public String getSrc_dbms_cd() {
			return src_dbms_cd;
		}

		public void setSrc_dbms_cd(String src_dbms_cd) {
			this.src_dbms_cd = src_dbms_cd;
		}

		public String getSrc_dbms() {
			return src_dbms;
		}

		public void setSrc_dbms(String src_dbms) {
			this.src_dbms = src_dbms;
		}

		public String getSrc_db() {
			return src_db;
		}

		public void setSrc_db(String src_db) {
			this.src_db = src_db;
		}

		public String getSrc_user() {
			return src_user;
		}

		public void setSrc_user(String src_user) {
			this.src_user = src_user;
		}

		public String getSrc_passwd() {
			return src_passwd;
		}

		public void setSrc_passwd(String src_passwd) {
			this.src_passwd = src_passwd;
		}

		public String getSrc_sql() {
			return src_sql;
		}

		public void setSrc_sql(String src_sql) {
			this.src_sql = src_sql;
		}

		public String getDest_ip() {
			return dest_ip;
		}

		public void setDest_ip(String dest_ip) {
			this.dest_ip = dest_ip;
		}

		public String getDest_port() {
			return dest_port;
		}

		public void setDest_port(String dest_port) {
			this.dest_port = dest_port;
		}

		public String getDest_dbms_cd() {
			return dest_dbms_cd;
		}

		public void setDest_dbms_cd(String dest_dbms_cd) {
			this.dest_dbms_cd = dest_dbms_cd;
		}

		public String getDest_dbms() {
			return dest_dbms;
		}

		public void setDest_dbms(String dest_dbms) {
			this.dest_dbms = dest_dbms;
		}

		public String getDest_db() {
			return dest_db;
		}

		public void setDest_db(String dest_db) {
			this.dest_db = dest_db;
		}

		public String getDest_table() {
			return dest_table;
		}

		public void setDest_table(String dest_table) {
			this.dest_table = dest_table;
		}

		public String getDest_user() {
			return dest_user;
		}

		public void setDest_user(String dest_user) {
			this.dest_user = dest_user;
		}

		public String getDest_passwd() {
			return dest_passwd;
		}

		public void setDest_passwd(String dest_passwd) {
			this.dest_passwd = dest_passwd;
		}

		public String getJob_method_cd() {
			return job_method_cd;
		}

		public void setJob_method_cd(String job_method_cd) {
			this.job_method_cd = job_method_cd;
		}

		public String getSave_preq_cd() {
			return save_preq_cd;
		}

		public void setSave_preq_cd(String save_preq_cd) {
			this.save_preq_cd = save_preq_cd;
		}

		public String getSave_preq() {
			return save_preq;
		}

		public void setSave_preq(String save_preq) {
			this.save_preq = save_preq;
		}

		public String getJob_type_cd() {
			return job_type_cd;
		}

		public void setJob_type_cd(String job_type_cd) {
			this.job_type_cd = job_type_cd;
		}

		public String getJob_class() {
			return job_class;
		}

		public void setJob_class(String job_class) {
			this.job_class = job_class;
		}

		public String getJob_path() {
			return job_path;
		}

		public void setJob_path(String job_path) {
			this.job_path = job_path;
		}

		public String getJob_selected() {
			return job_selected;
		}

		public void setJob_selected(String job_selected) {
			this.job_selected = job_selected;
		}

		public String getUse_yn() {
			return use_yn;
		}

		public void setUse_yn(String use_yn) {
			this.use_yn = use_yn;
		}

	}

	public class ClassIniCol {
		int col_seq;
		String col_cd;
		String col_nm;
		String col_type;
		int col_len;
		String col_date;
		int codeidx;
		String col_enc;

		public int getCol_seq() {
			return col_seq;
		}

		public void setCol_seq(int col_seq) {
			this.col_seq = col_seq;
		}

		public String getCol_cd() {
			return col_cd;
		}

		public void setCol_cd(String col_cd) {
			this.col_cd = col_cd;
		}

		public String getCol_nm() {
			return col_nm;
		}

		public void setCol_nm(String col_nm) {
			this.col_nm = col_nm;
		}

		public String getCol_type() {
			return col_type;
		}

		public void setCol_type(String col_type) {
			this.col_type = col_type;
		}

		public int getCol_len() {
			return col_len;
		}

		public void setCol_len(int col_len) {
			this.col_len = col_len;
		}

		public String getCol_date() {
			return col_date;
		}

		public void setCol_date(String col_date) {
			this.col_date = col_date;
		}

		public int getCodeidx() {
			return codeidx;
		}

		public void setCodeidx(int codeidx) {
			this.codeidx = codeidx;
		}

		public String getCol_enc() {
			return col_enc;
		}

		public void setCol_enc(String col_enc) {
			this.col_enc = col_enc;
		}
	}

	@SuppressWarnings("resource")
	public ClassIni getIni(String sClass) {

		ClassIni classIni = new ClassIni();
		Connection connectionManage = null;
		ConnectionManager conMgr = null;
		conMgr = new ConnectionManagerAll4("postgresql");
		try {
			String sQuery;
			// connectionManage = GetManagerConnection();
			connectionManage = conMgr.getConnection();
			Statement mStatment = connectionManage.createStatement();
			sQuery = "\nSELECT S.JOB_ID, S.DEST_SERVER, S.JOB_SCHEDULE, S.SRC_IP, S.SRC_PORT, C1.DETAIL_NM SRC_DBMS, S.SRC_DBMS_CD, S.SRC_DB, S.SRC_USER \n";
			sQuery += "      ,S.SRC_PASSWD, S.SRC_SQL, S.USE_YN, S.DEST_IP, S.DEST_PORT, C2.DETAIL_NM DEST_DBMS, S.DEST_DBMS_CD, S.DEST_DB, S.DEST_USER \n";
			sQuery += "      ,S.DEST_PASSWD, S.JOB_METHOD_CD, S.DEST_TABLE, S.SAVE_PREQ_CD, S.SAVE_PREQ, S.JOB_TYPE_CD, S.JOB_CLASS, S.JOB_PATH, S.SELECT_YN \n";
			sQuery += "  FROM SCHEDULE S, CODEDETAIL C1, CODEDETAIL C2  \n";
			sQuery += " WHERE S.SRC_DBMS_CD = C1.DETAIL_CD  \n";
			sQuery += "   AND 'DBMS_CD'     = C1.GROUP_CD   \n";
			sQuery += "   AND S.SRC_DBMS_CD = C2.DETAIL_CD  \n";
			sQuery += "   AND 'DBMS_CD'     = C2.GROUP_CD   \n";
			sQuery += "   AND LOWER(JOB_CD) = LOWER('" + sClass + "') \n";

			// logger.debug("getIni sQuery:" + sQuery);

			ResultSet mResultSet = mStatment.executeQuery(sQuery);
			while (mResultSet.next()) {
				classIni.setDest_db(mResultSet.getString("DEST_DB"));
				classIni.setDest_dbms(mResultSet.getString("DEST_DBMS"));
				classIni.setDest_dbms_cd(mResultSet.getString("DEST_DBMS_CD"));
				classIni.setDest_ip(mResultSet.getString("DEST_IP"));
				classIni.setJob_method_cd(mResultSet.getString("JOB_METHOD_CD"));
				classIni.setDest_passwd(mResultSet.getString("DEST_PASSWD"));
				classIni.setDest_port(mResultSet.getString("DEST_PORT"));
				classIni.setDest_table(mResultSet.getString("DEST_TABLE"));
				classIni.setDest_user(mResultSet.getString("DEST_USER"));

				classIni.setSrc_db(mResultSet.getString("SRC_DB"));
				classIni.setJob_id(mResultSet.getString("JOB_ID"));
				classIni.setSrc_dbms(mResultSet.getString("SRC_DBMS"));
				classIni.setSrc_dbms_cd(mResultSet.getString("SRC_DBMS_CD"));
				classIni.setSrc_ip(mResultSet.getString("SRC_IP"));
				classIni.setSrc_user(mResultSet.getString("SRC_USER"));
				classIni.setSrc_passwd(mResultSet.getString("SRC_PASSWD"));
				classIni.setSrc_port(mResultSet.getString("SRC_PORT"));
				classIni.setSrc_sql(mResultSet.getString("SRC_SQL"));
				classIni.setUse_yn(mResultSet.getString("USE_YN"));
				classIni.setJob_type_cd(mResultSet.getString("JOB_TYPE_CD"));
				classIni.setJob_class(mResultSet.getString("JOB_CLASS"));
				classIni.setJob_path(mResultSet.getString("JOB_PATH"));
				classIni.setJob_selected(mResultSet.getString("SELECT_YN"));
				classIni.setJob_schedule(mResultSet.getString("JOB_SCHEDULE"));
				classIni.setSave_preq(mResultSet.getString("SAVE_PREQ"));
				classIni.setSave_preq_cd(mResultSet.getString("SAVE_PREQ_CD"));

			}

			mStatment.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connectionManage != null)
				try {
					// connectionManage.close();
					conMgr.freeConnection(connectionManage);
				} catch (Exception e) {
					logger.error(e.getMessage());
					e.printStackTrace();
				}
		}
		return classIni;
	}

	public ArrayList<ClassSchedule> getIniSchedule() {

		// System.out.println("UtilClass:: getIniSchedule" );

		ArrayList<ClassSchedule> arrayList = new ArrayList<ClassSchedule>();

		Connection connectionManage = null;
		ConnectionManager conMgr = null;
		conMgr = new ConnectionManagerAll4("postgresql");
		try {
			String sQuery;
			// connectionManage = GetManagerConnection();
			connectionManage = conMgr.getConnection();
			Statement mStatment = connectionManage.createStatement();
			sQuery = "\nSELECT JOB_CD,JOB_NM,JOB_SCHEDULE \n";
			sQuery += "  FROM SCHEDULE WHERE USE_YN = 'Y' AND JOB_SCHEDULE is not null \n";

			// logger.debug("sQuery");

			ResultSet mResultSet = mStatment.executeQuery(sQuery);
			while (mResultSet.next()) {
				ClassSchedule classSchedule = new ClassSchedule();
				classSchedule.setJob_cd(mResultSet.getString("JOB_CD"));
				classSchedule.setJob_nm(mResultSet.getString("JOB_NM"));
				classSchedule.setJob_schedule(mResultSet.getString("JOB_SCHEDULE"));
				arrayList.add(classSchedule);
			}

			mStatment.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connectionManage != null)
				try {
					// connectionManage.close();
					conMgr.freeConnection(connectionManage);
				} catch (Exception e) {
					logger.error(e.getMessage());
					e.printStackTrace();
				}
		}
		return arrayList;
	}

	public ArrayList<ClassIniCol> getIniCol(String sClass) {

		ArrayList<ClassIniCol> arrayList = new ArrayList<ClassIniCol>();
		Connection connectionManage = null;
		ConnectionManager conMgr = null;
		conMgr = new ConnectionManagerAll4("postgresql");
		try {
			String sQuery;
			// connectionManage = GetManagerConnection();
			connectionManage = conMgr.getConnection();
			Statement mStatment = connectionManage.createStatement();
			sQuery = "\nSELECT COL_SEQ,COL_CD,COL_NM,COL_TYPE_CD,COL_LEN,COL_DATE_YN,COL_ENC_YN\n ";
			sQuery += "  FROM SCHEDULE_COL c , SCHEDULE s WHERE c.job_id = s.job_id and lower(s.JOB_CD) = lower('"
					+ sClass + "')  order by col_seq \n";

			// logger.debug("getIniCol debug:" + sQuery);

			ResultSet mResultSet = mStatment.executeQuery(sQuery);
			// logger.debug("getIniCol debug:" );

			while (mResultSet.next()) {
				ClassIniCol classIniCol = new ClassIniCol();
				classIniCol.setCol_seq(mResultSet.getInt("COL_SEQ"));
				classIniCol.setCol_cd(mResultSet.getString("COL_CD"));
				classIniCol.setCol_nm(mResultSet.getString("COL_NM"));
				classIniCol.setCol_type(mResultSet.getString("COL_TYPE_CD"));
				classIniCol.setCol_len(mResultSet.getInt("COL_LEN"));
				classIniCol.setCol_date(mResultSet.getString("COL_DATE_YN"));
				classIniCol.setCol_enc(mResultSet.getString("COL_ENC_YN"));

				arrayList.add(classIniCol);
			}
			// logger.debug("getIniCol debug:");

			mStatment.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connectionManage != null)
				try {
					// connectionManage.close();
					conMgr.freeConnection(connectionManage);
				} catch (Exception e) {
					logger.error(e.getMessage());
					e.printStackTrace();
				}
		}
		return arrayList;
	}

	public String getUserProperty(String sProperty) {

		ClassLoader cl;
		cl = Thread.currentThread().getContextClassLoader();
		String envPath = null;

		String fileSeparator = System.getProperty("file.separator");
		/***
		 * System.out.println("==>fileSeparator:"+fileSeparator+":"+fileSeparator.substring(0,
		 * 1)); String javaHome = System.getenv("JAVA_HOME");
		 * System.out.println("==>javaHome:"+javaHome); String osName =
		 * System.getProperty("os.name"); System.out.println("==>osName:"+osName);
		 * String userDir = System.getProperty("user.dir");
		 * System.out.println("==>userDir:"+userDir);
		 ***/

		if (cl == null)
			cl = ClassLoader.getSystemClassLoader();

		URL url = cl.getResource(sProperty);
		// System.out.println("url:"+ url.toString());

		if (fileSeparator.equals("/")) {
			// System.out.println("==>fileSeparator1:"+fileSeparator);
			envPath = url.getPath().substring(0, url.getPath().length());
		} else {
			// System.out.println("==>fileSeparator2:"+fileSeparator);
			envPath = url.getPath().substring(1, url.getPath().length());
		}
		// System.out.println("==>envPath:"+envPath);

		return envPath;
	}

	public String getUserRootProperty(String sProperty) {

		ClassLoader cl;
		cl = Thread.currentThread().getContextClassLoader();
		String envPath = null;

		// System.out.println("UtilClass:: sProperty:"+ sProperty);

		String fileSeparator = System.getProperty("file.separator");
		/*
		 * System.out.println("==>fileSeparator:"+fileSeparator+":"+fileSeparator.
		 * substring(0, 1));
		 * 
		 * String javaHome = System.getenv("JAVA_HOME");
		 * System.out.println("==>javaHome:"+javaHome);
		 * 
		 * String osName = System.getProperty("os.name");
		 * System.out.println("==>osName:"+osName);
		 * 
		 * String userDir = System.getProperty("user.dir");
		 * System.out.println("==>userDir:"+userDir);
		 */

		if (cl == null)
			cl = ClassLoader.getSystemClassLoader();

		URL url = cl.getResource(sProperty);
		// logger.debug("url:"+ url.toString());
		// System.out.println("UtilClass:: url:"+ url.toString());

		if (fileSeparator.equals("/")) {
			// System.out.println("==>fileSeparator1:"+fileSeparator);
			envPath = url.getPath().substring(0, url.getPath().length());
		} else {
			// System.out.println("==>fileSeparator2:"+fileSeparator);
			envPath = url.getPath().substring(1, url.getPath().length());
		}
		// System.out.println("==>envPath:"+envPath);

		return envPath;
	}

	/**
	 * 파일 이름 추출 파일이 있는지 중복여부 체크
	 * 
	 * 파일 업로드 나머지 엘리먼트 Map에 저장
	 * 
	 * @param iter
	 * @param fMidir
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public HashMap getFileUpload(Iterator iter, File fMidir) {

		logger.debug("getFileUpload in ..... logger.debug");

		HashMap file_map = new HashMap();
		try {
			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next();
				if (item.isFormField()) {// 파일이 아닌경우
					String key = item.getFieldName();
					String value = item.getString("utf-8");// 한글 꺠지는거 방지 utf-8로 재설정
					// System.out.println("key=" + key + " value=" + value);
					file_map.put(key, value);// HashMap 에 담는다
				} else {// 파일인 경우 여기선 중복 로직 처리도 반듯이 해준다............
					// String fileName = new String(item.getName().getBytes("8859_1"),"euc-kr");//한글
					// 계속 깨짐
					String fileName = item.getName();// 한글 계속 깨짐
					logger.debug("getFileUpload fileName:" + fileName);

					String extension = FilenameUtils.getExtension(fileName);
					String filenameonly = FilenameUtils.getBaseName(fileName);
					logger.debug("getFileUpload filenameonly:" + filenameonly);
					logger.debug("getFileUpload extension:" + extension);

					if (!fileName.equals("") && fileName != null) {// 파일이름이 존재하고 업로드할 파일이 존재한다면 업로드 시작

						int idx = fileName.lastIndexOf("\\"); // 윈도우의 경우, c:\ 까지 얻기
						if (idx == -1) {
							idx = fileName.lastIndexOf("/"); // 유닉스(리눅스)의 경우
						}
						fileName = fileName.substring(idx + 1);
						String tempfileName = fileName;
						// ++++++++++++++파일중복로직 시작++++++++++++++
						File save_file = new File(fMidir.getPath(), fileName);
						if (save_file.exists()) {// 파일이 존재한다면
							for (int i = 1; true; i++) {
								fileName = filenameonly + "_" + i + "." + extension;
								save_file = new File(fMidir.getPath(), fileName);
								if (!save_file.exists()) {
									// fileName = i + "_"+ fileName;
									break;
								} else {
									fileName = tempfileName;
								}
							}
						}
						file_map.put("filename", fileName);
						fMidir = new File(fMidir.getPath(), fileName);
						item.write(fMidir);
						// ++++++++++++++파일중복로직 종료++++++++++++++
					} else {
						file_map.put("filename", null);
					} // End Of FileName if
				}
			}
		} catch (Exception e) {
			logger.debug("Error : " + e.getMessage());
		} finally {
		}
		return file_map;
	}

	public String getDbMsg(String sCode) {

		Connection connectionManage = null;
		ConnectionManager conMgr = null;
		conMgr = new ConnectionManagerAll4("postgresql");
		
		String sMsg = "Not Found";
		try {
			String sQuery;
			// connectionManage = GetManagerConnection();
			connectionManage = conMgr.getConnection();
			Statement mStatment = connectionManage.createStatement();
			sQuery = "SELECT DETAIL_NM \n";
			sQuery += " FROM MDDB.TB_CODE_DETAIL \n";
			sQuery += "  WHERE GROUP_CD  = 'POSTGRESQL'  \n ";
			sQuery += "    AND DETAIL_CD = '" + sCode + "' \n";

			ResultSet mResultSet = mStatment.executeQuery(sQuery);
			while (mResultSet.next()) {
				sMsg = mResultSet.getString("DETAIL_NM");	
			}

			mStatment.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connectionManage != null)
				try {
					// connectionManage.close();
					conMgr.freeConnection(connectionManage);
				} catch (Exception e) {
					logger.error(e.getMessage());
					e.printStackTrace();
				}
		}
		return sMsg;
	}
	
}
