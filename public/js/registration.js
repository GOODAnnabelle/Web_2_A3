// Registration page JavaScript file

// Get URL parameter
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Show error message
function showError(container, message) {
  container.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
    </div>
  `;
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Registration page loaded');
  
  // Get event ID from URL parameters
  const eventId = getUrlParameter('id');
  console.log('Retrieved event ID:', eventId);
  
  if (!eventId) {
    const eventInfoContainer = document.querySelector('.event-info');
    showError(eventInfoContainer, 'Event ID not found, please return to homepage and select an event again');
    return;
  }
  
  // Load event details
  loadEventDetails(eventId);
  
  // Initialize registration form
  initRegistrationForm();
});

// Load event details
async function loadEventDetails(eventId) {
  const eventInfoContainer = document.querySelector('.event-info');
  eventInfoContainer.innerHTML = '<div class="loading">Loading event information...</div>';
  
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event details');
    }
    
    const event = await response.json();
    
    // Display event details
    displayEventDetails(event, eventInfoContainer);
  } catch (error) {
    console.error('Failed to load event details:', error);
    showError(eventInfoContainer, 'Failed to load event details, please try again later');
  }
}

// Display event details
function displayEventDetails(event, container) {
  // Use event's image URL, if not available use default image
  const imageUrl = event.image_url || `https://picsum.photos/800/400?random=${event.event_id}`;
  
  // Category tags
  const categoryTags = (event.categories && event.categories.length > 0) 
    ? event.categories.map(category => 
        `<span class="category-tag">${category.name}</span>`
      ).join('')
    : '<span class="category-tag">Charity Activity</span>';
  
  container.innerHTML = `
    <div class="event-header">
      <h1>${event.title}</h1>
      <div class="event-meta">
        <div class="meta-item">
          <i class="fas fa-calendar"></i>
          <span>${formatDate(event.start_date)} - ${formatDate(event.end_date)}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>${event.city}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-building"></i>
          <span>${event.charity_name}</span>
        </div>
      </div>
      <div class="event-categories">
        ${categoryTags}
      </div>
      <div class="event-description">
        <p>${event.description}</p>
      </div>
    </div>
  `;
}

// Initialize registration form
function initRegistrationForm() {
  const registrationForm = document.getElementById('registration-form');
  
  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(registrationForm);
    const registrationData = {
      event_id: getUrlParameter('id'),
      user_name: formData.get('user-name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      number_of_tickets: parseInt(formData.get('tickets'))
    };
    
    // Validate form data
    if (!registrationData.user_name || !registrationData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validate number of tickets
    if (registrationData.number_of_tickets < 1 || registrationData.number_of_tickets > 100) {
      alert('Number of tickets must be between 1 and 100');
      return;
    }
    
    // Show loading state
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    try {
      // Send registration request to API
      const response = await fetch(`${API_BASE_URL}/events/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const result = await response.json();
      
      // Show success message
      const confirmationMessage = document.getElementById('confirmation-message');
      confirmationMessage.style.display = 'block';
      
      // Hide form
      registrationForm.style.display = 'none';
      
      // Hide event info
      document.querySelector('.event-info').style.display = 'none';
      
    } catch (error) {
      console.error('Registration failed:', error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      // Restore button state
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}