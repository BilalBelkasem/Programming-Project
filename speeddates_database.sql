-- Speeddates Database Setup
-- Career Launch 2026 - Speeddates Module
-- This file contains ALL speeddate functionality

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `speeddates`
--

CREATE TABLE `speeddates` (
  `date_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL COMMENT 'ID van companies_details tabel',
  `begin_tijd` time NOT NULL COMMENT 'Starttijd van de speeddate',
  `eind_tijd` time NOT NULL COMMENT 'Eindtijd van de speeddate',
  `student_id` int(11) DEFAULT NULL COMMENT 'ID van students_details tabel (NULL als niet gereserveerd)',
  `status` enum('available','booked','cancelled_by_admin') NOT NULL DEFAULT 'available' COMMENT 'Status van het tijdslot',
  `cancellation_reason` varchar(255) DEFAULT NULL COMMENT 'Reden van annulering door admin',
  `aangemaakt_op` timestamp NOT NULL DEFAULT current_timestamp(),
  `gereserveerd_op` timestamp NULL DEFAULT NULL COMMENT 'Wanneer de speeddate gereserveerd werd',
  PRIMARY KEY (`date_id`),
  KEY `company_id` (`company_id`),
  KEY `student_id` (`student_id`),
  KEY `status` (`status`),
  KEY `begin_tijd` (`begin_tijd`),
  CONSTRAINT `fk_speeddates_company` FOREIGN KEY (`company_id`) REFERENCES `companies_details` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_speeddates_student` FOREIGN KEY (`student_id`) REFERENCES `students_details` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `speeddates` (only reserved/cancelled appointments)
--

INSERT INTO `speeddates` (`date_id`, `company_id`, `begin_tijd`, `eind_tijd`, `student_id`, `status`, `cancellation_reason`, `aangemaakt_op`, `gereserveerd_op`) VALUES
(449, 2, '14:20:00', '14:25:00', 7, 'cancelled_by_admin', 'De beschikbare tijden voor speeddates zijn gewijzigd door de organisatie.', '2025-06-21 13:03:20', '2025-06-21 16:41:29'),
(755, 1, '13:00:00', '13:05:00', 7, 'booked', NULL, '2025-06-21 16:59:21', '2025-06-21 17:12:17');

-- --------------------------------------------------------

--
-- Table structure for table `speeddates_audit_log`
--

CREATE TABLE `speeddates_audit_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `actie` varchar(50) NOT NULL COMMENT 'Type actie (STUDENT_DELETED, CONFIG_CHANGED, etc.)',
  `student_id` int(11) DEFAULT NULL COMMENT 'ID van de student (indien van toepassing)',
  `aantal_speeddates_vrijgegeven` int(11) DEFAULT NULL COMMENT 'Aantal speeddates dat is vrijgegeven',
  `uitgevoerd_op` timestamp NOT NULL DEFAULT current_timestamp(),
  `extra_info` text DEFAULT NULL COMMENT 'Extra informatie over de actie',
  PRIMARY KEY (`id`),
  KEY `actie` (`actie`),
  KEY `student_id` (`student_id`),
  KEY `uitgevoerd_op` (`uitgevoerd_op`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `speeddates_config`
--

CREATE TABLE `speeddates_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_uur` time NOT NULL COMMENT 'Startuur voor speeddates (bijv. 09:00)',
  `eind_uur` time NOT NULL COMMENT 'Einduur voor speeddates (bijv. 17:00)',
  `sessie_duur_minuten` int(11) NOT NULL DEFAULT 5 COMMENT 'Duur van elke speeddate sessie in minuten',
  `actief` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Of deze configuratie actief is',
  `aangemaakt_op` timestamp NOT NULL DEFAULT current_timestamp(),
  `aangepast_op` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `speeddates_config`
--

INSERT INTO `speeddates_config` (`id`, `start_uur`, `eind_uur`, `sessie_duur_minuten`, `actief`, `aangemaakt_op`, `aangepast_op`) VALUES
(1, '12:00:00', '14:00:00', 5, 1, NOW(), NOW());

-- --------------------------------------------------------

--
-- Structure for view `v_beschikbare_speeddates`
--
DROP TABLE IF EXISTS `v_beschikbare_speeddates`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_beschikbare_speeddates`  AS SELECT `s`.`date_id` AS `date_id`, `s`.`company_id` AS `company_id`, `cd`.`company_name` AS `company_name`, `s`.`begin_tijd` AS `begin_tijd`, `s`.`eind_tijd` AS `eind_tijd`, `s`.`status` AS `status` FROM (`speeddates` `s` join `companies_details` `cd` on(`s`.`company_id` = `cd`.`id`)) WHERE `s`.`status` = 'available' ORDER BY `cd`.`company_name` ASC, `s`.`begin_tijd` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_speeddates_kalender`
--
DROP TABLE IF EXISTS `v_speeddates_kalender`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_speeddates_kalender`  AS SELECT `s`.`date_id` AS `date_id`, `cd`.`company_name` AS `company_name`, `s`.`begin_tijd` AS `begin_tijd`, `s`.`eind_tijd` AS `eind_tijd`, CASE WHEN `s`.`status` = 'available' THEN 'Beschikbaar' WHEN `s`.`status` = 'booked' THEN concat('Gereserveerd door: ',`u`.`name`) WHEN `s`.`status` = 'cancelled_by_admin' THEN 'Geannuleerd door admin' END AS `status`, `s`.`gereserveerd_op` AS `gereserveerd_op` FROM (((`speeddates` `s` join `companies_details` `cd` on(`s`.`company_id` = `cd`.`id`)) left join `students_details` `sd` on(`s`.`student_id` = `sd`.`id`)) left join `users` `u` on(`sd`.`user_id` = `u`.`id`)) ORDER BY `s`.`begin_tijd` ASC, `cd`.`company_name` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_speeddates_stats_per_bedrijf`
--
DROP TABLE IF EXISTS `v_speeddates_stats_per_bedrijf`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_speeddates_stats_per_bedrijf`  AS SELECT `cd`.`id` AS `company_id`, `cd`.`company_name` AS `company_name`, count(`s`.`date_id`) AS `totaal_slots`, sum(case when `s`.`status` = 'available' then 1 else 0 end) AS `beschikbare_slots`, sum(case when `s`.`status` = 'booked' then 1 else 0 end) AS `gereserveerde_slots`, round(sum(case when `s`.`status` = 'booked' then 1 else 0 end) / count(`s`.`date_id`) * 100,2) AS `bezettingsgraad_percentage` FROM (`companies_details` `cd` left join `speeddates` `s` on(`cd`.`id` = `s`.`company_id`)) GROUP BY `cd`.`id`, `cd`.`company_name` ;

-- --------------------------------------------------------

--
-- Structure for view `v_student_reservaties`
--
DROP TABLE IF EXISTS `v_student_reservaties`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_student_reservaties`  AS SELECT `s`.`date_id` AS `date_id`, `s`.`company_id` AS `company_id`, `cd`.`company_name` AS `company_name`, `s`.`begin_tijd` AS `begin_tijd`, `s`.`eind_tijd` AS `eind_tijd`, `s`.`student_id` AS `student_id`, `sd`.`user_id` AS `student_user_id`, `u`.`name` AS `student_name`, `s`.`gereserveerd_op` AS `gereserveerd_op` FROM (((`speeddates` `s` join `companies_details` `cd` on(`s`.`company_id` = `cd`.`id`)) join `students_details` `sd` on(`s`.`student_id` = `sd`.`id`)) join `users` `u` on(`sd`.`user_id` = `u`.`id`)) WHERE `s`.`status` = 'booked' ORDER BY `s`.`begin_tijd` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_student_speeddates`
--
DROP TABLE IF EXISTS `v_student_speeddates`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_student_speeddates`  AS SELECT `s`.`date_id` AS `date_id`, `cd`.`company_name` AS `company_name`, `s`.`begin_tijd` AS `begin_tijd`, `s`.`eind_tijd` AS `eind_tijd`, `s`.`gereserveerd_op` AS `gereserveerd_op`, `u`.`name` AS `student_naam`, `u`.`email` AS `student_email` FROM (((`speeddates` `s` join `companies_details` `cd` on(`s`.`company_id` = `cd`.`id`)) join `students_details` `sd` on(`s`.`student_id` = `sd`.`id`)) join `users` `u` on(`sd`.`user_id` = `u`.`id`)) WHERE `s`.`status` = 'booked' ORDER BY `s`.`begin_tijd` ASC ;

-- --------------------------------------------------------

--
-- Procedures for Speeddate Management
--

DELIMITER $$

-- Procedure: AnnuleerSpeeddate
-- Annuleert een gereserveerde speeddate
CREATE DEFINER=`root`@`localhost` PROCEDURE `AnnuleerSpeeddate` (IN `speeddate_id_param` INT)   
BEGIN
    DECLARE is_reserved BOOLEAN DEFAULT FALSE;
    
    -- Controleer of de speeddate gereserveerd is
    SELECT status = 'booked' INTO is_reserved
    FROM speeddates 
    WHERE date_id = speeddate_id_param;
    
    IF is_reserved THEN
        -- Annuleer de reservering
        UPDATE speeddates 
        SET student_id = NULL, 
            status = 'available', 
            gereserveerd_op = NULL
        WHERE date_id = speeddate_id_param;
        
        SELECT 'SUCCESS' as status, 'Speeddate reservering geannuleerd' as message;
    ELSE
        SELECT 'ERROR' as status, 'Speeddate is niet gereserveerd' as message;
    END IF;
END$$

-- Procedure: GenereerSpeeddatesVoorAlleBedrijven
-- Genereert speeddates voor alle geregistreerde bedrijven
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenereerSpeeddatesVoorAlleBedrijven` ()   
BEGIN
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
            INSERT INTO speeddates (company_id, begin_tijd, eind_tijd, status)
            VALUES (
                company_id_var,
                current_time_slot,
                ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60)),
                'available'
            );
            
            -- Ga naar volgende tijdsslot
            SET current_time_slot = ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60));
        END WHILE;
        
    END LOOP;
    
    CLOSE company_cursor;
    
    SELECT 'SUCCESS' as status, 'Speeddates succesvol gegenereerd voor alle bedrijven' as message;
END$$

-- Procedure: GenereerSpeeddatesVoorBedrijf
-- Genereert speeddates voor een specifiek bedrijf
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenereerSpeeddatesVoorBedrijf` (IN `company_id_param` INT)   
BEGIN
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
        INSERT INTO speeddates (company_id, begin_tijd, eind_tijd, status)
        VALUES (
            company_id_param,
            current_time_slot,
            ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60)),
            'available'
        );
        
        -- Ga naar volgende tijdsslot
        SET current_time_slot = ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60));
    END WHILE;
END$$

-- Procedure: ReserveerSpeeddate
-- Reserveert een beschikbare speeddate voor een student
CREATE DEFINER=`root`@`localhost` PROCEDURE `ReserveerSpeeddate` (IN `speeddate_id_param` INT, IN `student_id_param` INT)   
BEGIN
    DECLARE is_available BOOLEAN DEFAULT FALSE;
    DECLARE current_company_id INT;
    
    -- Controleer of de speeddate beschikbaar is
    SELECT status = 'available', company_id INTO is_available, current_company_id
    FROM speeddates 
    WHERE date_id = speeddate_id_param;
    
    IF is_available THEN
        -- Reserveer de speeddate
        UPDATE speeddates 
        SET student_id = student_id_param, 
            status = 'booked', 
            gereserveerd_op = NOW()
        WHERE date_id = speeddate_id_param;
        
        SELECT 'SUCCESS' as status, 'Speeddate succesvol gereserveerd' as message;
    ELSE
        SELECT 'ERROR' as status, 'Speeddate is niet beschikbaar' as message;
    END IF;
END$$

-- Procedure: ResetAlleSpeeddates
-- Reset alle speeddates naar beschikbaar
CREATE DEFINER=`root`@`localhost` PROCEDURE `ResetAlleSpeeddates` ()   
BEGIN
    UPDATE speeddates 
    SET student_id = NULL,
        status = 'available',
        gereserveerd_op = NULL;
    
    SELECT 'SUCCESS' as status, 'Alle speeddates zijn gereset naar beschikbaar' as message;
END$$

-- Procedure: SynchroniseerSpeeddatesMetConfig
-- Synchroniseert speeddates met de huidige configuratie
CREATE DEFINER=`root`@`localhost` PROCEDURE `SynchroniseerSpeeddatesMetConfig` ()   
BEGIN
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

-- Procedure: ToonSpeeddatesOverzicht
-- Toont een overzicht van alle speeddates per bedrijf
CREATE DEFINER=`root`@`localhost` PROCEDURE `ToonSpeeddatesOverzicht` ()   
BEGIN
    SELECT 
        cd.company_name,
        COUNT(s.date_id) as totaal_slots,
        SUM(CASE WHEN s.status = 'available' THEN 1 ELSE 0 END) as beschikbaar,
        SUM(CASE WHEN s.status = 'booked' THEN 1 ELSE 0 END) as gereserveerd,
        ROUND((SUM(CASE WHEN s.status = 'booked' THEN 1 ELSE 0 END) / COUNT(s.date_id)) * 100, 2) as bezettingsgraad_percentage
    FROM companies_details cd
    LEFT JOIN speeddates s ON cd.id = s.company_id
    GROUP BY cd.id, cd.company_name
    ORDER BY cd.company_name;
END$$

-- Procedure: UpdateSpeeddatesConfiguratie
-- Update de speeddate configuratie en synchroniseert automatisch
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateSpeeddatesConfiguratie` (IN `start_uur_param` TIME, IN `eind_uur_param` TIME, IN `sessie_duur_minuten_param` INT)   
BEGIN
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

-- Procedure: VerwijderOudeSpeeddates
-- Verwijdert speeddates van niet-bestaande bedrijven
CREATE DEFINER=`root`@`localhost` PROCEDURE `VerwijderOudeSpeeddates` ()   
BEGIN
    DECLARE aantal_verwijderd INT DEFAULT 0;
    
    DELETE FROM speeddates 
    WHERE company_id NOT IN (SELECT id FROM companies_details);
    
    SET aantal_verwijderd = ROW_COUNT();
    
    SELECT 'SUCCESS' as status, CONCAT(aantal_verwijderd, ' oude speeddates verwijderd') as message;
END$$

-- Procedure: ZoekBeschikbareSpeeddates
-- Zoekt beschikbare speeddates vanaf een bepaald tijdstip
CREATE DEFINER=`root`@`localhost` PROCEDURE `ZoekBeschikbareSpeeddates` (IN `zoek_tijd` TIME)   
BEGIN
    SELECT 
        s.date_id,
        cd.company_name,
        s.begin_tijd,
        s.eind_tijd,
        s.status
    FROM speeddates s
    JOIN companies_details cd ON s.company_id = cd.id
    WHERE s.status = 'available' 
    AND s.begin_tijd >= zoek_tijd
    ORDER BY s.begin_tijd
    LIMIT 20;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Triggers for Speeddate Management
--

DELIMITER $$

-- Trigger: Automatisch speeddates synchroniseren bij configuratie wijziging
CREATE TRIGGER `tr_speeddates_config_update` 
AFTER UPDATE ON `speeddates_config`
FOR EACH ROW
BEGIN
    -- Alleen uitvoeren als de tijden of sessie duur zijn gewijzigd
    IF OLD.start_uur != NEW.start_uur OR OLD.eind_uur != NEW.eind_uur OR OLD.sessie_duur_minuten != NEW.sessie_duur_minuten THEN
        -- Roep de synchronisatie procedure aan
        CALL SynchroniseerSpeeddatesMetConfig();
    END IF;
END$$

-- Trigger: Automatisch speeddates vrijgeven wanneer student wordt verwijderd
CREATE TRIGGER `tr_student_deleted_speeddates_free` 
AFTER DELETE ON `students_details`
FOR EACH ROW
BEGIN
    -- Maak alle speeddates van de verwijderde student weer beschikbaar
    UPDATE speeddates 
    SET student_id = NULL,
        status = 'available',
        cancellation_reason = NULL,
        gereserveerd_op = NULL
    WHERE student_id = OLD.id;
    
    -- Log de actie (optioneel - voor audit trail)
    INSERT INTO speeddates_audit_log (actie, student_id, aantal_speeddates_vrijgegeven, uitgevoerd_op)
    VALUES ('STUDENT_DELETED', OLD.id, ROW_COUNT(), NOW());
END$$

-- Trigger: Automatisch speeddates vrijgeven wanneer user wordt verwijderd
CREATE TRIGGER `tr_user_deleted_speeddates_free` 
AFTER DELETE ON `users`
FOR EACH ROW
BEGIN
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
                status = 'available',
                cancellation_reason = NULL,
                gereserveerd_op = NULL
            WHERE student_id = student_details_id;
        END IF;
    END IF;
END$$

-- Trigger: Automatisch speeddates verwijderen wanneer bedrijf wordt verwijderd
CREATE TRIGGER `tr_company_deleted_speeddates_cleanup` 
AFTER DELETE ON `companies_details`
FOR EACH ROW
BEGIN
    DECLARE aantal_speeddates INT DEFAULT 0;
    DECLARE aantal_gereserveerde_speeddates INT DEFAULT 0;
    
    -- Tel hoeveel speeddates er zijn voor dit bedrijf (voor audit log)
    SELECT COUNT(*) INTO aantal_speeddates
    FROM speeddates 
    WHERE company_id = OLD.id;
    
    -- Tel aantal gereserveerde speeddates
    SELECT COUNT(*) INTO aantal_gereserveerde_speeddates
    FROM speeddates 
    WHERE company_id = OLD.id AND status = 'booked';
    
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
END$$

-- Trigger: Automatisch speeddates verwijderen wanneer bedrijf user wordt verwijderd
CREATE TRIGGER `tr_company_user_deleted_speeddates_cleanup` 
AFTER DELETE ON `users`
FOR EACH ROW
BEGIN
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
            WHERE company_id = company_details_id AND status = 'booked';
            
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
END$$

-- Trigger: Automatisch speeddates genereren wanneer nieuw bedrijf wordt toegevoegd
CREATE TRIGGER `tr_company_added_generate_speeddates` 
AFTER INSERT ON `companies_details`
FOR EACH ROW
BEGIN
    -- Genereer speeddates voor het nieuwe bedrijf
    CALL GenereerSpeeddatesVoorBedrijf(NEW.id);
    
    -- Log de actie in audit log (zonder result set)
    INSERT INTO speeddates_audit_log (actie, student_id, aantal_speeddates_vrijgegeven, uitgevoerd_op, extra_info)
    VALUES (
        'COMPANY_ADDED', 
        NULL, 
        NULL, 
        NOW(), 
        CONCAT('Nieuw bedrijf toegevoegd: ID ', NEW.id, ', Naam: ', NEW.company_name)
    );
END$$

DELIMITER ;

COMMIT; 