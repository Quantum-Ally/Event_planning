# Event Planning and Reminder System

A Node.js application that serves as an event planning and reminder system. Users can create events, assign them to different categories, set reminders, and view upcoming events.

## Features

- User Authentication
- Event Creation and Management
- Event Categorization
- In-Memory Notification System
- View Events by Date, Category, or Reminder Status
- Automated Testing with GitHub Actions

## Prerequisites

- Node.js (v16.x or v18.x)
- npm

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Quantum-Ally/Event_planning.git
cd Event_planning
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     - `JWT_SECRET`: Your JWT secret key
     - `PORT`: Server port (default: 3000)

4. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/register` - Register a new user
- POST `/api/login` - Login user

### Events
- POST `/api/events` - Create a new event
- GET `/api/events` - Get all user events
- GET `/api/events/category/:category` - Get events by category
- GET `/api/events/upcoming` - Get upcoming events
- POST `/api/events/:id/reminder` - Set reminder for an event

### Categories
- GET `/api/categories` - Get all available categories

### Notifications
- GET `/api/notifications` - Get all user notifications
- GET `/api/notifications/upcoming` - Get upcoming unread notifications
- PUT `/api/notifications/:id` - Mark a notification as read

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 