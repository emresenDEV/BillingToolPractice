# Billing Dashboard Project

## About the Project

The **Billing Dashboard** is a full-stack application designed to streamline the management of client billing and invoicing. Built with modern technologies, the project addresses common challenges faced by businesses in handling invoices, managing clients, and maintaining accurate financial records.

### Problem

Many businesses struggle with manual invoicing processes, which are prone to errors, inefficient, and time-consuming. Tracking tax rates, discounts, and client information can quickly become unmanageable as a business scales.

### Solution

The **Billing Dashboard** provides an automated and user-friendly platform for creating, managing, and updating invoices and client data. With real-time database integration and an intuitive frontend, the tool ensures accuracy and efficiency while reducing the workload for business owners and their teams.

## Tech Stack

### Frontend

- **React**: Provides a dynamic, component-based interface that ensures a responsive user experience.
- **CSS**: Offers efficient, utility-first styling for a clean and modern design.

### Backend

- **Flask**: Lightweight and scalable Python framework used for API endpoints and database interactions.
- **Flask-CORS**: Enables secure cross-origin resource sharing between the frontend and backend.

### Database

- **SQLite**: A lightweight and self-contained SQL database for quick local setup and testing.
- **SQLAlchemy**: Used as an Object-Relational Mapper (ORM) for database interactions.

### AWS Services

- **EC2**: Virtual server to host the backend application and database.
- **S3** (Planned): For storing static assets like images or backups.
- **RDS** (Planned): To replace SQLite with a managed, scalable SQL database.
- **Amplify**: Simplifies frontend hosting and deployment for the React application.

### Additional Tools

- **Gunicorn**: For running the Flask application in a production environment.
- **Nginx**: Reverse proxy for better performance and security.

## Features

1. **Invoice Management**: Create, edit, and update invoices with details like tax rates, discounts, and client-specific data.
2. **Client Management**: Maintain a centralized repository of client information.
3. **Real-Time Search**: Search for clients or invoices by various fields (e.g., business name, phone number, invoice ID).
4. **Database Seeding**: Python automation scripts for populating the database with sample data.
5. **Automated Calculations**: Automatic calculation of taxes, discounts, and final totals for invoices.

## Python Automation Scripts

1. **Data Migration**: A script to migrate data from CSV files to the SQLite database.
2. **Client and Billing Generation**: Scripts to generate sample clients and invoices for testing.

## Database Setup

- **Tables**:
  - `Clients`: Stores client details like business name, contact information, and address.
  - `BillingRecords`: Tracks invoices, including services rendered, amounts, tax rates, and discounts.
  - `TaxRates`: Maintains state-specific tax rates.

## AWS Integration

The application is designed for deployment on AWS. While some services are not yet fully functional, the plan includes:

- **Hosting the frontend** on AWS Amplify.
- **Running the backend** on an EC2 instance with Python 3.13.1.
- **Database migration** to AWS RDS for enhanced scalability and reliability.

---

## Setup Instructions

### Prerequisites

- Install Python 3.13.1 or higher.
- Install Node.js and npm.
- Install Git.

### macOS/Linux Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/emresenDEV/BillingToolPractice.git
   cd BillingToolPractice
   ```
2. **Setup the Backend**:

   - Navigate to the project root.

   ```bash
   cd billing_tool_practice
   ```

   - Create a virtual environment:

   ```bash
   python3.13 -m venv venv
   source venv/bin/activate
   ```

   - Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
3. **Setup the Frontend**:

   - Navigate to the frontend directory:

   ```bash
   cd billing-dashboard
   ```

   - Install dependencies:

   ```bash
   npm install
   ```

   - Start the development server:

   ```bash
   npm start
   ```

### Windows Setup

1. **Clone the Repository**:

   ```powershell
   git clone https://github.com/emresenDEV/BillingToolPractice.git
   cd BillingToolPractice
   ```
2. **Setup the Backend**:

   - Navigate to the project root:

   ```powershell
   cd billing_tool_practice
   ```

   - Create a virtual environment:

   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

   - Install dependencies:

   ```powershell
   pip install -r requirements.txt
   ```
3. **Setup the Frontend**:

   - Navigate to the frontend directory:

   ```powershell
   cd billing-dashboard
   ```

   - Install dependencies:

   ```powershell
   npm install
   ```

   - Start the development server:

   ```powershell
   npm start
   ```

---

## Future Enhancements

1. **Dockerization**: Simplify deployment with Docker containers.
2. **User Authentication**: Add secure login and role-based access controls.
3. **Email Notifications**: Notify clients about new or updated invoices.
4. **Enhanced Analytics**: Add charts and insights for billing trends.
