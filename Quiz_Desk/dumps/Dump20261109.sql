-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: quizdesk_db
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `answer_id` int NOT NULL AUTO_INCREMENT,
  `attempt_id` int NOT NULL,
  `question_id` int NOT NULL,
  `selected_option_id` int DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  UNIQUE KEY `attempt_id` (`attempt_id`,`question_id`),
  KEY `question_id` (`question_id`,`selected_option_id`),
  CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`attempt_id`),
  CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`),
  CONSTRAINT `answers_ibfk_3` FOREIGN KEY (`question_id`, `selected_option_id`) REFERENCES `options` (`question_id`, `option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,1,1,1),(2,1,2,5),(3,2,3,10),(4,2,4,13),(5,3,1,1),(6,5,1,1),(7,5,2,5),(8,13,4,13),(9,13,3,9),(10,18,3,11),(11,18,4,13),(17,19,3,9),(18,19,4,13);
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attempts`
--

DROP TABLE IF EXISTS `attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attempts` (
  `attempt_id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `user_id` int NOT NULL,
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `status` enum('in_progress','submitted') DEFAULT 'in_progress',
  PRIMARY KEY (`attempt_id`),
  KEY `exam_id` (`exam_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `attempts_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`),
  CONSTRAINT `attempts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attempts`
--

LOCK TABLES `attempts` WRITE;
/*!40000 ALTER TABLE `attempts` DISABLE KEYS */;
INSERT INTO `attempts` VALUES (1,1,2,'2026-11-07 11:29:39','2026-11-07 11:29:39','submitted'),(2,2,3,'2026-11-07 11:29:39','2026-11-07 11:29:39','submitted'),(3,1,4,'2026-11-07 12:44:13','2026-11-07 12:51:22','submitted'),(4,1,4,'2026-11-07 15:07:17',NULL,'in_progress'),(5,1,4,'2026-11-07 15:14:17','2026-11-07 15:14:45','submitted'),(6,1,4,'2026-11-07 15:23:22',NULL,'in_progress'),(7,3,4,'2026-11-08 11:59:18',NULL,'in_progress'),(8,3,4,'2026-11-08 11:59:59',NULL,'in_progress'),(9,3,4,'2026-11-08 12:05:30',NULL,'in_progress'),(10,3,4,'2026-11-08 12:46:47',NULL,'in_progress'),(11,2,4,'2026-11-08 12:50:05','2026-11-08 12:54:27','submitted'),(12,6,4,'2026-11-08 12:54:43','2026-11-08 12:54:50','submitted'),(13,2,4,'2026-11-08 12:55:01','2026-11-08 12:55:21','submitted'),(14,4,4,'2026-11-08 12:58:24',NULL,'in_progress'),(15,3,4,'2026-11-08 12:58:30','2026-11-08 12:58:36','submitted'),(16,6,4,'2026-11-08 12:58:44',NULL,'in_progress'),(17,3,4,'2026-11-08 12:58:50','2026-11-08 12:58:56','submitted'),(18,2,4,'2026-11-08 12:59:02','2026-11-08 12:59:35','submitted'),(19,2,4,'2026-11-09 05:05:47','2026-11-09 05:06:02','submitted');
/*!40000 ALTER TABLE `attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `exam_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text,
  `duration_minutes` int NOT NULL,
  `total_marks` int NOT NULL,
  `passing_marks` int NOT NULL,
  `status` enum('draft','published','closed') DEFAULT 'draft',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`exam_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES (1,'HTML Basics','Basic HTML examination',30,20,8,'draft',1,'2026-11-07 11:27:58'),(2,'CSS Fundamentals','Basic CSS examination',30,20,8,'published',1,'2026-11-07 11:27:58'),(3,'HTML Basics','Basic HTML examination',30,20,8,'published',1,'2026-11-07 11:28:04'),(4,'CSS Fundamentals','Basic CSS examination',30,20,8,'published',1,'2026-11-07 11:28:04'),(5,'JavaScript Basics','Basic JavaScript examination',30,20,8,'draft',1,'2026-11-07 11:45:21'),(6,'Exam','HTML',30,30,12,'published',1,'2026-11-08 11:43:22');
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `option_id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `option_text` varchar(500) NOT NULL,
  `is_correct` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `question_id` (`question_id`,`option_id`),
  CONSTRAINT `options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,1,'Hyper Text Markup Language',1),(2,1,'High Text Machine Language',0),(3,1,'Hyper Tool Multi Language',0),(4,1,'Home Text Markup Language',0),(5,2,'<h1>',1),(6,2,'<h3>',0),(7,2,'<p>',0),(8,2,'<head>',0),(9,3,'color',1),(10,3,'font-size',0),(11,3,'background-color',0),(12,3,'margin',0),(13,4,'background-color',1),(14,4,'text-align',0),(15,4,'border',0),(16,4,'padding',0);
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `question_text` text NOT NULL,
  `marks` int DEFAULT '1',
  `question_order` int DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,1,'What does HTML stand for?',10,1),(2,1,'Which tag is used for the largest heading?',10,2),(3,2,'Which property changes the text color in CSS?',10,1),(4,2,'Which property changes the background color?',10,2);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `attempt_id` int NOT NULL,
  `total_marks` int NOT NULL,
  `obtained_marks` int NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `result_status` enum('pass','fail') DEFAULT NULL,
  `evaluated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  UNIQUE KEY `attempt_id` (`attempt_id`),
  CONSTRAINT `results_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`attempt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (1,1,20,20,100.00,'pass','2026-11-07 11:33:32'),(2,2,20,10,50.00,'pass','2026-11-07 11:33:32'),(3,3,20,10,50.00,'pass','2026-11-07 12:51:22'),(4,5,20,20,100.00,'pass','2026-11-07 15:14:45'),(5,11,20,0,0.00,'fail','2026-11-08 12:54:27'),(6,12,0,0,0.00,'fail','2026-11-08 12:54:50'),(7,13,20,20,100.00,'pass','2026-11-08 12:55:21'),(8,15,0,0,0.00,'fail','2026-11-08 12:58:36'),(9,17,0,0,0.00,'fail','2026-11-08 12:58:56'),(10,18,20,10,50.00,'pass','2026-11-08 12:59:35'),(11,19,20,20,100.00,'pass','2026-11-09 05:06:02');
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','student') DEFAULT 'student',
  `student_code` varchar(30) DEFAULT NULL,
  `course` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `student_code` (`student_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'QuizDesk Admin','admin@quizdesk.com','$2b$10$KM1mWwfv3KM1Mvw8gApIBeQiFXotAsHZYouJwQoaeC1LYXzbKMlJG','admin',NULL,NULL,'active','2026-11-07 11:26:32'),(2,'Rahul Patil','rahul@gmail.com','TEMP_SAMPLE_ONLY','student','STU101','BCA','active','2026-11-07 11:26:32'),(3,'Priya Sharma','priya@gmail.com','TEMP_SAMPLE_ONLY','student','STU102','BSc CS','active','2026-11-07 11:26:32'),(4,'Amit Kumar','amit@gmail.com','$2b$10$wrUSwXjcgAv8zRb2yF5ybeXxkCAZi.z3wUJYTmyAJmCvRCkyV2Hc.','student','STU103','BCA','active','2026-11-07 12:15:36'),(5,'Test Student','teststudent@gmail.com','$2b$10$.ef0zBB1amFPoV/B8FX/FuKKdiakTzIEzyq9emtgtoM75kCMB4rXy','student','STU104','BCA','active','2026-11-07 13:05:31'),(6,'R','r@gmail.com','$2b$10$tr.TqXxB2VjdUBfxIYEUZOZdrwcBqPNmic8Gk3XT5RcfLQLt2gjba','student','1','be','inactive','2026-11-08 13:27:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-09 11:07:08
