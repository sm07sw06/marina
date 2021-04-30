-- Table: public.tb_unreg_boatdata

-- DROP TABLE public.tb_unreg_boatdata;

CREATE TABLE public.tb_unreg_boatdata
(
    gubun character varying(1) COLLATE pg_catalog."default" NOT NULL,
    send_time character varying(14) COLLATE pg_catalog."default" NOT NULL,
    machine_id character varying(20) COLLATE pg_catalog."default",
    photo_base64 text COLLATE pg_catalog."default",
    anchor_id integer,
    CONSTRAINT tb_unreg_boatdata_pkey PRIMARY KEY (gubun, send_time)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_unreg_boatdata
    OWNER to postgres;
COMMENT ON TABLE public.tb_unreg_boatdata
    IS '미등록 보트 입출 내역';

COMMENT ON COLUMN public.tb_unreg_boatdata.gubun
    IS '구분 : 1입항 2출항 3정박';

COMMENT ON COLUMN public.tb_unreg_boatdata.send_time
    IS '전송일시';

COMMENT ON COLUMN public.tb_unreg_boatdata.machine_id
    IS '장치ID';

COMMENT ON COLUMN public.tb_unreg_boatdata.photo_base64
    IS '이미지 텍스트';

COMMENT ON COLUMN public.tb_unreg_boatdata.anchor_id
    IS '계류지ID';