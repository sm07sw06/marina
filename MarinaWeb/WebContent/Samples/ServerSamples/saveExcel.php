<?php
/*
 * Base64 �� ���ڵ��Ǿ� ���޵� ���������� ������ decode�Ͽ� download���ִ� rMate Grid �� ������ �����Դϴ�
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
