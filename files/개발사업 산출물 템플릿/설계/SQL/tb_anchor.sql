-- Table: public.tb_anchor

-- DROP TABLE public.tb_anchor;

CREATE TABLE public.tb_anchor
(
    marina_id integer NOT NULL,
    anchor_id integer NOT NULL DEFAULT nextval('tb_anchor_anchor_id_seq'::regclass),
    sector_id integer,
    boat_id integer,
    anchor_status character varying(4) COLLATE pg_catalog."default",
    anchor_nm character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT tb_anchor_pkey PRIMARY KEY (marina_id, anchor_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_anchor
    OWNER to postgres;
COMMENT ON TABLE public.tb_anchor
    IS '계류지';

COMMENT ON COLUMN public.tb_anchor.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_anchor.anchor_id
    IS '계류지ID';

COMMENT ON COLUMN public.tb_anchor.sector_id
    IS '구역ID';

COMMENT ON COLUMN public.tb_anchor.boat_id
    IS '보트ID';

COMMENT ON COLUMN public.tb_anchor.anchor_status
    IS '계류지 상태 (1: 정박 , 0: 비정박) ';

COMMENT ON COLUMN public.tb_anchor.anchor_nm
    IS '계류지명';