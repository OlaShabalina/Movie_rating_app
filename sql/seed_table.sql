-- initial data so you can see examples of average rating

INSERT INTO users (name, email, password)
VALUES
('TestUser', 'testuser@gmail.com', '$2b$10$GfL6/XyJYBadle7e8Xm70e9y6oWgrCamz2Crhoh6exPsy23b4l32.'),
('TestUser2', 'testuser2@gmail.com', '$2b$10$GfL6/XyJYBadle7e8Xm70e9y6oWgrCamz2Crhoh6exPsy23b4l32.'),
('TestUser3', 'testuser3@gmail.com', '$2b$10$GfL6/XyJYBadle7e8Xm70e9y6oWgrCamz2Crhoh6exPsy23b4l32.');

INSERT INTO movies (users_id, movie_id, rating)
VALUES
(1, 580489, 3),
(1, 550988, 5),
(1, 335983, 4),
(2, 580489, 4),
(2, 550988, 3),
(2, 335983, 2),
(3, 580489, 5),
(3, 550988, 5),
(3, 335983, 5);