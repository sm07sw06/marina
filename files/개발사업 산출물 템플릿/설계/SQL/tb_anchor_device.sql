-- Table: public.tb_anchor_device

-- DROP TABLE public.tb_anchor_device;

CREATE TABLE public.tb_anchor_device
(
    machine_id character varying(20) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_anchor_device
    OWNER to postgres;
COMMENT ON TABLE public.tb_anchor_device
    IS '계류지 장치';

COMMENT ON COLUMN public.tb_anchor_device.machine_id
    IS '장치ID';