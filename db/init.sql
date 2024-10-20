--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+2)
-- Dumped by pg_dump version 16.4 (Ubuntu 16.4-0ubuntu0.24.04.2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tests (
    evaluator_id integer NOT NULL,
    patient_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    id uuid NOT NULL,
    type character varying(255) NOT NULL,
    measurements jsonb[] NOT NULL
);


ALTER TABLE public.tests OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, name, email, phone, created_at) FROM stdin;
1	Jorge Suarez	george@google.com	+573208967845	2024-10-15 16:55:56.05296
2	Sofia Buitrago	sbuitrago@oracle.com	+15553459870	2024-10-15 16:56:29.028328
3	Muhammad Ali	mali@boxing.com	+19807658721	2024-10-15 16:57:48.481658
4	Michael Fox	mfox@movies.com	+14879018755	2024-10-15 16:58:14.434186
5	Ozzy Osbourne	oosbourne@music.com	+13452349823	2024-10-15 16:58:52.477524
6	George Bush	gbush@us.gov	+11112223344	2024-10-15 16:59:24.378783
7	Jessie Jackson	jjackson@rights.com	+19087658822	2024-10-15 16:59:59.845718
8	Margaret Bourke-White	mbourke-white@photos.com	+13458795432	2024-10-15 17:01:01.277405
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	evaluator
\.


--
-- Data for Name: tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tests (evaluator_id, patient_id, created_at, id, type, measurements) FROM stdin;
0	0	2024-10-15 19:27:40.928201	2a303641-7708-40f0-9b50-f7e1e9a2a55e	footing	{"{\\"gyro\\": {\\"x\\": 0.314, \\"y\\": 0.52, \\"z\\": 0.19}, \\"accel\\": {\\"x\\": 10.0, \\"y\\": 0.059, \\"z\\": 0.1}}","{\\"gyro\\": {\\"x\\": 0.25, \\"y\\": 0.48, \\"z\\": 0.17}, \\"accel\\": {\\"x\\": 9.8, \\"y\\": -0.032, \\"z\\": 0.15}}","{\\"gyro\\": {\\"x\\": 0.312, \\"y\\": 0.5, \\"z\\": 0.2}, \\"accel\\": {\\"x\\": 10.1, \\"y\\": 0.04, \\"z\\": 0.12}}","{\\"gyro\\": {\\"x\\": 0.29, \\"y\\": 0.55, \\"z\\": 0.16}, \\"accel\\": {\\"x\\": 9.9, \\"y\\": 0.012, \\"z\\": 0.09}}","{\\"gyro\\": {\\"x\\": 0.32, \\"y\\": 0.51, \\"z\\": 0.18}, \\"accel\\": {\\"x\\": 10.0, \\"y\\": -0.045, \\"z\\": 0.13}}"}
0	0	2024-10-15 19:28:45.845068	265a6cb1-1988-4ee8-8e83-da1e454b0a9d	heeling	{"{\\"gyro\\": {\\"x\\": 0.314, \\"y\\": 0.52, \\"z\\": 0.19}, \\"accel\\": {\\"x\\": 10.0, \\"y\\": 0.059, \\"z\\": 0.1}}","{\\"gyro\\": {\\"x\\": 0.25, \\"y\\": 0.48, \\"z\\": 0.17}, \\"accel\\": {\\"x\\": 9.8, \\"y\\": -0.032, \\"z\\": 0.15}}","{\\"gyro\\": {\\"x\\": 0.312, \\"y\\": 0.5, \\"z\\": 0.2}, \\"accel\\": {\\"x\\": 10.1, \\"y\\": 0.04, \\"z\\": 0.12}}","{\\"gyro\\": {\\"x\\": 0.29, \\"y\\": 0.55, \\"z\\": 0.16}, \\"accel\\": {\\"x\\": 9.9, \\"y\\": 0.012, \\"z\\": 0.09}}","{\\"gyro\\": {\\"x\\": 0.32, \\"y\\": 0.51, \\"z\\": 0.18}, \\"accel\\": {\\"x\\": 10.0, \\"y\\": -0.045, \\"z\\": 0.13}}"}
0	0	2024-10-15 19:29:47.090134	a232fb0d-1a9e-4a0f-a650-4e74a22508c2	footing	{"{\\"gyro\\": {\\"x\\": 0.314, \\"y\\": 0.52, \\"z\\": 0.19}, \\"accel\\": {\\"x\\": 10.0, \\"y\\": 0.059, \\"z\\": 0.1}}","{\\"gyro\\": {\\"x\\": 0.25, \\"y\\": 0.48, \\"z\\": 0.17}, \\"accel\\": {\\"x\\": 9.8, \\"y\\": -0.032, \\"z\\": 0.15}}","{\\"gyro\\": {\\"x\\": 0.312, \\"y\\": 0.5, \\"z\\": 0.2}, \\"accel\\": {\\"x\\": 10.1, \\"y\\": 0.04, \\"z\\": 0.12}}","{\\"gyro\\": {\\"x\\": 0.29, \\"y\\": 0.55, \\"z\\": 0.16}, \\"accel\\": {\\"x\\": 9.9, \\"y\\": 0.012, \\"z\\": 0.09}}","{\\"gyro\\": {\\"x\\": 0.32, \\"y\\": 0.51, \\"z\\": 0.18}, \\"accel\\": {\\"x\\": 10.0, \\"y\\": -0.045, \\"z\\": 0.13}}"}
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, role) FROM stdin;
1	David Dulce	dulce@rj45.com	Password1	2024-10-15 16:49:42.808096	1
2	Jean Vidales	jean@rj45.com	Password1	2024-10-15 16:49:57.188832	1
3	Daniel Mejia	daniel@rj45.com	Password1	2024-10-15 16:52:25.175155	1
4	Nicolas Salazar	nico@i2t.io	Password1	2024-10-15 16:54:22.233727	2
5	Domiciano Rincon	domi@i2t.io	Password1	2024-10-15 16:54:41.696963	2
\.


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 8, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: tests tests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_fkey FOREIGN KEY (role) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

