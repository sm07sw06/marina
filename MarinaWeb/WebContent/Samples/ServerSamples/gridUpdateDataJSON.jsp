<%@ page contentType="text/html; charset=utf-8" import="org.json.simple.*, org.json.simple.parser.*, java.io.*"%>
<%
/*
 * rMate DataGrid에서 getChangedData 함수를 사용하여 변경내역을 받아 서버에서 처리하는 예제입니다.
 * 샘플의 Editing_SubmitToServer.html에서 변경내역을 changedData 파라메터로 Ajax를 통해 보내주게 되며
 * 전달된 changedData를 JSON 파싱하여 변경 내역에 따라 작업을 한 후 메세지를 보내주도록 하였습니다.
 * https://github.com/fangyidong/json-simple 의 JSON Parser를 사용하였습니다.
 */
request.setCharacterEncoding("utf-8");

String changedData = request.getParameter("changedData");

if (changedData == null || changedData.length() == 0) {
	out.println("변경된 자료가 없습니다.");
	return;
}

// for debug
out.println("changedData:"+changedData);

try {
	JSONParser jsonParser = new JSONParser();
	//JSON데이터를 넣어 JSON Object 로 만들어 준다.
	Object jsonObject = jsonParser.parse(changedData);
	//배열 추출
	JSONArray changedDataArray = (JSONArray)jsonObject;
	String key;

	for (int i = 0; i < changedDataArray.size(); i++) {
		JSONObject cRecord = (JSONObject)changedDataArray.get(i);
		String job = cRecord.get("job").toString();
		String idx = cRecord.get("idx").toString();
		JSONObject data = (JSONObject)cRecord.get("data");
		key = data.get("Subject").toString();
		if ("D".equals(job)) {	// delete 처리
			// for debug
			out.println("delete key:"+key);
		} else if ("U".equals(job)) {		// update 처리
			// for debug
			out.println("update key:"+key);
		} else if ("I".equals(job)) {		// insert 처리
			// for debug
			out.println("insert key:"+key);
		} else {
			out.println("invalid job:"+job);
		}
	}
} catch(java.lang.Exception e) {
	out.println("Error:"+ e.toString());
}
%>
