-- Table: public.tb_config

-- DROP TABLE public.tb_config;

CREATE TABLE public.tb_config
(
    grade numeric(5,2)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_config
    OWNER to postgres;
COMMENT ON TABLE public.tb_config
    IS '환경변수';

COMMENT ON COLUMN public.tb_config.grade
    IS '보트 기울기';