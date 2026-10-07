# Fullstack Developer Capstone - Dealership Review Platform

This project is a full-stack web application designed to help users explore dealerships, browse vehicle information, read customer reviews, and submit their own feedback. It combines a Django backend with a React frontend to create a responsive, user-friendly dealership experience.

## Overview

The application allows users to:

- Browse a list of dealerships
- Filter dealerships by state
- View dealership details and contact information
- Read customer reviews for each dealership
- Create an account and sign in
- Submit dealership reviews after authentication
- Explore vehicle makes and models stored in the local database

The project is structured as a modern full-stack application with separate backend and frontend layers, making it a strong example of a complete web app built using Python and JavaScript.

## Tech Stack

- Python 3
- Django
- React
- SQLite database
- Node.js and npm
- Bootstrap for styling
- REST-style backend endpoints

## Project Structure

```text
fullstack_developer_capstone/
├── LICENSE
├── README.md
├── about_us_url.txt
├── contact_us_url.txt
├── server/
│   ├── manage.py
│   ├── requirements.txt
│   ├── djangoproj/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── djangoapp/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── populate.py
│   │   ├── restapis.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── migrations/
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   └── package.json
│   └── database/
│       ├── docker-compose.yml
│       └── data/
└── django_server.txt
```

## Features

### User features

- User registration and authentication
- Login/logout flow using Django's built-in auth system
- Session-based user access for posting reviews

### Dealer features

- Display all dealerships
- View dealership details by ID
- Filter dealers by state
- View reviews associated with each dealer

### Review features

- Read user-submitted review comments
- Review sentiment analysis support via backend logic
- Add new reviews for a specific dealership

## Prerequisites

Before running this application, make sure you have:

- Python 3.9+ installed
- Node.js and npm installed
- A local terminal or command prompt

## Local Setup

### 1. Clone or open the project

```bash
cd fullstack_developer_capstone
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv
```

On Windows:

```bash
.venv\Scripts\activate
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

### 3. Install Python dependencies

```bash
cd server
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
```

### 5. Prepare the database

From the `server` folder, run:

```bash
python manage.py migrate
```

If the database is empty, the app can populate car-related records when the endpoint is accessed.

## Running the Application

### Option 1: Run the Django backend

From the `server` folder:

```bash
python manage.py runserver
```

This serves the application on:

```text
http://127.0.0.1:8000/
```

### Option 2: Run the React frontend

From the `server/frontend` folder:

```bash
npm start
```

This runs the React development server for local frontend development.

### Option 3: Build the frontend for Django

From the `server/frontend` folder:

```bash
npm run build
```

Then serve the project through Django so the built static files are used in the app.

## Important Routes

The project includes these main routes:

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dealers` - Dealer listings
- `/dealer/<dealer_id>` - Dealer details page
- `/postreview/<dealer_id>` - Review submission page

Backend API endpoints include:

- `/djangoapp/register`
- `/djangoapp/login`
- `/djangoapp/logout`
- `/djangoapp/get_dealers/`
- `/djangoapp/get_dealers/<state>`
- `/djangoapp/dealer/<int:dealer_id>`
- `/djangoapp/reviews/dealer/<int:dealer_id>`
- `/djangoapp/add_review`
- `/djangoapp/get_cars`

## Database and Data

The project includes sample data files in `server/database/data/` and a Docker Compose setup for local database services. The Django app also includes a population script to initialize some of the required model data.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Notes

This is a capstone-style application and is intended for learning and demonstration purposes. It is suitable for local development and can be extended with additional features such as more advanced authentication, deployment configuration, or richer inventory management.
