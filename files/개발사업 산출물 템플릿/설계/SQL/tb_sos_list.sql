-- Table: public.tb_sos_list

-- DROP TABLE public.tb_sos_list;

CREATE TABLE public.tb_sos_list
(
    marina_id integer NOT NULL,
    send_time character varying(14) COLLATE pg_catalog."default" NOT NULL,
    boat_id integer,
    gradex numeric(5,2),
    gradey numeric(5,2),
    latitude numeric(12,5),
    longitude numeric(12,5),
    CONSTRAINT tb_sos_list_pkey PRIMARY KEY (marina_id, send_time)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_sos_list
    OWNER to postgres;
COMMENT ON TABLE public.tb_sos_list
    IS 'SOS요청 내역';

COMMENT ON COLUMN public.tb_sos_list.send_time
    IS '전송일시';

COMMENT ON COLUMN public.tb_sos_list.boat_id
    IS '보트ID';

COMMENT ON COLUMN public.tb_sos_list.gradex
    IS '기울기 X';

COMMENT ON COLUMN public.tb_sos_list.gradey
    IS '기울기 Y';

COMMENT ON COLUMN public.tb_sos_list.latitude
    IS '위도';

COMMENT ON COLUMN public.tb_sos_list.longitude
    IS '경도';