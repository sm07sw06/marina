-- Table: public.tb_boat_hist

-- DROP TABLE public.tb_boat_hist;

CREATE TABLE public.tb_boat_hist
(
    marina_id integer NOT NULL,
    boat_id integer NOT NULL,
    send_time character varying(14) COLLATE pg_catalog."default" NOT NULL,
    boatinout character varying(1) COLLATE pg_catalog."default",
    CONSTRAINT tb_boat_hist_pkey PRIMARY KEY (marina_id, boat_id, send_time)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_boat_hist
    OWNER to postgres;
COMMENT ON TABLE public.tb_boat_hist
    IS '보트 입출항 이력';

COMMENT ON COLUMN public.tb_boat_hist.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_boat_hist.boat_id
    IS '보트ID';

COMMENT ON COLUMN public.tb_boat_hist.send_time
    IS '전송일시';

COMMENT ON COLUMN public.tb_boat_hist.boatinout
    IS '입출항구분 (1:입항 0:출항)';