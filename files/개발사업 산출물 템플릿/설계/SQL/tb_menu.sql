-- Table: public.tb_menu

 DROP TABLE public.tb_menu;

CREATE TABLE public.tb_menu
(
    menu_id integer NOT NULL DEFAULT nextval('menu_menu_id_seq'::regclass),
    menu_nm character varying(50) COLLATE pg_catalog."default",
    menu_cd character varying(5) COLLATE pg_catalog."default",
    menu_desc character varying(1000) COLLATE pg_catalog."default",
    menu_url character varying(100) COLLATE pg_catalog."default",
    menu_order numeric(3,0),
    up_menu_id integer,
    CONSTRAINT menu_pkey PRIMARY KEY (menu_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_menu
    OWNER to postgres;
COMMENT ON TABLE public.tb_menu
    IS '메뉴';

COMMENT ON COLUMN public.tb_menu.menu_id
    IS '메뉴ID';

COMMENT ON COLUMN public.tb_menu.menu_nm
    IS '메뉴명';

COMMENT ON COLUMN public.tb_menu.menu_cd
    IS '메뉴코드';

COMMENT ON COLUMN public.tb_menu.menu_desc
    IS '메뉴설명';

COMMENT ON COLUMN public.tb_menu.menu_url
    IS '메뉴링크';

COMMENT ON COLUMN public.tb_menu.menu_order
    IS '메뉴순서';

COMMENT ON COLUMN public.tb_menu.up_menu_id
    IS '상위메뉴ID';