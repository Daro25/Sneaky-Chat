-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-03-2025 a las 20:09:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mensajer_a`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `id` int(4) NOT NULL,
  `sala_Id` int(5) NOT NULL,
  `dates` datetime NOT NULL,
  `Texto` varchar(120) NOT NULL,
  `User_Id` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensaje`
--

INSERT INTO `mensaje` (`id`, `sala_Id`, `dates`, `Texto`, `User_Id`) VALUES
(1, 1000, '2025-02-09 03:53:04', 'HOLA MUNDO', 1000),
(5, 1000, '2025-02-22 21:26:10', ' hola a todos', 2000),
(6, 1000, '2025-02-25 18:32:44', ' jajajaj', 2000),
(7, 1000, '2025-02-25 18:33:19', ' hola a tds', 2000),
(8, 1000, '2025-02-26 08:38:13', ' jajajaj', 2000),
(9, 1000, '2025-02-26 08:42:00', ' jajajaj', 2000),
(10, 1000, '2025-02-26 08:42:15', ' hola mundo', 2000),
(11, 1000, '2025-02-26 08:42:30', ' hola mundo', 1000),
(12, 1000, '2025-02-26 09:16:33', ' hola', 2000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sala`
--

CREATE TABLE `sala` (
  `Id_sala` int(5) NOT NULL,
  `Contra_Sala` varchar(20) NOT NULL,
  `Nom_Sala` varchar(20) NOT NULL,
  `Cupo` int(3) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sala`
--

INSERT INTO `sala` (`Id_sala`, `Contra_Sala`, `Nom_Sala`, `Cupo`) VALUES
(1000, 'AFR4324', 'SalaP', 35);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id_User` int(4) NOT NULL,
  `Nomb` varchar(20) NOT NULL,
  `Contra` varchar(20) NOT NULL,
  `Sala_Id` int(5) NOT NULL,
  `Edad` int(2) NOT NULL,
  `keyPublic` text(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Id_User`, `Nomb`, `Contra`, `Sala_Id`, `Edad`) VALUES
(1000, 'user1', '0234dgsA', 1000, 18),
(2000, 'user2', '245trf', 1000, 16);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sala_Id` (`sala_Id`),
  ADD KEY `User_Id` (`User_Id`);

--
-- Indices de la tabla `sala`
--
ALTER TABLE `sala`
  ADD PRIMARY KEY (`Id_sala`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id_User`),
  ADD KEY `Sala_Id` (`Sala_Id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`sala_Id`) REFERENCES `sala` (`Id_sala`),
  ADD CONSTRAINT `mensaje_ibfk_2` FOREIGN KEY (`User_Id`) REFERENCES `usuario` (`Id_User`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Sala_Id`) REFERENCES `sala` (`Id_sala`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
