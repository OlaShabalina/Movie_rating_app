DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS movies CASCADE;

CREATE TABLE IF NOT EXISTS users (
    users_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL);

CREATE TABLE IF NOT EXISTS movies(
    review_id SERIAL PRIMARY KEY,
    users_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    CONSTRAINT fk_users 
        FOREIGN KEY(users_id)
            REFERENCES users(users_id)
                ON DELETE CASCADE
);