// Check if main image loads, hide placeholder if it does
const mainImage = document.getElementById('mainImage');
const heroMainImage = document.querySelector('.hero-main-image');

if (mainImage && heroMainImage) {
    // Asegurar que la imagen mantenga su ancho completo y el difuminado siempre
    function enforceImageWidth() {
        if (mainImage) {
            const containerWidth = heroMainImage.offsetWidth || window.innerWidth;
            mainImage.style.width = '100%';
            mainImage.style.minWidth = '100%';
            mainImage.style.maxWidth = '100vw';
            mainImage.style.transform = 'none';
            // Mantener el mask-image durante el scroll
            mainImage.style.maskImage = 'linear-gradient(to bottom, black 0%, black 40%, rgba(0, 0, 0, 0.98) 55%, rgba(0, 0, 0, 0.95) 65%, rgba(0, 0, 0, 0.9) 72%, rgba(0, 0, 0, 0.8) 78%, rgba(0, 0, 0, 0.65) 84%, rgba(0, 0, 0, 0.45) 89%, rgba(0, 0, 0, 0.3) 93%, rgba(0, 0, 0, 0.2) 95%, rgba(0, 0, 0, 0.1) 97%, rgba(0, 0, 0, 0.05) 98.5%, transparent 100%)';
            mainImage.style.webkitMaskImage = 'linear-gradient(to bottom, black 0%, black 40%, rgba(0, 0, 0, 0.98) 55%, rgba(0, 0, 0, 0.95) 65%, rgba(0, 0, 0, 0.9) 72%, rgba(0, 0, 0, 0.8) 78%, rgba(0, 0, 0, 0.65) 84%, rgba(0, 0, 0, 0.45) 89%, rgba(0, 0, 0, 0.3) 93%, rgba(0, 0, 0, 0.2) 95%, rgba(0, 0, 0, 0.1) 97%, rgba(0, 0, 0, 0.05) 98.5%, transparent 100%)';
        }
    }
    
    // Aplicar al cargar y en cada scroll
    enforceImageWidth();
    window.addEventListener('resize', enforceImageWidth);
    
    // Usar requestAnimationFrame para asegurar que se aplique después de cualquier otro cambio
    let lastScrollTime = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime > 16) { // Limitar a ~60fps
            requestAnimationFrame(() => {
                enforceImageWidth();
            });
            lastScrollTime = now;
        }
    }, { passive: true });
    
    // Observer para asegurar que el mask-image se mantenga si algo lo cambia
    const maskGradient = 'linear-gradient(to bottom, black 0%, black 40%, rgba(0, 0, 0, 0.98) 55%, rgba(0, 0, 0, 0.95) 65%, rgba(0, 0, 0, 0.9) 72%, rgba(0, 0, 0, 0.8) 78%, rgba(0, 0, 0, 0.65) 84%, rgba(0, 0, 0, 0.45) 89%, rgba(0, 0, 0, 0.3) 93%, rgba(0, 0, 0, 0.2) 95%, rgba(0, 0, 0, 0.1) 97%, rgba(0, 0, 0, 0.05) 98.5%, transparent 100%)';
    
    const observer = new MutationObserver(() => {
        if (mainImage) {
            // Verificar y restaurar el mask-image si se perdió
            const currentMask = mainImage.style.maskImage || getComputedStyle(mainImage).maskImage;
            if (!currentMask || currentMask === 'none') {
                mainImage.style.setProperty('mask-image', maskGradient, 'important');
                mainImage.style.setProperty('-webkit-mask-image', maskGradient, 'important');
            }
        }
    });
    
    // Observar cambios en los atributos de estilo
    if (mainImage) {
        observer.observe(mainImage, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
    
    // Check if image is already loaded
    if (mainImage.complete && mainImage.naturalHeight !== 0) {
        heroMainImage.classList.add('has-image');
        mainImage.style.opacity = '1';
        mainImage.style.display = 'block';
        enforceImageWidth();
    } else {
        mainImage.addEventListener('load', function() {
            heroMainImage.classList.add('has-image');
            this.style.opacity = '1';
            this.style.display = 'block';
            enforceImageWidth();
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
        enforceImageWidth();
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
        updateCountdownNumber('days', '00');
        updateCountdownNumber('hours', '00');
        updateCountdownNumber('minutes', '00');
        updateCountdownNumber('seconds', '00');
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateCountdownNumber('days', String(days).padStart(2, '0'));
    updateCountdownNumber('hours', String(hours).padStart(2, '0'));
    updateCountdownNumber('minutes', String(minutes).padStart(2, '0'));
    updateCountdownNumber('seconds', String(seconds).padStart(2, '0'));
}

// Función para actualizar números con animación moderna
function updateCountdownNumber(id, newValue) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const currentValue = element.textContent;
    if (currentValue === newValue) return;
    
    // Agregar clase de animación
    element.classList.add('countdown-updating');
    
    // Cambiar el valor después de un breve delay para la animación
    setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove('countdown-updating');
    }, 150);
}

// Función para actualizar labels en móvil
function updateCountdownLabels() {
    const minutesLabel = document.querySelector('.countdown-item:nth-child(3) .countdown-label');
    const secondsLabel = document.querySelector('.countdown-item:nth-child(4) .countdown-label');
    
    if (window.innerWidth <= 768) {
        if (minutesLabel && minutesLabel.textContent === 'Minutos') {
            minutesLabel.textContent = 'Min';
        }
        if (secondsLabel && secondsLabel.textContent === 'Segundos') {
            secondsLabel.textContent = 'Seg';
        }
    } else {
        if (minutesLabel && minutesLabel.textContent === 'Min') {
            minutesLabel.textContent = 'Minutos';
        }
        if (secondsLabel && secondsLabel.textContent === 'Seg') {
            secondsLabel.textContent = 'Segundos';
        }
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Actualizar labels en móvil
updateCountdownLabels();
window.addEventListener('resize', updateCountdownLabels);

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
            } else if (element.classList.contains('announcement-image')) {
                // Para la imagen de anuncio, mantener dentro del contenedor sin parallax excesivo
                // Solo un parallax muy sutil
                const yPos = -(scrolled * speed * 0.3);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                // Asegurar que mantenga el ancho
                element.style.width = '100%';
                element.style.left = '0';
                
                // NO mover el contenido del texto - debe quedarse fijo para que el gradiente cubra toda la imagen
            } else {
                // Para otras imágenes con parallax completo
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
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
        // Remove menu-open class from home icon
        if (menuToggle) {
            menuToggle.classList.remove('menu-open');
        }
        // Enable scroll
        document.body.style.overflow = '';
    } else {
        // Open menu
        sideMenu.classList.add('active');
        if (menuOverlay) {
            menuOverlay.classList.add('active');
        }
        // Add menu-open class to home icon
        if (menuToggle) {
            menuToggle.classList.add('menu-open');
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
            if (menuToggle) {
                menuToggle.classList.remove('menu-open');
            }
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
            if (menuToggle) {
                menuToggle.classList.remove('menu-open');
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

if (rsvpYesBtn && rsvpNoBtn && rsvpMessage) {
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
}

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

// Photo Gallery Lightbox
(function initPhotoGallery() {
    const cards = document.querySelectorAll('.photo-card');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('galleryLightboxImage');
    const closeBtn = document.getElementById('galleryClose');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const counter = document.getElementById('galleryCounter');

    if (!cards.length || !lightbox || !lightboxImage || !closeBtn || !prevBtn || !nextBtn || !counter) {
        return;
    }

    const imageSources = Array.from(cards).map((card) => {
        const img = card.querySelector('img');
        return img ? img.getAttribute('src') : '';
    }).filter(Boolean);

    let currentIndex = 0;

    function renderImage(index) {
        currentIndex = (index + imageSources.length) % imageSources.length;
        lightboxImage.src = imageSources[currentIndex];
        lightboxImage.alt = `Foto ampliada ${currentIndex + 1}`;
        counter.textContent = `${currentIndex + 1} / ${imageSources.length}`;
    }

    function openLightbox(index) {
        renderImage(index);
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', () => openLightbox(index));
    });

    prevBtn.addEventListener('click', () => renderImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => renderImage(currentIndex + 1));
    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('active')) return;

        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') renderImage(currentIndex - 1);
        if (event.key === 'ArrowRight') renderImage(currentIndex + 1);
    });
})();