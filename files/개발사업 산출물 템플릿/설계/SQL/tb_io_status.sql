-- Table: public.tb_io_status

-- DROP TABLE public.tb_io_status;

CREATE TABLE public.tb_io_status
(
    marina_id integer NOT NULL,
    boat_id integer NOT NULL,
    gradex numeric(5,2),
    gradey numeric(5,2),
    latitude numeric(12,5),
    longitude numeric(12,5),
    cctv_cd character varying(20) COLLATE pg_catalog."default",
    photo bytea,
    photo_base64 text COLLATE pg_catalog."default",
    CONSTRAINT tb_io_status_pkey PRIMARY KEY (marina_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_io_status
    OWNER to postgres;
COMMENT ON TABLE public.tb_io_status
    IS '최근입항정보';

COMMENT ON COLUMN public.tb_io_status.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_io_status.boat_id
    IS '보트ID';

COMMENT ON COLUMN public.tb_io_status.gradex
    IS '기울기X';

COMMENT ON COLUMN public.tb_io_status.gradey
    IS '기울기Y';

COMMENT ON COLUMN public.tb_io_status.latitude
    IS '위도';

COMMENT ON COLUMN public.tb_io_status.longitude
    IS '경도';

COMMENT ON COLUMN public.tb_io_status.cctv_cd
    IS 'CCTV코드';

COMMENT ON COLUMN public.tb_io_status.photo
    IS '얼굴이미지';

COMMENT ON COLUMN public.tb_io_status.photo_base64
    IS '얼굴이미지 텍스트';