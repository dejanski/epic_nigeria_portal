# EPIC Nigeria Portal (MVP)

A comprehensive API-first Health Information Management System (HIMS) tailored for Nigeria, featuring patient records, clinical documentation, billing, and analytics.

## Features

- **Patient Management**: Registration, demographics, and history.
- **Clinical Documentation**: Notes, diagnoses, and vital signs.
- **Medications**: Prescriptions and pharmacy management.
- **Billing**: Invoicing, payments, and insurance claims.
- **Labs**: Test orders and results.
- **Analytics**: Health data reporting and dashboards.
- **Authentication**: Secure OAuth2-based access.
- **API Documentation**: Fully interactive Swagger/OpenAPI docs.

## Tech Stack

- **Backend**: Django 5.2, Django Rest Framework (DRF)
- **Authentication**: Django OAuth Toolkit (OAuth2)
- **Documentation**: drf-spectacular (Swagger UI)
- **Database**: SQLite (Development) / PostgreSQL (Production ready)

## Prerequisites

- Python 3.10+
- pip (Python package manager)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd epic_nigeria_portal
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

## Running the Server

Start the development server:
```bash
python manage.py runserver
```
The API will be available at `http://localhost:8000/`.

## API Documentation

Interactive API documentation is currently available at:
- **Swagger UI**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **Schema**: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)

## Authentication Guide

This API uses **OAuth2** for authentication.

### 1. Register an App
1. Navigate to `http://localhost:8000/admin/` and log in.
2. Go to **Django OAuth Toolkit** > **Applications**.
3. Create a **New Application**:
   - **Client type**: Confidential
   - **Authorization grant type**: Password
   - **Name**: (e.g., "Frontend App")

### 2. Obtain a Token
Send a POST request to `/o/token/` with the application credentials:

```bash
curl -X POST http://localhost:8000/o/token/ \
     -d "grant_type=password" \
     -d "username=YOUR_USERNAME" \
     -d "password=YOUR_PASSWORD" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET"
```

### 3. Make Authenticated Requests
Include the token in the `Authorization` header:
```
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

## License

Proprietary Software. Internal use only.