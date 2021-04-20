<?
/*
 * rMate DataGrid에서 getChangedDataXML 함수를 사용하여 변경내역을 받아 서버에서 처리하는 예제입니다.
 * 샘플의 Editing_SubmitToServer.html에서 변경내역을 changedDataXML 파라메터로 Ajax를 통해 보내주게 되며
 * 전달된 changedDataXML를 파싱하여 변경 내역에 따라 작업을 한 후 메세지를 보내주도록 하였습니다.
 */
@header('Content-Type: text/plain; charset=utf-8');

$changedDataXML;

if ($changedDataXML == null || strlen($changedDataXML) == 0) {
	echo ("변경된 자료가 없습니다.");
	return;
}

// for debug
echo "changedData:".$changedDataXML."\n";

// XML 파서 생성
$xmlParser = new DOMDocument();
$xmlParser->loadXML($changedDataXML);

$idxNode = $xmlParser->getElementsByTagName("idx");		// 변경내역의 인덱스
$jobNode = $xmlParser->getElementsByTagName("job");		// 변경종류 - 삭제의 경우 "D", 수정의 경우 "U", 추가의 경우 "I"가 들어 있습니다.
$dataNode = $xmlParser->getElementsByTagName("data");	// 변경된 데이터 - 사용자가 수정 또는 추가한 데이터나 삭제된 데이터

// for debug
echo "idxNode:".$idxNode->length." jobNode:".$jobNode->length." dataNode:".$dataNode->length."\n";


for ($i = 0; $i < $jobNode->length; $i++) {
	$job = $jobNode->item($i)->firstChild->nodeValue;
	$data = $dataNode->item($i);
	$key;

	if ("D" == $job) {	// delete 처리
		$dataNodes = $data->getElementsByTagName("Subject");
		if ($dataNodes->length > 0) {
			$key = $dataNodes->item(0)->firstChild->nodeValue;
			// for debug
			echo "delete key:".$key."\n";
		} else
			echo "delete - not found data nodes\n";
	} else if ("U" == $job) {		// update 처리
		$dataNodes = $data->getElementsByTagName("Subject");
		if ($dataNodes->length > 0) {
			$key = $dataNodes->item(0)->firstChild->nodeValue;
			// for debug
			echo "update key:".$key."\n";
		} else
			echo "update - not found data nodes\n";
	} else {		// insert 처리
		$dataNodes = $data->getElementsByTagName("Subject");
		if ($dataNodes->length > 0) {
			$key = $dataNodes->item(0)->firstChild->nodeValue;
			// for debug
			echo "insert key:".$key."\n";
		} else
			echo "insert - not found data nodes\n";
	}
}
?>
