-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2025 at 11:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `career_launch_2026`
--

-- --------------------------------------------------------

--
-- Table structure for table `companies_details`
--

CREATE TABLE `companies_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `sector` varchar(100) DEFAULT NULL,
  `website` text DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `booth_contact_name` varchar(100) DEFAULT NULL,
  `booth_contact_email` varchar(100) DEFAULT NULL,
  `invoice_contact_name` varchar(100) DEFAULT NULL,
  `invoice_contact_email` varchar(100) DEFAULT NULL,
  `po_number` varchar(50) DEFAULT NULL,
  `vat_number` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies_details`
--

INSERT INTO `companies_details` (`id`, `user_id`, `company_name`, `sector`, `website`, `phone_number`, `street`, `postal_code`, `city`, `booth_contact_name`, `booth_contact_email`, `invoice_contact_name`, `invoice_contact_email`, `po_number`, `vat_number`) VALUES
(1, 3, 'TechCorp', 'IT Consultancy', 'https://techcorp.be', '+32012345678', 'Main Street 5', '1000', 'Brussel', 'Bob Tech', 'bob@techcorp.be', 'Finance TechCorp', 'factuur@techcorp.be', 'PO1234', 'BE0123456789'),
(2, 4, 'SmartSolutions', 'Softwareontwikkeling', 'https://smartsolutions.be', '+32098765432', 'Innovationlaan 3', '2000', 'Antwerpen', 'Eva Manager', 'eva@smartsolutions.be', 'Boekhouding Smart', 'boekhouding@smartsolutions.be', 'PO5678', 'BE9876543210');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `student_id`, `company_id`, `created_at`) VALUES
(1, 1, 1, '2025-06-05 09:06:39'),
(2, 2, 2, '2025-06-05 09:06:39');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `company_id`, `student_id`, `score`, `comment`, `created_at`) VALUES
(1, 1, 1, 5, 'Zeer gemotiveerd en goed voorbereid.', '2025-06-05 09:06:51'),
(2, 2, 2, 4, 'Sterke technische kennis, iets meer communicatie gewenst.', '2025-06-05 09:06:51');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `User_ID` int(11) NOT NULL,
  `ID_target` int(11) NOT NULL,
  `target_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stands`
--

CREATE TABLE `stands` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `location` varchar(50) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('beschikbaar','bezet') DEFAULT 'bezet'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stands`
--

INSERT INTO `stands` (`id`, `company_id`, `location`, `price`, `status`) VALUES
(1, 1, 'A-01', 300.00, 'bezet'),
(2, 2, 'A-02', 250.00, 'bezet');

-- --------------------------------------------------------

--
-- Table structure for table `students_details`
--

CREATE TABLE `students_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `school` varchar(100) DEFAULT NULL,
  `education` varchar(100) DEFAULT NULL,
  `year` enum('eerste','tweede','derde') DEFAULT NULL,
  `about` text DEFAULT NULL,
  `linkedin_url` text DEFAULT NULL,
  `interest_jobstudent` tinyint(1) DEFAULT NULL,
  `interest_stage` tinyint(1) DEFAULT NULL,
  `interest_job` tinyint(1) DEFAULT NULL,
  `interest_connect` tinyint(1) DEFAULT NULL,
  `domain_data` tinyint(1) DEFAULT NULL,
  `domain_networking` tinyint(1) DEFAULT NULL,
  `domain_ai` tinyint(1) DEFAULT NULL,
  `domain_software` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students_details`
--

INSERT INTO `students_details` (`id`, `user_id`, `school`, `education`, `year`, `about`, `linkedin_url`, `interest_jobstudent`, `interest_stage`, `interest_job`, `interest_connect`, `domain_data`, `domain_networking`, `domain_ai`, `domain_software`) VALUES
(1, 1, 'Hogeschool Gent', 'Toegepaste Informatica', 'derde', 'Passie voor software development.', 'https://linkedin.com/in/alice', 1, 1, 1, 0, 0, 0, 1, 1),
(2, 2, 'Hogeschool Gent', 'Toegepaste Informatica', 'tweede', 'Grote interesse in AI en data.', 'https://linkedin.com/in/thomas', 0, 1, 1, 1, 1, 0, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','bedrijf','admin') NOT NULL,
  `organization` varchar(100) DEFAULT NULL,
  `profile_slug` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `organization`, `profile_slug`, `created_at`) VALUES
(1, 'Alice Student', 'alice@student.com', '$2b$10$mstei6sypy6fdgdUHNHDIeo/aXAiE9LL/BKAPv0H5OK82U73ZfTn2', 'student', 'Hogeschool Gent', 'alice-student', '2025-06-05 09:01:00'),
(2, 'Thomas Student', 'thomas@student.com', 'hashed_pw2', 'student', 'Hogeschool Gent', 'thomas-student', '2025-06-05 09:01:00'),
(3, 'Bob Company', 'bob@bedrijf.com', 'hashed_pw3', 'bedrijf', 'TechCorp', 'bob-techcorp', '2025-06-05 09:01:00'),
(4, 'Eva Enterprise', 'eva@bedrijf.com', 'hashed_pw4', 'bedrijf', 'SmartSolutions', 'eva-smartsolutions', '2025-06-05 09:01:00'),
(5, 'Admin Beheer', 'admin@careerlaunch.be', 'hashed_admin', 'admin', NULL, 'admin-launch', '2025-06-05 09:01:00'),
(6, 'Bilal Belkasem', 'bilal.belkasem@student.ehb.be', '$2b$10$Qdog0YiEjEDkKV4SIfQ4zuPfFdcT6/vGFz/mTY6iTNQD3W8A1AWn6', 'student', 'Hogeschool Gent', 'bilal-belkasem', '2025-06-10 12:57:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `companies_details`
--
ALTER TABLE `companies_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`User_ID`,`ID_target`,`target_type`);

--
-- Indexes for table `stands`
--
ALTER TABLE `stands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `students_details`
--
ALTER TABLE `students_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `profile_slug` (`profile_slug`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `companies_details`
--
ALTER TABLE `companies_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stands`
--
ALTER TABLE `stands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `students_details`
--
ALTER TABLE `students_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `companies_details`
--
ALTER TABLE `companies_details`
  ADD CONSTRAINT `companies_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies_details` (`id`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies_details` (`id`),
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `stands`
--
ALTER TABLE `stands`
  ADD CONSTRAINT `stands_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies_details` (`id`);

--
-- Constraints for table `students_details`
--
ALTER TABLE `students_details`
  ADD CONSTRAINT `students_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
