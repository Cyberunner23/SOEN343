-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2018 at 08:11 AM
-- Server version: 10.1.35-MariaDB
-- PHP Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `soen343`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `IsAdmin` tinyint(1) NOT NULL,
  `EMail` text NOT NULL,
  `Password` text NOT NULL,
  `Salt` text NOT NULL,
  `FirstName` text NOT NULL,
  `LastName` text NOT NULL,
  `Phone` text NOT NULL,
  `Address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `IsAdmin`, `EMail`, `Password`, `Salt`, `FirstName`, `LastName`, `Phone`, `Address`) VALUES
(1, 1, 'One', 'One', 'soen343', 'One', 'One', 'One', 'One'),
(2, 0, 'Two', 'Two', 'soen343', 'Two', 'Two', 'Two', 'Two'),
(3, 0, 'Three', 'Three', 'soen343', 'Three', 'Three', 'Three', 'Three'),
(4, 0, 'Four', 'Four', 'soen343', 'Four', 'Four', 'Four', 'Four'),
(5, 0, 'Five', 'Five', 'soen343', 'Five', 'Five', 'Five', 'Five');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
