package com.a1ck.classes;


import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.a1ck.util.ConnectionManager;
import com.a1ck.util.ConnectionManagerAll4;

public class TestConnPool {
    public static void main(String[] args) {
        
        ConnectionManager conMgr = new ConnectionManagerAll4("mysql");  
        Connection conn = null;
        Statement  stmt = null;
        ResultSet  rs = null;

        String query = "SELECT * FROM tb_ate_hist";

        try {
            // 데이터베이스의 연결을 설정한다.
            conn = conMgr.getConnection();  // pool dhlee
            // Statement를 가져온다.
            stmt = conn.createStatement();

            // SQL문을 실행한다.
            rs = stmt.executeQuery(query);

            while (rs.next()) { 
                String empno = rs.getString(1);
                String ename = rs.getString(2);
                String job = rs.getString(3);
                String mgr = rs.getString(4);
                // 결과를 출력한다.
                System.out.println( empno + " : " + ename + " : " + job + " : " + mgr); 
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                // ResultSet를 닫는다.
                rs.close();
                // Statement를 닫는다.
                stmt.close();
                // Connection 를 풀로 복귀시킨다.
                conMgr.freeConnection(conn);  // pool dhlee
            } catch (SQLException e) {}
        }
    } // main()의 끝
} // 클래스의 끝