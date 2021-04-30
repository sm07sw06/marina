-- Table: public.tb_anchor_hist

-- DROP TABLE public.tb_anchor_hist;

CREATE TABLE public.tb_anchor_hist
(
    marina_id integer NOT NULL,
    anchor_id integer NOT NULL DEFAULT nextval('tb_anchor_hist_anchor_id_seq'::regclass),
    boat_id integer,
    enter_dt character varying(14) COLLATE pg_catalog."default" NOT NULL,
    leave_dt character varying(14) COLLATE pg_catalog."default",
    CONSTRAINT tb_anchor_hist_pkey PRIMARY KEY (marina_id, anchor_id, enter_dt)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_anchor_hist
    OWNER to postgres;
COMMENT ON TABLE public.tb_anchor_hist
    IS '정박 이력';

COMMENT ON COLUMN public.tb_anchor_hist.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_anchor_hist.anchor_id
    IS '계류지ID';

COMMENT ON COLUMN public.tb_anchor_hist.boat_id
    IS '보트ID';

COMMENT ON COLUMN public.tb_anchor_hist.enter_dt
    IS '정박 일시';

COMMENT ON COLUMN public.tb_anchor_hist.leave_dt
    IS '이탈 일시';