-- Table: public.tb_code_group

DROP TABLE public.tb_code_group;

CREATE TABLE public.tb_code_group
(
    group_cd character varying(30) COLLATE pg_catalog."default" NOT NULL,
    group_nm character varying(50) COLLATE pg_catalog."default",
    use_yn character varying(1) COLLATE pg_catalog."default" DEFAULT 'Y'::character varying,
    CONSTRAINT codegroup_pkey PRIMARY KEY (group_cd)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_code_group
    OWNER to postgres;
COMMENT ON TABLE public.tb_code_group
    IS '코드그룹';

COMMENT ON COLUMN public.tb_code_group.group_cd
    IS '그룹코드';

COMMENT ON COLUMN public.tb_code_group.group_nm
    IS '그룹명';

COMMENT ON COLUMN public.tb_code_group.use_yn
    IS '사용여부';