-- Table: public.tb_anchor_sector

-- DROP TABLE public.tb_anchor_sector;

CREATE TABLE public.tb_anchor_sector
(
    marina_id integer NOT NULL,
    sector_id integer NOT NULL DEFAULT nextval('tb_anchor_sector_sector_id_seq'::regclass),
    sector_nm character varying(200) COLLATE pg_catalog."default",
    sector_desc character varying(2000) COLLATE pg_catalog."default",
    gpsx1 numeric(7,3),
    gpsx2 numeric(7,3),
    gpsy1 numeric(7,3),
    gpsy2 numeric(7,3),
    sectorarea_cd character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT tb_anchor_sector_pkey PRIMARY KEY (marina_id, sector_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_anchor_sector
    OWNER to postgres;
COMMENT ON TABLE public.tb_anchor_sector
    IS '계류지 구역';

COMMENT ON COLUMN public.tb_anchor_sector.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_anchor_sector.sector_id
    IS '구역ID';

COMMENT ON COLUMN public.tb_anchor_sector.sector_nm
    IS '구역명';

COMMENT ON COLUMN public.tb_anchor_sector.sector_desc
    IS '구역 설명';

COMMENT ON COLUMN public.tb_anchor_sector.gpsx1
    IS 'GPS좌료범위 X1';

COMMENT ON COLUMN public.tb_anchor_sector.gpsx2
    IS 'GPS좌료범위 X2';

COMMENT ON COLUMN public.tb_anchor_sector.gpsy1
    IS 'GPS좌료범위 Y1';

COMMENT ON COLUMN public.tb_anchor_sector.gpsy2
    IS 'GPS좌료범위 Y2';

COMMENT ON COLUMN public.tb_anchor_sector.sectorarea_cd
    IS '구역영역코드';