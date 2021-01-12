<%@page import="java.sql.SQLException"%>
<%@page import="java.sql.DriverManager"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.sql.PreparedStatement"%>
<%@page import="java.sql.Connection"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>회원 목록</title>
</head>
<body>
<caption>Member 테이블의 내용</caption>
<table width="100%" border="1">
    <thead>
        <tr>
            <th>이름</th>
            <th>아이디</th>
            <th>이메일</th>
        </tr>
    </thead>
    <tbody>
    <%
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
         
        try{
            String jdbcDriver = "jdbc:apache:commons:dbcp:/pool";
            conn = DriverManager.getConnection(jdbcDriver);
            pstmt = conn.prepareStatement("select * from tb_ate_hist");
            rs = pstmt.executeQuery();
            while(rs.next()){
    %>
        <tr>
            <td><%= rs.getString("dvc_id") %></td>
            <td><%= rs.getString("atte_time") %></td>
            <td><%= rs.getString("rec_type") %></td>
        </tr>
    <%
            }
        }catch(SQLException se){
            se.printStackTrace();
        }finally{
            if(rs != null) rs.close();
            if(pstmt != null) pstmt.close();
            if(conn != null) conn.close();
        }
    %>
    </tbody>
</table>
</body>
</html>
