<%@CODEPAGE="65001" Language=VBScript %>
<%
'
' rMate DataGrid에서 getChangedDataXML 함수를 사용하여 변경내역을 받아 서버에서 처리하는 예제입니다.
' 샘플의 Editing_SubmitToServer.html에서 변경내역을 changedDataXML 파라메터로 Ajax를 통해 보내주게 되며
' 전달된 changedDataXML를 파싱하여 변경 내역에 따라 작업을 한 후 메세지를 보내주도록 하였습니다.
' 윈도우의 msxml2.domDocument를 사용하여 XML을 파싱합니다.
'
Option Explicit
Session.CodePage = "65001"
Response.Charset="utf-8"

Dim changedData

changedData = Request.Form("changedDataXML")

If IsEmpty(changedData) Or IsNull(changedData) Or changedData = "" Then
	Response.Write("변경된 자료가 없습니다.")
	Response.End
End If

// for debug
Response.Write("changedData:" & changedData & vbCrLf)

// XML 파서 생성
Dim objXmlParser, idxNode, jobNode, dataNode
Set objXmlParser = Server.CreateObject("msxml2.domDocument")
objXmlParser.async = false
objXmlParser.loadXML(changedData)

Set idxNode = objXmlParser.getElementsByTagName("idx")		' 변경내역의 인덱스
Set jobNode = objXmlParser.getElementsByTagName("job")		' 변경종류 - 삭제의 경우 "D", 수정의 경우 "U", 추가의 경우 "I"가 들어 있습니다.
Set dataNode = objXmlParser.getElementsByTagName("data")	' 변경된 데이터 - 사용자가 수정 또는 추가한 데이터나 삭제된 데이터

' for debug
Response.Write("idxNode:" & idxNode.Length & " jobNode:" & jobNode.Length & " dataNode:" & dataNode.Length & vbCrLf)

Dim i, dataNodes, job, data, key
For i = 0 To jobNode.Length - 1
	job = jobNode.Item(i).childNodes(0).Text
	Set data = dataNode.Item(i)

	If "D" = job Then	' delete 처리
		Set dataNodes = data.getElementsByTagName("Subject")
		If dataNodes.Length > 0 Then
			key = dataNodes.Item(0).ChildNodes(0).Text
			' for debug
			Response.Write("delete key:" & key & vbCrLf)
		Else
			Response.Write("delete - not found data nodes" & vbCrLf)
		End If
	Else
		If "U" = job Then		' update 처리
			Set dataNodes = data.getElementsByTagName("Subject")
			If dataNodes.Length > 0 Then
				key = dataNodes.Item(0).ChildNodes(0).Text
				' for debug
				Response.Write("update key:" & key & vbCrLf)
			Else
				Response.Write("update - not found data nodes" & vbCrLf)
			End If
		Else		' insert 처리
			Set dataNodes = data.getElementsByTagName("Subject")
			If dataNodes.Length > 0 Then
				key = dataNodes.Item(0).ChildNodes(0).Text
				' for debug
				Response.Write("insert key:" & key & vbCrLf)
			Else
				Response.Write("insert - not found data nodes" & vbCrLf)
			End If
		End If
	End If
	Set data = nothing
	Set dataNodes = nothing
Next
Set objXmlParser = nothing
%>
