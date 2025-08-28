-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2024 at 06:26 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `conference_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `conferenceId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
);

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `conferenceId`, `userId`, `userName`, `message`, `created_at`) VALUES
(10, 7, 2, 'wert', 'hi', '2024-11-03 16:49:26'),
(11, 7, 3, 'user2', 'hello', '2024-11-03 16:49:54'),
(12, 7, 2, 'wert', 'hi', '2024-11-03 16:54:46'),
(13, 7, 3, 'user2', 'yes', '2024-11-03 17:11:43'),
(14, 7, 3, 'user2', 'aaaaaaaaa', '2024-11-03 17:22:21'),
(15, 7, 2, 'wert', 'bbbbbbbbbb', '2024-11-03 17:27:19'),
(16, 7, 3, 'user2', 'gggggggggggggg', '2024-11-03 17:28:37'),
(17, 7, 2, 'wert', 'ttttttttttt', '2024-11-03 17:28:49'),
(18, 7, 3, 'user2', 'jjjjj', '2024-11-03 17:30:13'),
(19, 7, 2, 'wert', 'iiiiiiiiii', '2024-11-03 17:31:27'),
(20, 7, 2, 'user1', 'hi', '2024-11-16 13:12:31'),
(21, 7, 3, 'user2', 'hello', '2024-11-16 13:15:19');

-- --------------------------------------------------------

--
-- Table structure for table `conferences`
--

CREATE TABLE `conferences` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `paper_submission_date` date DEFAULT NULL,
  `notification_date` date DEFAULT NULL,
  `cameraready_date` date DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `originality` varchar(255) DEFAULT NULL,
  `plagiarism` varchar(255) DEFAULT NULL,
  `language_` varchar(255) DEFAULT NULL,
  `file_format` varchar(255) DEFAULT NULL,
  `length` varchar(255) DEFAULT NULL,
  `font` varchar(255) DEFAULT NULL,
  `title_page` varchar(255) DEFAULT NULL,
  `abstract` varchar(255) DEFAULT NULL,
  `introduction` varchar(255) DEFAULT NULL,
  `fee` int(11) NOT NULL
) ;

--
-- Dumping data for table `conferences`
--

INSERT INTO `conferences` (`id`, `name`, `date`, `location`, `type`, `description`, `paper_submission_date`, `notification_date`, `cameraready_date`, `registration_date`, `originality`, `plagiarism`, `language_`, `file_format`, `length`, `font`, `title_page`, `abstract`, `introduction`, `fee`) VALUES
(7, 'Mathematical Logic and Foundations', '2024-10-26', 'Harvard University update', 'mathematics', 'This field deals with finding the best solution from a set of feasible options, often within constraints. It includes linear, non-linear, and combinatorial optimization, with applications in engineering, economics, machine learning, and operations research. update', '2024-09-20', '2024-09-23', '2024-10-17', '2024-09-28', 'Papers must be original and not previously published or under consideration for publication elsewhere.', 'Submissions should be free of plagiarism. All papers will be checked for originality using plagiarism detection tools.', NULL, 'Papers must be submitted in PDF format.', 'The paper should be between 6 to 8 pages, including references, figures, and tables.', 'Use 10-point Times New Roman or a similar font for the main body text.', 'The title page should include the paper’s title, authors\' names, affiliations, and contact information of the corresponding author.', 'A concise summary of the paper, not exceeding 250 words.', 'Introduce the problem, background, and purpose of your research.', 102),
(8, 'Engineering & Industry (general)', '0000-00-00', 'The University of Texas at Arlington', 'engineering', 'This field focuses on developing innovative technologies for clean and renewable energy sources, such as solar, wind, and bioenergy. Research in sustainable energy engineering aims to reduce carbon emissions, improve energy efficiency, and create sustainable solutions for global energy demands.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
(9, 'Molecular Biology', '0000-00-00', 'The University of Texas at Arlington', 'lifeSciences', 'This topic explores how social media platforms are reshaping communication, relationships, and social behavior. It examines both the positive aspects, such as enhanced connectivity and information sharing, and the challenges, including issues like cyberbullying, social isolation, and the impact on mental health.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
(10, 'International Spine and Spinal Injury Conference', '0000-00-00', 'UTA, Texas', 'medicineHealthcare', 'Telemedicine is revolutionizing healthcare delivery by allowing patients to access medical services remotely. This topic covers advancements in telehealth platforms, virtual consultations, and remote patient monitoring.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
(11, 'Algebraic Geometry', '2024-12-27', 'The University of Texas at Arlington, Arlington, TX', 'mathematics', 'Algebraic geometry explores the solutions to systems of polynomial equations and their geometric structures. It connects algebra, geometry, and number theory, and has applications in fields such as cryptography and string theory.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50),
(12, 'Sustainable Energy Engineering', '0000-00-00', 'Harvard University, Cambridge, MA', 'engineering', 'This field focuses on developing innovative technologies for clean and renewable energy sources, such as solar, wind, and bioenergy. Research in sustainable energy engineering aims to reduce carbon emissions, improve energy efficiency, and create sustainable solutions for global energy demands.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `conference_schedule`
--

CREATE TABLE `conference_schedule` (
  `id` int(11) NOT NULL,
  `conference_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `speaker` varchar(255) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `Organization` varchar(150) NOT NULL,
  `abstract` varchar(1000) NOT NULL,
  `biography` varchar(1000) NOT NULL,
  `from_time` time NOT NULL,
  `to_time` time NOT NULL
) ;

--
-- Dumping data for table `conference_schedule`
--

INSERT INTO `conference_schedule` (`id`, `conference_id`, `title`, `speaker`, `designation`, `Organization`, `abstract`, `biography`, `from_time`, `to_time`) VALUES
(2, 7, 'Keynote session 1', 'Dr. Emily Roger', 'Asst. Professor', 'University of Dayton, dayton', 'Dr. Rogers will discuss the role of AI in revolutionizing healthcare, from improving diagnostic accuracy to creating personalized treatment plan.', 'Dr. Emily Rogers is a renowned expert in artificial intelligence applications in healthcare, with over 15 years of experience in machine learning, diagnostics, and medical research .', '10:00:00', '15:00:00'),
(3, 7, 'Innovations in Green Energy Solutions', 'Prof. Michael Green', 'Assistant Professor', 'University of Texas', 'A session on emerging green technologies and sustainable energy solution.', 'Prof. Michael Green is a renowned expert in artificial intelligence applications in healthcare, with over 15 years of experience in machine learning, diagnostics, and medical research .', '15:00:00', '17:30:00'),
(5, 11, 'Algeraic Geometry test 1', 'Speaker 1', 'Designation 1', 'Organization 1', 'Abstract', 'Biography ', '20:53:00', '21:53:00');

-- --------------------------------------------------------

--
-- Table structure for table `mentoring`
--

CREATE TABLE `mentoring` (
  `id` int(11) NOT NULL,
  `mentorid` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `fromDate` date NOT NULL,
  `toDate` date NOT NULL,
  `description` varchar(1000) NOT NULL,
  `registeredUsers` varchar(500) NOT NULL
) ;

--
-- Dumping data for table `mentoring`
--

INSERT INTO `mentoring` (`id`, `mentorid`, `session`, `fromDate`, `toDate`, `description`, `registeredUsers`) VALUES
(5, 5, 'Building a Career in Data Science', '2024-12-25', '2024-11-30', 'This session provides an in-depth look into the data science field, covering essential skills, industry trends, and practical advice on getting started. Our mentors will guide participants through creating a roadmap for entering and advancing in data science, offering insights on tools, techniques, and project ideas.', '3,'),
(6, 5, 'Effective Public Speaking for Tech Professionals', '2024-12-18', '2024-12-31', 'Public speaking is crucial for sharing ideas and knowledge. In this session, mentors will share strategies for delivering impactful presentations, managing stage anxiety, and engaging technical and non-technical audiences. Attendees will get tips on structuring content, body language, and improving their confidence in front of crowds.', ''),
(7, 6, 'Mastering Project Management in Agile Environments', '2024-12-25', '2024-12-31', 'Agile methodologies have transformed project management. This mentoring session will introduce participants to Agile principles, popular frameworks like Scrum and Kanban, and tools for efficient project tracking. Mentors will also share practical approaches for balancing flexibility with productivity in fast-paced projects.\r\n', ''),
(8, 6, 'From Concept to Launch: Developing a Tech Startup', '2025-01-13', '2025-01-19', 'Have a startup idea but don’t know where to begin? This session will cover the journey of turning ideas into reality. Mentors with experience in tech startups will discuss key steps, including product validation, pitching to investors, and navigating common startup challenges. Perfect for aspiring entrepreneurs!', ''),
(11, 7, 'Navigating Diversity and Inclusion in Technology', '2025-01-01', '2025-01-22', 'Creating an inclusive workplace is essential for innovation. This session covers strategies for promoting diversity and inclusion in tech, including recruiting practices, creating a welcoming environment, and addressing unconscious biases. Mentors will provide actionable advice on fostering a culture of respect and understanding.', '2,'),
(12, 7, 'Advancing Your Career Through Networking and Mentorship', '2025-01-16', '2025-01-22', 'Networking and mentorship are powerful tools for career growth. This session focuses on building and leveraging a professional network, finding the right mentors, and maintaining valuable connections. Mentors will offer tips on effective networking, finding opportunities, and building lasting relationships in the tech industry.', '');

-- --------------------------------------------------------

--
-- Table structure for table `paper_submissions`
--

CREATE TABLE `paper_submissions` (
  `id` int(11) NOT NULL,
  `paper_title` varchar(255) NOT NULL,
  `research_area` varchar(255) NOT NULL,
  `conference_id` int(11) NOT NULL,
  `author` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `institute` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reviewed` int(11) NOT NULL DEFAULT 0,
  `reviewer_name` varchar(150) NOT NULL,
  `reviewer_designation` varchar(50) NOT NULL,
  `reviewer_organization` varchar(200) NOT NULL,
  `reviewer_phone` int(20) NOT NULL,
  `reviewer_email` varchar(100) NOT NULL,
  `originality` int(11) NOT NULL,
  `clarity` int(11) NOT NULL,
  `relevance` int(11) NOT NULL,
  `feedback` varchar(500) NOT NULL,
  `feePaid` int(11) NOT NULL,
  `fee` int(11) NOT NULL
) ;

--
-- Dumping data for table `paper_submissions`
--

INSERT INTO `paper_submissions` (`id`, `paper_title`, `research_area`, `conference_id`, `author`, `designation`, `institute`, `phone`, `email`, `file_path`, `created_at`, `reviewed`, `reviewer_name`, `reviewer_designation`, `reviewer_organization`, `reviewer_phone`, `reviewer_email`, `originality`, `clarity`, `relevance`, `feedback`, `feePaid`, `fee`) VALUES
(2, 'Test 1', 'mathematics', 7, 'Author 1', 'Author 1 designation', 'Author 1 organization', '9999999999', 'abc@gmail.com', '2.pdf', '2024-10-31 07:33:02', 0, 'reviewer', 'desig', 'Org', 1234567890, '0', 2, 5, 6, 'feedback', 1, 100),
(3, 'Test 2', 'mathematics', 7, 'author 1', 'designation 1', 'organization 1', '9999999999', 'wer@er.df', '3.pdf', '2024-10-31 17:04:29', 1, 'Reviewer 1', '', '', 0, 'sdfg1@sdf.sf', 0, 4, 0, 'sd asdasd asds', 1, 100),
(6, 'sd', '', 8, 'ds', '', '', '', 'sunilgowdabr1993@gmail.com', '6.pdf', '2024-11-13 15:59:59', 0, '', '', '', 0, '', 0, 0, 0, '', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `institute` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `usertype` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `designation`, `institute`, `phone`, `email`, `usertype`, `password`) VALUES
(2, 'user1', 'df', 'fg', '1234567809', 'user1@gmail.com', 'author', 'Pass@123'),
(3, 'user2', 'df', 'fg', '1234567809', 'user2@gmail.com', 'reviewer', 'Pass@123'),
(5, 'Mentor1', 'Professor', 'Mentor1 Institute', '1234567809', 'mentor1@gmail.com', 'mentor', 'Pass@123'),
(6, 'Mentor2', 'Professor', 'Mentor2 Institute', '1234567809', 'mentor2@gmail.com', 'mentor', 'Pass@123'),
(7, 'Mentor3', 'Professor', 'Mentor3 Institute', '1234567809', 'mentor3@gmail.com', 'mentor', 'Pass@123'),
(8, 'Admin', '', '', '', 'admin@gmail.com', 'admin', 'Pass@123'),
(9, 'User 3', '', '', '', 'user3@gmail.com', 'author', 'Pass@123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conferences`
--
ALTER TABLE `conferences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conference_schedule`
--
ALTER TABLE `conference_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mentoring`
--
ALTER TABLE `mentoring`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `paper_submissions`
--
ALTER TABLE `paper_submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `conferences`
--
ALTER TABLE `conferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `conference_schedule`
--
ALTER TABLE `conference_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mentoring`
--
ALTER TABLE `mentoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `paper_submissions`
--
ALTER TABLE `paper_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
