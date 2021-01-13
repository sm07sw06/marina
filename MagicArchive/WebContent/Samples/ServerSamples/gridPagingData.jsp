<%@ page contentType="text/html; charset=utf-8"%>
<%
/*
 * rMate DataGrid에서 페이징 기능을 넣어 데이터를 조회하는 예제입니다.
 * 샘플의 Data_Paging.html에서 페이징 네비게이션을 만들고 사용자가 클릭한 페이지의 자료를
 * 서버에서 json형식으로 보내주도록 하였습니다.
 */
request.setCharacterEncoding("utf-8");

String pg = request.getParameter("page");

if (pg == null || pg.length() == 0) {
	pg = "1";
}

String[] From = {"Amit", "Amit", "Amit", "Barb", "Barb", "Harry", "Harry", "John", "John", "Phill", "Phill", "Phill", "Phill", "김철수", "김철수", "김철수", "이영희", "이영희", "이영희", "Amit"};
String[] Subject = {"GMC-1 Release1", "GMC-1 Release2", "GMC-1 Release3", "GMC-1 Release3", "GMC-1 Release4", "GMC-1 Release2", "GMC-1 Release3", "GMC-1 Release2", "GMC-1 Release3", "GMC-1 Release1", "GMC-1 Release1", "GMC-1 Release3", "GMC-1 Release4", "GMC-1 Release4", "GMC-1 Release5", "GMC-1 Release6", "GMC-1 Release3", "GMC-1 Release4", "GMC-1 Release1", "GMC-1 Release2"};
String[] ReceiveDate = {"2006/12/07", "2006/12/07", "2006/12/11", "2006/12/08", "2006/12/06", "2006/11/28", "2006/12/08", "2006/12/07", "2006/12/07", "2006/12/08", "2006/12/08", "2006/12/08", "2006/12/08", "2006/11/21", "2006/11/19", "2006/11/22", "2006/11/23", "2006/11/29", "2006/12/01", "2006/12/21"};
String[] SendDate = {"2006/12/07", "2006/12/07", "2006/12/11", "2006/12/08", "2006/12/07", "2006/11/28", "2006/12/07", "2006/12/07", "2006/12/07", "2006/12/08", "2006/12/08", "2006/12/08", "2006/12/07", "2006/11/21", "2006/11/19", "2006/11/21", "2006/11/23", "2006/11/28", "2006/12/01", "2006/12/21"};
String[] CC = {"Jim", "Jim", "Jim", "Anant", "Anant", "Ram", "Ram", "Jim", "Jim", "Jim", "Jim", "Jim", "Anant", "박순이", "이미자", "박만수", "김영자", "박만수", "김영자", "Ram"};
String[] Length = {"75126", "95822", "1862456", "65488", "4851568", "13548", "1235", "84621877", "51846", "31680", "1813", "13548", "16588", "5158", "216815", "312566", "8512", "6841", "7513", "55480"};
String[] AttachCount = {"1", "2", "31", "0", "12", "2", "0", "5", "3", "0", "0", "1", "0", "0", "2", "3", "1", "0", "0", "2"};

out.println("[");
for (int i = 0; i < From.length; i++) {
	out.println("{");
	out.println("\"From\":\""+From[i]+"\",");
	out.println("\"Subject\":\"Page "+pg+" "+Subject[i]+"\",");
	out.println("\"ReceiveDate\":\""+ReceiveDate[i]+"\",");
	out.println("\"SendDate\":\""+SendDate[i]+"\",");
	out.println("\"CC\":\""+CC[i]+"\",");
	out.println("\"Length\":"+Length[i]+",");
	out.println("\"AttachCount\":"+AttachCount[i]);
	if (i < From.length - 1)
		out.println("},");
	else
		out.println("}");
}
out.println("]");
%>
