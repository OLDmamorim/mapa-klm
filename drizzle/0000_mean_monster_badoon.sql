CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "colaboradores" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(10) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"loja" varchar(255) NOT NULL,
	"funcao" varchar(100) NOT NULL,
	"empresa" varchar(255) DEFAULT 'Expressglass SA' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "colaboradores_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "relatorios" (
	"id" serial PRIMARY KEY NOT NULL,
	"colaboradorId" integer NOT NULL,
	"data" varchar(10) NOT NULL,
	"matricula" varchar(20) NOT NULL,
	"localidade" varchar(255) NOT NULL,
	"motivo" text NOT NULL,
	"klm" integer NOT NULL,
	"valorPorKm" integer DEFAULT 36 NOT NULL,
	"totalDespesas" integer NOT NULL,
	"pdfUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
