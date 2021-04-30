-- Table: public.tb_marina

-- DROP TABLE public.tb_marina;

CREATE TABLE public.tb_marina
(
    marina_id integer NOT NULL DEFAULT nextval('tb_marina_marina_id_seq'::regclass),
    marina_nm character varying(100) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_marina
    OWNER to postgres;
COMMENT ON TABLE public.tb_marina
    IS '마리나';

COMMENT ON COLUMN public.tb_marina.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_marina.marina_nm
    IS '마리나명';