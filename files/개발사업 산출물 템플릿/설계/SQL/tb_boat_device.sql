-- Table: public.tb_boat_device

-- DROP TABLE public.tb_boat_device;

CREATE TABLE public.tb_boat_device
(
    machine_id character varying(20) COLLATE pg_catalog."default",
    marina_id integer,
    boat_id integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_boat_device
    OWNER to postgres;
COMMENT ON TABLE public.tb_boat_device
    IS '보트 단말기';


	
COMMENT ON COLUMN public.tb_boat_device.machine_id
    IS '장치ID';
	
COMMENT ON COLUMN public.tb_anchor.marina_id
    IS '마리나항 ID';

COMMENT ON COLUMN public.tb_anchor.boat_id
    IS '보트 ID';
	