
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

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE SCHEMA IF NOT EXISTS "tasky";

ALTER SCHEMA "tasky" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."status" AS ENUM (
    'To-Do',
    'In progress',
    'Done'
    );

ALTER TYPE "public"."status" OWNER TO "supabase_admin";

COMMENT ON TYPE "public"."status" IS 'state of a task';

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
AS $$
begin
    insert into public.profile (id, full_name, avatar_url)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "supabase_admin";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."assignment_project" (
                                                             "project_id" bigint NOT NULL,
                                                             "assignee" "uuid" NOT NULL
);

ALTER TABLE "public"."assignment_project" OWNER TO "supabase_admin";

CREATE TABLE IF NOT EXISTS "public"."assignment_task" (
                                                          "task_id" bigint NOT NULL,
                                                          "assignee" "uuid" NOT NULL
);

ALTER TABLE "public"."assignment_task" OWNER TO "supabase_admin";

CREATE TABLE IF NOT EXISTS "public"."profile" (
                                                  "id" "uuid" NOT NULL,
                                                  "updated_at" timestamp with time zone,
                                                  "username" "text",
                                                  "full_name" "text",
                                                  "avatar_url" "text",
                                                  CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);

ALTER TABLE "public"."profile" OWNER TO "supabase_admin";

CREATE TABLE IF NOT EXISTS "public"."project" (
                                                  "id" bigint NOT NULL,
                                                  "name" character varying NOT NULL,
                                                  "description" "text",
                                                  "owner" "uuid" NOT NULL,
                                                  "changed_at" timestamp with time zone,
                                                  "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."project" OWNER TO "supabase_admin";

ALTER TABLE "public"."project" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."project1_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."task" (
                                               "id" bigint NOT NULL,
                                               "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
                                               "changed_at" timestamp with time zone,
                                               "name" character varying NOT NULL,
                                               "content" "text",
                                               "status" "public"."status",
                                               "priority" smallint DEFAULT '1'::smallint,
                                               "project" bigint
);

ALTER TABLE "public"."task" OWNER TO "supabase_admin";

ALTER TABLE "public"."task" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."task_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );

ALTER TABLE ONLY "public"."assignment_project"
    ADD CONSTRAINT "assignment_project_pkey" PRIMARY KEY ("project_id", "assignee");

ALTER TABLE ONLY "public"."assignment_task"
    ADD CONSTRAINT "assignment_task_pkey" PRIMARY KEY ("task_id", "assignee");

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "project1_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."task"
    ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."assignment_task"
    ADD CONSTRAINT "assignment_assignee_fkey" FOREIGN KEY ("assignee") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."assignment_project"
    ADD CONSTRAINT "assignment_project_assignee_fkey" FOREIGN KEY ("assignee") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."assignment_project"
    ADD CONSTRAINT "assignment_project_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."assignment_task"
    ADD CONSTRAINT "assignment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."project"
    ADD CONSTRAINT "project1_owner_fkey" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."task"
    ADD CONSTRAINT "task_project_fkey" FOREIGN KEY ("project") REFERENCES "public"."project"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "All rights for project owner" ON "public"."assignment_project" USING (("project_id" IN ( SELECT "project"."id"
                                                                                                        FROM "public"."project"
                                                                                                        WHERE ("project"."owner" = "auth"."uid"()))));

CREATE POLICY "Enable all for users based on project" ON "public"."project" USING (("owner" = "auth"."uid"()));

CREATE POLICY "Public profile are viewable by every user." ON "public"."profile" FOR SELECT USING (true);

CREATE POLICY "Select project for team members" ON "public"."project" FOR SELECT USING (("id" IN ( SELECT "assignment_project"."project_id"
                                                                                                   FROM "public"."assignment_project"
                                                                                                   WHERE ("auth"."uid"() = "assignment_project"."assignee"))));

CREATE POLICY "Select rights for user in project" ON "public"."assignment_project" FOR SELECT USING (("project_id" IN ( SELECT "assignment_project_1"."project_id"
                                                                                                                        FROM "public"."assignment_project" "assignment_project_1"
                                                                                                                        WHERE ("assignment_project_1"."assignee" = "auth"."uid"()))));

CREATE POLICY "User in project" ON "public"."task" USING ((("id" IN ( SELECT "assignment_task"."task_id"
                                                                      FROM "public"."assignment_task"
                                                                      WHERE ("assignment_task"."assignee" = "auth"."uid"()))) OR ("project" IN ( SELECT "project"."id"
                                                                                                                                                 FROM "public"."project"
                                                                                                                                                 WHERE ("project"."owner" = "auth"."uid"())))));

CREATE POLICY "Users can insert their own profile." ON "public"."profile" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can update own profile." ON "public"."profile" FOR UPDATE USING (("auth"."uid"() = "id"));

ALTER TABLE "public"."profile" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."project" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."task" ENABLE ROW LEVEL SECURITY;

CREATE PUBLICATION "logflare_pub" WITH (publish = 'insert, update, delete, truncate');

ALTER PUBLICATION "logflare_pub" OWNER TO "supabase_admin";

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "postgres";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."assignment_project" TO "postgres";
GRANT ALL ON TABLE "public"."assignment_project" TO "anon";
GRANT ALL ON TABLE "public"."assignment_project" TO "authenticated";
GRANT ALL ON TABLE "public"."assignment_project" TO "service_role";

GRANT ALL ON TABLE "public"."assignment_task" TO "postgres";
GRANT ALL ON TABLE "public"."assignment_task" TO "anon";
GRANT ALL ON TABLE "public"."assignment_task" TO "authenticated";
GRANT ALL ON TABLE "public"."assignment_task" TO "service_role";

GRANT ALL ON TABLE "public"."profile" TO "postgres";
GRANT ALL ON TABLE "public"."profile" TO "anon";
GRANT ALL ON TABLE "public"."profile" TO "authenticated";
GRANT ALL ON TABLE "public"."profile" TO "service_role";

GRANT ALL ON TABLE "public"."project" TO "postgres";
GRANT ALL ON TABLE "public"."project" TO "anon";
GRANT ALL ON TABLE "public"."project" TO "authenticated";
GRANT ALL ON TABLE "public"."project" TO "service_role";

GRANT ALL ON SEQUENCE "public"."project1_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."project1_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project1_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project1_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."task" TO "postgres";
GRANT ALL ON TABLE "public"."task" TO "anon";
GRANT ALL ON TABLE "public"."task" TO "authenticated";
GRANT ALL ON TABLE "public"."task" TO "service_role";

GRANT ALL ON SEQUENCE "public"."task_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."task_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."task_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."task_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
