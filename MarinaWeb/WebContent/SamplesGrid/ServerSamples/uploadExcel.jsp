<%@ page language="java" contentType="text/html; charset=utf-8" %><%@ page import="org.apache.commons.codec.binary.Base64, java.io.*, java.util.*"%><%
// apache commons codec(https://commons.apache.org/proper/commons-codec/)의 Base64 를 이용하여 전달된 엑셀파일의 내용을 decode하여 저장하는 rMate Grid 의 서버쪽 예제입니다.
// 파일이 클 경우 서버의 POST크기 제한 때문에 오류가 발생할 수 있으며, 이때에는 최대파일 크기를 감안하여 제한값을 늘려줘야 합니다.

	String data = request.getParameter("fileData");
	String fileName = request.getParameter("fileName");
	String updir = request.getServerName() + "/gridTest/savedFile/";
	Date date = new Date();

	String userIp = request.getRemoteAddr();

	String filename = userIp + "_" + date.getTime()  + "." + fileName;

	String filePath = "/var/www/html/gridTest/savedFile/" + filename;

	File f = new File(filePath);
	String path = "";
	if(!f.exists())
	{
		f.createNewFile();

		if (data != null && data.length() > 0) {
//System.out.println("data.length:"+data.length());
			byte[] byteFile = Base64.decodeBase64(data.getBytes());

			FileOutputStream fileoutputstream = new FileOutputStream(f);

			for (int i=0,len=byteFile.length; i<len; ++i)
			{
				fileoutputstream.write(byteFile[i]);
			}
			fileoutputstream.close();
		}

		path=updir+filename;
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="Content-Script-Type" content="text/javascript"/>
<meta http-equiv="Content-Style-Type" content="text/css"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>rMate Grid for HTML5</title>
<link rel="stylesheet" type="text/css" href="http://demo.riamore.net/HTML5demo/grid/Samples/rMateGridH5Sample.css"/>
</head>
<body>
	<div id="header" style="text-align:center;font-family:맑은 고딕;">서버로 Excel 전송 완료</div>
	<div id="content" style="text-align:center;">
		경로 : <%=path%><br>
	</div>
</body>
</html>

