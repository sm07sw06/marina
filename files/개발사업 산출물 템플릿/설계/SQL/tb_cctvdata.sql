-- Table: public.tb_cctvdata

 DROP TABLE public.tb_cctvdata;

CREATE TABLE public.tb_cctvdata
(
    cctv_cd character varying(20) COLLATE pg_catalog."default" NOT NULL,
    send_time character varying(14) COLLATE pg_catalog."default" NOT NULL,
    photo bytea,
    photo_base64 text COLLATE pg_catalog."default",
    boatinout character varying(1) COLLATE pg_catalog."default",
    CONSTRAINT tb_cctvdata_pkey PRIMARY KEY (cctv_cd, send_time)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_cctvdata
    OWNER to postgres;
COMMENT ON TABLE public.tb_cctvdata
    IS 'CCTA 전송 데이터';

COMMENT ON COLUMN public.tb_cctvdata.cctv_cd
    IS 'CCTV코드';

COMMENT ON COLUMN public.tb_cctvdata.send_time
    IS '전송일시';

COMMENT ON COLUMN public.tb_cctvdata.photo
    IS '얼굴이미지';

COMMENT ON COLUMN public.tb_cctvdata.photo_base64
    IS '얼굴이미지 텍스트';

COMMENT ON COLUMN public.tb_cctvdata.boatinout
    IS '입출항구분 (1:입항 0:출항)';