// Home page JavaScript file

document.addEventListener('DOMContentLoaded', () => {
  // Get upcoming events
  fetchUpcomingEvents();
  
  // Get event categories
  fetchCategories();
  
  // Initialize search form
  initSearchForm();

  // Initialize English date pickers
  initDatePickers();
});

// Get upcoming events
async function fetchUpcomingEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch event data');
    }
    const events = await response.json();
    displayEvents(events.slice(0, 6)); // Display first 6 events
  } catch (error) {
    console.error('Failed to fetch events:', error);
    // If API call fails, display error message
    const eventsContainer = document.getElementById('upcoming-events');
    eventsContainer.innerHTML = '<p class="error-message">Unable to load event data at the moment, please try again later.</p>';
  }
}

// Display events list
function displayEvents(events) {
  const eventsContainer = document.getElementById('upcoming-events');
  
  if (events.length === 0) {
    eventsContainer.innerHTML = '<p>No upcoming events available</p>';
    return;
  }
  
  eventsContainer.innerHTML = events.map(event => createEventCard(event)).join('');
}

// Get event categories
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/events/categories/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch category data');
    }
    const categories = await response.json();
    displayCategories(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // If API call fails, display error message
    const categoriesContainer = document.getElementById('categories-list');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = '<p class="error-message">Unable to load category data at the moment, please try again later.</p>';
    }
  }
}

// Display event categories
function displayCategories(categories) {
  const categoriesContainer = document.getElementById('categories-list');
  
  if (!categoriesContainer) {
    console.error('Cannot find categories-list container');
    return;
  }
  
  if (categories.length === 0) {
    categoriesContainer.innerHTML = '<p>No event categories available</p>';
    return;
  }
  
  categoriesContainer.innerHTML = categories.map(category => `
    <div class="category-item">
      <h3>${category.name}</h3>
      <p>${category.description || 'No description available'}</p>
    </div>
  `).join('');
}



// Initialize search form
function initSearchForm() {
  const searchForm = document.getElementById('search-form');
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();
    
    for (const [key, value] of formData.entries()) {
      if (value) {
        searchParams.append(key, value);
      }
    }
    
    // Navigate to search page
    window.location.href = `search.html?${searchParams.toString()}`;
  });
}

// Initialize date pickers with English locale
function initDatePickers() {
  if (typeof flatpickr !== 'function') return;

  const options = {
    locale: 'en',
    dateFormat: 'Y-m-d', // submitted value
    altInput: true,
    altFormat: 'F j, Y', // display value e.g., September 30, 2025
    allowInput: true
  };

  flatpickr('#start-date', options);
  flatpickr('#end-date', options);
}