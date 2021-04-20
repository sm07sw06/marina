<?php
/*
 * Base64 로 인코딩되어 전달된 엑셀파일의 내용을 decode하여 저장하는 rMate Grid 의 서버쪽 예제입니다.
*/
	date_default_timezone_set('US/Eastern');
	$data = $_POST['fileData'];
	$fileName = $_POST['fileName'];
	$updir = gethostname () + "/gridTest/savedFile/";
	$dt = new DateTime();
	
	$userIp = $_SERVER['SERVER_ADDR'];

	$filename = $userIp . "_" . $dt->format('YmdHis') . "." . $fileName;
	
	$filePath = $_SERVER['DOCUMENT_ROOT'] . "/gridTest/savedFile/" . $filename;

	$f = fopen($filePath, "w") or die("Unable to open file!");
	$path = "";

	if ($data != null && strlen($data) > 0) {
		$byteFile = base64_decode($data);
		fwrite($f, $byteFile);
	}
	fclose($f);
		
	$path = $updir . $filename;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="Content-Script-Type" content="text/javascript"/>
<meta http-equiv="Content-Style-Type" content="text/css"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Koe Grid for HTML5</title>
<link rel="stylesheet" type="text/css" href="http://demo.riamore.net/HTML5demo/grid/Samples/rMateGridH5Sample.css"/>
</head>

<body>
	<div id="header" style="text-align:center;font-family:Arial;">Upload Complete</div>
	<div id="content" style="text-align:center;">
		Path: <?php echo $path; ?><br>
	</div>
</body>
</html>

