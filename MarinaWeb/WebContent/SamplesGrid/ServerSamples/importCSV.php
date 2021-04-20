<?php
/*
 * PHP fileupload 를 이용하여 CSV파일을 처리하는 rMate Grid 의 서버쪽 예제입니다.
 * rMate Grid에서는 CSV파일을 읽기 위해 input file 태그를 통해 CSV파일을 서버에 올리고, CSV의 내용을 다시 받아 처리하도록 설계되어 있습니다.
 */

	$path = $_SERVER['DOCUMENT_ROOT'] . "/var/lib/tomcat6/webapps/ROOT/temp";
	$count = 0;
	$file_upload = false;
	$max_allowed_file_size = 100000000; //

	if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST") {
		foreach($_FILES as $file) {
			$name = $path . $file['name'];
			if (is_uploaded_file($file['tmp_name'])) {
				if(!copy($file['tmp_name'], $name)) {
					$message[] = "Error while copying the uploaded file.";
				} else {
					$outStr = "fileName=" . urlencode($file['name']) . "&csvStr=";
					$size = filesize($file['tmp_name']) + strlen($outStr);
					header("Content-Type: text/html; charset=utf-8");
					header("Content-Length: $size");

					$myfile = fopen($file['tmp_name'], "r") or die("Unable to open file!");
					while (($data = fgetcsv($myfile, 1024, ",")) !== FALSE) {
						$num = count($data);
						for ($c=0; $c < $num; $c++) {
							if ($c == $num-1)
								$outStr .= $data[$c] . "<br>";
							else
								$outStr .= $data[$c] . ",";
						}
					}
					fclose($myfile);

					//echo "<SCRIPT> alert( '" . $outStr . "'); </SCRIPT>";
					echo $outStr;
				}
			}
		}
	}
?>