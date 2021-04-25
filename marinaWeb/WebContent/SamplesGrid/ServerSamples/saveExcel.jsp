<%@ page language="java" %><%@ page import="org.apache.commons.codec.binary.Base64, java.io.*, java.util.*, java.net.*"%><%
// apache commons codec(https://commons.apache.org/proper/commons-codec/)의 Base64 를 이용하여 전달된 엑셀파일의 내용을 decode하여 download해주는 rMate Grid 의 서버쪽 예제입니다.
// 파일이 클 경우 서버의 POST크기 제한 때문에 오류가 발생할 수 있으며, 이때에는 최대파일 크기를 감안하여 제한값을 늘려줘야 합니다.

String fileName = request.getParameter("fileName");

ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
int j = 0;

while (true) {
	String data = request.getParameter("fileData"+j);
	if (data != null && data.length() > 0) {
		byte[] dataByte = Base64.decodeBase64(data.getBytes());
		outputStream.write(dataByte);
		j++;
	} else
		break;
}

if (outputStream.size() > 0) {
//System.out.println("outputStream.size():"+outputStream.size());
	response.reset();
	response.setContentType("application/octet-stream");
	String client = request.getHeader("User-Agent");
	// ie일 경우
	if (client.indexOf("MSIE") != -1 || client.indexOf("Trident") != -1)
		response.setHeader("Content-Disposition","attachment; filename=" + URLEncoder.encode(fileName, "8859_1").replaceAll("\\+", "%20"));
	else
		response.setHeader("Content-Disposition","attachment; filename=\"" + fileName + "\"");
	response.setHeader("Content-Transfer-Encoding", "binary");
	response.setHeader("Content-Length",String.valueOf(outputStream.size()));

	out.clear();
	out = pageContext.pushBody();
	ServletOutputStream out2 = response.getOutputStream();
	out2.write(outputStream.toByteArray());
	out2.flush();
	out2.close();
}
%>