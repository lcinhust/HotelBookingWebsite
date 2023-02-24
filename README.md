# Database Lab (IT3290E) Final Project - ICT K66 - HUST

# Hotel Booking Website 
As the demand for tourism is growing, the need to find hotels with high quality rooms and good services is significantly increasing. Therefore, we made this website for the purpose of providing customers with accurate information about rooms at hotel and how to book online to help you to setup hotel booking system quickly, pleasantly and easily.

## Overview

### Database Schema
![Architecture](https://github.com/lcinhust/HotelBookingWebsite/blob/main/bookingapp_query/bookingapp.jpg)

### Technical Specifications
* Frontend: EJS, CSS, Javascript
* Backend: ExpressJS
* Database: MySQL

### Features
- Authentication: Login, signup, resetPassword, updatePassword
- Authorization:
  - Restrict users, admin, guides what they can do
- Admin:
  - An admin account is provided
  - Create, read, update the booking status
  - Search booking information 
  - Checkin - checkout
- Users:
  - Update user information
  - Review room types and prices
  - Booking validation
  - Recommend the rooms number for each chosen room type 
  - Bill displaying

## Setup
1. Press the **Fork** button (top right the page) to save copy of this project on your account.
2. Download the repository files (project) from the download section or clone this project to your local machine by typing in the bash the following command:

       git clone https://github.com/lcinhust/HotelBookingWebsite.git
3. Install some essential libraries: `npm install`
4. Import & execute the SQL queries from the Database folder to the MySQL database.
5. Import the project in any IDE that support the aforementioned programming languages.
6. Deploy & Run the application with `npm run dev` :D

## Project Structure
    ├── bookingapp_query    # tables and queries used for this project
    |   └── bookingapp.jpg
    |   └── bookingapp.sql
    ├── pages               #ejs files
    ├── public              
    ├── routes              #code files
    |   └── admin.js
    |   └── booking.js
    |   └── general.js
    |   └── users.js    
    ├── .env
    ├── .gitignore
    ├── README.md
    ├── database.js
    ├── HBWpresentSlide.pdf
    ├── index.js
    ├── package-lock.json
    └── package.json

### Contributing 🔧
If you want to contribute to this project and make it better with new ideas, your pull request is very welcomed.
If you find any issue just put it in the repository issue section, thank you.

## Collaborators
<table>
    <tbody>
        <tr>
            <th align="center">Member name</th>
            <th align="center">Student ID</th>
        </tr>
        <tr>
            <td>Nguyễn Chí Long</td>
            <td align="center"> 20210553&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
            <td>Ngô Xuân Bách</td>
            <td align="center"> 20215181&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
            <td>Lê Xuân Hiếu</td>
            <td align="center"> 20215201&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
            <td>Đinh Việt Quang</td>
            <td align="center"> 20215235&nbsp;&nbsp;&nbsp;</td>
        </tr>
    </tbody>
</table>
