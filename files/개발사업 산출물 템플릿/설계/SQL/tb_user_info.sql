-- Table: public.tb_user_info

-- DROP TABLE public.tb_user_info;

CREATE TABLE public.tb_user_info
(
    marina_id integer NOT NULL,
    user_id integer NOT NULL DEFAULT nextval('tb_user_info_user_id_seq'::regclass),
    user_cd character varying(30) COLLATE pg_catalog."default",
    user_nm character varying(50) COLLATE pg_catalog."default",
    password character varying(256) COLLATE pg_catalog."default",
    telephone character varying(20) COLLATE pg_catalog."default",
    email character varying(50) COLLATE pg_catalog."default",
    use_yn character varying(1) COLLATE pg_catalog."default",
    picture character varying(1024) COLLATE pg_catalog."default",
    faceid character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT userinfo_pkey PRIMARY KEY (marina_id, user_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_user_info
    OWNER to postgres;
COMMENT ON TABLE public.tb_user_info
    IS '회원정보';

COMMENT ON COLUMN public.tb_user_info.user_id
    IS '회원ID';

COMMENT ON COLUMN public.tb_user_info.user_cd
    IS '회원코드';

COMMENT ON COLUMN public.tb_user_info.user_nm
    IS '회원명';

COMMENT ON COLUMN public.tb_user_info.password
    IS '비밀번호';

COMMENT ON COLUMN public.tb_user_info.telephone
    IS '연락처';

COMMENT ON COLUMN public.tb_user_info.email
    IS '메일';

COMMENT ON COLUMN public.tb_user_info.use_yn
    IS '사용여부';

COMMENT ON COLUMN public.tb_user_info.picture
    IS '사진';

COMMENT ON COLUMN public.tb_user_info.faceid
    IS '얼굴ID';