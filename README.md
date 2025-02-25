# DevNode

DevNode is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to provide a secure and seamless user authentication experience. Built with TypeScript on the backend and React on the frontend, DevNode features JWT-based authentication, email notifications, and password management, all while ensuring robust security and scalability.

## Features

- **User Authentication**: Secure JWT-based authentication with AccessToken and RefreshToken stored in HTTP-only cookies.
- **Email Notifications**: Integrated with Resend for account verification and password reset emails.
- **Scalable API Architecture**: Layered architecture with routes, controllers, services, and models for efficient request handling and business logic separation.
- **Seamless Frontend Experience**: Built with React, Chakra UI, and React Query, featuring custom hooks for auth state management and automated token refresh logic.
- **Error Handling**: Custom error handler middleware for consistent error management across the application.

## Technologies Used

- **Backend**: TypeScript, Express, MongoDB, Resend (for email notifications)
- **Frontend**: React, Chakra UI, React Query
- **Authentication**: JSON Web Tokens (JWT) with secure, HTTP-only cookies
- **Testing**: Thunder Client for API testing

## API Architecture

The API is structured into four main layers:

1. **Routes**: Handle incoming requests and forward them to the appropriate controller.
2. **Controllers**: Validate requests, call the appropriate service, and send back the response.
3. **Services**: Handle business logic, interact with the database, and call external services.
4. **Models**: Define the database schema and include utility methods for database interactions.

## Authentication Flow

- **Login**: Generates two JWTs (AccessToken and RefreshToken) stored in secure, HTTP-only cookies.
  - AccessToken: Short-lived (15 minutes), used for authenticating every request.
  - RefreshToken: Long-lived (30 days), used only to generate a new AccessToken via the `/refresh` endpoint.
- **Token Refresh**: Frontend automatically handles 401 errors by requesting a new AccessToken from the `/refresh` endpoint. If successful, the original request is retried; otherwise, the user is logged out.

## Error Handling

Errors are managed using a custom error handler middleware. Each controller is wrapped with the `errorCatch()` utility function to ensure errors are caught and processed consistently.

## Frontend Features

- **Forms**: Login, registration, password reset, and more.
- **Custom Hooks**: Manage authentication state and application data efficiently.
- **Responsive Design**: Built with Chakra UI for a modern and responsive user interface.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shyarnis/devnode.git
   ```
2. **Install Dependencies**:

   ```bash
   cd devnode
   cd backend
   npm install
   cd ..
   cd frontend
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the necessary variables from `.env.example`.

4. **Run the application**: Create two terminals and go to each directory frontend and backend.

```bash
npm run dev
```
