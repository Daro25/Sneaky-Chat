CREATE TABLE `CATEGORIA` (
	`ID_categoria` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Nombre` text(40) NOT NULL,
	`Color` text(7) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `DATOSP` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pass` text(20) NOT NULL,
	`Id_User` text(40) NOT NULL,
	`Id_Usserver` integer NOT NULL,
	`Year` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `EMISOR` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`idUsserver` integer,
	`n` text(2048),
	`Id_User` text(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `MENSAJE` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`IDSERV` integer NOT NULL,
	`Sala` text(20) NOT NULL,
	`Dates` text(30) NOT NULL,
	`Texto` text(200),
	`Id_User` text(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `NOTAS` (
	`ID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Titulo` text(40) NOT NULL,
	`Descripcion` text(250),
	`ID_categoria` integer,
	FOREIGN KEY (`ID_categoria`) REFERENCES `CATEGORIA`(`ID_categoria`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `SALAS` (
	`Id_sala` integer NOT NULL,
	`pass` text(20) NOT NULL,
	`nombre` text(20)
);
