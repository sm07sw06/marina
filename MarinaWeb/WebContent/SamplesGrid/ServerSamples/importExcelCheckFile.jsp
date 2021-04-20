<%@ page import="java.util.*, java.io.*, java.nio.*, java.net.*, org.apache.commons.fileupload.*, org.apache.commons.io.*, org.apache.commons.codec.binary.Base64"%><%
// apache commons fileupload(https://commons.apache.org/proper/commons-fileupload) 를 이용하여 엑셀파일을 처리하는 rMate Grid 의 서버쪽 예제입니다.
// rMate Grid에서는 엑셀파일을 읽기 위해 input file 태그를 통해 엑셀파일을 서버에 올리고, 파일의 내용을 다시 받아 처리하도록 설계되어 있습니다.
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

iter = fileItems.iterator();
while (iter.hasNext()) {
	item = (FileItem)iter.next();

	if (!item.isFormField()) {						// input type="file" 인경우
		if ("fileImport".equals(item.getFieldName())) {		// rMate Grid 컴포넌트가 올린 파일의 input file명
			String fileName = item.getName();		// 경로가 포함된 파일명
			fileName = fileName.substring(fileName.lastIndexOf("\\")+1);		//경로제거하여 파일명만 가지고 옴
			String ext = FilenameUtils.getExtension(fileName);
			// 확장자 검사
			if (!"xls".equals(ext) && !"xlsx".equals(ext)) {
				out.println("xls or xlsx file only.");
				return;
			}
			long fileSize = item.getSize();			//파일 사이즈
			byte[] fileByte = item.get();
			long n;
			// xls 파일 여부
			if ("xls".equals(ext)) {
				n = ByteBuffer.wrap(fileByte).getInt();
				if (n != 0xD0CF11E0) {
					out.println("Invalid xls file.:"+n);
					return;
				}
			}
			// xlsx 파일 여부 검사
			if ("xlsx".equals(ext)) {
				n = ByteBuffer.wrap(fileByte).getInt();
				if (n != 0x504B0304) {
					out.println("Invalid xlsx file.:"+n);
					return;
				}
			}
			byte[] dataByte = Base64.encodeBase64(fileByte);

			String outStr = "<html><body><textarea>fileName=" + URLEncoder.encode(fileName, "utf-8") + "&encodedStr=";
			response.reset();
			response.setContentType("text/html; charset=utf-8");
			response.setHeader("Content-Length",String.valueOf(outStr.length() + dataByte.length + 25));

			ServletOutputStream out2 = response.getOutputStream();
			out2.write(outStr.getBytes());
			out2.write(dataByte);
			out2.write("</textarea></body></html>".getBytes());
			out2.flush();
			out2.close();
		}
	}
}
%>
