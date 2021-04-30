-- Table: public.tb_emp_auth

DROP TABLE public.tb_emp_auth;

CREATE TABLE public.tb_emp_auth
(
    emp_gb character varying(1) COLLATE pg_catalog."default" NOT NULL,
    emp_cd character varying(30) COLLATE pg_catalog."default" NOT NULL,
    menu_id integer NOT NULL,
    CONSTRAINT tb_emp_auth_pkey PRIMARY KEY (emp_gb, emp_cd, menu_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_emp_auth
    OWNER to postgres;
COMMENT ON TABLE public.tb_emp_auth
    IS '사용자권한';

COMMENT ON COLUMN public.tb_emp_auth.emp_gb
    IS '사용자그룹';

COMMENT ON COLUMN public.tb_emp_auth.emp_cd
    IS '사용자번호';

COMMENT ON COLUMN public.tb_emp_auth.menu_id
    IS '메뉴ID';