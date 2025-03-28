-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: bookstore_db
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbBook`
--

DROP TABLE IF EXISTS `tbBook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbBook` (
  `BookID` int NOT NULL AUTO_INCREMENT,
  `CategoryID` int DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Author` varchar(100) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `StockQuantity` int DEFAULT '0',
  `Image` varchar(255) DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BookID`),
  KEY `CategoryID` (`CategoryID`),
  CONSTRAINT `tbBook_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `tbCategory` (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbBook`
--

LOCK TABLES `tbBook` WRITE;
/*!40000 ALTER TABLE `tbBook` DISABLE KEYS */;
INSERT INTO `tbBook` VALUES (1,1,'Book1','Me',10.00,100,'uploads/products/2025/02/book_67b7e1c153156_1740104129.jpg','2025-02-21 02:15:29');
/*!40000 ALTER TABLE `tbBook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbBookDetail`
--

DROP TABLE IF EXISTS `tbBookDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbBookDetail` (
  `DetailID` int NOT NULL AUTO_INCREMENT,
  `BookID` int DEFAULT NULL,
  `ISBN10` varchar(10) DEFAULT NULL,
  `ISBN13` varchar(17) DEFAULT NULL,
  `Publisher` varchar(255) DEFAULT NULL,
  `PublishYear` int DEFAULT NULL,
  `Edition` varchar(50) DEFAULT NULL,
  `PageCount` int DEFAULT NULL,
  `Language` varchar(50) DEFAULT NULL,
  `Format` enum('Hardcover','Paperback','Ebook','Audiobook') DEFAULT NULL,
  `Dimensions` varchar(100) DEFAULT NULL,
  `Weight` decimal(6,2) DEFAULT NULL,
  `Description` text,
  PRIMARY KEY (`DetailID`),
  UNIQUE KEY `BookID` (`BookID`),
  CONSTRAINT `tbBookDetail_ibfk_1` FOREIGN KEY (`BookID`) REFERENCES `tbBook` (`BookID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbBookDetail`
--

LOCK TABLES `tbBookDetail` WRITE;
/*!40000 ALTER TABLE `tbBookDetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbBookDetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbCart`
--

DROP TABLE IF EXISTS `tbCart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbCart` (
  `CartID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `BookID` int DEFAULT NULL,
  `Quantity` int NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CartID`),
  KEY `UserID` (`UserID`),
  KEY `BookID` (`BookID`),
  CONSTRAINT `tbCart_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `tbUser` (`UserID`),
  CONSTRAINT `tbCart_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `tbBook` (`BookID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbCart`
--

LOCK TABLES `tbCart` WRITE;
/*!40000 ALTER TABLE `tbCart` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbCart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbCategory`
--

DROP TABLE IF EXISTS `tbCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbCategory` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Description` text,
  `Image` varchar(255) DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbCategory`
--

LOCK TABLES `tbCategory` WRITE;
/*!40000 ALTER TABLE `tbCategory` DISABLE KEYS */;
INSERT INTO `tbCategory` VALUES (1,'Romance','ABC',NULL,'2025-02-21 02:05:24');
/*!40000 ALTER TABLE `tbCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbOrder`
--

DROP TABLE IF EXISTS `tbOrder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbOrder` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `OrderDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TotalAmount` decimal(10,2) NOT NULL,
  `Status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `ShippingAddress` text,
  `PaymentMethod` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `tbOrder_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `tbUser` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbOrder`
--

LOCK TABLES `tbOrder` WRITE;
/*!40000 ALTER TABLE `tbOrder` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbOrder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbOrderDetail`
--

DROP TABLE IF EXISTS `tbOrderDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbOrderDetail` (
  `OrderDetailID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `BookID` int DEFAULT NULL,
  `Quantity` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`OrderDetailID`),
  KEY `OrderID` (`OrderID`),
  KEY `BookID` (`BookID`),
  CONSTRAINT `tbOrderDetail_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `tbOrder` (`OrderID`),
  CONSTRAINT `tbOrderDetail_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `tbBook` (`BookID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbOrderDetail`
--

LOCK TABLES `tbOrderDetail` WRITE;
/*!40000 ALTER TABLE `tbOrderDetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbOrderDetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbPurchase`
--

DROP TABLE IF EXISTS `tbPurchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbPurchase` (
  `PurchaseID` int NOT NULL,
  `BookID` int NOT NULL,
  `Quantity` int NOT NULL,
  `UnitPrice` decimal(10,2) NOT NULL,
  `PaymentMethod` varchar(50) NOT NULL,
  `OrderDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PurchaseID`),
  KEY `BookID` (`BookID`),
  CONSTRAINT `tbPurchase_ibfk_1` FOREIGN KEY (`BookID`) REFERENCES `tbBook` (`BookID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbPurchase`
--

LOCK TABLES `tbPurchase` WRITE;
/*!40000 ALTER TABLE `tbPurchase` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbPurchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbReview`
--

DROP TABLE IF EXISTS `tbReview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbReview` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `BookID` int DEFAULT NULL,
  `Rating` int NOT NULL,
  `Comment` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ReviewID`),
  KEY `UserID` (`UserID`),
  KEY `BookID` (`BookID`),
  CONSTRAINT `tbReview_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `tbUser` (`UserID`),
  CONSTRAINT `tbReview_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `tbBook` (`BookID`),
  CONSTRAINT `tbReview_chk_1` CHECK (((`Rating` >= 1) and (`Rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbReview`
--

LOCK TABLES `tbReview` WRITE;
/*!40000 ALTER TABLE `tbReview` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbReview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbUser`
--

DROP TABLE IF EXISTS `tbUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbUser` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  `Address` text,
  `Role` enum('admin','user') DEFAULT 'user',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbUser`
--

LOCK TABLES `tbUser` WRITE;
/*!40000 ALTER TABLE `tbUser` DISABLE KEYS */;
INSERT INTO `tbUser` VALUES (6,'Admin','User','admin@admin.com','$2y$10$XiQ5PlWiAmMo6MTEuxz/Ze4VGI3pv4OC9dQ5t0tbIxsO5g8oN7IDm',NULL,NULL,'admin','2025-02-20 12:32:42');
/*!40000 ALTER TABLE `tbUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbWishlist`
--

DROP TABLE IF EXISTS `tbWishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbWishlist` (
  `WishlistID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `BookID` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`WishlistID`),
  KEY `UserID` (`UserID`),
  KEY `BookID` (`BookID`),
  CONSTRAINT `tbWishlist_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `tbUser` (`UserID`),
  CONSTRAINT `tbWishlist_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `tbBook` (`BookID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbWishlist`
--

LOCK TABLES `tbWishlist` WRITE;
/*!40000 ALTER TABLE `tbWishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbWishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-28  5:44:39
