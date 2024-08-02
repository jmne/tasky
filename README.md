# TASKY

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Adjust the .env files to your needs [see .env.example](./.env.example)
   and [see Docker .env.example](./docker/.env.example)
4. Run `npm build` to build the server
5. Run `cd docker/ && docker-compose up -d` to start the database
6. Open `http://localhost:8000` in your browser and login with the credentials (Supabase) you set in the .env file
7. Check if the database is created and the tables are created (Tasks, Projects and Users in 'public' schema).
   If not, create the database and tables manually (see the [database.sql](./docker/volumes/db/init/data.sql) file)
8. Run `npm start` to start the server
9. Open `http://localhost:3000` in your browser
10. Enjoy!

## Description

This is a simple task manager that allows you to add, delete, and edit tasks.

## Structure

![structure](./public/images/readme_structure.png)

## Features

- Project Creation and Management: ✅
- Task Creation and Assignment: ✅
- Task Overview: ✅
- User Authentication: ✅
- User Roles and Permissions: (✅)
- Notification System: ❌
- Comments and File Attachments: ❌
