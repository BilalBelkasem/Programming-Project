-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 21, 2025 at 11:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AnnuleerSpeeddate` (IN `speeddate_id_param` INT)   BEGIN
    DECLARE is_reserved BOOLEAN DEFAULT FALSE;
    
    -- Controleer of de speeddate gereserveerd is
    SELECT bezet = 1 INTO is_reserved
    FROM speeddates 
    WHERE date_id = speeddate_id_param;
    
    IF is_reserved THEN
        -- Annuleer de reservering
        UPDATE speeddates 
        SET student_id = NULL, 
            bezet = 0, 
            gereserveerd_op = NULL
        WHERE date_id = speeddate_id_param;
        
        SELECT 'SUCCESS' as status, 'Speeddate reservering geannuleerd' as message;
    ELSE
        SELECT 'ERROR' as status, 'Speeddate is niet gereserveerd' as message;
    END IF;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GenereerSpeeddatesVoorAlleBedrijven` ()   BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE company_id_var INT;
    DECLARE start_time TIME;
    DECLARE end_time TIME;
    DECLARE session_duration INT;
    DECLARE current_time_slot TIME;
    DECLARE company_cursor CURSOR FOR SELECT id FROM companies_details;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Haal de actieve configuratie op
    SELECT start_uur, eind_uur, sessie_duur_minuten 
    INTO start_time, end_time, session_duration
    FROM speeddates_config 
    WHERE actief = 1 
    LIMIT 1;
    
    -- Verwijder alle bestaande speeddates
    DELETE FROM speeddates;
    
    -- Loop door alle bedrijven
    OPEN company_cursor;
    
    read_loop: LOOP
        FETCH company_cursor INTO company_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Genereer speeddate slots voor dit bedrijf
        SET current_time_slot = start_time;
        
        WHILE current_time_slot < end_time DO
            INSERT INTO speeddates (company_id, begin_tijd, eind_tijd, bezet)
            VALUES (
                company_id_var,
                current_time_slot,
                ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60)),
                0
            );
            
            -- Ga naar volgende tijdsslot
            SET current_time_slot = ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60));
        END WHILE;
        
    END LOOP;
    
    CLOSE company_cursor;
    
    SELECT 'SUCCESS' as status, 'Speeddates succesvol gegenereerd voor alle bedrijven' as message;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GenereerSpeeddatesVoorBedrijf` (IN `company_id_param` INT)   BEGIN
    DECLARE start_time TIME;
    DECLARE end_time TIME;
    DECLARE session_duration INT;
    DECLARE current_time_slot TIME;
    
    -- Haal de actieve configuratie op
    SELECT start_uur, eind_uur, sessie_duur_minuten 
    INTO start_time, end_time, session_duration
    FROM speeddates_config 
    WHERE actief = 1 
    LIMIT 1;
    
    -- Verwijder bestaande speeddates voor dit bedrijf
    DELETE FROM speeddates WHERE company_id = company_id_param;
    
    -- Genereer nieuwe speeddate slots
    SET current_time_slot = start_time;
    
    WHILE current_time_slot < end_time DO
        INSERT INTO speeddates (company_id, begin_tijd, eind_tijd, bezet)
        VALUES (
            company_id_param,
            current_time_slot,
            ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60)),
            0
        );
        
        -- Ga naar volgende tijdsslot
        SET current_time_slot = ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60));
    END WHILE;
    
    SELECT 'SUCCESS' as status, CONCAT('Speeddates succesvol gegenereerd voor bedrijf ID: ', company_id_param) as message;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReserveerSpeeddate` (IN `speeddate_id_param` INT, IN `student_id_param` INT)   BEGIN
    DECLARE is_available BOOLEAN DEFAULT FALSE;
    DECLARE current_company_id INT;
    
    -- Controleer of de speeddate beschikbaar is
    SELECT bezet = 0, company_id INTO is_available, current_company_id
    FROM speeddates 
    WHERE date_id = speeddate_id_param;
    
    IF is_available THEN
        -- Reserveer de speeddate
        UPDATE speeddates 
        SET student_id = student_id_param, 
            bezet = 1, 
            gereserveerd_op = NOW()
        WHERE date_id = speeddate_id_param;
        
        SELECT 'SUCCESS' as status, 'Speeddate succesvol gereserveerd' as message;
    ELSE
        SELECT 'ERROR' as status, 'Speeddate is niet beschikbaar' as message;
    END IF;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ResetAlleSpeeddates` ()   BEGIN
    UPDATE speeddates 
    SET student_id = NULL,
        bezet = 0,
        gereserveerd_op = NULL;
    
    SELECT 'SUCCESS' as status, 'Alle speeddates zijn gereset naar beschikbaar' as message;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SynchroniseerSpeeddatesMetConfig` ()   BEGIN
    DECLARE v_start_uur TIME;
    DECLARE v_eind_uur TIME;
    DECLARE v_sessie_duur INT;
    DECLARE v_company_id INT;
    DECLARE v_huidige_tijd TIME;
    DECLARE v_eind_tijd_sessie TIME;
    DECLARE done INT DEFAULT FALSE;

    -- Cursor om door alle bedrijven te lussen.
    DECLARE cur_companies CURSOR FOR SELECT id FROM companies_details;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Haal de actieve configuratie op.
    SELECT start_uur, eind_uur, sessie_duur_minuten
    INTO v_start_uur, v_eind_uur, v_sessie_duur
    FROM speeddates_config WHERE actief = 1 LIMIT 1;

    -- Markeer geboekte afspraken die buiten het nieuwe tijdsbestek vallen als geannuleerd.
    UPDATE speeddates
    SET
        status = 'cancelled_by_admin',
        cancellation_reason = 'De beschikbare tijden voor speeddates zijn gewijzigd door de organisatie.'
    WHERE
        status = 'booked'
        AND (begin_tijd < v_start_uur OR eind_tijd > v_eind_uur);

    -- Verwijder alle nog beschikbare (niet-geboekte) tijdslots, want deze worden opnieuw gegenereerd.
    DELETE FROM speeddates WHERE status = 'available';

    -- Loop door alle bedrijven om nieuwe, beschikbare tijdslots te genereren.
    OPEN cur_companies;

    read_loop: LOOP
        FETCH cur_companies INTO v_company_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET v_huidige_tijd = v_start_uur;

        -- Genereer de nieuwe slots.
        WHILE v_huidige_tijd < v_eind_uur DO
            SET v_eind_tijd_sessie = ADDTIME(v_huidige_tijd, MAKETIME(0, v_sessie_duur, 0));

            IF v_eind_tijd_sessie <= v_eind_uur THEN
                -- Voeg alleen een nieuw, beschikbaar slot toe als er op dit tijdstip nog geen
                -- (geboekt of geannuleerd) slot bestaat voor dit bedrijf.
                IF NOT EXISTS (SELECT 1 FROM speeddates WHERE company_id = v_company_id AND begin_tijd = v_huidige_tijd) THEN
                    INSERT INTO speeddates (company_id, begin_tijd, eind_tijd, status)
                    VALUES (v_company_id, v_huidige_tijd, v_eind_tijd_sessie, 'available');
                END IF;
            END IF;

            SET v_huidige_tijd = v_eind_tijd_sessie;
        END WHILE;
    END LOOP;

    CLOSE cur_companies;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ToonSpeeddatesOverzicht` ()   BEGIN
    SELECT 
        cd.company_name,
        COUNT(s.date_id) as totaal_slots,
        SUM(CASE WHEN s.bezet = 0 THEN 1 ELSE 0 END) as beschikbaar,
        SUM(CASE WHEN s.bezet = 1 THEN 1 ELSE 0 END) as gereserveerd,
        ROUND((SUM(CASE WHEN s.bezet = 1 THEN 1 ELSE 0 END) / COUNT(s.date_id)) * 100, 2) as bezettingsgraad_percentage
    FROM companies_details cd
    LEFT JOIN speeddates s ON cd.id = s.company_id
    GROUP BY cd.id, cd.company_name
    ORDER BY cd.company_name;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateSpeeddatesConfiguratie` (IN `start_uur_param` TIME, IN `eind_uur_param` TIME, IN `sessie_duur_minuten_param` INT)   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR' as status, 'Fout bij het updaten van de configuratie' as message;
    END;
    
    START TRANSACTION;
    
    -- Update de configuratie
    UPDATE speeddates_config 
    SET start_uur = start_uur_param,
        eind_uur = eind_uur_param,
        sessie_duur_minuten = sessie_duur_minuten_param,
        aangepast_op = NOW()
    WHERE actief = 1;
    
    -- Synchroniseer automatisch alle speeddates
    CALL SynchroniseerSpeeddatesMetConfig();
    
    COMMIT;
    
    SELECT 'SUCCESS' as status, 'Configuratie succesvol bijgewerkt en speeddates gesynchroniseerd' as message;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `VerwijderOudeSpeeddates` ()   BEGIN
    DECLARE aantal_verwijderd INT DEFAULT 0;
    
    DELETE FROM speeddates 
    WHERE company_id NOT IN (SELECT id FROM companies_details);
    
    SET aantal_verwijderd = ROW_COUNT();
    
    SELECT 'SUCCESS' as status, CONCAT(aantal_verwijderd, ' oude speeddates verwijderd') as message;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ZoekBeschikbareSpeeddates` (IN `zoek_tijd` TIME)   BEGIN
    SELECT 
        s.date_id,
        cd.company_name,
        s.begin_tijd,
        s.eind_tijd,
        s.bezet
    FROM speeddates s
    JOIN companies_details cd ON s.company_id = cd.id
    WHERE s.bezet = 0 
    AND s.begin_tijd >= zoek_tijd
    ORDER BY s.begin_tijd
    LIMIT 20;
END$$

DELIMITER ;

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
  `vat_number` varchar(50) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `zoek_jobstudent` tinyint(1) DEFAULT 0,
  `zoek_stage` tinyint(1) DEFAULT 0,
  `zoek_connecties` tinyint(1) DEFAULT 0,
  `zoek_job` tinyint(1) DEFAULT 0,
  `domein_data` tinyint(1) DEFAULT 0,
  `domein_netwerking` tinyint(1) DEFAULT 0,
  `domein_ai` tinyint(1) DEFAULT 0,
  `domein_software` tinyint(1) DEFAULT 0,
  `about` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies_details`
--

INSERT INTO `companies_details` (`id`, `user_id`, `company_name`, `sector`, `website`, `phone_number`, `street`, `postal_code`, `city`, `booth_contact_name`, `booth_contact_email`, `invoice_contact_name`, `invoice_contact_email`, `po_number`, `vat_number`, `logo`, `zoek_jobstudent`, `zoek_stage`, `zoek_connecties`, `zoek_job`, `domein_data`, `domein_netwerking`, `domein_ai`, `domein_software`, `about`) VALUES
(1, 3, 'TechCorp', 'IT Consultancy', 'https://techcorp.be', '+32012345678', 'Main Street 5', '1000', 'Brussel', 'Bob Tech', 'bob@techcorp.be', 'Finance TechCorp', 'factuur@techcorp.be', 'PO1234', 'BE0123456789', NULL, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
(2, 4, 'SmartSolutions', 'Softwareontwikkeling', 'https://smartsolutions.be', '+32098765432', 'Innovationlaan 3', '2000', 'Antwerpen', 'Eva Manager', 'eva@smartsolutions.be', 'Boekhouding Smart', 'boekhouding@smartsolutions.be', 'PO5678', 'BE9876543210', NULL, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
(3, 12, 'qwerty', 'Dienstverlening & consultancy', 'qwerty', '12345789', 'qwerty', '1234', 'qwerty', 'qwerty', 'qwerty@qwerty', 'qwerty', 'qwerty@qwerty', NULL, '102589648', NULL, 1, 1, 0, 0, 0, 0, 1, 0, 'qwerty is beter dan azerty');

--
-- Triggers `companies_details`
--
DELIMITER $$
CREATE TRIGGER `tr_company_added_generate_speeddates` AFTER INSERT ON `companies_details` FOR EACH ROW BEGIN
    -- Genereer speeddates voor het nieuwe bedrijf
    CALL GenereerSpeeddatesVoorBedrijf(NEW.id);
    
    -- Log de actie in audit log
    INSERT INTO speeddates_audit_log (actie, student_id, aantal_speeddates_vrijgegeven, uitgevoerd_op, extra_info)
    VALUES (
        'COMPANY_ADDED', 
        NULL, 
        NULL, 
        NOW(), 
        CONCAT('Nieuw bedrijf toegevoegd: ID ', NEW.id, ', Naam: ', NEW.company_name)
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_company_deleted_speeddates_cleanup` AFTER DELETE ON `companies_details` FOR EACH ROW BEGIN
    DECLARE aantal_speeddates INT DEFAULT 0;
    DECLARE aantal_gereserveerde_speeddates INT DEFAULT 0;
    
    -- Tel hoeveel speeddates er zijn voor dit bedrijf (voor audit log)
    SELECT COUNT(*) INTO aantal_speeddates
    FROM speeddates 
    WHERE company_id = OLD.id;
    
    -- Tel aantal gereserveerde speeddates
    SELECT COUNT(*) INTO aantal_gereserveerde_speeddates
    FROM speeddates 
    WHERE company_id = OLD.id AND bezet = 1;
    
    -- Verwijder alle speeddates van dit bedrijf
    DELETE FROM speeddates WHERE company_id = OLD.id;
    
    -- Log de actie in audit log
    INSERT INTO speeddates_audit_log (actie, student_id, aantal_speeddates_vrijgegeven, uitgevoerd_op, extra_info)
    VALUES (
        'COMPANY_DELETED', 
        NULL, 
        aantal_speeddates, 
        NOW(), 
        CONCAT('Bedrijf ID: ', OLD.id, ', Bedrijfsnaam: ', OLD.company_name, ', Gereserveerde speeddates: ', aantal_gereserveerde_speeddates)
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `bedrijf_liked_student` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `student_id`, `company_id`, `created_at`, `bedrijf_liked_student`) VALUES
(1, 1, 1, '2025-06-05 09:06:39', 0),
(2, 2, 2, '2025-06-05 09:06:39', 0),
(36, 13, 2, '2025-06-19 15:16:03', 0),
(38, 13, 12, '2025-06-19 15:36:03', 1);

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
-- Table structure for table `speeddates`
--

CREATE TABLE `speeddates` (
  `date_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL COMMENT 'ID van companies_details tabel',
  `begin_tijd` time NOT NULL COMMENT 'Starttijd van de speeddate',
  `eind_tijd` time NOT NULL COMMENT 'Eindtijd van de speeddate',
  `student_id` int(11) DEFAULT NULL COMMENT 'ID van students_details tabel (NULL als niet gereserveerd)',
  `status` enum('available','booked','cancelled_by_admin') NOT NULL DEFAULT 'available' COMMENT 'Status van het tijdslot',
  `cancellation_reason` varchar(255) DEFAULT NULL COMMENT 'Reden van annulering door admin',
  `aangemaakt_op` timestamp NOT NULL DEFAULT current_timestamp(),
  `gereserveerd_op` timestamp NULL DEFAULT NULL COMMENT 'Wanneer de speeddate gereserveerd werd'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `speeddates`
--

INSERT INTO `speeddates` (`date_id`, `company_id`, `begin_tijd`, `eind_tijd`, `student_id`, `status`, `cancellation_reason`, `aangemaakt_op`, `gereserveerd_op`) VALUES
(449, 2, '14:20:00', '14:25:00', 7, 'cancelled_by_admin', 'De beschikbare tijden voor speeddates zijn gewijzigd door de organisatie.', '2025-06-21 13:03:20', '2025-06-21 16:41:29'),
(755, 1, '13:00:00', '13:05:00', 7, 'booked', NULL, '2025-06-21 16:59:21', '2025-06-21 17:12:17'),
(1180, 1, '12:00:00', '12:05:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1181, 1, '12:05:00', '12:10:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1182, 1, '12:10:00', '12:15:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1183, 1, '12:15:00', '12:20:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1184, 1, '12:20:00', '12:25:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1185, 1, '12:25:00', '12:30:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1186, 1, '12:30:00', '12:35:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1187, 1, '12:35:00', '12:40:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1188, 1, '12:40:00', '12:45:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1189, 1, '12:45:00', '12:50:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1190, 1, '12:50:00', '12:55:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1191, 1, '12:55:00', '13:00:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1192, 1, '13:05:00', '13:10:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1193, 1, '13:10:00', '13:15:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1194, 1, '13:15:00', '13:20:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1195, 1, '13:20:00', '13:25:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1196, 1, '13:25:00', '13:30:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1197, 1, '13:30:00', '13:35:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1198, 1, '13:35:00', '13:40:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1199, 1, '13:40:00', '13:45:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1200, 1, '13:45:00', '13:50:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1201, 1, '13:50:00', '13:55:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1202, 1, '13:55:00', '14:00:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1203, 2, '12:00:00', '12:05:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1204, 2, '12:05:00', '12:10:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1205, 2, '12:10:00', '12:15:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1206, 2, '12:15:00', '12:20:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1207, 2, '12:20:00', '12:25:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1208, 2, '12:25:00', '12:30:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1209, 2, '12:30:00', '12:35:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1210, 2, '12:35:00', '12:40:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1211, 2, '12:40:00', '12:45:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1212, 2, '12:45:00', '12:50:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1213, 2, '12:50:00', '12:55:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1214, 2, '12:55:00', '13:00:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1215, 2, '13:00:00', '13:05:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1216, 2, '13:05:00', '13:10:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1217, 2, '13:10:00', '13:15:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1218, 2, '13:15:00', '13:20:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1219, 2, '13:20:00', '13:25:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1220, 2, '13:25:00', '13:30:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1221, 2, '13:30:00', '13:35:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1222, 2, '13:35:00', '13:40:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1223, 2, '13:40:00', '13:45:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1224, 2, '13:45:00', '13:50:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1225, 2, '13:50:00', '13:55:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1226, 2, '13:55:00', '14:00:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1227, 3, '12:00:00', '12:05:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1228, 3, '12:05:00', '12:10:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1229, 3, '12:10:00', '12:15:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1230, 3, '12:15:00', '12:20:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1231, 3, '12:20:00', '12:25:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1232, 3, '12:25:00', '12:30:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1233, 3, '12:30:00', '12:35:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1234, 3, '12:35:00', '12:40:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1235, 3, '12:40:00', '12:45:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1236, 3, '12:45:00', '12:50:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1237, 3, '12:50:00', '12:55:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1238, 3, '12:55:00', '13:00:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1239, 3, '13:00:00', '13:05:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1240, 3, '13:05:00', '13:10:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1241, 3, '13:10:00', '13:15:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1242, 3, '13:15:00', '13:20:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1243, 3, '13:20:00', '13:25:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1244, 3, '13:25:00', '13:30:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1245, 3, '13:30:00', '13:35:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1246, 3, '13:35:00', '13:40:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1247, 3, '13:40:00', '13:45:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1248, 3, '13:45:00', '13:50:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1249, 3, '13:50:00', '13:55:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL),
(1250, 3, '13:55:00', '14:00:00', NULL, 'available', NULL, '2025-06-21 17:44:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `speeddates_audit_log`
--

CREATE TABLE `speeddates_audit_log` (
  `id` int(11) NOT NULL,
  `actie` varchar(50) NOT NULL COMMENT 'Type actie (STUDENT_DELETED, CONFIG_CHANGED, etc.)',
  `student_id` int(11) DEFAULT NULL COMMENT 'ID van de student (indien van toepassing)',
  `aantal_speeddates_vrijgegeven` int(11) DEFAULT NULL COMMENT 'Aantal speeddates dat is vrijgegeven',
  `uitgevoerd_op` timestamp NOT NULL DEFAULT current_timestamp(),
  `extra_info` text DEFAULT NULL COMMENT 'Extra informatie over de actie'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `speeddates_config`
--

CREATE TABLE `speeddates_config` (
  `id` int(11) NOT NULL,
  `start_uur` time NOT NULL COMMENT 'Startuur voor speeddates (bijv. 09:00)',
  `eind_uur` time NOT NULL COMMENT 'Einduur voor speeddates (bijv. 17:00)',
  `sessie_duur_minuten` int(11) NOT NULL DEFAULT 5 COMMENT 'Duur van elke speeddate sessie in minuten',
  `actief` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Of deze configuratie actief is',
  `aangemaakt_op` timestamp NOT NULL DEFAULT current_timestamp(),
  `aangepast_op` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `speeddates_config`
--

INSERT INTO `speeddates_config` (`id`, `start_uur`, `eind_uur`, `sessie_duur_minuten`, `actief`, `aangemaakt_op`, `aangepast_op`) VALUES
(1, '12:00:00', '14:00:00', 5, 1, '2025-06-21 13:03:18', '2025-06-21 18:16:08');

--
-- Triggers `speeddates_config`
--
DELIMITER $$
CREATE TRIGGER `tr_speeddates_config_update` AFTER UPDATE ON `speeddates_config` FOR EACH ROW BEGIN
    -- Alleen uitvoeren als de tijden of sessie duur zijn gewijzigd
    IF OLD.start_uur != NEW.start_uur OR OLD.eind_uur != NEW.eind_uur OR OLD.sessie_duur_minuten != NEW.sessie_duur_minuten THEN
        -- Roep de synchronisatie procedure aan
        CALL SynchroniseerSpeeddatesMetConfig();
    END IF;
END
$$
DELIMITER ;

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
(2, 2, 'Hogeschool Gent', 'Toegepaste Informatica', 'tweede', 'Grote interesse in AI en data.', 'https://linkedin.com/in/thomas', 0, 1, 1, 1, 1, 0, 1, 0),
(4, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 11, 'ErasmusHogeschool', 'TI', '', 'Ik ben Bilal', 'https://www.linkedin.com/in/bilal-belkasem-0ba8552b6/', 1, 0, 0, 0, 0, 0, 1, 0),
(7, 13, 'Erasmus Hogeschool Brussel', 'toegepaste informatica', 'eerste', ':sfhlghse', NULL, 0, 0, 0, 1, 0, 1, 0, 0),
(8, 14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Triggers `students_details`
--
DELIMITER $$
CREATE TRIGGER `tr_student_deleted_speeddates_free` AFTER DELETE ON `students_details` FOR EACH ROW BEGIN
    -- Maak alle speeddates van de verwijderde student weer beschikbaar
    UPDATE speeddates 
    SET student_id = NULL,
        bezet = 0,
        gereserveerd_op = NULL
    WHERE student_id = OLD.id;
    
    -- Log de actie (optioneel - voor audit trail)
    INSERT INTO speeddates_audit_log (actie, student_id, aantal_speeddates_vrijgegeven, uitgevoerd_op)
    VALUES ('STUDENT_DELETED', OLD.id, ROW_COUNT(), NOW());
END
$$
DELIMITER ;

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
(5, 'Admin Beheer', 'admin@careerlaunch.be', '$2b$10$yd6ZQbXM3QBC.uNfz2apBulLeqIiEb78ss.C7wIbxTzC4xLa5pd2S', 'admin', NULL, 'admin-launch', '2025-06-05 09:01:00'),
(8, 'Digay kengoum', 'Digay.kengoum@student.ehb.be', '$2b$10$OSWeRWMn6mJSlZP//.BdOOXGBdP5h.tUxHQ9W7bUzw86JXpx5jVHG', 'student', 'Hogeschool Gent', 'digay-kengoum', '2025-06-13 13:22:59'),
(10, 'âzerty', 'azerty@azerty', '$2b$10$INqhpWp9K8hGxIDmzeH5tOXWrGavD85GVPKwLnFRamoA7Oy1sT9ra', 'bedrijf', NULL, 'âzerty', '2025-06-16 07:52:30'),
(11, 'Bilal Belkasem', 'bilal.belkasem@student.ehb.be', '$2b$10$1Vt9y9nSEVWMOe98nDCoxOCc3/EQx/JHIY3HRmj9MGDEq05H4Zod6', 'student', 'Hogeschool Gent', 'bilal-belkasem', '2025-06-17 07:49:01'),
(12, 'qwerty', 'qwerty@qwerty', '$2b$10$9dPSkl6VbWAdFgSWJ0eXHeaYs.HXMhRFhNhuIcugyFHW7caemhgGK', 'bedrijf', NULL, 'qwerty', '2025-06-17 08:22:02'),
(13, 'jelle schroeven2', 'jelle.schroeven@student.ehb.be', '$2b$10$akFfsQZpQNEk2aO88uSIf.y7UPqGn6Ys7u7/fLnxGoxG0Q6wS3Lxq', 'student', NULL, 'jelle-schroeven2', '2025-06-18 08:05:22'),
(14, 'hildegard laporte', 'mama@mail', '$2b$10$lE84PYbSppX6px69dfQ/zuJK.wv.CMzmsVbTUytl0S9XX2bsdiIIK', 'student', 'Hogeschool Gent', 'hildegard-laporte', '2025-06-21 18:37:38');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `tr_company_user_deleted_speeddates_cleanup` AFTER DELETE ON `users` FOR EACH ROW BEGIN
    DECLARE company_details_id INT;
    DECLARE aantal_speeddates INT DEFAULT 0;
    DECLARE aantal_gereserveerde_speeddates INT DEFAULT 0;
    
    -- Als een user wordt verwijderd, controleer of het een bedrijf was
    IF OLD.role = 'bedrijf' THEN
        -- Zoek de bijbehorende company_details record
        SELECT id INTO company_details_id 
        FROM companies_details 
        WHERE user_id = OLD.id;
        
        -- Als er een company_details record bestaat, verwijder speeddates
        IF company_details_id IS NOT NULL THEN
            -- Tel totaal aantal speeddates
            SELECT COUNT(*) INTO aantal_speeddates
            FROM speeddates 
            WHERE company_id = company_details_id;
            
            -- Tel aantal gereserveerde speeddates
            SELECT COUNT(*) INTO aantal_gereserveerde_speeddates
            FROM speeddates 
            WHERE company_id = company_details_id AND bezet = 1;
            
            -- Verwijder alle speeddates van dit bedrijf
            DELETE FROM speeddates WHERE company_id = company_details_id;
            
            -- Log de actie in audit log
            INSERT INTO speeddates_audit_log (actie, student_id, aantal_speeddates_vrijgegeven, uitgevoerd_op, extra_info)
            VALUES (
                'COMPANY_USER_DELETED', 
                NULL, 
                aantal_speeddates, 
                NOW(), 
                CONCAT('Bedrijf User ID: ', OLD.id, ', Company Details ID: ', company_details_id, ', Gereserveerde speeddates: ', aantal_gereserveerde_speeddates)
            );
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_user_deleted_speeddates_free` AFTER DELETE ON `users` FOR EACH ROW BEGIN
    DECLARE student_details_id INT;
    
    -- Als een user wordt verwijderd, controleer of het een student was
    IF OLD.role = 'student' THEN
        -- Zoek de bijbehorende student_details record
        SELECT id INTO student_details_id 
        FROM students_details 
        WHERE user_id = OLD.id;
        
        -- Als er een student_details record bestaat, maak speeddates vrij
        IF student_details_id IS NOT NULL THEN
            UPDATE speeddates 
            SET student_id = NULL,
                bezet = 0,
                gereserveerd_op = NULL
            WHERE student_id = student_details_id;
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_beschikbare_speeddates`
-- (See below for the actual view)
--
CREATE TABLE `v_beschikbare_speeddates` (
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_speeddates_kalender`
-- (See below for the actual view)
--
CREATE TABLE `v_speeddates_kalender` (
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_speeddates_stats_per_bedrijf`
-- (See below for the actual view)
--
CREATE TABLE `v_speeddates_stats_per_bedrijf` (
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_student_reservaties`
-- (See below for the actual view)
--
CREATE TABLE `v_student_reservaties` (
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_student_speeddates`
-- (See below for the actual view)
--
CREATE TABLE `v_student_speeddates` (
);

-- --------------------------------------------------------

--
-- Structure for view `v_beschikbare_speeddates`
--
DROP TABLE IF EXISTS `v_beschikbare_speeddates`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_beschikbare_speeddates`  AS SELECT `s`.`date_id` AS `date_id`, `s`.`company_id` AS `company_id`, `cd`.`company_name` AS `company_name`, `s`.`begin_tijd` AS `begin_tijd`, `s`.`eind_tijd` AS `eind_tijd`, `s`.`bezet` AS `bezet` FROM (`speeddates` `s` join `companies_details` `cd` on(`s`.`company_id` = `cd`.`id`)) WHERE `s`.`bezet` = 0 ORDER BY `cd`.`company_name` ASC, `s`.`begin_tijd` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_speeddates_kalender`
--
DROP TABLE IF EXISTS `v_speeddates_kalender`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_speeddates_kalender`  AS SELECT `s`.`date_id` AS `date_id`, `cd`.`company_name` AS `company_name`, `s`.`begin_tijd` AS `begin_tijd`, `s`.`eind_tijd` AS `eind_tijd`, CASE WHEN `s`.`bezet` = 0 THEN 'Beschikbaar' WHEN `s`.`bezet` = 1 THEN concat('Gereserveerd door: ',`u`.`name`) END AS `status`, `s`.`gereserveerd_op` AS `gereserveerd_op` FROM (((`speeddates` `s` join `companies_details` `cd` on(`s`.`company_id` = `cd`.`id`)) left join `students_details` `sd` on(`s`.`student_id` = `sd`.`id`)) left join `users` `u` on(`sd`.`user_id` = `u`.`id`)) ORDER BY `s`.`begin_tijd` ASC, `cd`.`company_name` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_speeddates_stats_per_bedrijf`
--
DROP TABLE IF EXISTS `v_speeddates_stats_per_bedrijf`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_speeddates_stats_per_bedrijf`  AS SELECT `cd`.`id` AS `company_id`, `cd`.`company_name` AS `company_name`, count(`s`.`date_id`) AS `totaal_slots`, sum(case when `s`.`bezet` = 0 then 1 else 0 end) AS `beschikbare_slots`, sum(case when `s`.`bezet` = 1 then 1 else 0 end) AS `gereserveerde_slots`, round(sum(case when `s`.`bezet` = 1 then 1 else 0 end) / count(`s`.`date_id`) * 100,2) AS `bezettingsgraad_percentage` FROM (`companies_details` `cd` left join `speeddates` `s` on(`cd`.`id` = `s`.`company_id`)) GROUP BY `cd`.`id`, `cd`.`company_name` ;

-- --------------------------------------------------------

--
-- Structure for view `v_student_reservaties`
--
DROP TABLE IF EXISTS `v_student_reservaties`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_student_reservaties`  AS SELECT `s`.`date_id` AS `date_id`, `s`.`company_id` AS `company_id`, `cd`.`company_name` AS `company_name`, `s`.`begin_tijd` AS `begin_tijd`, `s`.`eind_tijd` AS `eind_tijd`, `s`.`student_id` AS `student_id`, `sd`.`user_id` AS `student_user_id`, `u`.`name` AS `student_name`, `s`.`gereserveerd_op` AS `gereserveerd_op` FROM (((`speeddates` `s` join `companies_details` `cd` on(`s`.`company_id` = `cd`.`id`)) join `students_details` `sd` on(`s`.`student_id` = `sd`.`id`)) join `users` `u` on(`sd`.`user_id` = `u`.`id`)) WHERE `s`.`bezet` = 1 ORDER BY `s`.`begin_tijd` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_student_speeddates`
--
DROP TABLE IF EXISTS `v_student_speeddates`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_student_speeddates`  AS SELECT `s`.`date_id` AS `date_id`, `cd`.`company_name` AS `company_name`, `s`.`begin_tijd` AS `begin_tijd`, `s`.`eind_tijd` AS `eind_tijd`, `s`.`gereserveerd_op` AS `gereserveerd_op`, `u`.`name` AS `student_naam`, `u`.`email` AS `student_email` FROM (((`speeddates` `s` join `companies_details` `cd` on(`s`.`company_id` = `cd`.`id`)) join `students_details` `sd` on(`s`.`student_id` = `sd`.`id`)) join `users` `u` on(`sd`.`user_id` = `u`.`id`)) WHERE `s`.`bezet` = 1 ORDER BY `s`.`begin_tijd` ASC ;

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
  ADD UNIQUE KEY `unique_like` (`student_id`,`company_id`,`bedrijf_liked_student`),
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
-- Indexes for table `speeddates`
--
ALTER TABLE `speeddates`
  ADD PRIMARY KEY (`date_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `begin_tijd` (`begin_tijd`);

--
-- Indexes for table `speeddates_audit_log`
--
ALTER TABLE `speeddates_audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actie` (`actie`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `uitgevoerd_op` (`uitgevoerd_op`);

--
-- Indexes for table `speeddates_config`
--
ALTER TABLE `speeddates_config`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `speeddates`
--
ALTER TABLE `speeddates`
  MODIFY `date_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1251;

--
-- AUTO_INCREMENT for table `speeddates_audit_log`
--
ALTER TABLE `speeddates_audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `speeddates_config`
--
ALTER TABLE `speeddates_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stands`
--
ALTER TABLE `stands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `students_details`
--
ALTER TABLE `students_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies_details` (`id`),
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `speeddates`
--
ALTER TABLE `speeddates`
  ADD CONSTRAINT `fk_speeddates_company` FOREIGN KEY (`company_id`) REFERENCES `companies_details` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_speeddates_student` FOREIGN KEY (`student_id`) REFERENCES `students_details` (`id`) ON DELETE SET NULL;

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
