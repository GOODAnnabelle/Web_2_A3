// Main JavaScript file

// Responsive navigation handling
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

  // Hamburger menu click event
  if (burger) {
    burger.addEventListener('click', () => {
      // Toggle navigation menu
      nav.classList.toggle('nav-active');

      // Animate links
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = '';
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
      });

      // Hamburger menu animation
      burger.classList.toggle('toggle');
    });
  }

  // Navigation bar effect on scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    }
  });
});

// Base URL (static mode)
const API_BASE_URL = 'http://localhost:3000/api';

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Create event card HTML
function createEventCard(event) {
  // Use image URL from database, if not available use default network image
  const imageUrl = event.image_url || `https://picsum.photos/300/200?random=${event.event_id}`;
  
  // Category tags - handle possibly non-existent categories property
  const categoryTags = (event.categories && event.categories.length > 0) 
    ? event.categories.map(category => 
        `<span class="category-tag">${category.name}</span>`
      ).join('')
    : '<span class="category-tag">Charity Activity</span>';
  
  return `
    <div class="event-card">
      <div class="event-image" style="background-image: url('${imageUrl}')"></div>
      <div class="event-content">
        <h3 class="event-title">${event.title}</h3>
        <div class="event-info">
          <p><i class="fas fa-calendar"></i> ${formatDate(event.start_date)} - ${formatDate(event.end_date)}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${event.city}</p>
          <p><i class="fas fa-building"></i> ${event.charity_name}</p>
        </div>
        <div class="event-categories">
          ${categoryTags}
        </div>
        <a href="event-details.html?id=${event.event_id}" class="btn btn-primary">View Details</a>
      </div>
    </div>
  `;
}

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