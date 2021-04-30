-- Table: public.tb_anchor_lidar

-- DROP TABLE public.tb_anchor_lidar;

CREATE TABLE public.tb_anchor_lidar
(
    machine_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    left_right character varying(1) COLLATE pg_catalog."default" NOT NULL,
    marina_id integer,
    anchor_id integer,
    CONSTRAINT tb_anchor_lidar_pkey PRIMARY KEY (machine_id, left_right)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_anchor_lidar
    OWNER to postgres;
COMMENT ON TABLE public.tb_anchor_lidar
    IS '계류지 라이더 정보';

COMMENT ON COLUMN public.tb_anchor_lidar.machine_id
    IS '장치ID';

COMMENT ON COLUMN public.tb_anchor_lidar.left_right
    IS '좌우구분';

COMMENT ON COLUMN public.tb_anchor_lidar.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_anchor_lidar.anchor_id
    IS '계류지ID';