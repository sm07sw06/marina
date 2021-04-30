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

