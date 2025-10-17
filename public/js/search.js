// Search page JavaScript file

document.addEventListener('DOMContentLoaded', () => {
  // Get event categories
  fetchCategories();
  
  // Initialize search form
  initSearchForm();

  // Initialize English date pickers
  initDatePickers();
  
  // Check URL parameters and execute search
  checkUrlParamsAndSearch();
});

// Get event categories
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/events/categories/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch category data');
    }
    
    const categories = await response.json();
    
    // Add options for category selection
    const categorySelect = document.getElementById('category');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.category_id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
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
    
    // Update URL and execute search
    window.history.pushState({}, '', `?${searchParams.toString()}`);
    searchEvents(Object.fromEntries(searchParams));
  });
}

// Initialize date pickers with English locale
function initDatePickers() {
  if (typeof flatpickr === 'undefined') return;
  const commonOptions = {
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'F j, Y',
    locale: 'en'
  };
  flatpickr('#start-date', commonOptions);
  flatpickr('#end-date', commonOptions);
}

// Check URL parameters and execute search
function checkUrlParamsAndSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const filters = {};
  
  // Get search parameters from URL
  for (const [key, value] of urlParams.entries()) {
    filters[key] = value;
    
    // Set form values
    const input = document.querySelector(`[name="${key}"]`);
    if (input) {
      input.value = value;
    }
  }
  
  // If there are search parameters, execute search
  if (Object.keys(filters).length > 0) {
    searchEvents(filters);
  } else {
    // Otherwise display all events
    fetchAllEvents();
  }
}

// Get all events
async function fetchAllEvents() {
  const resultsContainer = document.getElementById('search-results');
  
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch event data');
    }
    
    const events = await response.json();
    
    if (events.length === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No events available</p>';
      return;
    }
    
    resultsContainer.innerHTML = events.map(event => createEventCard(event)).join('');
  } catch (error) {
    console.error('Failed to fetch events:', error);
    showError(resultsContainer, 'Failed to fetch event data, please try again later');
  }
}

// Search events
async function searchEvents(filters) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
  
  try {
    // Build query parameters
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        searchParams.append(key, value);
      }
    }
    
    const response = await fetch(`${API_BASE_URL}/events/search/filter?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search events');
    }
    
    const events = await response.json();
    
    if (events.length === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No events found matching the criteria</p>';
      return;
    }
    
    resultsContainer.innerHTML = events.map(event => createEventCard(event)).join('');
  } catch (error) {
    console.error('Failed to search events:', error);
    showError(resultsContainer, 'Failed to search events, please try again later');
  }
}