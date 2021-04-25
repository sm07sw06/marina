package com.a1ck.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.http.HttpServlet;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class CodeClass extends HttpServlet { 
	
	
	private static final long serialVersionUID = -6108753779473516316L;

	private final Logger logger = LogManager.getLogger(this.getClass().getName() + ".class");
	
	/** Server List **/
	private static HashMap<String, String > hashMapServer = new HashMap<String, String>();

	public static synchronized HashMap<String, String> getHashMapServer() {
		return hashMapServer;
	}

	public static synchronized void setHashMapServer(HashMap<String, String> target) {
		hashMapServer = target;
	}


	
	/** Code List **/
	private static HashMap<String, ArrayList<CodeDetail>> hashMap = new HashMap<String, ArrayList<CodeDetail>>();

	public static synchronized HashMap<String, ArrayList<CodeDetail>> getHashMap() {
		return hashMap;
	}

	public static synchronized void setHashMap(HashMap<String, ArrayList<CodeDetail>> target) {
		hashMap = target;
	}

	public static class CodeDetail {
		
		String grpCD, code, codeNm;

		public String getGrpCD() {
			return grpCD;
		}

		public void setGrpCD(String grpCD) {
			this.grpCD = grpCD;
		}

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}

		public String getCodeNm() {
			return codeNm;
		}

		public void setCodeNm(String codeNm) {
			this.codeNm = codeNm;
		}
	}
	
	public CodeClass() {
		super();
		
	//	logger.debug("**** ... CodeClass .........................");
	}


	public String getComboBoxByServer(String value, boolean first) {
		
		ArrayList<String> resultList = new ArrayList<>();
		StringBuffer sb = new StringBuffer();
		String selChk = "";
	
		String sServerId = "";
		String sServerNm = "";	
		int nInpos = 0;
		
		@SuppressWarnings("rawtypes")
		Set key = CodeClass.getHashMapServer().keySet();
		for (@SuppressWarnings("rawtypes")
		Iterator iterator = key.iterator(); iterator.hasNext();) {
        	selChk = "";
			sServerId = (String) iterator.next(); 
			logger.debug("sServerId:" + sServerId);
			sServerNm = (String) CodeClass.getHashMapServer().get(sServerId); // 값이 따라 형변환 필요 System.out.println(keyName +" = " +valueName); }
			
			if(first && nInpos == 0) {
				selChk = " selected";
				nInpos = 1;
				logger.debug(sServerNm);
			} else if(value != null && value.length() > 0 ) {
				//logger.debug("bean.getCode:" + bean.getCode());
				if(sServerId.equals(value)) {
					selChk = " selected";
					logger.debug(sServerNm);
					nInpos = 1;
				}
			}
			
			sb.append("<option value='" + sServerId + "'" + selChk + ">");
			sb.append(sServerNm);
			sb.append("</option>");
		}
		resultList.add(sb.toString());

		logger.debug(resultList.toString());
		return resultList.toString();
		
	}


	 
	public String getComboBoxByCodeList(String grpCD, String value, boolean first) {
		ArrayList<String> resultList = new ArrayList<>();
		ArrayList<CodeDetail> codeList = getHashMap().get(grpCD);
		StringBuffer sb = new StringBuffer();
		String selChk = "";
		if(codeList != null && codeList.size() > 0 ) {
			int nInposFirst = 0;
			for(CodeDetail bean : codeList) {
				selChk = "";
				if(first)  {
					if(nInposFirst == 0 && bean.getCode().equals(value)) {
						selChk = " selected";
						nInposFirst = 1;
					}
				} else if(value != null && value.length() > 0 ) {
					//logger.debug("bean.getCode:" + bean.getCode());
					if(bean.getCode().equals(value)) {
						selChk = " selected";
					}
				}
				
				sb.append("<option value='" + bean.getCode() + "'" + selChk + ">");
				sb.append(bean.getCodeNm());
				sb.append("</option>");
			}
			resultList.add(sb.toString());
		}
		
		//logger.debug(resultList.toString());
		return resultList.toString();
		
	}	
	 
}
