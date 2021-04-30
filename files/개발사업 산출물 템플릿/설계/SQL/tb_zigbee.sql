-- Table: public.tb_zigbee

-- DROP TABLE public.tb_zigbee;

CREATE TABLE public.tb_zigbee
(
    machine_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT zigbee_pkey PRIMARY KEY (machine_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_zigbee
    OWNER to postgres;
COMMENT ON TABLE public.tb_zigbee
    IS '통신 단말기';

COMMENT ON COLUMN public.tb_zigbee.machine_id
    IS '장치ID';