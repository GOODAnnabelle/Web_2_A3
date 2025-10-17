// Admin Dashboard JavaScript file

document.addEventListener('DOMContentLoaded', () => {
  // Load initial data
  loadEvents();
  loadCharities();
  
  // Set up event listeners
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const view = this.getAttribute('data-view');
      showView(view);
    });
  });
  
  // Refresh events
  document.getElementById('refresh-events').addEventListener('click', loadEvents);
  
  // Create event form
  document.getElementById('create-event-form').addEventListener('submit', createEvent);
  
  // Edit event form
  document.getElementById('edit-event-form').addEventListener('submit', updateEvent);
  
  // Modal close button
  document.querySelector('#edit-event-modal .close').addEventListener('click', () => {
    document.getElementById('edit-event-modal').style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('edit-event-modal');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Show specific view
function showView(viewName) {
  // Update active link
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
  
  // Show/hide views
  document.getElementById('events-view').style.display = 
    viewName === 'events' ? 'block' : 'none';
  document.getElementById('create-event-view').style.display = 
    viewName === 'create-event' ? 'block' : 'none';
}

// Load events
async function loadEvents() {
  const eventsList = document.getElementById('events-list');
  eventsList.innerHTML = '<div class="loading">Loading events...</div>';
  
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const events = await response.json();
    displayEvents(events, eventsList);
  } catch (error) {
    console.error('Failed to load events:', error);
    eventsList.innerHTML = `<div class="error-message">Failed to load events: ${error.message}</div>`;
  }
}

// Display events
function displayEvents(events, container) {
  if (events.length === 0) {
    container.innerHTML = '<p>No events found</p>';
    return;
  }
  
  container.innerHTML = events.map(event => `
    <div class="event-card">
      <div class="event-image" style="background-image: url('${event.image_url || `https://picsum.photos/300/200?random=${event.event_id}`}')"></div>
      <div class="event-content">
        <h3 class="event-title">${event.title}</h3>
        <div class="event-meta">
          <p><i class="fas fa-calendar"></i> ${formatDate(event.start_date)}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${event.city}</p>
          <p><i class="fas fa-building"></i> ${event.charity_name}</p>
          <p><i class="fas fa-users"></i> ${event.registration_count || 0} registrations</p>
        </div>
        <div class="event-actions">
          <button class="btn btn-edit btn-sm" onclick="editEvent(${event.event_id})">Edit</button>
          <button class="btn btn-delete btn-sm" onclick="deleteEvent(${event.event_id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Load charities for dropdowns
async function loadCharities() {
  try {
    // For simplicity, we'll use a static list of charities from the database
    const charities = [
      { charity_id: 1, name: 'Chinese Red Cross Society' },
      { charity_id: 2, name: 'Project Hope (China Youth Development Foundation)' },
      { charity_id: 3, name: 'Greenpeace' },
      { charity_id: 4, name: 'UNICEF China' }
    ];
    
    // Populate create event form
    const createSelect = document.getElementById('charity_id');
    createSelect.innerHTML = '<option value="">Select Charity</option>';
    charities.forEach(charity => {
      const option = document.createElement('option');
      option.value = charity.charity_id;
      option.textContent = charity.name;
      createSelect.appendChild(option);
    });
    
    // Populate edit event form
    const editSelect = document.getElementById('edit_charity_id');
    editSelect.innerHTML = '<option value="">Select Charity</option>';
    charities.forEach(charity => {
      const option = document.createElement('option');
      option.value = charity.charity_id;
      option.textContent = charity.name;
      editSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load charities:', error);
  }
}

// Edit event
async function editEvent(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event details');
    }
    
    const event = await response.json();
    
    // Populate form fields
    document.getElementById('edit_event_id').value = event.event_id;
    document.getElementById('edit_title').value = event.title;
    document.getElementById('edit_description').value = event.description;
    document.getElementById('edit_start_date').value = event.start_date;
    document.getElementById('edit_end_date').value = event.end_date || '';
    document.getElementById('edit_city').value = event.city;
    document.getElementById('edit_charity_id').value = event.charity_id;
    document.getElementById('edit_image_url').value = event.image_url || '';
    
    // Clear notifications
    document.getElementById('edit-event-notifications').innerHTML = '';
    
    // Load registrations for this event
    loadEventRegistrations(eventId);
    
    // Show modal
    document.getElementById('edit-event-modal').style.display = 'block';
  } catch (error) {
    console.error('Failed to load event:', error);
    alert(`Failed to load event: ${error.message}`);
  }
}

// Load event registrations
async function loadEventRegistrations(eventId) {
  const registrationsList = document.getElementById('registrations-list');
  registrationsList.innerHTML = '<p>Loading registrations...</p>';
  
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event details');
    }
    
    const event = await response.json();
    
    if (event.registrations && event.registrations.length > 0) {
      registrationsList.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tickets</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${event.registrations.map(reg => `
              <tr>
                <td>${reg.user_name}</td>
                <td>${reg.email}</td>
                <td>${reg.number_of_tickets}</td>
                <td>${formatDate(reg.registration_date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      registrationsList.innerHTML = '<p>No registrations for this event</p>';
    }
  } catch (error) {
    console.error('Failed to load registrations:', error);
    registrationsList.innerHTML = `<p>Failed to load registrations: ${error.message}</p>`;
  }
}

// Update event
async function updateEvent(e) {
  e.preventDefault();
  
  const form = document.getElementById('edit-event-form');
  const eventId = document.getElementById('edit_event_id').value;
  
  // Get form data
  const eventData = {
    title: form.title.value,
    description: form.description.value,
    start_date: form.start_date.value,
    end_date: form.end_date.value || null,
    city: form.city.value,
    charity_id: parseInt(form.charity_id.value),
    image_url: form.image_url.value || null
  };
  
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Updating...';
  
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update event');
    }
    
    // Show success message
    showNotification('edit-event-notifications', 'Event updated successfully!', 'success');
    
    // Close modal after delay
    setTimeout(() => {
      document.getElementById('edit-event-modal').style.display = 'none';
      loadEvents(); // Refresh events list
    }, 1500);
    
  } catch (error) {
    console.error('Failed to update event:', error);
    showNotification('edit-event-notifications', `Error: ${error.message}`, 'error');
  } finally {
    // Restore button state
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

// Delete event
async function deleteEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete event');
    }
    
    alert('Event deleted successfully!');
    loadEvents(); // Refresh events list
  } catch (error) {
    console.error('Failed to delete event:', error);
    alert(`Failed to delete event: ${error.message}`);
  }
}

// Create event
async function createEvent(e) {
  e.preventDefault();
  
  const form = document.getElementById('create-event-form');
  
  // Get form data
  const eventData = {
    title: form.title.value,
    description: form.description.value,
    start_date: form.start_date.value,
    end_date: form.end_date.value || null,
    city: form.city.value,
    charity_id: parseInt(form.charity_id.value),
    image_url: form.image_url.value || null
  };
  
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Creating...';
  
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create event');
    }
    
    const result = await response.json();
    alert('Event created successfully!');
    
    // Reset form
    form.reset();
    
    // Switch to events view
    showView('events');
    loadEvents(); // Refresh events list
    
  } catch (error) {
    console.error('Failed to create event:', error);
    alert(`Failed to create event: ${error.message}`);
  } finally {
    // Restore button state
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

// Show notification
function showNotification(containerId, message, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="notification ${type}">
      ${message}
    </div>
  `;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}