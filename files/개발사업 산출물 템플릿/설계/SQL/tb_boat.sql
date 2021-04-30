-- Table: public.tb_boat

-- DROP TABLE public.tb_boat;

CREATE TABLE public.tb_boat
(
    marina_id integer NOT NULL,
    boat_id integer NOT NULL DEFAULT nextval('tb_boat_boat_id_seq'::regclass),
    user_id integer,
    boat_nm character varying(100) COLLATE pg_catalog."default",
    boat_status character varying(4) COLLATE pg_catalog."default",
    boat_desc character varying(1000) COLLATE pg_catalog."default",
    CONSTRAINT tb_boat_pkey PRIMARY KEY (marina_id, boat_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_boat
    OWNER to postgres;
COMMENT ON TABLE public.tb_boat
    IS '보트';

COMMENT ON COLUMN public.tb_anchor.marina_id
    IS '마리나ID';
	
COMMENT ON COLUMN public.tb_boat.boat_id
    IS '보트ID';

COMMENT ON COLUMN public.tb_boat.user_id
    IS '회원ID';

COMMENT ON COLUMN public.tb_boat.boat_nm
    IS '보트명';

COMMENT ON COLUMN public.tb_boat.boat_status
    IS '보트상태(9:미가입,  1: 정박,  0:출항)';

COMMENT ON COLUMN public.tb_boat.boat_desc
    IS '보트설명';