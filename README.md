# Help Desk System

## Project Description

Full Stack Help Desk system that allows customers to open support tickets without creating an account.

The system also includes a protected admin area where an administrator can view, search, filter, update and delete tickets, view ticket statistics and export tickets to a CSV file.

## Starting Point

This project is based on the previous Full Stack user management project from the course.

The existing project structure and principles were reused and adapted from users to support tickets, including typed React components, React state, API services, `ApiResponse<T>`, Express, TypeScript, validation, database actions and typed MongoDB collections.

## Technologies

### Frontend
- React
- TypeScript
- Vite
- React Router
- TailwindCSS
- Radix UI
- Fetch API

### Backend
- Node.js
- Express
- TypeScript
- MongoDB Native Driver
- CORS
- bcrypt
- JSON Web Token (JWT)

### Database
- MongoDB

## User Roles

### Customer
- Can open a new support ticket.
- Does not need to create an account.

### Admin
- Can log in to the protected admin area.
- Can view and manage support tickets.
- Can update ticket status and priority.
- Can delete tickets.
- Can export tickets to CSV.

## Pages

### Public Pages
- Open Ticket Page - allows a customer to create a new support ticket.
- Confirmation Page - displayed after a ticket is created successfully.

### Admin Pages
- Admin Login Page - allows the admin to log in.
- Dashboard Page - displays ticket statistics.
- Tickets Management Page - allows the admin to view, search, filter and manage tickets.

## Project Structure

### Frontend

`vite-test/src`

- `components` - reusable UI components.
- `pages` - application pages.
- `services` - API request functions.
- `types` - TypeScript types and interfaces.
- `App.tsx` - application routes.
- `main.tsx` - application entry point.

### Backend

`Server`

- `server` - Express server and API routes.
- `db` - MongoDB connection and database actions.
- `type` - backend TypeScript types and interfaces.

## Components

- Loading - displays a loading state during requests.
- ErrorMessage - displays error messages.
- TicketForm - form for creating a new support ticket.
- TicketCard - displays ticket information.
- TicketDetailsDialog - displays full ticket details and allows updates.
- DeleteTicketDialog - asks for confirmation before deleting a ticket.

## Data Model

### Ticket

A ticket stores:

- ID
- Customer Name
- Email
- Phone
- Title
- Description
- Category
- Priority
- Status
- Created At
- Updated At

Available categories:

- Hardware
- Software
- Network
- Account
- Other

Available priorities:

- Low
- Medium
- High

Available statuses:

- Open
- In Progress
- Resolved

New public tickets are automatically created with the `Open` status.

### Admin

An admin stores:

- Username
- Password Hash

The admin password is not stored as plain text.

## Types

The system uses TypeScript types and interfaces including:

- Ticket
- CreateTicketInput
- UpdateTicketInput
- Category
- Priority
- Status
- AdminLoginInput
- ApiResponse

## API Endpoints

### Public

- `POST /tickets` - create a new support ticket.
- `POST /admin/login` - admin login.

### Admin Protected

- `GET /tickets` - get all tickets.
- `GET /tickets/:id` - get a ticket by ID.
- `PATCH /tickets/:id` - update ticket status or priority.
- `DELETE /tickets/:id` - delete a ticket.
- `GET /tickets/export/csv` - export tickets to CSV.

## Authentication

The admin logs in using a username and password.

The server checks the admin credentials and compares the password with the stored password hash using bcrypt.

After a successful login, the server returns a JWT token.

Protected admin requests send the token in the Authorization header. The server verifies the token before allowing access to protected endpoints.

Logging out removes the token from the client.

## Environment Variables

### Frontend

Create a `.env` file inside `vite-test`:

```env
VITE_API_URL=http://localhost:3000
```

### Backend

Create a `.env` file inside `Server`.

Required variables:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=jwt_secret
ADMIN_USERNAME=admin_username
ADMIN_PASSWORD=admin_password
```

Example environment files are included in the project without real secrets.

## How to Run

### Backend

Open the `Server` directory and run:

```bash
npm install
npm run build
npm start
```

Make sure MongoDB is running before starting the server.

### Frontend

Open the `vite-test` directory and run:

```bash
npm install
npm run dev
```

Then open the local URL displayed by Vite in the terminal.

## Responsibility

### Frontend
- Displays the user interface.
- Manages React state.
- Validates form input.
- Sends requests through the API service.
- Displays loading, errors and server responses.
- Updates the UI after ticket operations without requiring a manual refresh.

### Backend
- Handles API requests.
- Validates incoming data.
- Handles authentication and protected routes.
- Performs database actions.
- Communicates with MongoDB.
- Creates ticket dates and initial status.