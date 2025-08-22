const footer = document.querySelector('.footer'); 
const videoSources = [
    "https://video.richardmille.com/mobile/crystalclear_header.mp4",
    "https://video.richardmille.com/mobile/RM-032_packshot_header-2.mp4",
    "https://video.richardmille.com/desktop/RM-65-01McL_header.mp4",
    "https://video.richardmille.com/desktop/Shelly_Ann_Fraser_16-9_1.mp4",
    "https://video.richardmille.com/desktop/header-collection-women-04_1.mp4",
    "https://video.richardmille.com/desktop/the-brand-history-rm-homepage.mp4"
];

const videos = document.querySelectorAll('video');
const videoContainers = document.querySelectorAll('.video-container');
const totalVideos = videos.length;
let currentVideoIndex = 0;
let isScrolling = false;


let headerLoaded = false;
let footerLoaded = false;

// Load video sources
videos.forEach((video, index) => {
    video.src = videoSources[index];
    video.load();
});

/**
 * Function to scroll to a specific video container or the footer
 * @param {number} index - Index of the container to scroll to, or beyond for natural scroll
 */
function scrollToVideo(index) {
    isScrolling = true;
    if (index >= totalVideos) {
        const footer = document.querySelector('#footer-placeholder');
        if (footer) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
        currentVideoIndex = totalVideos;
    } else if (index >= 0 && index < totalVideos) {
        videoContainers[index].scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => { isScrolling = false; }, 1000);
}

/**
 * Handle scrolling behavior
 */
function handleScroll(event) {
    if (isScrolling) return;

    const scrollDirection = event.deltaY > 0 ? 1 : -1;
    if (scrollDirection > 0 && currentVideoIndex < totalVideos) {
        currentVideoIndex++;
    } else if (scrollDirection < 0 && currentVideoIndex > 0) {
        currentVideoIndex--;
    }
    scrollToVideo(currentVideoIndex);
}

// Automatically change video every 8 seconds
setInterval(() => {
    if (!isScrolling && currentVideoIndex < totalVideos - 1) {
        currentVideoIndex++;
        scrollToVideo(currentVideoIndex);
    }
}, 8000);

// Attach the scroll event listener
window.addEventListener('wheel', handleScroll);

// Initialize the first video
scrollToVideo(currentVideoIndex);

// Click and Dropdown Toggle Functions

/**
 * Handle click events to toggle the underline.
 * @param {HTMLElement} element - The clicked element.
 */
function handleClick(element) {
    if (element.classList.contains('clicked')) {
        element.classList.remove('clicked');
    } else {
        document.querySelectorAll('.button, .clickable').forEach(btn => btn.classList.remove('clicked'));
        element.classList.add('clicked');
    }
}

/**
 * Toggle the language dropdown visibility with animation.
 * @param {Event} event - The click event.
 */
function toggleLanguageDropdown(event) {
    event.stopPropagation();
    const container = event.currentTarget.parentElement;
    const dropdown = container.querySelector('.language-dropdown');
    const buttons = dropdown.querySelectorAll('.lang-button');
    const languageButton = container.querySelector('.language-button');

    container.classList.toggle('open');

    if (container.classList.contains('open')) {
        dropdown.classList.add('show');
        languageButton.classList.add('clicked');
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, index * 100);
        });
    } else {
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(-20px)';
            }, index * 100);
            if (index === buttons.length - 1) {
                setTimeout(() => {
                    dropdown.classList.remove('show');
                    languageButton.classList.remove('clicked');
                }, (buttons.length + 1) * 100);
            }
        });
    }
}

/**
 * Toggle the side menu visibility and button state
 * @param {HTMLElement} button - The hamburger menu button
 */
function toggleMenu(button) {
    const sideMenu = document.querySelector('.side-menu');
    const blurOverlay = document.querySelector('.blur-overlay');
    const overlay = document.querySelector('.overlay');

    button.classList.toggle('clicked');
    sideMenu.classList.toggle('open');
    blurOverlay.classList.toggle('show');
    overlay.classList.toggle('show');

    if (!sideMenu.classList.contains('open')) {
        const menuButton = document.querySelector('.navbar.clickable');
        if (menuButton) {
            menuButton.classList.remove('clicked');
        }
    }
}

// Handle "COLLECTIONS" Button Click and Icon Rotation
document.addEventListener('DOMContentLoaded', () => {
    const collectionsButton = document.querySelector('.button[aria-label="Collections"]');
    const collectionsIcon = collectionsButton.querySelector('.collections-icon');

    // Add hover animations for the icon
    collectionsButton.addEventListener('mouseenter', () => {
        collectionsIcon.classList.remove('rotate-anticlockwise');
        collectionsIcon.classList.add('rotate-clockwise');
    });

    collectionsButton.addEventListener('mouseleave', () => {
        collectionsIcon.classList.remove('rotate-clockwise');
        collectionsIcon.classList.add('rotate-anticlockwise');
    });

    collectionsIcon.addEventListener('animationend', () => {
        collectionsIcon.classList.remove('rotate-clockwise');
        collectionsIcon.classList.remove('rotate-anticlockwise');
    });

    // Redirect to new page when the button or icon is clicked
    collectionsButton.addEventListener('click', () => {
        // Smoothly update the title before redirecting
        document.title = "COLLECTIONS | Luxury Watches . RICHARD MILLE";

        // Simulate a slight delay to let the title update visually before redirection
        setTimeout(() => {
            window.open('collection.html', '_self'); // Opens the page in the same tab
        }, 200);
    });

    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            headerLoaded = true;
            if (footerLoaded) loadContent();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            footerLoaded = true;
            if (headerLoaded) loadContent();
        })
        .catch(error => console.error('Error loading footer:', error));
});

function loadContent() {
    // Initialize any components that depend on both header and footer being loaded
    const footer = document.querySelector('#footer-placeholder');
    if (footer) {
        footer.style.display = 'block';
    }
}

// Close language dropdown and side menu when clicking outside
document.addEventListener('click', function(event) {
    const languageContainers = document.querySelectorAll('.language-container');
    languageContainers.forEach(container => {
        if (!container.contains(event.target)) {
            container.classList.remove('open');
            const dropdown = container.querySelector('.language-dropdown');
            const languageButton = container.querySelector('.language-button');
            dropdown.classList.remove('show');
            languageButton.classList.remove('clicked');
            dropdown.querySelectorAll('.lang-button').forEach(button => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(-20px)';
            });
        }
    });

    const sideMenu = document.querySelector('.side-menu');
    const hamburger = document.querySelector('.hamburger-menu');
    const overlay = document.querySelector('.overlay');
    if (sideMenu.classList.contains('open') && !sideMenu.contains(event.target) && !hamburger.contains(event.target)) {
        toggleMenu(hamburger);
    }
});

document.querySelector('.overlay').addEventListener('click', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    toggleMenu(hamburger);
});