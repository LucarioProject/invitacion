// Check if main image loads, hide placeholder if it does
const mainImage = document.getElementById('mainImage');
const heroMainImage = document.querySelector('.hero-main-image');

if (mainImage && heroMainImage) {
    // Check if image is already loaded
    if (mainImage.complete && mainImage.naturalHeight !== 0) {
        heroMainImage.classList.add('has-image');
        mainImage.style.opacity = '1';
        mainImage.style.display = 'block';
    } else {
        mainImage.addEventListener('load', function() {
            heroMainImage.classList.add('has-image');
            this.style.opacity = '1';
            this.style.display = 'block';
        });
        
        mainImage.addEventListener('error', function() {
            // If image fails to load, keep placeholder visible
            heroMainImage.classList.remove('has-image');
            this.style.display = 'none';
            console.error('Error loading main image:', this.src);
        });
        
        // Set initial display
        mainImage.style.display = 'block';
        mainImage.style.opacity = '1';
    }
}

// Verify location image loads
const locationImage = document.querySelector('.location-image');
if (locationImage) {
    locationImage.addEventListener('load', function() {
        console.log('Location image loaded successfully');
        this.style.opacity = '1';
    });
    
    locationImage.addEventListener('error', function() {
        console.error('Error loading location image:', this.src);
        // Show error indicator
        this.style.backgroundColor = 'rgba(139, 69, 19, 0.5)';
        this.alt = 'Error al cargar la imagen de la iglesia';
    });
    
    // Ensure image is visible
    locationImage.style.display = 'block';
    locationImage.style.opacity = '1';
}

// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('2026-04-05T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Parallax Effect
function parallaxScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-image');
    const announcementImage = document.querySelector('.announcement-image');
    const announcementContent = document.querySelector('.announcement-content');
    const announcementSection = document.querySelector('.announcement-section');

    parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const section = element.closest('.announcement-section, .final-section');
        
        // Only apply parallax when element is in viewport
        if (rect.bottom >= 0 && rect.top <= windowHeight) {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            
            // Para imágenes dentro de contenedores (ubicación), deshabilitar parallax o hacerlo muy sutil
            if (element.classList.contains('location-image')) {
                // Sin parallax para la imagen de ubicación, se mantiene estática
                element.style.transform = 'none';
            } else if (element.classList.contains('final-image')) {
                // Para la imagen del footer, usar parallax relativo a su sección
                if (section) {
                    const sectionRect = section.getBoundingClientRect();
                    const sectionTop = sectionRect.top + scrolled;
                    const sectionBottom = sectionRect.bottom + scrolled;
                    const relativeScroll = scrolled - sectionTop;
                    // Limitar el parallax para que la imagen no se salga completamente
                    const maxScroll = sectionRect.height * 0.3;
                    const limitedScroll = Math.min(Math.max(relativeScroll, 0), maxScroll);
                    const yPos = -(limitedScroll * speed);
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                } else {
                    // Fallback si no encuentra la sección
                    const yPos = -(scrolled * speed * 0.3);
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            } else {
                // Para otras imágenes con parallax completo (anuncio)
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                
                // Si es la imagen de anuncio, mover también el contenido del texto con la misma velocidad
                if (element === announcementImage && announcementContent) {
                    // El texto se mueve exactamente igual que la imagen
                    announcementContent.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            }
        } else if (element.classList.contains('final-image')) {
            // Si la imagen del footer está fuera del viewport, asegurar que esté visible
            element.style.transform = 'translate3d(0, 0, 0)';
        }
    });
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            parallaxScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Smooth scroll for hero section parallax
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 500);
        }
    }
});

// Side Menu Functionality
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const sideMenuLinks = document.querySelectorAll('.side-menu-link');

function toggleMenu() {
    const isActive = sideMenu.classList.contains('active');
    
    if (isActive) {
        // Close menu
        sideMenu.classList.remove('active');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        // Enable scroll
        document.body.style.overflow = '';
    } else {
        // Open menu
        sideMenu.classList.add('active');
        if (menuOverlay) {
            menuOverlay.classList.add('active');
        }
        // Disable scroll
        document.body.style.overflow = 'hidden';
    }
}

if (menuToggle && sideMenu) {
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            // Enable scroll
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking a link
    sideMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            if (menuOverlay) {
                menuOverlay.classList.remove('active');
            }
            // Enable scroll
            document.body.style.overflow = '';
        });
    });
}

// RSVP Functionality
const rsvpYesBtn = document.getElementById('rsvpYes');
const rsvpNoBtn = document.getElementById('rsvpNo');
const rsvpMessage = document.getElementById('rsvpMessage');

rsvpYesBtn.addEventListener('click', () => {
    rsvpMessage.textContent = '¡Gracias por confirmar tu asistencia! Nos vemos el 5 de Abril 🎉';
    rsvpMessage.style.color = 'var(--color-brown)';
    rsvpYesBtn.style.background = 'var(--color-brown-dark)';
    rsvpNoBtn.style.background = 'var(--color-brown)';
});

rsvpNoBtn.addEventListener('click', () => {
    rsvpMessage.textContent = 'Lamentamos que no puedas asistir. ¡Esperamos verte pronto! 💙';
    rsvpMessage.style.color = 'var(--color-brown)';
    rsvpNoBtn.style.background = 'var(--color-brown-dark)';
    rsvpYesBtn.style.background = 'var(--color-green)';
});

// Additional parallax effects for timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
window.addEventListener('scroll', () => {
    timelineItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = (windowHeight - rect.top) / windowHeight;
            const direction = index % 2 === 0 ? -1 : 1;
            const translateX = (1 - progress) * 100 * direction;
            
            item.style.transform = `translateX(${translateX * 0.1}px)`;
            item.style.opacity = Math.min(1, progress * 1.5);
        }
    });
});

// Smooth entrance animations for sections
function animateOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.8) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
animateOnScroll();

// Add subtle animations to countdown numbers
const countdownNumbers = document.querySelectorAll('.countdown-number');
countdownNumbers.forEach(num => {
    num.addEventListener('transitionend', () => {
        num.style.transform = 'scale(1)';
    });
});

setInterval(() => {
    countdownNumbers.forEach(num => {
        num.style.transform = 'scale(1.1)';
        setTimeout(() => {
            num.style.transform = 'scale(1)';
        }, 200);
    });
}, 1000);

// Scroll to Top Button
function updateScrollToTopButton() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;
    
    const sideMenuEl = document.getElementById('sideMenu');
    const isMenuOpen = sideMenuEl && sideMenuEl.classList.contains('active');
    const scrollPosition = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
    
    // Always hide when menu is open
    if (isMenuOpen) {
        scrollToTopBtn.classList.remove('visible');
        return;
    }
    
    // Show button after scrolling down (100px)
    if (scrollPosition > 100) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Initialize scroll to top button
(function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) {
        // Try again after a short delay if button not found
        setTimeout(initScrollToTop, 100);
        return;
    }
    
    // Force correct positioning
    scrollToTopBtn.style.position = 'fixed';
    scrollToTopBtn.style.bottom = '30px';
    scrollToTopBtn.style.right = '30px';
    scrollToTopBtn.style.top = 'auto';
    scrollToTopBtn.style.left = 'auto';
    
    // Initially hide
    scrollToTopBtn.classList.remove('visible');
    
    // Update on scroll
    window.addEventListener('scroll', updateScrollToTopButton, { passive: true });
    
    // Check on load
    updateScrollToTopButton();
    
    // Click handler
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hide when menu opens/closes
    const sideMenuEl = document.getElementById('sideMenu');
    if (sideMenuEl) {
        const observer = new MutationObserver(() => {
            updateScrollToTopButton();
        });
        
        observer.observe(sideMenuEl, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
})();

// Also initialize on DOM ready and load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateScrollToTopButton);
} else {
    updateScrollToTopButton();
}

window.addEventListener('load', updateScrollToTopButton);

// Preload images for better performance
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Prevent FOUC (Flash of Unstyled Content)
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});