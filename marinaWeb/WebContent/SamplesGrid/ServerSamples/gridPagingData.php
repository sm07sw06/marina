<?php
/*
 * rMate DataGrid���� ����¡ ����� �־� �����͸� ��ȸ�ϴ� �����Դϴ�.
 * ������ Data_Paging.html���� ����¡ �׺���̼��� ����� ����ڰ� Ŭ���� �������� �ڷḦ
 * �������� json�������� �����ֵ��� �Ͽ����ϴ�.
 */

	header("Content-type: text/html; charset=utf-8");

	$pg = $_GET['page'];

	if ($pg == null || strlen($pg) == 0) {
		$pg = "1";
	}

	$From = array("Amit", "Amit", "Amit", "Barb", "Barb", "Harry", "Harry", "John", "John", "Phill", "Phill", "Phill", "Phill", "James", "James", "James", "Jennifer", "Jennifer", "Jennifer", "Amit");
	$Subject = array("GMC-1 Release1", "GMC-1 Release2", "GMC-1 Release3", "GMC-1 Release3", "GMC-1 Release4", "GMC-1 Release2", "GMC-1 Release3", "GMC-1 Release2", "GMC-1 Release3", "GMC-1 Release1", "GMC-1 Release1", "GMC-1 Release3", "GMC-1 Release4", "GMC-1 Release4", "GMC-1 Release5", "GMC-1 Release6", "GMC-1 Release3", "GMC-1 Release4", "GMC-1 Release1", "GMC-1 Release2");
	$ReceiveDate = array("2006/12/07", "2006/12/07", "2006/12/11", "2006/12/08", "2006/12/06", "2006/11/28", "2006/12/08", "2006/12/07", "2006/12/07", "2006/12/08", "2006/12/08", "2006/12/08", "2006/12/08", "2006/11/21", "2006/11/19", "2006/11/22", "2006/11/23", "2006/11/29", "2006/12/01", "2006/12/21");
	$SendDate = array("2006/12/07", "2006/12/07", "2006/12/11", "2006/12/08", "2006/12/07", "2006/11/28", "2006/12/07", "2006/12/07", "2006/12/07", "2006/12/08", "2006/12/08", "2006/12/08", "2006/12/07", "2006/11/21", "2006/11/19", "2006/11/21", "2006/11/23", "2006/11/28", "2006/12/01", "2006/12/21");
	$CC = array("Jim", "Jim", "Jim", "Anant", "Anant", "Ram", "Ram", "Jim", "Jim", "Jim", "Jim", "Jim", "Anant", "Michael", "William", "David", "Michelle", "David", "Michelle", "Ram");
	$Length = array("75126", "95822", "1862456", "65488", "4851568", "13548", "1235", "84621877", "51846", "31680", "1813", "13548", "16588", "5158", "216815", "312566", "8512", "6841", "7513", "55480");
	$AttachCount = array("1", "2", "31", "0", "12", "2", "0", "5", "3", "0", "0", "1", "0", "0", "2", "3", "1", "0", "0", "2");

	print("[\n");
	$arr_length = count($From);
	for ($i = 0; $i < $arr_length; $i++) {
		print("{\n");
		print("\"From\":\"" . $From[$i] . "\",\n");
		print("\"Subject\":\"Page " . $pg . " " . $Subject[$i] . "\",\n");
		print("\"ReceiveDate\":\"" . $ReceiveDate[$i] . "\",\n");
		print("\"SendDate\":\"" . $SendDate[$i] . "\",\n");
		print("\"CC\":\"" . $CC[$i] . "\",\n");
		print("\"Length\":" . $Length[$i] . ",\n");
		print("\"AttachCount\":" . $AttachCount[$i] . "\n");
		if ($i < $arr_length - 1)
			print("},\n");
		else
			print("}\n");
	}
	print("]\n");
?>
