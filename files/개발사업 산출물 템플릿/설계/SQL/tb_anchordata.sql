-- Table: public.tb_anchordata

-- DROP TABLE public.tb_anchordata;

CREATE TABLE public.tb_anchordata
(
    machine_id character varying(20) COLLATE pg_catalog."default",
    sendtime character varying(14) COLLATE pg_catalog."default",
    temperature numeric(5,2),
    humidity numeric(5,2),
    distance numeric(5,2),
    stime timestamp with time zone
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_anchordata
    OWNER to postgres;
COMMENT ON TABLE public.tb_anchordata
    IS '계류지 데이터(미사용)';

COMMENT ON COLUMN public.tb_anchordata.machine_id
    IS '장치ID';

COMMENT ON COLUMN public.tb_anchordata.sendtime
    IS '전송시각';

COMMENT ON COLUMN public.tb_anchordata.temperature
    IS '온도';

COMMENT ON COLUMN public.tb_anchordata.humidity
    IS '습도';

COMMENT ON COLUMN public.tb_anchordata.distance
    IS '거리';

COMMENT ON COLUMN public.tb_anchordata.stime
    IS '시스템시각';