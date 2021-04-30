-- Table: public.tb_emp

DROP TABLE public.tb_emp;

CREATE TABLE public.tb_emp
(
    marina_id integer NOT NULL,
    emp_cd character varying(30) COLLATE pg_catalog."default" NOT NULL,
    emp_nm character varying(20) COLLATE pg_catalog."default" NOT NULL,
    dept_cd character varying(10) COLLATE pg_catalog."default",
    dept_nm character varying(50) COLLATE pg_catalog."default",
    retire_dt character varying(10) COLLATE pg_catalog."default",
    state_cd character varying(2) COLLATE pg_catalog."default",
    picture character varying(1024) COLLATE pg_catalog."default",
    CONSTRAINT emp_pkey PRIMARY KEY (marina_id, emp_cd)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_emp
    OWNER to postgres;
COMMENT ON TABLE public.tb_emp
    IS '사원';

COMMENT ON COLUMN public.tb_emp.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_emp.emp_cd
    IS '사용자번호';

COMMENT ON COLUMN public.tb_emp.emp_nm
    IS '사용자명';

COMMENT ON COLUMN public.tb_emp.dept_cd
    IS '부서코드';

COMMENT ON COLUMN public.tb_emp.dept_nm
    IS '부서명';

COMMENT ON COLUMN public.tb_emp.retire_dt
    IS '퇴사일자';

COMMENT ON COLUMN public.tb_emp.state_cd
    IS '재직코드';

COMMENT ON COLUMN public.tb_emp.picture
    IS '사진';