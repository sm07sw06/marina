-- Table: public.tb_code_detail

 DROP TABLE public.tb_code_detail;

CREATE TABLE public.tb_code_detail
(
    group_cd character varying(30) COLLATE pg_catalog."default" NOT NULL,
    detail_cd character varying(30) COLLATE pg_catalog."default" NOT NULL,
    detail_nm character varying(50) COLLATE pg_catalog."default",
    use_yn character varying(1) COLLATE pg_catalog."default" DEFAULT 'Y'::character varying,
    CONSTRAINT codedetail_pkey PRIMARY KEY (group_cd, detail_cd)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_code_detail
    OWNER to postgres;
COMMENT ON TABLE public.tb_code_detail
    IS '코드상세';

COMMENT ON COLUMN public.tb_code_detail.group_cd
    IS '그룹코드';

COMMENT ON COLUMN public.tb_code_detail.detail_cd
    IS '상세코드';

COMMENT ON COLUMN public.tb_code_detail.detail_nm
    IS '상세코드명';

COMMENT ON COLUMN public.tb_code_detail.use_yn
    IS '사용여부';