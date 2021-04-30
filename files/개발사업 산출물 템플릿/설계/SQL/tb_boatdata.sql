-- Table: public.tb_boatdata

-- DROP TABLE public.tb_boatdata;

CREATE TABLE public.tb_boatdata
(
    machine_id character varying(20) COLLATE pg_catalog."default",
    temperature numeric(5,2),
    humidity numeric(5,2),
    gradex numeric(5,2),
    gradey numeric(5,2),
    gpsquality numeric(1,0),
    latitude numeric(12,5),
    longitude numeric(12,5),
    satellite numeric(3,0),
    gpsage numeric(3,0),
    sent_type character varying(1) COLLATE pg_catalog."default",
    send_time character varying(14) COLLATE pg_catalog."default",
    stime timestamp with time zone,
    marina_id integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_boatdata
    OWNER to postgres;
COMMENT ON TABLE public.tb_boatdata
    IS '보트전송 데이터';

COMMENT ON COLUMN public.tb_boatdata.machine_id
    IS '장치ID';

COMMENT ON COLUMN public.tb_boatdata.temperature
    IS '온도';

COMMENT ON COLUMN public.tb_boatdata.humidity
    IS '습도';

COMMENT ON COLUMN public.tb_boatdata.gradex
    IS '기울기X';

COMMENT ON COLUMN public.tb_boatdata.gradey
    IS '기울기Y';

COMMENT ON COLUMN public.tb_boatdata.gpsquality
    IS 'GPS품질표시기';

COMMENT ON COLUMN public.tb_boatdata.latitude
    IS '위도';

COMMENT ON COLUMN public.tb_boatdata.longitude
    IS '경도';

COMMENT ON COLUMN public.tb_boatdata.satellite
    IS '사용중인 새틀라이트수';

COMMENT ON COLUMN public.tb_boatdata.gpsage
    IS '차동GPS데이터의 나이';

COMMENT ON COLUMN public.tb_boatdata.sent_type
    IS '전송구분';

COMMENT ON COLUMN public.tb_boatdata.send_time
    IS '전송일시';

COMMENT ON COLUMN public.tb_boatdata.stime
    IS '시스템시각';
	
COMMENT ON COLUMN public.tb_boatdata.marina_id
    IS '마리나ID';	
	