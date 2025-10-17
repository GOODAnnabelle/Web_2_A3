// Database connection module
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'charityevents_db'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Get all events with registration count and status
async function getAllEvents() {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.name as charity_name, 
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.event_id) as registration_count
      FROM events e
      LEFT JOIN charities c ON e.charity_id = c.charity_id
      ORDER BY e.start_date ASC
    `);
    
    // Get categories for each event
    for (let event of rows) {
      const [categories] = await pool.query(`
        SELECT c.category_id, c.name, c.description
        FROM categories c
        JOIN event_categories ec ON c.category_id = ec.category_id
        WHERE ec.event_id = ?
      `, [event.event_id]);
      
      event.categories = categories;
      
      // Add event status based on current date
      const currentDate = new Date();
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      
      if (currentDate < startDate) {
        event.status = 'upcoming'; // 活动未开始
        event.status_text = 'Upcoming';
      } else if (currentDate > endDate) {
        event.status = 'ended'; // 活动已结束
        event.status_text = 'Ended';
      } else {
        event.status = 'active'; // 活动进行中
        event.status_text = 'Active';
      }
    }
    
    return rows;
  } catch (error) {
    console.error('Failed to get event list:', error);
    throw error;
  }
}

// Get single event details with registrations and status
async function getEventById(eventId) {
  try {
    const [events] = await pool.query(`
      SELECT e.*, c.name as charity_name, c.description as charity_description, 
             c.logo_url, c.website, c.contact_email, c.contact_phone,
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.event_id) as registration_count
      FROM events e
      LEFT JOIN charities c ON e.charity_id = c.charity_id
      WHERE e.event_id = ?
    `, [eventId]);
    
    if (events.length === 0) {
      return null;
    }
    
    const event = events[0];
    
    // Add event status based on current date
    const currentDate = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    if (currentDate < startDate) {
      event.status = 'upcoming';
      event.status_text = 'Upcoming';
    } else if (currentDate > endDate) {
      event.status = 'ended';
      event.status_text = 'Ended';
    } else {
      event.status = 'active';
      event.status_text = 'Active';
    }
    
    // Get event categories
    const [categories] = await pool.query(`
      SELECT c.category_id, c.name, c.description
      FROM categories c
      JOIN event_categories ec ON c.category_id = ec.category_id
      WHERE ec.event_id = ?
    `, [eventId]);
    
    event.categories = categories;
    
    // Get registrations for this event, sorted by latest date
    const [registrations] = await pool.query(`
      SELECT * FROM registrations 
      WHERE event_id = ? 
      ORDER BY registration_date DESC
    `, [eventId]);
    
    event.registrations = registrations;
    event.registration_count = registrations.length; // 添加注册人数字段
    
    return event;
  } catch (error) {
    console.error('Failed to get event details:', error);
    throw error;
  }
}

// Search events with status
async function searchEvents(filters) {
  try {
    let query = `
      SELECT e.*, c.name as charity_name,
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.event_id) as registration_count
      FROM events e
      LEFT JOIN charities c ON e.charity_id = c.charity_id
    `;
    
    const queryParams = [];
    const conditions = [];
    
    // Add date filtering
    if (filters.startDate) {
      conditions.push('e.start_date >= ?');
      queryParams.push(filters.startDate);
    }
    
    if (filters.endDate) {
      conditions.push('e.end_date <= ?');
      queryParams.push(filters.endDate);
    }
    
    // Add location filtering
    if (filters.city) {
      conditions.push('e.city LIKE ?');
      queryParams.push(`%${filters.city}%`);
    }
    
    // Add category filtering
    if (filters.categoryId) {
      query += `
        JOIN event_categories ec ON e.event_id = ec.event_id
      `;
      conditions.push('ec.category_id = ?');
      queryParams.push(filters.categoryId);
    }
    
    // Combine WHERE clause
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add sorting
    query += ' ORDER BY e.start_date ASC';
    
    const [rows] = await pool.query(query, queryParams);
    
    // Get categories for each event and add status
    for (let event of rows) {
      const [categories] = await pool.query(`
        SELECT c.category_id, c.name, c.description
        FROM categories c
        JOIN event_categories ec ON c.category_id = ec.category_id
        WHERE ec.event_id = ?
      `, [event.event_id]);
      
      event.categories = categories;
      
      // Add event status based on current date
      const currentDate = new Date();
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      
      if (currentDate < startDate) {
        event.status = 'upcoming';
        event.status_text = 'Upcoming';
      } else if (currentDate > endDate) {
        event.status = 'ended';
        event.status_text = 'Ended';
      } else {
        event.status = 'active';
        event.status_text = 'Active';
      }
    }
    
    return rows;
  } catch (error) {
    console.error('Failed to search events:', error);
    throw error;
  }
}

// Get all categories
async function getAllCategories() {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  } catch (error) {
    console.error('Failed to get category list:', error);
    throw error;
  }
}

// Create registration
async function createRegistration(registrationData) {
  try {
    const { event_id, user_name, email, phone, number_of_tickets } = registrationData;
    
    // First, check if the event has already ended
    const [events] = await pool.query(`
      SELECT end_date FROM events 
      WHERE event_id = ?
    `, [event_id]);
    
    // If event doesn't exist, throw an error
    if (events.length === 0) {
      throw new Error('Event not found');
    }
    
    // Check if event has already ended
    const eventEndDate = new Date(events[0].end_date);
    const currentDate = new Date();
    
    // If event has already ended, prevent registration
    if (eventEndDate < currentDate) {
      throw new Error('Cannot register for an event that has already ended');
    }
    
    // Check if user has already registered for this event
    // Prevent duplicate registration with same user information
    const [existingRegistrations] = await pool.query(`
      SELECT registration_id FROM registrations 
      WHERE event_id = ? AND (user_name = ? OR email = ? OR phone = ?)
    `, [event_id, user_name, email, phone]);
    
    // If registration already exists, throw an error with specific message
    if (existingRegistrations.length > 0) {
      throw new Error('You have already registered for this event. Duplicate registrations are not allowed.');
    }
    
    // If no duplicate found and event hasn't ended, create new registration
    const [result] = await pool.query(`
      INSERT INTO registrations (event_id, user_name, email, phone, number_of_tickets)
      VALUES (?, ?, ?, ?, ?)
    `, [event_id, user_name, email, phone, number_of_tickets]);
    
    return result.insertId;
  } catch (error) {
    console.error('Failed to create registration:', error);
    throw error;
  }
}

// Create new event
async function createEvent(eventData) {
  try {
    const { title, description, start_date, end_date, start_time, end_time, location, address, city, image_url, registration_url, charity_id } = eventData;
    
    const [result] = await pool.query(`
      INSERT INTO events (title, description, start_date, end_date, start_time, end_time, location, address, city, image_url, registration_url, charity_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, start_date, end_date, start_time, end_time, location, address, city, image_url, registration_url, charity_id]);
    
    return result.insertId;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
}

// Update event
async function updateEvent(eventId, eventData) {
  try {
    const { title, description, start_date, end_date, start_time, end_time, location, address, city, image_url, registration_url, charity_id } = eventData;
    
    const [result] = await pool.query(`
      UPDATE events 
      SET title = ?, description = ?, start_date = ?, end_date = ?, start_time = ?, end_time = ?, 
          location = ?, address = ?, city = ?, image_url = ?, registration_url = ?, charity_id = ?
      WHERE event_id = ?
    `, [title, description, start_date, end_date, start_time, end_time, location, address, city, image_url, registration_url, charity_id, eventId]);
    
    return result.affectedRows;
  } catch (error) {
    console.error('Failed to update event:', error);
    throw error;
  }
}

// Delete event (only if no registrations exist)
async function deleteEvent(eventId) {
  try {
    // Check if there are any registrations for this event
    const [registrations] = await pool.query(`
      SELECT COUNT(*) as count FROM registrations WHERE event_id = ?
    `, [eventId]);
    
    if (registrations[0].count > 0) {
      throw new Error('Cannot delete event: There are existing registrations');
    }
    
    const [result] = await pool.query(`
      DELETE FROM events WHERE event_id = ?
    `, [eventId]);
    
    return result.affectedRows;
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
}

module.exports = {
  testConnection,
  getAllEvents,
  getEventById,
  searchEvents,
  getAllCategories,
  createRegistration,
  createEvent,
  updateEvent,
  deleteEvent
};