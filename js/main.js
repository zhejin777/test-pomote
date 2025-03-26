// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize game cards
    initializeGameCards();
    
    // Initialize search functionality
    initializeSearch();
    
    // Handle image errors
    handleImageErrors();
    
    // Initialize rating system if on game page
    if (document.querySelector('.game-rating-interactive')) {
        initializeRatingSystem();
    }
    
    // Initialize game loading if on game page
    initializeGameLoading();
});

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Make game cards clickable
function initializeGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only navigate if the click wasn't on a button or rating stars
            if (!e.target.closest('.btn') && !e.target.closest('.game-rating')) {
                const gameLink = this.querySelector('.btn-play').getAttribute('href');
                window.location.href = gameLink;
            }
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.trim();
            if (searchTerm) {
                // Add actual search logic here
                window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}

// Replace broken images with placeholder
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Default placeholder based on context
            let placeholder = 'images/placeholder.jpg';
            
            // If it's a game image, use game placeholder
            if (this.closest('.game-card')) {
                placeholder = 'images/game-placeholder.jpg';
            }
            
            this.src = placeholder;
            this.alt = 'Image unavailable';
        });
    });
}

// Initialize rating system
function initializeRatingSystem() {
    const stars = document.querySelectorAll('.rating-star');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseover', function() {
            // Highlight stars on hover
            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('hover');
            }
        });
        
        star.addEventListener('mouseout', function() {
            // Remove highlight on mouseout
            stars.forEach(s => s.classList.remove('hover'));
        });
        
        star.addEventListener('click', function() {
            // Set rating on click
            const rating = index + 1;
            rateGame(rating);
        });
    });
}

// Rate game function
function rateGame(rating) {
    // Update UI to reflect user's rating
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        star.classList.remove('active');
        if (index < rating) {
            star.classList.add('active');
        }
    });
    
    // Update rating text
    document.querySelector('.user-rating-value').textContent = rating.toFixed(1);
    
    // Show thank you message
    showRatingMessage("Thank you for rating!");
    
    // Here you would typically send the rating to a server
    console.log(`Game rated: ${rating} stars`);
}

// Show rating confirmation message
function showRatingMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'alert alert-success rating-message';
    messageEl.textContent = message;
    
    const ratingContainer = document.querySelector('.game-rating-interactive');
    ratingContainer.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// Initialize game loading
function initializeGameLoading() {
    const gameFrame = document.querySelector('.game-iframe');
    const loadingEl = document.querySelector('.loading');
    
    if (gameFrame && loadingEl) {
        loadingEl.style.display = 'block';
        
        gameFrame.addEventListener('load', function() {
            loadingEl.style.display = 'none';
        });
        
        // Fallback in case the load event doesn't fire
        setTimeout(() => {
            loadingEl.style.display = 'none';
        }, 5000);
    }
}

// Social sharing functionality
function shareGame(platform) {
    const url = window.location.href;
    const title = document.title;
    
    switch(platform) {
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
            break;
        case 'reddit':
            window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
            break;
    }
}

// Filter games on category pages
function filterGames(category) {
    const gameCards = document.querySelectorAll('.game-card');
    
    if (category === 'all') {
        gameCards.forEach(card => {
            card.closest('.col-md-6').style.display = 'block';
        });
        return;
    }
    
    gameCards.forEach(card => {
        const gameCategory = card.dataset.category;
        const parentCol = card.closest('.col-md-6');
        
        if (gameCategory === category) {
            parentCol.style.display = 'block';
        } else {
            parentCol.style.display = 'none';
        }
    });
}

// Sort games on pages with game listings
function sortGames(method) {
    const gameContainer = document.querySelector('.game-listing .row');
    const gameCards = Array.from(document.querySelectorAll('.game-card'));
    
    if (!gameContainer) return;
    
    switch(method) {
        case 'rating':
            gameCards.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector('.rating-score').textContent);
                const ratingB = parseFloat(b.querySelector('.rating-score').textContent);
                return ratingB - ratingA; // Descending order
            });
            break;
        case 'name':
            gameCards.sort((a, b) => {
                const nameA = a.querySelector('.card-title').textContent;
                const nameB = b.querySelector('.card-title').textContent;
                return nameA.localeCompare(nameB); // Alphabetical
            });
            break;
        case 'newest':
            // Assuming there's a data attribute for date
            gameCards.sort((a, b) => {
                const dateA = new Date(a.dataset.date || 0);
                const dateB = new Date(b.dataset.date || 0);
                return dateB - dateA; // Newest first
            });
            break;
    }
    
    // Clear container and append sorted cards
    gameCards.forEach(card => {
        gameContainer.appendChild(card.closest('.col-md-6'));
    });
}
