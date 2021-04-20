<%@ page import="java.util.*, java.io.*, java.net.*, org.apache.commons.fileupload.*,org.apache.commons.io.*"%><%
// apache commons fileupload(https://commons.apache.org/proper/commons-fileupload) 를 이용하여 CSV파일을 처리하는 rMate Grid 의 서버쪽 예제입니다.
// rMate Grid에서는 CSV파일을 읽기 위해 input file 태그를 통해 CSV파일을 서버에 올리고, CSV의 내용을 다시 받아 처리하도록 설계되어 있습니다.
// 이 예제에서는 commons-fileupload-1.1.1.jar를 사용하여 서버에 올라온 파일을 처리했습니다.

final String realPath = "/var/lib/tomcat6/webapps/bbs/temp";		// 파일 임시 저장소
final String tempPath = "/var/lib/tomcat6/webapps/bbs/temp";		// 파일 임시 저장소

DiskFileUpload upload = new DiskFileUpload();

boolean isMultipart = upload.isMultipartContent(request);
if (!isMultipart) {
	out.println("is not multipart content");
	return;
}

upload.setSizeMax(100000000);						// 파일 업로드 최대 size
upload.setSizeThreshold(4096);						// 메모리에 저장할 최대 size
upload.setRepositoryPath(tempPath);					// 파일 임시 저장소

List fileItems = upload.parseRequest(request);
Iterator iter = fileItems.iterator();
FileItem item;
String utf8 = "true";
String encoding = "euc-kr";

// utf8 추출
while (iter.hasNext()) {
	item = (FileItem)iter.next();
	if (item.isFormField()) {                                               // input type="file"이 아닌경우
//System.out.println("item.getFieldName():"+item.getFieldName()+":"+item.getString());
		if ("utf8".equals(item.getFieldName()))
			utf8 = item.getString();
		else if ("encoding".equals(item.getFieldName()))
			encoding = item.getString();
	}
}

iter = fileItems.iterator();
while (iter.hasNext()) {
	item = (FileItem)iter.next();

	if (!item.isFormField()) {						// input type="file" 인경우
		if ("fileImport".equals(item.getFieldName())) {		// rMate Grid 컴포넌트가 올린 파일의 input file명
			String fileName = item.getName();		// 경로가 포함된 파일명
			fileName = fileName.substring(fileName.lastIndexOf("\\")+1);		//경로제거하여 파일명만 가지고 옴
			String ext = FilenameUtils.getExtension(fileName);
			// 확장자 검사
			if (!"csv".equals(ext)) {
				out.println("csv file only.");
				return;
			}
			long fileSize = item.getSize();			//파일 사이즈

			String outStr = "<html><body><textarea>fileName=" + URLEncoder.encode(fileName, "utf-8") + "&csvStr=";
			response.reset();
			if ("true".equals(utf8))
				response.setContentType("text/html; charset=utf-8");
			else
				response.setContentType("text/html; charset="+encoding);
			response.setHeader("Content-Length",String.valueOf(outStr.length() + fileSize + 25));

			ServletOutputStream out2 = response.getOutputStream();
			out2.write(outStr.getBytes());
			out2.write(item.get());
			out2.write("</textarea></body></html>".getBytes());
			out2.flush();
			out2.close();
		}
	}
}
%>
