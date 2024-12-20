PGDMP      6            
    |            webdb    17.0    17.0 E    }           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            ~           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16389    webdb    DATABASE     g   CREATE DATABASE webdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE webdb;
                     postgres    false                        3079    16698 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1259    17733    assignedshifts    TABLE     �  CREATE TABLE public.assignedshifts (
    assigned_shift_id integer NOT NULL,
    shift_id character varying(50),
    assigned_date date NOT NULL,
    assignment_type character varying(20),
    employee_id character varying(50),
    department_id character varying(50),
    CONSTRAINT assignedshifts_assignment_type_check CHECK (((assignment_type)::text = ANY ((ARRAY['Individual'::character varying, 'Department'::character varying])::text[]))),
    CONSTRAINT check_assignment CHECK (((((assignment_type)::text = 'Individual'::text) AND (employee_id IS NOT NULL) AND (department_id IS NULL)) OR (((assignment_type)::text = 'Department'::text) AND (department_id IS NOT NULL) AND (employee_id IS NULL))))
);
 "   DROP TABLE public.assignedshifts;
       public         heap r       postgres    false            �            1259    17732 $   assignedshifts_assigned_shift_id_seq    SEQUENCE     �   CREATE SEQUENCE public.assignedshifts_assigned_shift_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.assignedshifts_assigned_shift_id_seq;
       public               postgres    false    228            �           0    0 $   assignedshifts_assigned_shift_id_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.assignedshifts_assigned_shift_id_seq OWNED BY public.assignedshifts.assigned_shift_id;
          public               postgres    false    227            �            1259    17765 
   clockinout    TABLE     �  CREATE TABLE public.clockinout (
    clock_id integer NOT NULL,
    employee_id character varying(50),
    assigned_shift_id integer,
    location_id character varying(50),
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    work_mode_in_id integer,
    work_mode_out_id integer,
    time_in_location character varying(20),
    time_out_location character varying(20),
    status character varying(20),
    CONSTRAINT clockinout_status_check CHECK (((status)::text = ANY ((ARRAY['On-time'::character varying, 'Late'::character varying, 'No-show'::character varying])::text[]))),
    CONSTRAINT clockinout_time_in_location_check CHECK (((time_in_location)::text = ANY ((ARRAY['ON SITE'::character varying, 'OFF SITE'::character varying])::text[]))),
    CONSTRAINT clockinout_time_out_location_check CHECK (((time_out_location)::text = ANY ((ARRAY['ON SITE'::character varying, 'OFF SITE'::character varying])::text[])))
);
    DROP TABLE public.clockinout;
       public         heap r       postgres    false            �            1259    17764    clockinout_clock_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clockinout_clock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.clockinout_clock_id_seq;
       public               postgres    false    231            �           0    0    clockinout_clock_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.clockinout_clock_id_seq OWNED BY public.clockinout.clock_id;
          public               postgres    false    230            �            1259    17240    departments    TABLE     �   CREATE TABLE public.departments (
    department_id character varying(50) NOT NULL,
    department_name character varying(100)
);
    DROP TABLE public.departments;
       public         heap r       postgres    false            �            1259    17495    employeelocations    TABLE     �   CREATE TABLE public.employeelocations (
    employee_location_id integer NOT NULL,
    employee_id character varying(50),
    location_id character varying(50)
);
 %   DROP TABLE public.employeelocations;
       public         heap r       postgres    false            �            1259    17494 *   employeelocations_employee_location_id_seq    SEQUENCE     �   CREATE SEQUENCE public.employeelocations_employee_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.employeelocations_employee_location_id_seq;
       public               postgres    false    222            �           0    0 *   employeelocations_employee_location_id_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.employeelocations_employee_location_id_seq OWNED BY public.employeelocations.employee_location_id;
          public               postgres    false    221            �            1259    17290 	   employees    TABLE     �  CREATE TABLE public.employees (
    employee_id character varying(50) NOT NULL,
    prefix character varying(10),
    firstname character varying(100),
    lastname character varying(100),
    email character varying(100),
    password character varying(255),
    role character varying(20),
    department_id character varying(50),
    CONSTRAINT employees_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'employee'::character varying])::text[])))
);
    DROP TABLE public.employees;
       public         heap r       postgres    false            �            1259    17264 	   locations    TABLE     �   CREATE TABLE public.locations (
    location_id character varying(50) NOT NULL,
    location_name character varying(100),
    latitude numeric(9,6),
    longitude numeric(9,6),
    department_id character varying(50)
);
    DROP TABLE public.locations;
       public         heap r       postgres    false            �            1259    17758    mastershifts    TABLE     �  CREATE TABLE public.mastershifts (
    shift_id character varying(50) NOT NULL,
    shift_name character varying(100),
    start_time time without time zone,
    end_time time without time zone,
    shift_type character varying(20),
    CONSTRAINT mastershifts_shift_type_check CHECK (((shift_type)::text = ANY ((ARRAY['Regular'::character varying, 'OT'::character varying])::text[])))
);
     DROP TABLE public.mastershifts;
       public         heap r       postgres    false            �            1259    17515    settings    TABLE     �   CREATE TABLE public.settings (
    setting_id integer NOT NULL,
    setting_key character varying(50) NOT NULL,
    setting_value character varying(50) NOT NULL
);
    DROP TABLE public.settings;
       public         heap r       postgres    false            �            1259    17514    settings_setting_id_seq    SEQUENCE     �   CREATE SEQUENCE public.settings_setting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.settings_setting_id_seq;
       public               postgres    false    224            �           0    0    settings_setting_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.settings_setting_id_seq OWNED BY public.settings.setting_id;
          public               postgres    false    223            �            1259    17524 	   workmodes    TABLE     x   CREATE TABLE public.workmodes (
    work_mode_id integer NOT NULL,
    work_mode_name character varying(50) NOT NULL
);
    DROP TABLE public.workmodes;
       public         heap r       postgres    false            �            1259    17523    workmodes_work_mode_id_seq    SEQUENCE     �   CREATE SEQUENCE public.workmodes_work_mode_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.workmodes_work_mode_id_seq;
       public               postgres    false    226            �           0    0    workmodes_work_mode_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.workmodes_work_mode_id_seq OWNED BY public.workmodes.work_mode_id;
          public               postgres    false    225            �           2604    17736     assignedshifts assigned_shift_id    DEFAULT     �   ALTER TABLE ONLY public.assignedshifts ALTER COLUMN assigned_shift_id SET DEFAULT nextval('public.assignedshifts_assigned_shift_id_seq'::regclass);
 O   ALTER TABLE public.assignedshifts ALTER COLUMN assigned_shift_id DROP DEFAULT;
       public               postgres    false    228    227    228            �           2604    17768    clockinout clock_id    DEFAULT     z   ALTER TABLE ONLY public.clockinout ALTER COLUMN clock_id SET DEFAULT nextval('public.clockinout_clock_id_seq'::regclass);
 B   ALTER TABLE public.clockinout ALTER COLUMN clock_id DROP DEFAULT;
       public               postgres    false    231    230    231            �           2604    17498 &   employeelocations employee_location_id    DEFAULT     �   ALTER TABLE ONLY public.employeelocations ALTER COLUMN employee_location_id SET DEFAULT nextval('public.employeelocations_employee_location_id_seq'::regclass);
 U   ALTER TABLE public.employeelocations ALTER COLUMN employee_location_id DROP DEFAULT;
       public               postgres    false    222    221    222            �           2604    17518    settings setting_id    DEFAULT     z   ALTER TABLE ONLY public.settings ALTER COLUMN setting_id SET DEFAULT nextval('public.settings_setting_id_seq'::regclass);
 B   ALTER TABLE public.settings ALTER COLUMN setting_id DROP DEFAULT;
       public               postgres    false    223    224    224            �           2604    17527    workmodes work_mode_id    DEFAULT     �   ALTER TABLE ONLY public.workmodes ALTER COLUMN work_mode_id SET DEFAULT nextval('public.workmodes_work_mode_id_seq'::regclass);
 E   ALTER TABLE public.workmodes ALTER COLUMN work_mode_id DROP DEFAULT;
       public               postgres    false    226    225    226            w          0    17733    assignedshifts 
   TABLE DATA           �   COPY public.assignedshifts (assigned_shift_id, shift_id, assigned_date, assignment_type, employee_id, department_id) FROM stdin;
    public               postgres    false    228   2a       z          0    17765 
   clockinout 
   TABLE DATA           �   COPY public.clockinout (clock_id, employee_id, assigned_shift_id, location_id, start_time, end_time, work_mode_in_id, work_mode_out_id, time_in_location, time_out_location, status) FROM stdin;
    public               postgres    false    231   xa       m          0    17240    departments 
   TABLE DATA           E   COPY public.departments (department_id, department_name) FROM stdin;
    public               postgres    false    218   �a       q          0    17495    employeelocations 
   TABLE DATA           [   COPY public.employeelocations (employee_location_id, employee_id, location_id) FROM stdin;
    public               postgres    false    222   'd       o          0    17290 	   employees 
   TABLE DATA           s   COPY public.employees (employee_id, prefix, firstname, lastname, email, password, role, department_id) FROM stdin;
    public               postgres    false    220   sd       n          0    17264 	   locations 
   TABLE DATA           c   COPY public.locations (location_id, location_name, latitude, longitude, department_id) FROM stdin;
    public               postgres    false    219   �j       x          0    17758    mastershifts 
   TABLE DATA           ^   COPY public.mastershifts (shift_id, shift_name, start_time, end_time, shift_type) FROM stdin;
    public               postgres    false    229   w       s          0    17515    settings 
   TABLE DATA           J   COPY public.settings (setting_id, setting_key, setting_value) FROM stdin;
    public               postgres    false    224   _x       u          0    17524 	   workmodes 
   TABLE DATA           A   COPY public.workmodes (work_mode_id, work_mode_name) FROM stdin;
    public               postgres    false    226   �x       �           0    0 $   assignedshifts_assigned_shift_id_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.assignedshifts_assigned_shift_id_seq', 6, true);
          public               postgres    false    227            �           0    0    clockinout_clock_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.clockinout_clock_id_seq', 1, false);
          public               postgres    false    230            �           0    0 *   employeelocations_employee_location_id_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.employeelocations_employee_location_id_seq', 19, true);
          public               postgres    false    221            �           0    0    settings_setting_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.settings_setting_id_seq', 2, true);
          public               postgres    false    223            �           0    0    workmodes_work_mode_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.workmodes_work_mode_id_seq', 4, true);
          public               postgres    false    225            �           2606    17742 D   assignedshifts assignedshifts_assigned_date_employee_id_shift_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.assignedshifts
    ADD CONSTRAINT assignedshifts_assigned_date_employee_id_shift_id_key UNIQUE (assigned_date, employee_id, shift_id);
 n   ALTER TABLE ONLY public.assignedshifts DROP CONSTRAINT assignedshifts_assigned_date_employee_id_shift_id_key;
       public                 postgres    false    228    228    228            �           2606    17740 "   assignedshifts assignedshifts_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.assignedshifts
    ADD CONSTRAINT assignedshifts_pkey PRIMARY KEY (assigned_shift_id);
 L   ALTER TABLE ONLY public.assignedshifts DROP CONSTRAINT assignedshifts_pkey;
       public                 postgres    false    228            �           2606    17773    clockinout clockinout_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.clockinout
    ADD CONSTRAINT clockinout_pkey PRIMARY KEY (clock_id);
 D   ALTER TABLE ONLY public.clockinout DROP CONSTRAINT clockinout_pkey;
       public                 postgres    false    231            �           2606    17244    departments departments_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);
 F   ALTER TABLE ONLY public.departments DROP CONSTRAINT departments_pkey;
       public                 postgres    false    218            �           2606    17502 ?   employeelocations employeelocations_employee_id_location_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.employeelocations
    ADD CONSTRAINT employeelocations_employee_id_location_id_key UNIQUE (employee_id, location_id);
 i   ALTER TABLE ONLY public.employeelocations DROP CONSTRAINT employeelocations_employee_id_location_id_key;
       public                 postgres    false    222    222            �           2606    17500 (   employeelocations employeelocations_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.employeelocations
    ADD CONSTRAINT employeelocations_pkey PRIMARY KEY (employee_location_id);
 R   ALTER TABLE ONLY public.employeelocations DROP CONSTRAINT employeelocations_pkey;
       public                 postgres    false    222            �           2606    17299    employees employees_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_email_key;
       public                 postgres    false    220            �           2606    17297    employees employees_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);
 B   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_pkey;
       public                 postgres    false    220            �           2606    17268    locations locations_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (location_id);
 B   ALTER TABLE ONLY public.locations DROP CONSTRAINT locations_pkey;
       public                 postgres    false    219            �           2606    17763    mastershifts mastershifts_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.mastershifts
    ADD CONSTRAINT mastershifts_pkey PRIMARY KEY (shift_id);
 H   ALTER TABLE ONLY public.mastershifts DROP CONSTRAINT mastershifts_pkey;
       public                 postgres    false    229            �           2606    17520    settings settings_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (setting_id);
 @   ALTER TABLE ONLY public.settings DROP CONSTRAINT settings_pkey;
       public                 postgres    false    224            �           2606    17522 !   settings settings_setting_key_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_setting_key_key UNIQUE (setting_key);
 K   ALTER TABLE ONLY public.settings DROP CONSTRAINT settings_setting_key_key;
       public                 postgres    false    224            �           2606    17529    workmodes workmodes_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.workmodes
    ADD CONSTRAINT workmodes_pkey PRIMARY KEY (work_mode_id);
 B   ALTER TABLE ONLY public.workmodes DROP CONSTRAINT workmodes_pkey;
       public                 postgres    false    226            �           2606    17531 &   workmodes workmodes_work_mode_name_key 
   CONSTRAINT     k   ALTER TABLE ONLY public.workmodes
    ADD CONSTRAINT workmodes_work_mode_name_key UNIQUE (work_mode_name);
 P   ALTER TABLE ONLY public.workmodes DROP CONSTRAINT workmodes_work_mode_name_key;
       public                 postgres    false    226            �           2606    17753 0   assignedshifts assignedshifts_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignedshifts
    ADD CONSTRAINT assignedshifts_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.assignedshifts DROP CONSTRAINT assignedshifts_department_id_fkey;
       public               postgres    false    3510    228    218            �           2606    17748 .   assignedshifts assignedshifts_employee_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignedshifts
    ADD CONSTRAINT assignedshifts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.assignedshifts DROP CONSTRAINT assignedshifts_employee_id_fkey;
       public               postgres    false    3516    220    228            �           2606    17779 ,   clockinout clockinout_assigned_shift_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.clockinout
    ADD CONSTRAINT clockinout_assigned_shift_id_fkey FOREIGN KEY (assigned_shift_id) REFERENCES public.assignedshifts(assigned_shift_id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.clockinout DROP CONSTRAINT clockinout_assigned_shift_id_fkey;
       public               postgres    false    3532    231    228            �           2606    17774 &   clockinout clockinout_employee_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.clockinout
    ADD CONSTRAINT clockinout_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.clockinout DROP CONSTRAINT clockinout_employee_id_fkey;
       public               postgres    false    220    3516    231            �           2606    17784 &   clockinout clockinout_location_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.clockinout
    ADD CONSTRAINT clockinout_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(location_id) ON DELETE SET NULL;
 P   ALTER TABLE ONLY public.clockinout DROP CONSTRAINT clockinout_location_id_fkey;
       public               postgres    false    3512    219    231            �           2606    17789 *   clockinout clockinout_work_mode_in_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.clockinout
    ADD CONSTRAINT clockinout_work_mode_in_id_fkey FOREIGN KEY (work_mode_in_id) REFERENCES public.workmodes(work_mode_id);
 T   ALTER TABLE ONLY public.clockinout DROP CONSTRAINT clockinout_work_mode_in_id_fkey;
       public               postgres    false    231    226    3526            �           2606    17794 +   clockinout clockinout_work_mode_out_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.clockinout
    ADD CONSTRAINT clockinout_work_mode_out_id_fkey FOREIGN KEY (work_mode_out_id) REFERENCES public.workmodes(work_mode_id);
 U   ALTER TABLE ONLY public.clockinout DROP CONSTRAINT clockinout_work_mode_out_id_fkey;
       public               postgres    false    3526    231    226            �           2606    17503 4   employeelocations employeelocations_employee_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employeelocations
    ADD CONSTRAINT employeelocations_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.employeelocations DROP CONSTRAINT employeelocations_employee_id_fkey;
       public               postgres    false    3516    222    220            �           2606    17508 4   employeelocations employeelocations_location_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employeelocations
    ADD CONSTRAINT employeelocations_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(location_id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.employeelocations DROP CONSTRAINT employeelocations_location_id_fkey;
       public               postgres    false    222    219    3512            �           2606    17300 &   employees employees_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE SET NULL;
 P   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_department_id_fkey;
       public               postgres    false    218    220    3510            �           2606    17269 &   locations locations_department_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.locations DROP CONSTRAINT locations_department_id_fkey;
       public               postgres    false    3510    219    218            w   6   x�3��5000�4202�54�52���K�,�L)M��4445�4������� �
H      z      x������ � �      m   �  x��Umn�@�]N�$�!���Ä	�Rۄ�����Ej�T�ӎo3G��[/kH%ke���z�{�y���)ezc��VL���K�S�M�3c3=2�7�2P�.���9�L1L_�*ށ��� -@~���j@���/`�3�A��He�W���ֲIc�5��\��t 3���<������׫�E�zG��x��>���?�Lo栈��B�s~�ԇq&n:XzUX��u�ez��,��n���u6�s��@G�{��T}>�:��B�ه�GK�[)����N�����GME4�5�e
��5z�G�C|��"^� �;4G!Ok*��K��n��+c�4��..���v#�~��+k�3�CQ������A'��:W��©��4��&�˪fi���qz�m��+0�W!��i�Pć��`G��9�3�~I3��w����$9Mōsa$f2A�J�xjԤ�tN�|�GbG�Qq�U[���/Jil�k�S%�)�{����]E��j�Ƹ� ��{��HS0s�,Ѽ!�w���C_�G�1��0F��5�6E�?&�.|N1��ˢa���H���Q�%���D��5������Y�V�bH&��%%0�޻	���nkQ�z�h4> 1{��      q   <   x�Mɹ  ���<&ف��K��
;�(۬	+q,x&�����'����H6�T V@�      o   6  x�u�[������ߑk����l0`�ƀ������v�JݍZ�J�6�J����d'��%{{��ʶ���0P	Y�e���}��A�"Kir�&��Rz��4�N��i�&��&O��m���&?��M���n�w��������%�J(Z_�z �+�WJO��~����{q˘v�`
պ�#.���I���fA�z6<��	�Ɔ�A%�t;���0z��x� �i�������) ~�&���������^��뒸�l_Q��y^wL��ѮBxeh;��8��c��q�l�֤�̰9���XU��@P&�#��@����-���s��p������7�o��=pSZ)���)����.�����aOD�W�l�V8YG��,����g��/K���cp��P.?ϩ� ���l] �o��Ue�n��X��6��M��`Fy�^�5��|k#肸��zX̓!G���f�,Y�-�kS� ��IRG�΋{d,�=(�	H���:o�䗒/Zb(�������D�؍c����p!5�y�ƣ��oYH�f�jk�^4h�E���jSy3"Աh_
0�4y���zξ�7��������g(;|E�ΗR���=���2ړsa��i�T;xל-\�rcM)��`{�p'=�!$I}18�&[�-����~���-3˘R��t��&�H�ю��!�\��>��-W����b|N�[�a��kEz�a�A(ꁡ����)z��=P�O@�Mz�=8u�?�����-mŭ�+�w��K$b��N�MGn� T(QM����<����R��-�q	+�(H�A+�C�vDy}h��nׅ%�=��䈖%I�x�������������6���q3�ʁ�jX��P��̝������������/`ݛ�0���Xѕ�޽�^d��*�@�v�]�ؠ֭4W�`���;�{��R��
[S݄=�Z���(�7�"dVd�D�g[0�� ~v��χ|<�������w�v�p���d� I�/@��%��Չ��ѵ��e ��n���r��m��Jݡ�~d��=~�
�7�����h(�Xz�o�M�������U'S����)���ƣ�lU�ۃ���5�:��&�V�C�S����u&�K���bp���	͏ �o����wU)3��%����te�T����Sw�T�%��2��+8�Y�b#U�9�A[˱����dAp;���0����y��e�}&i�}Wl�Sc�׻�.�F�h7n��ϬYy�"hؖ�t���[?A1�Η��a������ ����̹P����Ej+�TG�}o����R�0hLcf;椆�ҁ�VDrn�֬2+�x�}$S�rż�.�5��R�Y5��;�qƶ�-�i'��~�kd�zQ#�W�&	����%�.�P�
�6(|�{F��������9{b�Ya�?�PAG}��5�5�s�
`�RZ�44&b�'�=��Z���5��+$+��K�cwơ�%�mqA�2D��J�p��w��T���]D?��Z�>����ֹ��Hc�	V�Fwc�˩��א���f��Gh�ޟ����5�Ѥ����ǳ�k�����Y"I�      n   B  x��[_o��?�=�Cܻ�ww���A� �뷾�[h]����Bi�	�6�J�Y%(K`1tr�6�Q�;���s$�HI�"y��������gi�fuuRW��հ���WW�����gu�C]M�M��Q]���n]����u�g�ˍ,e��R�2����]�L�d�l��Y�߫g_��]�}={���]]������M]Uu�]Ϟ��i]�G,���c�k�3xJ��oxu
�c�` &(Y��v�r���V g^`!�@��(�@bci�% ��0Z���D>�����W��[�u`�2���l���H���eFtTEZ�P�mxgJ��!��7�3ۉ�k��9J�}F�O���>�~���O���G�##��?+����bR8�
��D�|Ō�j����3x���|s�[�ʡ�����q"�XŐ����(c�,��(b`������_�#��n5~3�;4���1�;�=x|��a؇_O��j�+�9D�rK�� f��s`�
��?�,v
��88����/�E���$��t�mț[S��v	^���e�9	E8eW���C��Kx�b������s��n]�qY��'hR���D�D����$Ϧ�t�`���b�,��UA���1d���5�!�y�r6K9\��<h)��S�KBQ�Hq��צ��6���G^&X
�<ْ��la�2F�v?�p���6�w�����O?��ܸw����'�jYJ�Vf����Y[�ĝ�,V��`���dK)<�+-b1eyq�"E`j Z�@�~�S?a�>C�>�|K4H��b�|�����h1�G>_��j�g࢙|30@�~|�RY:���"��6�p6d�nO T h�6���X�a�L?o�$`�Mk����fx�2%$�=�V<�Uy����;�&�{��߾z���/�����ÿ�U��Ť��@��ݷb,�v�[��|p����������H��^n`'v�F�����u�/]�����H5��y[��b���A���Ҝ!z�&�O�ԏ���&��n�M䧚��4�(=0��C=��n���'7�|�vGA;&���]~ϸ���?'��On�L����i�sj���F��c}]WW#�-e&��,O/����}��7�\�yvi�yиR�Ʀ[�7��/~��m����`�Lq�B%��~����"���v��Y'o�F98��6��6�$�W���T}��?�%�gV�C���D��L���m�fq�\ ������1+�Sz����� ���)��<a��kJ���ZC� 8�x�xA8���%���@),@I(����r���%e��t*ov�R�!"N��{�3ܒ�>�A� A9u� �>6��~�9X�"��Z�),s�*�R�1�6�l��ZfEG4��XACrVp��VP"�6��(�.fWϞ��^9ɒ�[�hg�xȰ��\���d2+��̰�x���dr+�����H�lM��Qۆ���,��u�f��f��&�7}�$��z*;�̝$���-��l+������:�m7w(��B�Q
W��Ď\��HٞB�1B��	v��6��q��hՔic����UpZPeG�xw
Y�<�$7�-���z��-�3�����gt�|$[L�6��+�b�ӓ����4p�$�M[u�~�]0w����NEu4K��o�J�H�na����|Ծ}kUE������փcH�#$��0Up{ѷ����������WE��n��n4z[};��P��uɬ����"��}O��L��1�nF���'�����O>��9�P�5@~E4���[��eyx7���Sk�g������'X	_�G#�~{X�zp�5n~w��7�f�B���j�v�j���j���T�{�4_�\��Z6,/��epk�~�)5��q��Y<�6�yk�4�y�%i���6e��ۣ�Ĵ��[�-� B�<��rra1�&�=@�;P��ڳ�p��/O�͏�>In�}t��V���Y�;��e���H�Z�f*�h��#o9�F�]�/�.u
�������r�m����0E{c&%^�O;��nfݝ��S�ˍd��=L�<|�[�pV*iS���kN8%�M��xc��a-i�Q�Ǜ��DQў��8��f~���ұ�6U�4��f��O!'La��>]\�o�&�/�bTŎ���7�w�֏Q%:���Iqʮ#N[�Jf	G��=ʎ�H��c5��Q��،�xӱ�������W!��*I-�q���~p5�%5��FS"�xi�:v��I���w���w�1��ҍ�d)0��Y �i�#�h�n����a�|Íz�e<-a<q�C#Sx�����c��R�w�2�{��&�|���!:�����7���>�e;c����v��²�	��h������"1)��:�aB�,c�N��_�ۋv�JU0�@�7K�/�#9͹AP�E5gFY�)�c�o���
�h���-�kKn�q �۬	�;Z�2�X_H� �+�N"��(P������iq���3Hn�� G��#0�k��'NF�_8'd��E�d�R5W�p��!C�`PAWk����~��g�� ����:�mJ
zH�G�PIdP�@?h{ 5IO��S��'Q�Y��h�)I�/��~Nl�y��A]���kA�6{��K�w>��<�W1�,kT����,f��?��n�*��-�2nrC�=އ�'�T���o$�s�ݹ5/�vFK��sK�P� �E� �疋�Y&1�2�Y�s��IQ��A~���t�K�u�om�H��x.X�rkf ���/������4���LȂ2�S����jY��������$���E��K����VW%�HP�[/* ��!N�M� I��@,��㘄������f5^�3�ve ̼��vq^�1n����ZQj��E	���o��A���h�Mq<��CDL�6�����I��˄�'8�o���(|)�>����N�����gL��Ȼ`�}�H�@�[2~�t���@/N�p"��s˳��gQ�2r�-NӖej9B��b��|S=��^���??+��Hae.f���>�!//Q��V�����׮]�,��      x   D  x����N�0���)<����ÞE"aC�J��H�!JF&F6&��6�($qJ�#�����/> i�n��]�M%v\�NK�&�3R�d*{ؓ���r�k��	��Ƃ����������o	?	����2x'|%D��}�>��b%�;�O��z�׫]��i�/7�l%N��B3�LzL�锕�5$_�$Sg�����e=�Z֗tZ20ɀ��$�Ϋ;�Ԫ@�J�A.,	]	C9]�f50fӿ��'=�LU۝[�3A8�<`�����S��w�D�����|�ͧ��W'��O��3g��m� ���      s   "   x�3�LIMK,�)�/JL�,-�420������ r�T      u   B   x�3��OK�LN�2����M�L�I�21�J�3�R��uK�2�L8��uӊ�su3�sS�b���� E�     