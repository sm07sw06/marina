-- Table: public.tb_emp_group

DROP TABLE public.tb_emp_group;

CREATE TABLE public.tb_emp_group
(
    emp_grp character varying(1) COLLATE pg_catalog."default",
    emp_grp_nm character varying(50) COLLATE pg_catalog."default",
    description character varying(1000) COLLATE pg_catalog."default",
    use_yn character varying(1) COLLATE pg_catalog."default" DEFAULT 'Y'::character varying,
    CONSTRAINT tb_emp_group_pkey PRIMARY KEY (emp_grp)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_emp_group
    OWNER to postgres;
COMMENT ON TABLE public.tb_emp_group
    IS '사용자그룹';

COMMENT ON COLUMN public.tb_emp_group.emp_grp
    IS '사용자그룹';

COMMENT ON COLUMN public.tb_emp_group.emp_grp_nm
    IS '사용자그룹명';

COMMENT ON COLUMN public.tb_emp_group.description
    IS '설명';

COMMENT ON COLUMN public.tb_emp_group.use_yn
    IS '사용여부';