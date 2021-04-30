-- Table: public.tb_emp_member

 DROP TABLE public.tb_emp_member;

CREATE TABLE public.tb_emp_member
(
    emp_cd character varying(30) COLLATE pg_catalog."default" NOT NULL,
    emp_grp character varying(1) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_emp_member_pkey PRIMARY KEY (emp_cd, emp_grp)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_emp_member
    OWNER to postgres;
COMMENT ON TABLE public.tb_emp_member
    IS '사용자멤버';

COMMENT ON COLUMN public.tb_emp_member.emp_cd
    IS '사용자번호';

COMMENT ON COLUMN public.tb_emp_member.emp_grp
    IS '사용자그룹';