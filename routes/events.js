// Event API routes
const express = require('express');
const router = express.Router();
const eventDb = require('../models/event_db');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await eventDb.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('Failed to get event list:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single event details with registrations
router.get('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await eventDb.getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Failed to get event details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search events
router.get('/search/filter', async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      city: req.query.city,
      categoryId: req.query.categoryId
    };
    
    const events = await eventDb.searchEvents(filters);
    res.json(events);
  } catch (error) {
    console.error('Failed to search events:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await eventDb.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Failed to get category list:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create registration
router.post('/register', async (req, res) => {
  try {
    const { event_id, user_name, email, phone, number_of_tickets } = req.body;
    
    // Validate required fields
    if (!event_id || !user_name || !email) {
      return res.status(400).json({ error: 'Event ID, user name, and email are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate number of tickets
    const tickets = parseInt(number_of_tickets);
    if (isNaN(tickets) || tickets < 1 || tickets > 100) {
      return res.status(400).json({ error: 'Number of tickets must be between 1 and 100' });
    }
    
    const registrationId = await eventDb.createRegistration({
      event_id, user_name, email, phone, number_of_tickets: tickets
    });
    
    res.status(201).json({ message: 'Registration successful', registrationId });
  } catch (error) {
    console.error('Failed to create registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.title || !eventData.start_date || !eventData.charity_id) {
      return res.status(400).json({ error: 'Title, start date, and charity ID are required' });
    }
    
    const eventId = await eventDb.createEvent(eventData);
    
    res.status(201).json({ message: 'Event created successfully', eventId });
  } catch (error) {
    console.error('Failed to create event:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.title || !eventData.start_date || !eventData.charity_id) {
      return res.status(400).json({ error: 'Title, start date, and charity ID are required' });
    }
    
    const affectedRows = await eventDb.updateEvent(eventId, eventData);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Failed to update event:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const affectedRows = await eventDb.deleteEvent(eventId);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Failed to delete event:', error);
    if (error.message.includes('existing registrations')) {
      res.status(400).json({ error: 'Cannot delete event: There are existing registrations' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

module.exports = router;