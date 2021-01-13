<?php
/*
 * Base64 로 인코딩되어 전달된 엑셀파일의 내용을 decode하여 download해주는 rMate Grid 의 서버쪽 예제입니다
 */

	$fileName = $_REQUEST['fileName'];
	$j = 0;

	$data_length = 0;
	$data_byte = "";

	header("Content-Type: application/octet-stream");
	header('Content-Disposition: attachment; filename="' . $fileName . '"');

	while (true) {
		$data = $_REQUEST["fileData" . $j];
		$data_length += strlen($data);
		if ($data != null && $data_length > 0) {
			$data_byte = base64_decode($data);
			echo $data_byte;
			$j++;
		} else
			break;
	}

	/*if ($data_length > 0) {
		header("Content-Type: application/octet-stream");
		header('Content-Disposition: attachment; filename="' . $fileName . '"');
		header("Content-Length: $data_length");

		echo $data_byte;
	}*/
?>
