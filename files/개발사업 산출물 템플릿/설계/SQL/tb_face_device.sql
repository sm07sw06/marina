-- Table: public.tb_face_device

-- DROP TABLE public.tb_face_device;

CREATE TABLE public.tb_face_device
(
    marina_id integer NOT NULL,
    dvc_id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    dvc_nm character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT tb_face_device_pkey PRIMARY KEY (marina_id, dvc_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_face_device
    OWNER to postgres;
COMMENT ON TABLE public.tb_face_device
    IS '단말기장치';

COMMENT ON COLUMN public.tb_face_device.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_face_device.dvc_id
    IS '단말기ID';

COMMENT ON COLUMN public.tb_face_device.dvc_nm
    IS '단말기명';