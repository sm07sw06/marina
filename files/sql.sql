/* 최종변경시각 트리거 */
CREATE TRIGGER update_trigger
BEFORE UPDATE ON tb_anchor
FOR EACH ROW
EXECUTE PROCEDURE update_time();


/* 장치 수집 */
SELECT DISTINCT machine_id,  FROM public.tb_lidardata;
SELECT DISTINCT machine_id   FROM public.tb_boatdata;
SELECT DISTINCT machine_id   FROM public.tb_rssidata;
SELECT DISTINCT boat_recv_id FROM public.tb_rssidata;




-- delete from tb_boatdata
-- delete from tb_lidardata
-- delete from tb_rssidata

SELECT distinct machine_id
	FROM public.tb_boatdata
	where latitude > 0
	
SELECT *
	FROM public.tb_boatdata
	where 1 = 1
--	and latitude > 0 
-- 	 and machine_id = '0013A20041BB953E'
 	 and machine_id = '0013A20041BB9636'
	order by send_time desc	
	
SELECT *
	FROM public.tb_rssidata
	where 1 = 1
--	and boat_recv_id = '0013A20041BB953E'
	and boat_recv_id = '0013A20041BB9636'
	order by   send_time desc	, send_recv_time desc
	
	

/*** logic  */

// setp 1 ( 우측 방향에 보트가 식별시 가장 가까운 보트 찾기)

 SELECT rd.boat_recv_id, rd.rssi   // 0013A20041BF1586  46
   FROM tb_anchor_device  ad, tb_rssidata rd,tb_lidardata ld
  WHERE 1 = 1
    AND ad.machine_id = rd.machine_id
    AND ad.machine_id = 'F83224878CA2'
	AND ld.send_time ='20210415163608'
	AND rd.rssi > 55
	AND ld.send_time BETWEEN to_char((to_timestamp(rd.send_recv_time, 'YYYYMMDDHH24MISS') - interval '4 sec'),'YYYYMMDDHH24MISS') 
	AND to_char((to_timestamp(rd.send_recv_time, 'YYYYMMDDHH24MISS') + interval '4 sec'),'YYYYMMDDHH24MISS')  
  ORDER BY rd.rssi 
  LIMIT 1

// setp 2 ( 찾은 보트가 정박 상태 인지 확인)  정박이면 미등록,  아니면 계속

SELECT b.boat_status     // 보트상태 (9:미가입,  1: 정박,  0:출항)
  FROM tb_boat_device bd, tb_boat b
 WHERE bd.boat_id = b.boat_id
   AND bd.machine_id ='0013A20041BF1586'
   
// setp 3 ( 우측 방향에 있는 가장 가까운 lidar로 식별된 보트의 rssi 찾기)

 SELECT rd.boat_recv_id,rd.rssi
   FROM tb_rssidata rd
  WHERE 1 = 1
    AND rd.boat_recv_id = '0013A20041BF1586'
	AND '20210415163608' BETWEEN to_char((to_timestamp(rd.send_recv_time, 'YYYYMMDDHH24MISS') - interval '4 sec'),'YYYYMMDDHH24MISS') 
	AND to_char((to_timestamp(rd.send_recv_time, 'YYYYMMDDHH24MISS') + interval '4 sec'),'YYYYMMDDHH24MISS')  
  ORDER BY rd.rssi 
  LIMIT 1 

// step 4

step1의 rssi 와 step3의 rssi 비교

  기준치 rssi 값이 비교치(우측) rssi 보다 크면 미등록
  기준치 rssi 값이 비교치(우측) rssi 보다 작으면 정상
  
  

  
   
