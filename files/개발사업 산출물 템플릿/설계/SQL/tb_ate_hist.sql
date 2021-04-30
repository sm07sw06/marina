-- Table: public.tb_ate_hist

DROP TABLE public.tb_ate_hist;

CREATE TABLE public.tb_ate_hist
(
    marina_id integer NOT NULL,
    reg_date character(8) COLLATE pg_catalog."default" NOT NULL,
    atte_time character varying(20) COLLATE pg_catalog."default" NOT NULL,
    faceid character varying(20) COLLATE pg_catalog."default",
    dvc_id character varying(20) COLLATE pg_catalog."default",
    user_cd character varying(30) COLLATE pg_catalog."default",
    user_nm character varying(50) COLLATE pg_catalog."default",
    work_code character varying(10) COLLATE pg_catalog."default",
    status character(1) COLLATE pg_catalog."default",
    card_src1 character varying(10) COLLATE pg_catalog."default",
    card_src2 character varying(10) COLLATE pg_catalog."default",
    photo bytea,
    score character varying(10) COLLATE pg_catalog."default",
    rec_type character(1) COLLATE pg_catalog."default",
    send_yn character varying(1) COLLATE pg_catalog."default",
    send_time character varying(14) COLLATE pg_catalog."default",
    log_kind character varying(1) COLLATE pg_catalog."default",
    dept_cd character varying(10) COLLATE pg_catalog."default",
    dept_name character varying(50) COLLATE pg_catalog."default",
    photo_base64 text COLLATE pg_catalog."default",
    CONSTRAINT tb_ate_hist_pkey PRIMARY KEY (marina_id, reg_date, atte_time)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_ate_hist
    OWNER to postgres;
COMMENT ON TABLE public.tb_ate_hist
    IS '비대면 얼굴인식 장치 출입 내역';

COMMENT ON COLUMN public.tb_ate_hist.marina_id
    IS '마리나ID';

COMMENT ON COLUMN public.tb_ate_hist.reg_date
    IS '등록일자';

COMMENT ON COLUMN public.tb_ate_hist.atte_time
    IS '출입시각';

COMMENT ON COLUMN public.tb_ate_hist.faceid
    IS '얼굴ID';

COMMENT ON COLUMN public.tb_ate_hist.dvc_id
    IS '단말기ID';

COMMENT ON COLUMN public.tb_ate_hist.user_cd
    IS '회원코드';

COMMENT ON COLUMN public.tb_ate_hist.user_nm
    IS '회원명';

COMMENT ON COLUMN public.tb_ate_hist.work_code
    IS '작업코드';

COMMENT ON COLUMN public.tb_ate_hist.status
    IS '상태  ( C: 재직  R: 퇴사  H: 휴직 )';

COMMENT ON COLUMN public.tb_ate_hist.card_src1
    IS '카드소스1';

COMMENT ON COLUMN public.tb_ate_hist.card_src2
    IS '카드소스2';

COMMENT ON COLUMN public.tb_ate_hist.photo
    IS '얼굴이미지';

COMMENT ON COLUMN public.tb_ate_hist.score
    IS '점수';

COMMENT ON COLUMN public.tb_ate_hist.rec_type
    IS '기록형태';

COMMENT ON COLUMN public.tb_ate_hist.send_yn
    IS '전송여부';

COMMENT ON COLUMN public.tb_ate_hist.send_time
    IS '전송일시';

COMMENT ON COLUMN public.tb_ate_hist.log_kind
    IS '로그종류';

COMMENT ON COLUMN public.tb_ate_hist.dept_cd
    IS '부서코드';

COMMENT ON COLUMN public.tb_ate_hist.dept_name
    IS '부서명';

COMMENT ON COLUMN public.tb_ate_hist.photo_base64
    IS '얼굴이미지 텍스트';