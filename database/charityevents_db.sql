/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80036
Source Host           : localhost:3306
Source Database       : charityevents_db

Target Server Type    : MYSQL
Target Server Version : 80036
File Encoding         : 65001

Date: 2025-09-30 20:27:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `icon_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES ('1', 'Education Support', 'Activities that support education development and learning opportunities', 'https://cdn-icons-png.flaticon.com/512/3133/3133993.png');
INSERT INTO `categories` VALUES ('2', 'Environmental Protection', 'Activities focusing on environmental issues and ecological protection', 'https://cdn-icons-png.flaticon.com/512/1946/1946485.png');
INSERT INTO `categories` VALUES ('3', 'Health & Medical', 'Activities providing medical services and health support', 'https://cdn-icons-png.flaticon.com/512/1488/1488958.png');
INSERT INTO `categories` VALUES ('4', 'Disaster Relief', 'Activities offering aid for natural disasters and humanitarian crises', 'https://cdn-icons-png.flaticon.com/512/3072/3072668.png');
INSERT INTO `categories` VALUES ('5', 'Child Welfare', 'Activities focusing on children’s rights and welfare', 'https://cdn-icons-png.flaticon.com/512/2885/2885000.png');
INSERT INTO `categories` VALUES ('6', 'Community Development', 'Activities that promote community building and development', 'https://cdn-icons-png.flaticon.com/512/3075/3075642.png');

-- ----------------------------
-- Table structure for charities
-- ----------------------------
DROP TABLE IF EXISTS `charities`;
CREATE TABLE `charities` (
  `charity_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `logo_url` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`charity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of charities
-- ----------------------------
INSERT INTO `charities` VALUES ('1', 'Chinese Red Cross Society', 'Committed to humanitarian aid and disaster relief', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Chinese_Red_Cross_Logo.svg', 'https://www.redcross.org.cn', 'redcross315@163.com', '010-84050082', 'No.53 Dongdan North Street, Dongcheng District, Beijing, China', '2025-09-29 23:37:54');
INSERT INTO `charities` VALUES ('2', 'Project Hope (China Youth Development Foundation)', 'Focused on improving educational conditions for children in poor areas', 'https://www.cydf.org.cn/images/logo.png', 'https://www.cydf.org.cn/project_hope', 'info@cydf.org.cn', '010-65680585', 'No.10 Qianmen East Street, Dongcheng District, Beijing, China', '2025-09-29 23:37:54');
INSERT INTO `charities` VALUES ('3', 'Greenpeace', 'Dedicated to environmental protection and sustainable development', 'https://www.greenpeace.org/international/wp-content/uploads/2018/01/greenpeace-logo-1.png', 'https://www.greenpeace.org/china', 'greenpeace.cn@greenpeace.org', '+86-10-65546931', 'Room 201, Building A, Liangdian Creative Park, No.94 Dongsi Shitiao, Dongcheng District, Beijing, China', '2025-09-29 23:37:54');
INSERT INTO `charities` VALUES ('4', 'UNICEF China', 'Protecting children’s rights with health and education support', 'https://www.unicef.org/sites/all/themes/unicef/images/unicef-logo.svg', 'https://www.unicef.cn', 'beijing@unicef.org', '+86-10-85318430', '12 Sanlitun Road, Chaoyang District, Beijing, China', '2025-09-29 23:37:54');

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `address` text,
  `city` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `registration_url` varchar(255) DEFAULT NULL,
  `charity_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `charity_id` (`charity_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`charity_id`) REFERENCES `charities` (`charity_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of events
-- ----------------------------
INSERT INTO `events` VALUES ('1', 'Hope Primary School Fundraising', 'Charity event raising funds to build Hope Primary Schools in poor areas', '2023-10-15', '2023-10-15', '18:00:00', '21:00:00', 'Beijing International Hotel', 'No.1 Jianguomen Outer Street, Chaoyang District, Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d', 'https://www.cydf.org.cn/donate/', '2', '2025-09-29 23:37:55');
INSERT INTO `events` VALUES ('2', 'Tree Planting Campaign', 'Volunteers plant trees around the city to improve the environment', '2023-11-05', '2023-11-05', '09:00:00', '16:00:00', 'Miyun District, Beijing', 'Miyun Water Source Protection Area, Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86', 'https://www.greenpeace.org/china/act/', '3', '2025-09-29 23:37:55');
INSERT INTO `events` VALUES ('3', 'Free Medical Consultation', 'Free health checks and medical consultations for community residents', '2023-10-28', '2023-10-29', '08:30:00', '17:00:00', 'Shanghai General Hospital', 'No.300 Wujin Road, Hongkou District, Shanghai, China', 'Shanghai', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef', 'https://www.redcross.org.cn/html/jz/', '1', '2025-09-29 23:37:55');
INSERT INTO `events` VALUES ('4', 'Psychological Support for Children in Disasters', 'Providing counseling and support for children affected by natural disasters', '2023-11-10', '2023-11-12', '09:00:00', '18:00:00', 'Mianyang, Sichuan', 'Fucheng District, Mianyang, Sichuan, China', 'Mianyang', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644', 'https://www.unicef.cn/donate/', '4', '2025-09-29 23:37:55');
INSERT INTO `events` VALUES ('5', 'Community Library Construction', 'Building community libraries in rural areas to provide reading resources', '2023-12-01', '2023-12-10', '08:00:00', '17:00:00', 'Zhoukou, Henan', 'Chuanhui District, Zhoukou, Henan, China', 'Zhoukou', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6', 'https://www.cydf.org.cn/project_hope/donate/', '2', '2025-09-29 23:37:55');
INSERT INTO `events` VALUES ('6', 'Environmental Lectures Series', 'Public lectures on climate change and sustainable living', '2023-11-15', '2023-11-17', '19:00:00', '21:00:00', 'Guangzhou Library', 'Zhujiang West Road, Zhujiang New Town, Tianhe District, Guangzhou, China', 'Guangzhou', 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f', 'https://www.greenpeace.org/china/support-us/', '3', '2025-09-29 23:37:55');
INSERT INTO `events` VALUES ('7', 'Children Vaccination Day', 'Free vaccination services for children in poor regions', '2023-10-20', '2023-10-20', '08:00:00', '16:00:00', 'Kunming Children’s Hospital', 'Jinjiang Road, Panlong District, Kunming, Yunnan, China', 'Kunming', 'https://images.unsplash.com/photo-1584516150909-cdfd40880934', 'https://www.unicef.cn/donate/', '4', '2025-09-29 23:37:55');
INSERT INTO `events` VALUES ('8', 'Elderly Care Program', 'Providing supplies and mental care for solitary elderly', '2023-12-20', '2023-12-20', '14:00:00', '17:00:00', 'Chaoyang District Nursing Home, Beijing', 'No.89 Jianguo Road, Chaoyang District, Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1570549717483-5ed389df5cd0', 'https://www.redcross.org.cn/html/jz/', '1', '2025-09-29 23:37:55');
INSERT INTO `events` VALUES ('9', 'World Red Cross Day Celebration', 'Annual event promoting humanitarian aid and community health awareness.', '2025-05-08', '2025-05-08', '09:00:00', '17:00:00', 'Beijing Red Cross Center', '北京市东城区东单北大街53号', 'Beijing', 'https://images.unsplash.com/photo-1515169067868-5387ec3568e4', 'https://www.redcross.org.cn/html/jz/', '1', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('10', 'Resilience Forum on Disasters', 'Forum on building community resilience against natural disasters.', '2025-03-07', '2025-03-07', '09:30:00', '13:00:00', 'Beijing Conference Hall', '北京市朝阳区亮马河南路14号', 'Beijing', 'https://images.unsplash.com/photo-1542744173-05336fcc7ad0', 'https://www.redcross.org.cn/html/jz/', '1', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('11', 'Gansu Earthquake Relief', 'Emergency response providing aid to earthquake victims in Gansu.', '2023-12-19', '2023-12-31', '00:00:00', '23:59:00', 'Gansu Province', 'Jishishan County, Gansu Province, China', 'Lanzhou', 'https://images.unsplash.com/photo-1544027995-e27147a8d6b5', 'https://www.redcross.org.cn/html/jz/', '1', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('12', 'Tibet Earthquake Response', 'Support for victims of the Shigatse earthquake with relief supplies.', '2025-01-01', '2025-01-15', '08:00:00', '18:00:00', 'Shigatse Region', 'Shigatse, Tibet, China', 'Shigatse', 'https://images.unsplash.com/photo-1544027995-e27147a8d6b5', 'https://www.redcross.org.cn/html/jz/', '1', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('13', 'Rural Lung Cancer Detection', 'Program to improve early detection of lung cancer in rural areas.', '2023-01-01', '2025-12-31', null, null, 'Rural Communities', '中国农村地区', 'Various', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef', 'https://www.cydf.org.cn/donate/', '2', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('14', 'Post-Earthquake Rehab Training', 'Rehabilitative training for earthquake survivors, focusing on health.', '2023-01-01', '2023-12-31', '09:00:00', '17:00:00', 'Sichuan Province', '四川省成都市', 'Chengdu', 'https://images.unsplash.com/photo-1584516150909-cdfd40880934', 'https://www.cydf.org.cn/donate/', '2', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('15', 'Green Future Photo Exhibition', 'Exhibition showcasing environmental changes and energy transitions.', '2025-09-17', '2025-09-20', '10:00:00', '18:00:00', 'Beijing Art Gallery', 'Dongcheng District, Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f', 'https://www.greenpeace.org/china/support-us/', '3', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('16', 'Steel Decarbonization Workshop', 'Workshop on financing low-carbon transitions in the steel industry.', '2025-09-24', '2025-09-24', '09:00:00', '17:00:00', 'Shanghai Conference Center', 'Jing’an District, Shanghai, China', 'Shanghai', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86', 'https://www.greenpeace.org/china/support-us/', '3', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('17', 'Green Energy Investment Conf', 'Conference on overseas green energy investments and strategies.', '2025-09-30', '2025-09-30', '09:00:00', '17:00:00', 'Guangzhou Expo Hall', 'Tianhe District, Guangzhou, China', 'Guangzhou', 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f', 'https://www.greenpeace.org/china/support-us/', '3', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('18', 'Ocean Protection Campaign', 'Campaign celebrating the BBNJ agreement for global ocean conservation.', '2025-09-22', '2025-09-30', null, null, 'Coastal Cities', 'Coastal areas of Shanghai, China', 'Shanghai', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86', 'https://www.greenpeace.org/china/support-us/', '3', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('19', 'Light Every Moment Campaign', 'Initiative promoting positive parenting and child development.', '2023-01-01', '2025-12-31', null, null, 'Nationwide', 'Across regions in China', 'Various', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644', 'https://www.unicef.cn/donate/', '4', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('20', 'Positive Parenting Promotion', 'Promotion of non-violent parenting techniques in Guangxi.', '2023-06-01', '2023-12-31', '09:00:00', '17:00:00', 'Guangxi Region', 'Nanning, Guangxi, China', 'Nanning', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644', 'https://www.unicef.cn/donate/', '4', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('21', 'World Children\'s Day Event', 'Nationwide event lighting up cities in blue for children\'s rights.', '2023-11-20', '2023-11-20', '18:00:00', '22:00:00', 'Multiple Cities', 'Chaoyang District, Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d', 'https://www.unicef.cn/donate/', '4', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('22', 'Child Care Allowance Advocacy', 'Advocacy for new child care allowances to support families.', '2025-08-08', '2025-12-31', null, null, 'Beijing Policy Center', '12 Sanlitun Road, Chaoyang District, Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1584516150909-cdfd40880934', 'https://www.unicef.cn/donate/', '4', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('23', 'Special Olympics Partnership', 'Collaboration to promote inclusion for children with disabilities.', '2023-09-12', '2025-12-31', null, null, 'East Asia Regions', 'Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1570549717483-5ed389df5cd0', 'https://www.unicef.cn/donate/', '4', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('24', 'British Charity Ball for Kids', 'Themed ball raising funds for underprivileged children\'s education and care.', '2025-04-26', '2025-04-26', '18:00:00', '02:00:00', 'Ritz-Carlton Guangzhou', 'Zhujiang New Town, Tianhe District, Guangzhou, China', 'Guangzhou', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d', 'https://www.unicef.cn/donate/', '4', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('25', 'Safe Schools Program Pilot', 'Piloting safe school initiatives to prevent violence and promote learning.', '2023-01-01', '2025-12-31', null, null, 'Nationwide Schools', 'Schools across China', 'Various', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6', 'https://www.unicef.cn/donate/', '4', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('26', 'Oral Health Initiative', 'Improving oral health for vulnerable children in rural and urban areas.', '2023-01-01', '2025-12-31', '08:00:00', '17:00:00', 'Rural and Urban Areas', 'Chengdu, Sichuan, China', 'Chengdu', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef', 'https://www.unicef.cn/donate/', '4', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('27', 'Zayed Charity Run', 'Charity run to support health and community welfare.', '2025-09-20', '2025-09-20', '07:00:00', '12:00:00', 'Beijing Olympic Park', 'Chaoyang District, Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1515169067868-5387ec3568e4', 'https://www.redcross.org.cn/html/jz/', '1', '2025-09-30 20:18:16');
INSERT INTO `events` VALUES ('28', 'Great Wall Charity Trek', 'Trek to raise funds for education and community development.', '2025-10-13', '2025-10-20', '08:00:00', '18:00:00', 'Great Wall Sections', 'Huairou District, Beijing, China', 'Beijing', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86', 'https://www.cydf.org.cn/donate/', '2', '2025-09-30 20:18:16');

-- ----------------------------
-- Table structure for event_categories
-- ----------------------------
DROP TABLE IF EXISTS `event_categories`;
CREATE TABLE `event_categories` (
  `event_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`event_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `event_categories_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `event_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of event_categories
-- ----------------------------
INSERT INTO `event_categories` VALUES ('1', '1');
INSERT INTO `event_categories` VALUES ('5', '1');
INSERT INTO `event_categories` VALUES ('6', '1');
INSERT INTO `event_categories` VALUES ('15', '1');
INSERT INTO `event_categories` VALUES ('19', '1');
INSERT INTO `event_categories` VALUES ('25', '1');
INSERT INTO `event_categories` VALUES ('28', '1');
INSERT INTO `event_categories` VALUES ('2', '2');
INSERT INTO `event_categories` VALUES ('6', '2');
INSERT INTO `event_categories` VALUES ('15', '2');
INSERT INTO `event_categories` VALUES ('16', '2');
INSERT INTO `event_categories` VALUES ('17', '2');
INSERT INTO `event_categories` VALUES ('18', '2');
INSERT INTO `event_categories` VALUES ('3', '3');
INSERT INTO `event_categories` VALUES ('7', '3');
INSERT INTO `event_categories` VALUES ('8', '3');
INSERT INTO `event_categories` VALUES ('9', '3');
INSERT INTO `event_categories` VALUES ('13', '3');
INSERT INTO `event_categories` VALUES ('14', '3');
INSERT INTO `event_categories` VALUES ('20', '3');
INSERT INTO `event_categories` VALUES ('22', '3');
INSERT INTO `event_categories` VALUES ('26', '3');
INSERT INTO `event_categories` VALUES ('27', '3');
INSERT INTO `event_categories` VALUES ('4', '4');
INSERT INTO `event_categories` VALUES ('10', '4');
INSERT INTO `event_categories` VALUES ('11', '4');
INSERT INTO `event_categories` VALUES ('12', '4');
INSERT INTO `event_categories` VALUES ('14', '4');
INSERT INTO `event_categories` VALUES ('18', '4');
INSERT INTO `event_categories` VALUES ('1', '5');
INSERT INTO `event_categories` VALUES ('4', '5');
INSERT INTO `event_categories` VALUES ('7', '5');
INSERT INTO `event_categories` VALUES ('12', '5');
INSERT INTO `event_categories` VALUES ('13', '5');
INSERT INTO `event_categories` VALUES ('14', '5');
INSERT INTO `event_categories` VALUES ('19', '5');
INSERT INTO `event_categories` VALUES ('20', '5');
INSERT INTO `event_categories` VALUES ('21', '5');
INSERT INTO `event_categories` VALUES ('22', '5');
INSERT INTO `event_categories` VALUES ('23', '5');
INSERT INTO `event_categories` VALUES ('24', '5');
INSERT INTO `event_categories` VALUES ('25', '5');
INSERT INTO `event_categories` VALUES ('26', '5');
INSERT INTO `event_categories` VALUES ('3', '6');
INSERT INTO `event_categories` VALUES ('5', '6');
INSERT INTO `event_categories` VALUES ('8', '6');
INSERT INTO `event_categories` VALUES ('9', '6');
INSERT INTO `event_categories` VALUES ('10', '6');
INSERT INTO `event_categories` VALUES ('23', '6');
INSERT INTO `event_categories` VALUES ('24', '6');
INSERT INTO `event_categories` VALUES ('27', '6');
INSERT INTO `event_categories` VALUES ('28', '6');

-- ----------------------------
-- Table structure for registrations
-- ----------------------------
DROP TABLE IF EXISTS `registrations`;
CREATE TABLE `registrations` (
  `registration_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `number_of_tickets` int NOT NULL DEFAULT '1',
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  PRIMARY KEY (`registration_id`),
  KEY `idx_event_id` (`event_id`),
  CONSTRAINT `fk_registrations_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of registrations
-- ----------------------------

INSERT INTO `registrations` (`event_id`, `user_name`, `email`, `phone`, `number_of_tickets`) VALUES 
(1, 'zs', 'zhangsan@example.com', '13800138000', 2),
(1, 'ls', 'lisi@example.com', '13900139000', 1),
(2, 'ww', 'wangwu@example.com', '13700137000', 3),
(2, 'zl', 'zhaoliu@example.com', '13600136000', 1),
(3, 'sq', 'sunqi@example.com', '13500135000', 2),
(3, 'zb', 'zhouba@example.com', '13400134000', 1),
(4, 'wj', 'wujiu@example.com', '13300133000', 3),
(4, 'zs', 'zhengshi@example.com', '13200132000', 2),
(5, 'qss', 'qian11@example.com', '13100131000', 1),
(5, 'css', 'chen12@example.com', '13000130000', 2);
