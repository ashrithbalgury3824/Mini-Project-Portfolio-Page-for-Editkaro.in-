// Portfolio Data with preview videos
const videos = [
    {
        title: "Short-Form Video 1",
        category: "Short-Form Videos",
        src: "assets/videos/short1.mp4",
        preview: "assets/videos/short1-preview.mp4"
    },
    {
        title: "Gaming Video 1",
        category: "Gaming Videos",
        src: "assets/videos/gaming1.mp4",
        preview: "assets/videos/gaming1-preview.mp4"
    },
    {
        title: "Football Edit 1",
        category: "Football Edits",
        src: "assets/videos/football1.mp4",
        preview: "assets/videos/football1-preview.mp4"
    },
    {
        title: "eCommerce Ad 1",
        category: "eCommerce Ads",
        src: "assets/videos/ecommerce1.mp4",
        preview: "assets/videos/ecommerce1-preview.mp4"
    },
    {
        title: "Documentary Style 1",
        category: "Documentary Style",
        src: "assets/videos/documentary1.mp4",
        preview: "assets/videos/documentary1-preview.mp4"
    },
    {
        title: "Anime Video 1",
        category: "Anime Videos",
        src: "assets/videos/anime1.mp4",
        preview: "assets/videos/anime1-preview.mp4"
    },
    {
        title: "Ad 1",
        category: "Ads",
        src: "assets/videos/ads1.mp4",
        preview: "assets/videos/ads1-preview.mp4"
    }
];

const categories = [
    "All",
    ...Array.from(new Set(videos.map(v => v.category)))
];

const nav = document.getElementById('category-nav');
const portfolio = document.getElementById('portfolio');
const lightbox = document.getElementById('lightbox');
const lightboxVideo = document.getElementById('lightbox-video');
const closeLightbox = document.getElementById('close-lightbox');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const sectionHeading = document.getElementById('section-heading');
const sectionTitle = document.getElementById('section-title');

let currentVideos = [...videos];
let currentCategory = "All";

// Render category navigation
categories.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;
    li.onclick = () => filterCategory(cat);
    if (cat === "All") li.classList.add('active');
    nav.appendChild(li);
});

function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('#category-nav li').forEach(li => {
        li.classList.toggle('active', li.textContent === category);
    });
    
    // Update section heading
    sectionTitle.textContent = category === "All" ? "All Videos" : category;
    sectionHeading.classList.remove('hidden');
    
    // Ensure navigation stays visible when filtering
    showNavigation();
    
    // Add animation class to portfolio
    portfolio.classList.add('filter-transition');
    
    applyFilters();
}

function applyFilters() {
    let filteredVideos = currentCategory === "All" ? [...videos] : videos.filter(v => v.category === currentCategory);
    
    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredVideos = filteredVideos.filter(v => 
            v.title.toLowerCase().includes(searchTerm) || 
            v.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    const sortBy = sortSelect.value;
    if (sortBy === 'title') {
        filteredVideos.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
        filteredVideos.sort((a, b) => a.category.localeCompare(b.category));
    }
    
    currentVideos = filteredVideos;
    renderVideos(currentVideos);
}

function renderVideos(list) {
    portfolio.innerHTML = '';
    
    if (list.length === 0) {
        portfolio.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #aaa; font-size: 1.2rem;">No videos found matching your criteria.</div>';
        return;
    }
    
    list.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'video-card animate-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="video-thumb-container">
                <video class="video-thumb" muted preload="metadata">
                    <source src="${video.preview}#t=0.1" type="video/mp4">
                </video>
                <video src="${video.preview}" class="video-preview" muted loop preload="none"></video>
                <div class="play-overlay">▶</div>
                <div class="category-badge">${video.category}</div>
            </div>
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-category">${video.category}</div>
            </div>
        `;
        
        // Add hover effects for video preview
        const thumbnailVideo = card.querySelector('.video-thumb');
        const previewVideo = card.querySelector('.video-preview');
        
        // Load first frame as thumbnail
        thumbnailVideo.addEventListener('loadedmetadata', () => {
            thumbnailVideo.currentTime = 0.1;
        });
        
        card.addEventListener('mouseenter', () => {
            thumbnailVideo.style.opacity = '0';
            previewVideo.style.opacity = '1';
            previewVideo.play().catch(() => {
                console.log('Preview video failed to load');
            });
        });
        
        card.addEventListener('mouseleave', () => {
            thumbnailVideo.style.opacity = '1';
            previewVideo.style.opacity = '0';
            previewVideo.pause();
            previewVideo.currentTime = 0;
        });
        
        card.onclick = () => openLightbox(video.src);
        portfolio.appendChild(card);
    });
}

// Search functionality
searchInput.addEventListener('input', debounce(applyFilters, 300));
sortSelect.addEventListener('change', applyFilters);

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function openLightbox(src) {
    lightbox.classList.remove('hidden');
    lightboxVideo.src = src;
    lightboxVideo.play();
}

closeLightbox.onclick = () => {
    lightbox.classList.add('hidden');
    lightboxVideo.pause();
    lightboxVideo.src = '';
};

lightbox.onclick = (e) => {
    if (e.target === lightbox) {
        closeLightbox.onclick();
    }
};

// --- Hero Zoom-Out Scroll Effect with Page Transitions ---
const hero = document.getElementById('fullscreen-hero');
const mainContent = document.getElementById('main-content');
const navBar = document.getElementById('main-nav');

let isVideoPageActive = false;
let transitionInProgress = false;

function handleHeroZoom() {
    if (transitionInProgress) return; // Prevent updates during transitions
    
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    const threshold = heroHeight * 0.75;

    // Determine if we should be in video page mode
    const shouldShowVideoPage = scrollY > threshold;

    if (shouldShowVideoPage && !isVideoPageActive) {
        // Transition to video page
        activateVideoPage();
    } else if (!shouldShowVideoPage && isVideoPageActive) {
        // Transition back to hero page
        deactivateVideoPage();
    }

    // Always apply hero zoom effect when not in video page mode
    if (!isVideoPageActive) {
        const scale = Math.max(0.88, 1 - (scrollY / heroHeight) * 0.12);
        const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.85)));
        
        hero.style.transform = `scale(${scale})`;
        hero.style.opacity = opacity;
    }
}

function activateVideoPage() {
    if (transitionInProgress) return;
    
    transitionInProgress = true;
    isVideoPageActive = true;
    
    // Hide hero completely
    hero.style.transition = 'all 0.4s ease';
    hero.style.transform = 'scale(0.88)';
    hero.style.opacity = '0';
    
    // Slide in navigation
    setTimeout(() => {
        navBar.classList.remove('hidden-nav');
        navBar.classList.add('slide-in');
        
        // Add content padding
        mainContent.classList.add('content-with-nav');
        
        // Show section heading
        sectionHeading.classList.remove('hidden');
        
        transitionInProgress = false;
    }, 100);
}

function deactivateVideoPage() {
    if (transitionInProgress) return;
    
    transitionInProgress = true;
    isVideoPageActive = false;
    
    // Slide out navigation
    navBar.classList.remove('slide-in');
    navBar.classList.add('hidden-nav');
    
    // Remove content padding
    mainContent.classList.remove('content-with-nav');
    
    // Hide section heading
    sectionHeading.classList.add('hidden');
    
    // Restore hero immediately and completely
    setTimeout(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        // Force hero back to proper state
        if (scrollY <= 0) {
            hero.style.transform = 'scale(1)';
            hero.style.opacity = '1';
        } else {
            const scale = Math.max(0.88, 1 - (scrollY / heroHeight) * 0.12);
            const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.85)));
            
            hero.style.transform = `scale(${scale})`;
            hero.style.opacity = opacity;
        }
        
        transitionInProgress = false;
    }, 100);
}

function showNavigation() {
    // Only force show nav if we're in video page mode
    if (isVideoPageActive && !transitionInProgress) {
        navBar.classList.add('slide-in');
        navBar.classList.remove('hidden-nav');
    }
}

// Use requestAnimationFrame for smoother performance
let ticking = false;
function smoothHeroZoom() {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleHeroZoom();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', smoothHeroZoom, { passive: true });
window.addEventListener('resize', handleHeroZoom);
document.addEventListener('DOMContentLoaded', handleHeroZoom);

// Initial render
renderVideos(videos);
