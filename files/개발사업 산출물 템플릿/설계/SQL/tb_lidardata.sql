-- Table: public.tb_lidardata

-- DROP TABLE public.tb_lidardata;

CREATE TABLE public.tb_lidardata
(
    machine_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    send_time character varying(14) COLLATE pg_catalog."default" NOT NULL,
    angle_min numeric(5,2),
    angle_max numeric(5,2),
    load_min numeric(5,2),
    load_threshold numeric(5,2),
    load_left_count integer,
    load_right_count integer,
    load_left_yn character varying(1) COLLATE pg_catalog."default",
    load_right_yn character varying(1) COLLATE pg_catalog."default",
    ship_max numeric(5,2),
    ship_threshold numeric(5,2),
    ship_left_count integer,
    ship_right_count integer,
    ship_left_yn character varying(1) COLLATE pg_catalog."default",
    ship_right_yn character varying(1) COLLATE pg_catalog."default",
    temperature numeric(5,2),
    huminity numeric(5,2),
    etcdata character varying(2000) COLLATE pg_catalog."default",
    stime timestamp with time zone,
    CONSTRAINT tb_lidardata_pkey PRIMARY KEY (machine_id, send_time)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_lidardata
    OWNER to postgres;
COMMENT ON TABLE public.tb_lidardata
    IS '라이더 데이터';

COMMENT ON COLUMN public.tb_lidardata.machine_id
    IS '장치ID';

COMMENT ON COLUMN public.tb_lidardata.send_time
    IS '전송일시';

COMMENT ON COLUMN public.tb_lidardata.angle_min
    IS 'Detect 최소 각도';

COMMENT ON COLUMN public.tb_lidardata.angle_max
    IS 'Detect 최대 각도';

COMMENT ON COLUMN public.tb_lidardata.load_min
    IS '적재물 판단 거리';

COMMENT ON COLUMN public.tb_lidardata.load_threshold
    IS '적재물 판단할 Detect 갯수	';

COMMENT ON COLUMN public.tb_lidardata.load_left_count
    IS '왼쪽의 적재물 판단갯수	';

COMMENT ON COLUMN public.tb_lidardata.load_right_count
    IS '오른쪽 적재물 판단갯수';

COMMENT ON COLUMN public.tb_lidardata.load_left_yn
    IS '왼쪽에 적재물 판단 여부 (0: 적재물없음, 1: 적재물 있음)';

COMMENT ON COLUMN public.tb_lidardata.load_right_yn
    IS '오른쪽에 적재물 판단 여부 (0: 적재물없음, 1: 적재물 있음)';

COMMENT ON COLUMN public.tb_lidardata.ship_max
    IS '보트 판단 거리(Cm)';

COMMENT ON COLUMN public.tb_lidardata.ship_threshold
    IS '보트 판단할 Detect 갯수';

COMMENT ON COLUMN public.tb_lidardata.ship_left_count
    IS '왼쪽으 보트 판단갯수';

COMMENT ON COLUMN public.tb_lidardata.ship_right_count
    IS '오른쪽 보트 판단갯수';

COMMENT ON COLUMN public.tb_lidardata.ship_left_yn
    IS ' 왼쪽에 보트 판단 여부 (0: 보트 없음,  1: 보트 있음)';

COMMENT ON COLUMN public.tb_lidardata.ship_right_yn
    IS '오른쪽에 보트 판단 여부 (0: 보트 없음,  1: 보트 있음) ';

COMMENT ON COLUMN public.tb_lidardata.temperature
    IS '온도';

COMMENT ON COLUMN public.tb_lidardata.huminity
    IS '습도';

COMMENT ON COLUMN public.tb_lidardata.etcdata
    IS '기타데이터';

COMMENT ON COLUMN public.tb_lidardata.stime
    IS '시스템시각';