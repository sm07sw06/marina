<%@ page contentType="text/html; charset=utf-8" import="org.w3c.dom.*, org.xml.sax.*, java.io.*, javax.xml.parsers.*"%>
<%
/*
 * rMate DataGrid에서 getChangedDataXML 함수를 사용하여 변경내역을 받아 서버에서 처리하는 예제입니다.
 * 샘플의 Editing_SubmitToServer.html에서 변경내역을 changedDataXML 파라메터로 Ajax를 통해 보내주게 되며
 * 전달된 changedDataXML를 파싱하여 변경 내역에 따라 작업을 한 후 메세지를 보내주도록 하였습니다.
 * java 의 DocumentBuilderFactory와 DocumentBuilder를 사용하여 XML을 파싱합니다.
 */
request.setCharacterEncoding("utf-8");

String changedData = request.getParameter("changedDataXML");

if (changedData == null || changedData.length() == 0) {
	out.println("변경된 자료가 없습니다.");
	return;
}

// for debug
out.println("changedData:"+changedData);

try {
	// DocumentBuilderFactory 의 객체 생성
	DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
	// factory로부터 DocumentBuilder 를 얻어온다.
	DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
	InputSource is = new InputSource();
	is.setCharacterStream(new StringReader(changedData));
	Document doc = docBuilder.parse(is);
	// 전달 내역 파싱
	NodeList idxNodeDOC = doc.getElementsByTagName("idx");		// 변경내역의 인덱스
	NodeList jobNodeDOC = doc.getElementsByTagName("job");		// 변경종류 - 삭제의 경우 "D", 수정의 경우 "U", 추가의 경우 "I"가 들어 있습니다.
	NodeList dataNodeDOC = doc.getElementsByTagName("data");	// 변경된 데이터 - 사용자가 수정 또는 추가한 데이터나 삭제된 데이터

	// for debug
	out.println("idxNodeDOC:"+idxNodeDOC.getLength()+" jobNodeDOC:"+jobNodeDOC.getLength()+" dataNodeDOC:"+dataNodeDOC.getLength());

	for (int i = 0; i < jobNodeDOC.getLength(); i++) {
		String job = jobNodeDOC.item(i).getFirstChild().getNodeValue();
		Element data = (Element)dataNodeDOC.item(i);
		String key;

		if ("D".equals(job)) {	// delete 처리
			NodeList dataNodes = data.getElementsByTagName("Subject");
			if (dataNodes.getLength() > 0) {
				key = dataNodes.item(0).getFirstChild().getNodeValue();
				// for debug
				out.println("delete key:"+key);
			} else
				out.println("delete - not found data nodes");
		} else if ("U".equals(job)) {		// update 처리
			NodeList dataNodes = data.getElementsByTagName("Subject");
			if (dataNodes.getLength() > 0) {
				key = dataNodes.item(0).getFirstChild().getNodeValue();
				// for debug
				out.println("update key:"+key);
			} else
				out.println("update - not found data nodes");
		} else {		// insert 처리
			NodeList dataNodes = data.getElementsByTagName("Subject");
			if (dataNodes.getLength() > 0) {
				key = dataNodes.item(0).getFirstChild().getNodeValue();
				// for debug
				out.println("insert key:"+key);
			} else
				out.println("insert - not found data nodes");
		}
	}
} catch(java.lang.Exception e) {
	out.println("Error:"+ e.toString());
}
%>
