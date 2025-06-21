-- Speeddates Database Setup
-- Career Launch 2026 - Speeddates Module

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `speeddates_config`
-- Deze tabel wordt gebruikt door de admin om de speeddates tijden in te stellen
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
-- Standaard configuratie: 9:00 tot 17:00, 5 minuten per sessie
--

INSERT INTO `speeddates_config` (`id`, `start_uur`, `eind_uur`, `sessie_duur_minuten`, `actief`, `aangemaakt_op`, `aangepast_op`) VALUES
(1, '09:00:00', '17:00:00', 5, 1, NOW(), NOW());

-- --------------------------------------------------------

--
-- Table structure for table `speeddates`
-- Deze tabel bevat alle speeddate slots
--

CREATE TABLE `speeddates` (
  `date_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL COMMENT 'ID van companies_details tabel',
  `begin_tijd` time NOT NULL COMMENT 'Starttijd van de speeddate',
  `eind_tijd` time NOT NULL COMMENT 'Eindtijd van de speeddate',
  `student_id` int(11) DEFAULT NULL COMMENT 'ID van students_details tabel (NULL als niet gereserveerd)',
  `bezet` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Of de speeddate gereserveerd is',
  `aangemaakt_op` timestamp NOT NULL DEFAULT current_timestamp(),
  `gereserveerd_op` timestamp NULL DEFAULT NULL COMMENT 'Wanneer de speeddate gereserveerd werd',
  PRIMARY KEY (`date_id`),
  KEY `company_id` (`company_id`),
  KEY `student_id` (`student_id`),
  KEY `bezet` (`bezet`),
  KEY `begin_tijd` (`begin_tijd`),
  CONSTRAINT `fk_speeddates_company` FOREIGN KEY (`company_id`) REFERENCES `companies_details` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_speeddates_student` FOREIGN KEY (`student_id`) REFERENCES `students_details` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Trigger: Automatisch speeddates synchroniseren bij configuratie wijziging
-- Deze trigger zorgt ervoor dat speeddates automatisch aangepast worden wanneer de configuratie verandert
--

DELIMITER $$
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
DELIMITER ;

-- --------------------------------------------------------

--
-- Trigger: Automatisch speeddates vrijgeven wanneer student wordt verwijderd
-- Deze trigger zorgt ervoor dat speeddates automatisch beschikbaar worden wanneer een student wordt verwijderd
--

DELIMITER $$
CREATE TRIGGER `tr_student_deleted_speeddates_free` 
AFTER DELETE ON `students_details`
FOR EACH ROW
BEGIN
    -- Maak alle speeddates van de verwijderde student weer beschikbaar
    UPDATE speeddates 
    SET student_id = NULL,
        bezet = 0,
        gereserveerd_op = NULL
    WHERE student_id = OLD.id;
    
    -- Log de actie (optioneel - voor audit trail)
    INSERT INTO speeddates_audit_log (actie, student_id, aantal_speeddates_vrijgegeven, uitgevoerd_op)
    VALUES ('STUDENT_DELETED', OLD.id, ROW_COUNT(), NOW());
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Trigger: Automatisch speeddates vrijgeven wanneer user wordt verwijderd
-- Deze trigger zorgt ervoor dat speeddates automatisch beschikbaar worden wanneer een user wordt verwijderd
--

DELIMITER $$
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
                bezet = 0,
                gereserveerd_op = NULL
            WHERE student_id = student_details_id;
        END IF;
    END IF;
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Trigger: Automatisch speeddates verwijderen wanneer bedrijf wordt verwijderd
-- Deze trigger zorgt ervoor dat alle speeddates van een bedrijf worden verwijderd wanneer het bedrijf wordt verwijderd
--

DELIMITER $$
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
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Trigger: Automatisch speeddates verwijderen wanneer bedrijf user wordt verwijderd
-- Deze trigger zorgt ervoor dat speeddates worden verwijderd wanneer een bedrijf user wordt verwijderd
--

DELIMITER $$
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
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `speeddates_audit_log`
-- Deze tabel houdt bij welke acties er zijn uitgevoerd op speeddates (optioneel)
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
-- Stored Procedure: Synchroniseer Speeddates met Configuratie
-- Deze procedure zorgt ervoor dat alle speeddates overeenkomen met de actuele configuratie
-- Verwijdert alleen speeddates die buiten de nieuwe tijdsrange vallen
-- Behoudt bestaande reserveringen binnen de nieuwe tijdsrange
--

DELIMITER $$
CREATE PROCEDURE `SynchroniseerSpeeddatesMetConfig`()
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
    
    -- Verwijder alleen speeddates die buiten de nieuwe tijdsrange vallen
    -- Behoud speeddates die binnen de nieuwe range vallen (inclusief reserveringen)
    DELETE FROM speeddates 
    WHERE begin_tijd < start_time OR eind_tijd > end_time;
    
    -- Loop door alle bedrijven
    OPEN company_cursor;
    
    read_loop: LOOP
        FETCH company_cursor INTO company_id_var;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Controleer of er al speeddates bestaan voor dit bedrijf binnen de nieuwe tijdsrange
        SET current_time_slot = start_time;
        
        WHILE current_time_slot < end_time DO
            -- Controleer of er al een speeddate bestaat voor deze tijd
            IF NOT EXISTS (
                SELECT 1 FROM speeddates 
                WHERE company_id = company_id_var 
                AND begin_tijd = current_time_slot
            ) THEN
                -- Voeg nieuwe speeddate toe als deze nog niet bestaat
                INSERT INTO speeddates (company_id, begin_tijd, eind_tijd, bezet)
                VALUES (
                    company_id_var,
                    current_time_slot,
                    ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60)),
                    0
                );
            END IF;
            
            -- Ga naar volgende tijdsslot
            SET current_time_slot = ADDTIME(current_time_slot, SEC_TO_TIME(session_duration * 60));
        END WHILE;
        
    END LOOP;
    
    CLOSE company_cursor;
    
    SELECT 'SUCCESS' as status, 'Speeddates succesvol gesynchroniseerd met nieuwe configuratie (bestaande reserveringen behouden)' as message;
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stored Procedure: Genereer Speeddates voor alle bedrijven
-- Deze procedure genereert automatisch speeddate slots voor alle bedrijven
-- op basis van de actieve configuratie
--

DELIMITER $$
CREATE PROCEDURE `GenereerSpeeddatesVoorAlleBedrijven`()
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
DELIMITER ;

-- --------------------------------------------------------

--
-- Stored Procedure: Genereer Speeddates voor specifiek bedrijf
-- Deze procedure genereert speeddate slots voor één specifiek bedrijf
--

DELIMITER $$
CREATE PROCEDURE `GenereerSpeeddatesVoorBedrijf`(IN company_id_param INT)
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
DELIMITER ;

-- --------------------------------------------------------

--
-- Stored Procedure: Update Speeddates Configuratie
-- Deze procedure update de configuratie en synchroniseert automatisch alle speeddates
--

DELIMITER $$
CREATE PROCEDURE `UpdateSpeeddatesConfiguratie`(
    IN start_uur_param TIME,
    IN eind_uur_param TIME,
    IN sessie_duur_minuten_param INT
)
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
DELIMITER ;

-- --------------------------------------------------------

--
-- Stored Procedure: Reserveer Speeddate
-- Deze procedure reserveert een speeddate voor een student
--

DELIMITER $$
CREATE PROCEDURE `ReserveerSpeeddate`(
    IN speeddate_id_param INT,
    IN student_id_param INT
)
BEGIN
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
DELIMITER ;

-- --------------------------------------------------------

--
-- Stored Procedure: Annuleer Speeddate
-- Deze procedure annuleert een speeddate reservering
--

DELIMITER $$
CREATE PROCEDURE `AnnuleerSpeeddate`(IN speeddate_id_param INT)
BEGIN
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
DELIMITER ;

-- --------------------------------------------------------

--
-- Views voor gemakkelijke data toegang
--

-- View: Beschikbare Speeddates per bedrijf
CREATE VIEW `v_beschikbare_speeddates` AS
SELECT 
    s.date_id,
    s.company_id,
    cd.company_name,
    s.begin_tijd,
    s.eind_tijd,
    s.bezet
FROM speeddates s
JOIN companies_details cd ON s.company_id = cd.id
WHERE s.bezet = 0
ORDER BY cd.company_name, s.begin_tijd;

-- View: Gereserveerde Speeddates per student
CREATE VIEW `v_student_reservaties` AS
SELECT 
    s.date_id,
    s.company_id,
    cd.company_name,
    s.begin_tijd,
    s.eind_tijd,
    s.student_id,
    sd.user_id as student_user_id,
    u.name as student_name,
    s.gereserveerd_op
FROM speeddates s
JOIN companies_details cd ON s.company_id = cd.id
JOIN students_details sd ON s.student_id = sd.id
JOIN users u ON sd.user_id = u.id
WHERE s.bezet = 1
ORDER BY s.begin_tijd;

-- View: Speeddates statistieken per bedrijf
CREATE VIEW `v_speeddates_stats_per_bedrijf` AS
SELECT 
    cd.id as company_id,
    cd.company_name,
    COUNT(s.date_id) as totaal_slots,
    SUM(CASE WHEN s.bezet = 0 THEN 1 ELSE 0 END) as beschikbare_slots,
    SUM(CASE WHEN s.bezet = 1 THEN 1 ELSE 0 END) as gereserveerde_slots,
    ROUND((SUM(CASE WHEN s.bezet = 1 THEN 1 ELSE 0 END) / COUNT(s.date_id)) * 100, 2) as bezettingsgraad_percentage
FROM companies_details cd
LEFT JOIN speeddates s ON cd.id = s.company_id
GROUP BY cd.id, cd.company_name;

-- --------------------------------------------------------

--
-- Voorbeeld data (optioneel)
-- Voer deze uit om speeddates te genereren voor bestaande bedrijven
--

-- CALL GenereerSpeeddatesVoorAlleBedrijven();

-- --------------------------------------------------------

--
-- Trigger: Automatisch speeddates genereren wanneer nieuw bedrijf wordt toegevoegd
-- Deze trigger zorgt ervoor dat er automatisch speeddates worden gegenereerd voor nieuwe bedrijven
--

DELIMITER $$
CREATE TRIGGER `tr_company_added_generate_speeddates` 
AFTER INSERT ON `companies_details`
FOR EACH ROW
BEGIN
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
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Automatisch speeddates genereren voor bestaande bedrijven
-- Voer dit uit om speeddates te maken voor bedrijven die al in de database staan
--

CALL GenereerSpeeddatesVoorAlleBedrijven();

-- --------------------------------------------------------

--
-- Indexes voor de nieuwe tabellen
--

ALTER TABLE `speeddates_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `speeddates`
  MODIFY `date_id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;

-- --------------------------------------------------------

--
-- Stored Procedure: Toon Speeddates Overzicht
-- Deze procedure geeft een overzicht van alle speeddates per bedrijf
--

DELIMITER $$
CREATE PROCEDURE `ToonSpeeddatesOverzicht`()
BEGIN
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
DELIMITER ;

-- --------------------------------------------------------

--
-- Stored Procedure: Zoek Beschikbare Speeddates
-- Deze procedure zoekt beschikbare speeddates voor een specifieke tijd
--

DELIMITER $$
CREATE PROCEDURE `ZoekBeschikbareSpeeddates`(IN zoek_tijd TIME)
BEGIN
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
-- Stored Procedure: Reset Alle Speeddates
-- Deze procedure maakt alle speeddates weer beschikbaar (handig voor testing)
--

DELIMITER $$
CREATE PROCEDURE `ResetAlleSpeeddates`()
BEGIN
    UPDATE speeddates 
    SET student_id = NULL,
        bezet = 0,
        gereserveerd_op = NULL;
    
    SELECT 'SUCCESS' as status, 'Alle speeddates zijn gereset naar beschikbaar' as message;
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stored Procedure: Verwijder Oude Speeddates
-- Deze procedure verwijdert speeddates van bedrijven die niet meer bestaan
--

DELIMITER $$
CREATE PROCEDURE `VerwijderOudeSpeeddates`()
BEGIN
    DECLARE aantal_verwijderd INT DEFAULT 0;
    
    DELETE FROM speeddates 
    WHERE company_id NOT IN (SELECT id FROM companies_details);
    
    SET aantal_verwijderd = ROW_COUNT();
    
    SELECT 'SUCCESS' as status, CONCAT(aantal_verwijderd, ' oude speeddates verwijderd') as message;
END$$
DELIMITER ;

-- --------------------------------------------------------

--
-- View: Speeddates Kalender Overzicht
-- Deze view toont alle speeddates in chronologische volgorde
--

CREATE VIEW `v_speeddates_kalender` AS
SELECT 
    s.date_id,
    cd.company_name,
    s.begin_tijd,
    s.eind_tijd,
    CASE 
        WHEN s.bezet = 0 THEN 'Beschikbaar'
        WHEN s.bezet = 1 THEN CONCAT('Gereserveerd door: ', u.name)
    END as status,
    s.gereserveerd_op
FROM speeddates s
JOIN companies_details cd ON s.company_id = cd.id
LEFT JOIN students_details sd ON s.student_id = sd.id
LEFT JOIN users u ON sd.user_id = u.id
ORDER BY s.begin_tijd, cd.company_name;

-- --------------------------------------------------------

--
-- View: Student Speeddate Overzicht
-- Deze view toont alle speeddates van een specifieke student
--

CREATE VIEW `v_student_speeddates` AS
SELECT 
    s.date_id,
    cd.company_name,
    s.begin_tijd,
    s.eind_tijd,
    s.gereserveerd_op,
    u.name as student_naam,
    u.email as student_email
FROM speeddates s
JOIN companies_details cd ON s.company_id = cd.id
JOIN students_details sd ON s.student_id = sd.id
JOIN users u ON sd.user_id = u.id
WHERE s.bezet = 1
ORDER BY s.begin_tijd;

-- --------------------------------------------------------

--
-- Automatisch speeddates genereren voor bestaande bedrijven
-- Voer dit uit om speeddates te maken voor bedrijven die al in de database staan
--

CALL GenereerSpeeddatesVoorAlleBedrijven();

-- --------------------------------------------------------

--
-- Indexes voor de nieuwe tabellen
--

ALTER TABLE `speeddates_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `speeddates`
  MODIFY `date_id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT; 