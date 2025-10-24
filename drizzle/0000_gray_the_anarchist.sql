CREATE TABLE `colaboradores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(10) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`loja` varchar(255) NOT NULL,
	`funcao` varchar(100) NOT NULL,
	`empresa` varchar(255) NOT NULL DEFAULT 'Expressglass SA',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `colaboradores_id` PRIMARY KEY(`id`),
	CONSTRAINT `colaboradores_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `relatorios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`colaboradorId` int NOT NULL,
	`data` varchar(10) NOT NULL,
	`matricula` varchar(20) NOT NULL,
	`localidade` varchar(255) NOT NULL,
	`motivo` text NOT NULL,
	`klm` int NOT NULL,
	`valorPorKm` int NOT NULL DEFAULT 36,
	`totalDespesas` int NOT NULL,
	`pdfUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `relatorios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
