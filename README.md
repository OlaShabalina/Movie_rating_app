# Movie Rating App

Simple app to search for movies based on title, genre or both. There is an option to log in and rate each movie then see the average rating of all the app users who rated that movie.

## Languages/packages used

Express app with PostgreSQL database, using EJS for rendering pages, and AJAX requests for getting data from API.
Styling is done with Bootstrap and CSS. Validation through backend. 

## Getting Started

### Dependencies

* Express
* Ejs
* Bcrypt
* Pg-promise 
* Express-session
* Express-flash
* Dotenv
* Morgan
* Nodemon

### Installing

* Git clode from https://github.com/OlaShabalina/Movie_app_practice.git
* Copy .env.sample and rename it to .env. You need to set up your environment variables in .env file.

### Executing program

Install all the dependencies. 

```
npm install
```
Then create database, tables and fill them by running the code below:

```
npm run create-db
create-table
seed-table
```
Start the program with your .env variables.

```
npm run dev
```

## App overview

### Homepage
![image](https://user-images.githubusercontent.com/88268603/137474443-11c98e5e-91d3-419c-90bd-25534a02c692.png)

### Login page
![image](https://user-images.githubusercontent.com/88268603/137474520-8f878efb-aa65-4bca-aef4-f6805275051a.png)

### Registration page
![image](https://user-images.githubusercontent.com/88268603/137474575-914bc20e-897d-49b7-8224-2738346b878a.png)

### SIngle movie page (logged in)
![image](https://user-images.githubusercontent.com/88268603/137474663-b36a869b-3e7d-4839-9c6d-f8af72728c86.png)

### Single movie page (logged out)
![image](https://user-images.githubusercontent.com/88268603/137474735-89fe7d44-4b0d-4202-a435-ca15d09cbe4d.png)

