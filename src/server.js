const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { users, events, categories, notifications } = require('./models/data');

const app = express();
app.use(cors());
app.use(express.json());

// JWT Secret (in production, this should be in .env)
const JWT_SECRET = 'your-secret-key';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// User Routes
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        id: users.length + 1,
        username,
        password: hashedPassword,
        email
    };
    
    users.push(user);
    res.status(201).json({ message: 'User created successfully' });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token });
});

// Event Routes
app.post('/api/events', authenticateToken, (req, res) => {
    const { name, description, date, time, category } = req.body;
    const event = {
        id: events.length + 1,
        userId: req.user.id,
        name,
        description,
        date,
        time,
        category,
        reminder: null
    };
    
    events.push(event);
    res.status(201).json(event);
});

app.get('/api/events', authenticateToken, (req, res) => {
    const userEvents = events.filter(e => e.userId === req.user.id);
    res.json(userEvents);
});

app.post('/api/events/:id/reminder', authenticateToken, (req, res) => {
    const { reminderTime } = req.body;
    const event = events.find(e => e.id === parseInt(req.params.id) && e.userId === req.user.id);
    
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    event.reminder = reminderTime;
    
    // Create notification
    const notification = {
        id: notifications.length + 1,
        userId: req.user.id,
        eventId: event.id,
        eventName: event.name,
        reminderTime,
        isRead: false,
        createdAt: new Date().toISOString()
    };
    
    notifications.push(notification);
    res.json({ event, notification });
});

// Get user notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
    const userNotifications = notifications
        .filter(n => n.userId === req.user.id)
        .sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));
    res.json(userNotifications);
});

// Mark notification as read
app.put('/api/notifications/:id', authenticateToken, (req, res) => {
    const notification = notifications.find(
        n => n.id === parseInt(req.params.id) && n.userId === req.user.id
    );
    
    if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    res.json(notification);
});

app.get('/api/categories', authenticateToken, (req, res) => {
    res.json(categories);
});

// Get events by category
app.get('/api/events/category/:category', authenticateToken, (req, res) => {
    const categoryEvents = events.filter(
        e => e.userId === req.user.id && e.category === req.params.category
    );
    res.json(categoryEvents);
});

// Get upcoming events
app.get('/api/events/upcoming', authenticateToken, (req, res) => {
    const now = new Date();
    const upcomingEvents = events
        .filter(e => e.userId === req.user.id && new Date(e.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(upcomingEvents);
});

// Get upcoming notifications
app.get('/api/notifications/upcoming', authenticateToken, (req, res) => {
    const now = new Date();
    const upcomingNotifications = notifications
        .filter(n => n.userId === req.user.id && new Date(n.reminderTime) > now && !n.isRead)
        .sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));
    res.json(upcomingNotifications);
});

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app; 