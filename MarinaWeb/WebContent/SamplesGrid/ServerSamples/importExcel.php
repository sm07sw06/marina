<?php
/*
 * PHP fileupload 를 이용하여 엑셀파일을 처리하는 rMate Grid 의 서버쪽 예제입니다.
 * rMate Grid에서는 엑셀파일을 읽기 위해 input file 태그를 통해 엑셀파일을 서버에 올리고, 파일의 내용을 다시 받아 처리하도록 설계되어 있습니다.
 */

	$path = $_SERVER['DOCUMENT_ROOT'] . "/var/lib/tomcat6/webapps/ROOT/temp";
	$file_upload = false;
	$max_allowed_file_size = 100000000; //

	if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST") {
		foreach($_FILES as $file) {
			$name = $path . $file['name'];
			if (is_uploaded_file($file['tmp_name'])) {
				if(!copy($file['tmp_name'], $name)) {
					$message[] = "Error while copying the uploaded file.";
				} else {
					$outStr = "fileName=" . urlencode($file['name']) . "&encodedStr=";
					$myfile = fopen($file['tmp_name'], "r") or die("Unable to open file!");
					$filebinary = fread($myfile, filesize($file['tmp_name']));
					$outStr .= base64_encode($filebinary);
					$size = strlen($outStr);
					header("Content-Type: text/html; charset=utf-8");
					header("Content-Length: $size");
					echo $outStr;
					fclose($myfile);
				}
			}
		}
	}
?>