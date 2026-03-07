// ===== MAXTRAVEL - JavaScript =====

// ===== Telegram Bot Configuration =====
// ВАЖНО: Замените эти значения на свои!
// Создайте бота через @BotFather в Telegram и получите токен
// Chat ID можно узнать через @userinfobot или @getidsbot
const TELEGRAM_CONFIG = {
    botToken: '7681820294:AAE8WM-gtgy3-U0OwTPUrganW2PLZvFGHN8',
    chatId: '-5125497780'
};

// ===== Send Message to Telegram =====
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        
        if (!result.ok) {
            console.error('Telegram API error:', result);
            return false;
        }
        
        console.log('✅ Message sent to Telegram successfully!');
        return true;
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return false;
    }
}

// ===== Analytics Event Tracking =====
function trackEvent(eventName, eventParams = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', eventName, eventParams);
    }
    
    // DataLayer (Google Tag Manager)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': eventName,
        ...eventParams
    });
    
    // Console log for debugging
    console.log('📊 Event:', eventName, eventParams);
}

// Predefined events for advertising
const TrackingEvents = {
    // Contact events
    clickPhone: (phoneNumber) => trackEvent('click_phone', { phone: phoneNumber, method: 'phone' }),
    clickWhatsApp: (phoneNumber) => trackEvent('click_whatsapp', { phone: phoneNumber, method: 'whatsapp' }),
    clickTelegram: (link) => trackEvent('click_telegram', { link: link, method: 'telegram' }),
    clickEmail: (email) => trackEvent('click_email', { email: email, method: 'email' }),
    
    // Conversion events
    clickBookNow: (location) => trackEvent('click_book_now', { location: location, category: 'conversion' }),
    formSubmit: (formType) => trackEvent('form_submit', { form_type: formType, category: 'conversion' }),
    reviewSubmit: (rating) => trackEvent('review_submit', { rating: rating, category: 'engagement' }),
    
    // Engagement events  
    clickService: (serviceName) => trackEvent('click_service', { service: serviceName, category: 'engagement' }),
    clickFleet: (vehicleName) => trackEvent('click_fleet', { vehicle: vehicleName, category: 'engagement' }),
    clickRoute: (route) => trackEvent('click_route', { route: route, category: 'engagement' }),
    viewGallery: (imageName) => trackEvent('view_gallery', { image: imageName, category: 'engagement' }),
    
    // Page events
    scrollToSection: (sectionName) => trackEvent('scroll_to_section', { section: sectionName }),
    languageChange: (lang) => trackEvent('language_change', { language: lang })
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initLanguageSwitcher();
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initContactForm();
    initScrollAnimations();
    initClientCounter();
    initReviewsSlider();
    initReviewModal();
    loadUserReviews();
    initFleetSliders();
    initLightbox();
    initBlogArticles();
    initEventTracking();
});

// ===== Initialize Event Tracking =====
function initEventTracking() {
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            const phone = link.getAttribute('href').replace('tel:', '');
            TrackingEvents.clickPhone(phone);
        });
    });
    
    // Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            const phone = link.getAttribute('href').match(/wa\.me\/(\d+)/)?.[1] || '';
            TrackingEvents.clickWhatsApp(phone);
        });
    });
    
    // Track Telegram clicks
    document.querySelectorAll('a[href*="t.me"]').forEach(link => {
        link.addEventListener('click', () => {
            TrackingEvents.clickTelegram(link.getAttribute('href'));
        });
    });
    
    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            const email = link.getAttribute('href').replace('mailto:', '');
            TrackingEvents.clickEmail(email);
        });
    });
    
    // Track "Book Now" / "Book Transfer" buttons
    document.querySelectorAll('.btn-primary[href="#contact"], .btn-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const location = btn.closest('section')?.id || 'header';
            TrackingEvents.clickBookNow(location);
        });
    });
    
    // Track service card clicks
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.querySelector('.service-title')?.textContent || 'unknown';
            TrackingEvents.clickService(serviceName);
        });
    });
    
    // Track fleet card clicks
    document.querySelectorAll('.fleet-card .fleet-info').forEach(card => {
        card.addEventListener('click', () => {
            const vehicleName = card.querySelector('.fleet-name')?.textContent || 'unknown';
            TrackingEvents.clickFleet(vehicleName);
        });
    });
    
    // Track route clicks
    document.querySelectorAll('.route-item').forEach(route => {
        route.addEventListener('click', () => {
            const from = route.querySelector('.route-from')?.textContent || '';
            const to = route.querySelector('.route-to')?.textContent || '';
            TrackingEvents.clickRoute(`${from} → ${to}`);
        });
    });
    
    // Track navigation / scroll to sections
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const section = link.getAttribute('href')?.replace('#', '') || '';
            TrackingEvents.scrollToSection(section);
        });
    });
    
    // Track social media clicks
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', () => {
            const platform = link.getAttribute('aria-label') || 'social';
            trackEvent('click_social', { platform: platform });
        });
    });
    
    console.log('📊 Event tracking initialized!');
}

// ===== Dynamic Client Counter =====
function initClientCounter() {
    // Start date: January 14, 2026
    const startDate = new Date('2026-01-14');
    const baseClients = 5000;
    const dailyIncrease = 10;
    
    // Calculate days since start
    const today = new Date();
    const timeDiff = today - startDate;
    const daysPassed = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
    
    // Calculate total clients
    const totalClients = baseClients + (daysPassed * dailyIncrease);
    
    // Find and update the client counter
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        if (stat.textContent.includes('5000')) {
            stat.textContent = totalClients.toLocaleString() + '+';
            
            // Animate the number counting up
            animateCounter(stat, totalClients);
        }
    });
}

// Animate counter from 0 to target
function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toLocaleString() + '+';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== Blog Articles =====
function initBlogArticles() {
    const readMoreLinks = document.querySelectorAll('.blog-card-link');
    const fullArticles = document.querySelectorAll('.blog-full-article');
    const articlesSection = document.querySelector('.blog-articles-section');
    
    if (!readMoreLinks.length) return; // Not on blog page
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            const targetArticle = document.getElementById(targetId);
            
            if (targetArticle) {
                // Hide all articles first
                fullArticles.forEach(article => article.classList.remove('active'));
                
                // Show target article
                targetArticle.classList.add('active');
                
                // Scroll to article with offset for header
                setTimeout(() => {
                    const headerOffset = 100;
                    const elementPosition = targetArticle.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });
    
    // Handle direct URL with hash
    if (window.location.hash) {
        const targetId = window.location.hash.replace('#', '');
        const targetArticle = document.getElementById(targetId);
        if (targetArticle && targetArticle.classList.contains('blog-full-article')) {
            targetArticle.classList.add('active');
            setTimeout(() => {
                targetArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
    
    // Add back to articles button
    fullArticles.forEach(article => {
        const backBtn = document.createElement('button');
        backBtn.className = 'back-to-articles';
        backBtn.innerHTML = '← Back to Articles';
        backBtn.setAttribute('data-en', '← Back to Articles');
        backBtn.setAttribute('data-cz', '← Zpět na články');
        backBtn.setAttribute('data-ua', '← Назад до статей');
        backBtn.onclick = () => {
            article.classList.remove('active');
            const blogGrid = document.querySelector('.blog-grid');
            if (blogGrid) {
                blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            history.pushState(null, '', window.location.pathname);
        };
        article.insertBefore(backBtn, article.firstChild);
    });
}

// ===== Language Switcher =====
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en]');
    const placeholderElements = document.querySelectorAll('[data-placeholder-en]');
    
    // Get saved language or default to English
    let currentLang = localStorage.getItem('maxtravel-lang') || 'en';
    
    // Set initial language
    setLanguage(currentLang);
    
    // Add click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('maxtravel-lang', lang);
            
            // Track language change
            TrackingEvents.languageChange(lang);
        });
    });
    
    function setLanguage(lang) {
        // Update button states
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Re-select all translatable elements (including dynamically added)
        const allTranslatable = document.querySelectorAll('[data-en]');
        const allPlaceholders = document.querySelectorAll('[data-placeholder-en]');
        
        // Update text content
        allTranslatable.forEach(el => {
            const text = el.dataset[lang] || el.dataset['en']; // fallback to English
            if (text) {
                el.textContent = text;
            }
        });
        
        // Update placeholders
        allPlaceholders.forEach(el => {
            const placeholder = el.dataset[`placeholder${lang.charAt(0).toUpperCase() + lang.slice(1)}`] 
                || el.dataset['placeholderEn'];
            if (placeholder) {
                el.placeholder = placeholder;
            }
        });
        
        // Update HTML lang attribute
        const langMap = { 'cz': 'cs', 'ua': 'uk', 'en': 'en' };
        document.documentElement.lang = langMap[lang] || 'en';
        
        // Update AI Chat welcome message if exists
        updateAIChatLanguage(lang);
    }
    
    // Make setLanguage globally accessible
    window.setCurrentLanguage = setLanguage;
}

// Update AI Chat language
function updateAIChatLanguage(lang) {
    const aiBubbleText = document.getElementById('aiBubbleText');
    const aiWelcome = document.querySelector('.ai-message-text');
    
    const messages = {
        bubble: {
            en: "Need help with booking?",
            cz: "Potřebujete pomoct s rezervací?",
            ua: "Потрібна допомога з бронюванням?"
        },
        welcome: {
            en: "Hello! I'm Max, your MAXTRAVEL assistant 🚐 How can I help you today? Airport transfer, city tour, or something else?",
            cz: "Ahoj! Jsem Max, váš asistent MAXTRAVEL 🚐 Jak vám mohu dnes pomoci? Letištní transfer, prohlídka města nebo něco jiného?",
            ua: "Привіт! Я Макс, ваш асистент MAXTRAVEL 🚐 Чим можу допомогти сьогодні? Трансфер в аеропорт, тур містом чи щось інше?"
        }
    };
    
    if (aiBubbleText && messages.bubble[lang]) {
        aiBubbleText.textContent = messages.bubble[lang];
    }
    
    if (aiWelcome && messages.welcome[lang]) {
        aiWelcome.textContent = messages.welcome[lang];
    }
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Get current language for messages
        const currentLang = localStorage.getItem('maxtravel-lang') || 'en';
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'cz' ? 'Odesílání...' : 'Sending...';
        
        try {
            // Format message for Telegram
            const telegramMessage = `
🚐 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

👤 <b>Имя:</b> ${data.name || 'Не указано'}
📱 <b>Телефон:</b> ${data.phone || 'Не указан'}
🛣 <b>Маршрут:</b> ${data.route || 'Не указан'}
📅 <b>Дата:</b> ${data.date || 'Не указана'}
👥 <b>Пассажиры:</b> ${data.passengers || 'Не указано'}
💬 <b>Сообщение:</b> ${data.message || 'Нет'}

⏰ <i>Время заявки: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Prague' })}</i>
            `.trim();
            
            // Send to Telegram
            const telegramSent = await sendToTelegram(telegramMessage);
            
            if (!telegramSent) {
                throw new Error('Failed to send to Telegram');
            }
            
            // Track conversion event
            TrackingEvents.formSubmit('contact_form');
            
            console.log('Form submitted and sent to Telegram:', data);

            // Redirect to thank-you page (triggers Google Ads conversion)
            window.location.href = '/thank-you.html';
            
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            alert(currentLang === 'cz' 
                ? 'Chyba při odesílání. Zkuste to prosím znovu.' 
                : 'Error sending. Please try again.');
        }
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .fleet-card, .review-card, .country-item, .route-item, .feature-item'
    );
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== Active Navigation Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Initialize active nav link tracking
updateActiveNavLink();

// ===== Reviews Slider =====
function initReviewsSlider() {
    const slider = document.querySelector('.reviews-compact-slider');
    if (!slider) return;
    
    // Clone all review items for seamless infinite scroll
    const reviews = slider.querySelectorAll('.review-mini');
    reviews.forEach(review => {
        const clone = review.cloneNode(true);
        slider.appendChild(clone);
    });
}

// ===== Fleet Image Sliders =====
function initFleetSliders() {
    const sliders = document.querySelectorAll('.fleet-image-slider');
    
    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const images = track.querySelectorAll('img');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        if (images.length <= 1) {
            // Hide controls if only one image
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }
        
        let currentIndex = 0;
        
        // Create dots
        images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        
        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % images.length;
            goToSlide(currentIndex);
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            goToSlide(currentIndex);
        }
        
        // Button handlers
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        }
    });
}

// ===== Review Modal =====
function initReviewModal() {
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReviewModal');
    const closeBtn = document.getElementById('closeReviewModal');
    const form = document.getElementById('reviewForm');
    
    if (!modal || !openBtn || !form) return;
    
    // Open modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const currentLang = localStorage.getItem('maxtravel-lang') || 'en';
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'cz' ? 'Odesílání...' : 'Sending...';
        
        const review = {
            id: Date.now(),
            name: formData.get('reviewName'),
            city: formData.get('reviewCity'),
            rating: parseInt(formData.get('rating')),
            text: formData.get('reviewText'),
            date: new Date().toISOString(),
            isNew: true
        };
        
        try {
            // Save to Firebase
            await saveReview(review);
            
            // Track review submission
            TrackingEvents.reviewSubmit(review.rating);
            
            // Show success message
            form.innerHTML = `
                <div class="form-success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <h4>${currentLang === 'cz' ? 'Děkujeme za recenzi!' : 'Thank you for your review!'}</h4>
                    <p>${currentLang === 'cz' ? 'Vaše recenze byla úspěšně odeslána.' : 'Your review has been successfully submitted.'}</p>
                </div>
            `;
            
            // Close modal after 2 seconds
            setTimeout(() => {
                closeModal();
                // Reload page to show new review
                setTimeout(() => {
                    location.reload();
                }, 300);
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            alert(currentLang === 'cz' ? 'Chyba při odesílání. Zkuste to znovu.' : 'Error sending. Please try again.');
        }
    });
}

// ===== Save Review to Firebase =====
async function saveReview(review) {
    // Wait for Firebase to be ready
    if (!window.firebaseDB) {
        console.log('Waiting for Firebase...');
        await new Promise(resolve => {
            window.addEventListener('firebaseReady', resolve, { once: true });
        });
    }
    
    try {
        const db = window.firebaseDB;
        const addDoc = window.firebaseAddDoc;
        const collection = window.firebaseCollection;
        
        await addDoc(collection(db, 'reviews'), {
            name: review.name,
            city: review.city,
            rating: review.rating,
            text: review.text,
            date: review.date,
            createdAt: new Date()
        });
        
        console.log('Review saved to Firebase!');
        
        // Send review notification to Telegram
        const stars = '⭐'.repeat(review.rating);
        const telegramMessage = `
📝 <b>НОВЫЙ ОТЗЫВ НА САЙТЕ</b>

${stars} (${review.rating}/5)

👤 <b>Автор:</b> ${review.name}
📍 <b>Город:</b> ${review.city}

💬 <b>Отзыв:</b>
"${review.text}"

⏰ <i>Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Prague' })}</i>
        `.trim();
        
        await sendToTelegram(telegramMessage);
        
    } catch (error) {
        console.error('Error saving review:', error);
        // Fallback to localStorage
        let reviews = JSON.parse(localStorage.getItem('maxtravel-reviews') || '[]');
        reviews.unshift(review);
        localStorage.setItem('maxtravel-reviews', JSON.stringify(reviews));
    }
}

// ===== Load User Reviews from Firebase =====
async function loadUserReviews() {
    const container = document.querySelector('.reviews-compact .container');
    const currentLang = localStorage.getItem('maxtravel-lang') || 'en';
    
    if (!container) return;
    
    // Wait for Firebase to be ready
    if (!window.firebaseDB) {
        window.addEventListener('firebaseReady', () => loadUserReviews(), { once: true });
        return;
    }
    
    try {
        const db = window.firebaseDB;
        const getDocs = window.firebaseGetDocs;
        const collection = window.firebaseCollection;
        const query = window.firebaseQuery;
        const orderBy = window.firebaseOrderBy;
        const limit = window.firebaseLimit;
        
        // Get reviews from Firebase, ordered by date, limit 20
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        
        if (reviews.length === 0) return;
        
        // Remove existing user reviews section if any
        const existingSection = container.querySelector('.user-reviews-section');
        if (existingSection) {
            existingSection.remove();
        }
        
        // Create user reviews section
        const section = document.createElement('div');
        section.className = 'user-reviews-section';
        section.innerHTML = `
            <h4 class="user-reviews-title" data-en="Recent Reviews from Our Clients" data-cz="Nedávné recenze od našich klientů">
                ${currentLang === 'cz' ? 'Nedávné recenze od našich klientů' : 'Recent Reviews from Our Clients'}
            </h4>
            <div class="user-reviews-grid">
                ${reviews.map(review => createReviewCard(review, currentLang)).join('')}
            </div>
        `;
        
        container.appendChild(section);
        
    } catch (error) {
        console.error('Error loading reviews from Firebase:', error);
        // Fallback to localStorage
        loadLocalReviews();
    }
}

// ===== Fallback: Load from localStorage =====
function loadLocalReviews() {
    const reviews = JSON.parse(localStorage.getItem('maxtravel-reviews') || '[]');
    const container = document.querySelector('.reviews-compact .container');
    const currentLang = localStorage.getItem('maxtravel-lang') || 'en';
    
    if (!container || reviews.length === 0) return;
    
    const existingSection = container.querySelector('.user-reviews-section');
    if (existingSection) existingSection.remove();
    
    const section = document.createElement('div');
    section.className = 'user-reviews-section';
    section.innerHTML = `
        <h4 class="user-reviews-title">${currentLang === 'cz' ? 'Nedávné recenze od našich klientů' : 'Recent Reviews from Our Clients'}</h4>
        <div class="user-reviews-grid">
            ${reviews.map(review => createReviewCard(review, currentLang)).join('')}
        </div>
    `;
    
    container.appendChild(section);
}

// ===== Create Review Card HTML =====
function createReviewCard(review, lang) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const date = new Date(review.date);
    const formattedDate = date.toLocaleDateString(lang === 'cz' ? 'cs-CZ' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const newBadge = review.isNew ? `<span class="new-badge">${lang === 'cz' ? 'Nová' : 'New'}</span>` : '';
    
    return `
        <div class="user-review-card">
            <div class="user-review-header">
                <div>
                    <div class="user-review-author">${escapeHtml(review.name)}${newBadge}</div>
                    <div class="user-review-city">${escapeHtml(review.city)}</div>
                </div>
                <div class="user-review-stars">${stars}</div>
            </div>
            <p class="user-review-text">"${escapeHtml(review.text)}"</p>
            <div class="user-review-date">${formattedDate}</div>
        </div>
    `;
}

// ===== Escape HTML to prevent XSS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Image Lightbox =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCurrent = document.getElementById('lightboxCurrent');
    const lightboxTotal = document.getElementById('lightboxTotal');
    
    let currentImages = [];
    let currentIndex = 0;
    
    // Add click handlers to all slider images
    document.querySelectorAll('.fleet-image-slider .slider-track img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Get all images from this slider
            const slider = img.closest('.fleet-image-slider');
            const allImages = slider.querySelectorAll('.slider-track img');
            
            currentImages = Array.from(allImages).map(i => i.src);
            currentIndex = Array.from(allImages).indexOf(img);
            
            openLightbox();
        });
    });
    
    function openLightbox() {
        lightboxImg.src = currentImages[currentIndex];
        lightboxTotal.textContent = currentImages.length;
        lightboxCurrent.textContent = currentIndex + 1;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Track gallery view
        const imageName = currentImages[currentIndex].split('/').pop();
        TrackingEvents.viewGallery(imageName);
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateImage();
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateImage();
    }
    
    function updateImage() {
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            lightboxImg.src = currentImages[currentIndex];
            lightboxCurrent.textContent = currentIndex + 1;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                showNext();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
    }, { passive: true });
    
    // Add transition to lightbox image
    lightboxImg.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
}

// ===== Preloader (optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});


// ===== AI Chat Widget =====
function initAIChat() {
    const chatWidget = document.getElementById('aiChatWidget');
    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const chatClose = document.getElementById('aiChatClose');
    const chatInput = document.getElementById('aiChatInput');
    const chatMessages = document.getElementById('aiChatMessages');
    const sendBtn = document.getElementById('aiSendBtn');
    const quickBtns = document.querySelectorAll('.ai-quick-btn');
    const aiBubble = document.getElementById('aiBubble');
    const aiBubbleText = document.getElementById('aiBubbleText');
    const aiBubbleClose = document.getElementById('aiBubbleClose');
    
    // Welcome Banner Elements
    const welcomeBanner = document.getElementById('aiWelcomeBanner');
    const welcomeClose = document.getElementById('welcomeClose');
    
    if (!chatWidget || !chatBtn || !chatWindow) return;
    
    let isOpen = false;
    let bubbleShown = false;
    let bubbleDismissed = false;
    let lastTrigger = null;
    let welcomeShown = !sessionStorage.getItem('maxtravel-welcome-shown');
    
    // Initialize Welcome Banner
    if (welcomeBanner && welcomeShown) {
        // Hide banner initially, show after 7 seconds
        welcomeBanner.style.opacity = '0';
        welcomeBanner.style.pointerEvents = 'none';
        
        setTimeout(() => {
            // Don't show if chat is already open
            if (isOpen) {
                welcomeBanner.classList.add('hidden');
                sessionStorage.setItem('maxtravel-welcome-shown', 'true');
                return;
            }
            
            welcomeBanner.style.opacity = '';
            welcomeBanner.style.pointerEvents = '';
            welcomeBanner.classList.add('appearing');
            
            // Auto-collapse after 5 seconds of being visible
            setTimeout(() => {
                if (welcomeBanner && !welcomeBanner.classList.contains('hidden')) {
                    collapseWelcomeBanner();
                }
            }, 5000);
        }, 7000);
        
        // Close button
        if (welcomeClose) {
            welcomeClose.addEventListener('click', () => {
                collapseWelcomeBanner();
            });
        }
        
        // Click on banner - open chat
        welcomeBanner.addEventListener('click', (e) => {
            if (e.target.classList.contains('welcome-close')) return;
            welcomeBanner.classList.add('hidden');
            sessionStorage.setItem('maxtravel-welcome-shown', 'true');
            isOpen = true;
            toggleChat();
        });
    } else if (welcomeBanner) {
        welcomeBanner.classList.add('hidden');
    }
    
    function collapseWelcomeBanner() {
        if (!welcomeBanner) return;
        welcomeBanner.classList.add('collapsing');
        sessionStorage.setItem('maxtravel-welcome-shown', 'true');
        
        // Add splash effect when droplet lands
        setTimeout(() => {
            chatBtn.classList.add('splash-ready');
            setTimeout(() => {
                chatBtn.classList.remove('splash-ready');
                chatBtn.classList.add('pulse-highlight');
            }, 600);
        }, 500);
        
        setTimeout(() => {
            welcomeBanner.classList.add('hidden');
            welcomeBanner.classList.remove('collapsing');
            
            // Remove highlight after a moment
            setTimeout(() => {
                chatBtn.classList.remove('pulse-highlight');
            }, 1500);
        }, 800);
    }
    
    // Get current language
    const lang = () => localStorage.getItem('maxtravel-lang') || 'en';
    
    // Proactive messages
    const proactiveMessages = {
        welcome: {
            en: "Hello! 👋 I'm Max, your travel assistant. Need help with a transfer?",
            cz: "Ahoj! 👋 Jsem Max, váš cestovní asistent. Potřebujete pomoct s transferem?",
            ua: "Привіт! 👋 Я Max, ваш асистент. Потрібна допомога з трансфером?"
        },
        fleet: {
            en: "Looking at our vehicles? 🚐 I can help you choose the perfect one!",
            cz: "Prohlížíte si naše vozidla? 🚐 Pomohu vám vybrat to pravé!",
            ua: "Переглядаєте наші авто? 🚐 Допоможу обрати ідеальне!"
        },
        routes: {
            en: "Planning a trip? 🗺️ Tell me your destination and I'll help!",
            cz: "Plánujete cestu? 🗺️ Řekněte mi kam a já pomohu!",
            ua: "Плануєте поїздку? 🗺️ Скажіть куди і я допоможу!"
        },
        contact: {
            en: "Ready to book? 📞 I can guide you through the process!",
            cz: "Připraveni k rezervaci? 📞 Provedu vás procesem!",
            ua: "Готові бронювати? 📞 Проведу вас через процес!"
        },
        scroll: {
            en: "Like what you see? 😊 Any questions? I'm here to help!",
            cz: "Líbí se vám? 😊 Máte dotazy? Jsem tu pro vás!",
            ua: "Подобається? 😊 Є питання? Я тут щоб допомогти!"
        },
        idle: {
            en: "Still browsing? 🤔 Let me help you find what you need!",
            cz: "Stále hledáte? 🤔 Pomohu vám najít, co potřebujete!",
            ua: "Ще шукаєте? 🤔 Допоможу знайти те, що потрібно!"
        }
    };
    
    // Show bubble
    function showBubble(messageKey) {
        if (bubbleDismissed || isOpen || !aiBubble) return;
        if (lastTrigger === messageKey) return;
        
        lastTrigger = messageKey;
        const message = proactiveMessages[messageKey];
        if (!message) return;
        
        aiBubbleText.textContent = message[lang()] || message['en'];
        aiBubble.classList.add('active');
        
        setTimeout(() => {
            aiBubble.classList.add('bounce');
            setTimeout(() => aiBubble.classList.remove('bounce'), 500);
        }, 300);
        
        bubbleShown = true;
        
        setTimeout(() => {
            if (!isOpen) hideBubble();
        }, 8000);
    }
    
    function hideBubble() {
        if (aiBubble) aiBubble.classList.remove('active');
    }
    
    // Bubble click opens chat
    if (aiBubble) {
        aiBubble.addEventListener('click', (e) => {
            if (e.target === aiBubbleClose) return;
            isOpen = true;
            toggleChat();
            hideBubble();
        });
    }
    
    // Bubble close
    if (aiBubbleClose) {
        aiBubbleClose.addEventListener('click', (e) => {
            e.stopPropagation();
            hideBubble();
            bubbleDismissed = true;
        });
    }
    
    // Welcome after 4 seconds
    setTimeout(() => {
        if (!sessionStorage.getItem('max-welcomed')) {
            showBubble('welcome');
            sessionStorage.setItem('max-welcomed', 'true');
        }
    }, 4000);
    
    // Section observers
    const sectionTriggers = {
        'fleet': 'fleet',
        'routes': 'routes',
        'contact': 'contact'
    };
    
    Object.keys(sectionTriggers).forEach(sectionId => {
        const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
        if (!section) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !bubbleDismissed && !isOpen) {
                    setTimeout(() => showBubble(sectionTriggers[sectionId]), 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(section);
    });
    
    // 50% scroll trigger
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
        if (scrollTriggered || bubbleDismissed || isOpen) return;
        
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50) {
            scrollTriggered = true;
            setTimeout(() => showBubble('scroll'), 1500);
        }
    });
    
    // Idle trigger
    let idleTimer;
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if (!bubbleDismissed && !isOpen && !bubbleShown) {
                showBubble('idle');
            }
        }, 30000);
    }
    
    ['mousemove', 'scroll', 'click', 'keypress'].forEach(event => {
        document.addEventListener(event, resetIdleTimer, { passive: true });
    });
    resetIdleTimer();
    
    // Toggle chat
    chatBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        toggleChat();
    });
    
    chatClose?.addEventListener('click', () => {
        isOpen = false;
        toggleChat();
    });
    
    function toggleChat() {
        chatWindow.classList.toggle('active', isOpen);
        chatBtn.classList.toggle('hidden', isOpen);
        
        if (isOpen && chatInput) {
            setTimeout(() => chatInput.focus(), 300);
        }
    }
    
    // Send message
    async function sendMessage(text) {
        if (!text.trim()) return;
        
        const quickActions = chatMessages.querySelector('.ai-quick-actions');
        if (quickActions) quickActions.style.display = 'none';
        
        addMessage(text, 'user');
        if (chatInput) chatInput.value = '';
        
        showTyping();
        
        try {
            const response = await getAIResponse(text);
            hideTyping();
            addMessage(response, 'bot');
        } catch (error) {
            hideTyping();
            addMessage(lang() === 'cz' 
                ? 'Došlo k chybě. Zkuste to prosím znovu.' 
                : 'An error occurred. Please try again.', 'bot');
        }
    }
    
    // Car data for displaying in chat
    const carData = {
        ford: {
            id: 'ford',
            name: 'Ford Transit Custom',
            year: '2022',
            image: 'images/bus1.jpg',
            seats: '8+1',
            features: {
                en: ['Climate Control', 'Wi-Fi', 'USB Charging'],
                cz: ['Klimatizace', 'Wi-Fi', 'USB nabíjení'],
                ua: ['Кондиціонер', 'Wi-Fi', 'USB зарядка']
            },
            ideal: {
                en: 'Airports, City Tours',
                cz: 'Letiště, Městské výlety',
                ua: 'Аеропорти, Екскурсії'
            }
        },
        renault1: {
            id: 'renault1',
            name: 'Renault Trafic #1',
            year: '2025',
            image: 'images/bus2.jpg',
            seats: '8+1',
            features: {
                en: ['Climate Control', 'Premium Interior', 'Comfort Seats'],
                cz: ['Klimatizace', 'Prémiový interiér', 'Komfortní sedadla'],
                ua: ['Кондиціонер', 'Преміальний салон', 'Комфортні сидіння']
            },
            ideal: {
                en: 'VIP, Business',
                cz: 'VIP, Business',
                ua: 'VIP, Бізнес'
            }
        },
        renault2: {
            id: 'renault2',
            name: 'Renault Trafic #2',
            year: '2024',
            image: 'images/bus3.jpg',
            seats: '8+1',
            features: {
                en: ['Climate Control', 'Premium Interior', 'Comfort Seats'],
                cz: ['Klimatizace', 'Prémiový interiér', 'Komfortní sedadla'],
                ua: ['Кондиціонер', 'Преміальний салон', 'Комфортні сидіння']
            },
            ideal: {
                en: 'VIP, Business',
                cz: 'VIP, Business',
                ua: 'VIP, Бізнес'
            }
        },
        renault3: {
            id: 'renault3',
            name: 'Renault Trafic #3',
            year: '2025',
            image: 'images/bus2.jpg',
            seats: '8+1',
            features: {
                en: ['Climate Control', 'Premium Interior', 'Comfort Seats'],
                cz: ['Klimatizace', 'Prémiový interiér', 'Komfortní sedadla'],
                ua: ['Кондиціонер', 'Преміальний салон', 'Комфортні сидіння']
            },
            ideal: {
                en: 'VIP, Business',
                cz: 'VIP, Business',
                ua: 'VIP, Бізнес'
            }
        }
    };

    function createCarCard(car) {
        const currentLang = lang();
        const features = car.features[currentLang] || car.features.en;
        const ideal = car.ideal[currentLang] || car.ideal.en;
        
        const bookText = {
            en: 'Book Now',
            cz: 'Rezervovat',
            ua: 'Забронювати'
        };
        
        const detailsText = {
            en: 'Details',
            cz: 'Detaily',
            ua: 'Деталі'
        };
        
        return `
            <div class="ai-car-card" data-car="${car.id}">
                <img src="${car.image}" alt="${car.name}" class="ai-car-image" loading="lazy">
                <div class="ai-car-info">
                    <div class="ai-car-header">
                        <h4 class="ai-car-name">${car.name}</h4>
                        <span class="ai-car-year">${car.year}</span>
                    </div>
                    <div class="ai-car-specs">
                        <span class="ai-car-spec">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            ${car.seats}
                        </span>
                        <span class="ai-car-spec">✓ ${ideal}</span>
                    </div>
                    <div class="ai-car-features">
                        ${features.map(f => `<span class="ai-car-feature">${f}</span>`).join('')}
                    </div>
                    <div class="ai-car-cta">
                        <button class="ai-car-btn ai-car-btn-primary" onclick="document.getElementById('aiChatInput').value='${currentLang === 'ua' ? 'Хочу забронювати ' : currentLang === 'cz' ? 'Chci rezervovat ' : 'I want to book '}${car.name}'; document.getElementById('aiSendBtn').click();">
                            ${bookText[currentLang] || bookText.en}
                        </button>
                        <button class="ai-car-btn ai-car-btn-secondary" onclick="document.querySelector('[href=\\'#fleet\\']').click(); document.getElementById('aiChatWindow').classList.remove('active');">
                            ${detailsText[currentLang] || detailsText.en}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function parseCarTags(text) {
        const carTagRegex = /\[SHOW_CAR:(ford|renault|all)\]/gi;
        const matches = text.match(carTagRegex);
        const cleanText = text.replace(carTagRegex, '').trim();
        
        let carsToShow = [];
        if (matches) {
            matches.forEach(match => {
                const carId = match.match(/:(ford|renault|all)/i)[1].toLowerCase();
                if (carId === 'all') {
                    carsToShow = Object.values(carData);
                } else if (carId === 'ford') {
                    if (!carsToShow.find(c => c.id === 'ford')) carsToShow.push(carData.ford);
                } else if (carId === 'renault') {
                    // Show all Renault vehicles
                    ['renault1', 'renault2', 'renault3'].forEach(rId => {
                        if (carData[rId] && !carsToShow.find(c => c.id === rId)) {
                            carsToShow.push(carData[rId]);
                        }
                    });
                }
            });
        }
        
        return { cleanText, carsToShow };
    }

    function addMessage(text, type) {
        const time = new Date().toLocaleTimeString(lang() === 'cz' ? 'cs-CZ' : 'en-US', { 
            hour: '2-digit', minute: '2-digit' 
        });
        
        let displayText = text;
        let carCards = '';
        
        // Parse car tags only for bot messages
        if (type === 'bot') {
            const parsed = parseCarTags(text);
            displayText = parsed.cleanText;
            
            if (parsed.carsToShow.length > 0) {
                carCards = `<div class="ai-car-cards">${parsed.carsToShow.map(car => createCarCard(car)).join('')}</div>`;
            }
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${type}`;
        messageDiv.innerHTML = `
            <div class="ai-message-content"><p>${displayText}</p>${carCards}</div>
            <span class="ai-message-time">${time}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-message-bot ai-typing-wrapper';
        typingDiv.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
        typingDiv.id = 'aiTyping';
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    function hideTyping() {
        const typing = document.getElementById('aiTyping');
        if (typing) typing.remove();
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    let conversationHistory = [];
    
    async function getAIResponse(userMessage) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: conversationHistory,
                    language: lang()
                })
            });
            
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            
            conversationHistory.push({ role: 'user', content: userMessage });
            conversationHistory.push({ role: 'assistant', content: data.message });
            
            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-20);
            }
            
            return data.message;
            
        } catch (error) {
            console.error('AI API Error:', error);
            return lang() === 'cz' 
                ? 'Omlouváme se, došlo k problému. Kontaktujte nás prosím přímo: +420 735 103 830 📞'
                : 'Sorry, there was an issue. Please contact us directly: +420 735 103 830 📞';
        }
    }
    
    // Event listeners
    sendBtn?.addEventListener('click', () => sendMessage(chatInput.value));
    
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(chatInput.value);
        }
    });
    
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentLang = lang();
            const messageKey = `message${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`;
            const message = btn.dataset[messageKey] || btn.dataset.messageEn;
            sendMessage(message);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            isOpen = false;
            toggleChat();
        }
    });
}

// Initialize AI Chat
initAIChat();

// ===== Video Modal =====
function initVideoModal() {
    const videoBtn = document.getElementById('videoFloatBtn');
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    const closeBtn = document.getElementById('videoModalCloseBtn');
    const overlay = document.getElementById('videoModalClose');
    
    const YOUTUBE_VIDEO_ID = 'FWaTxFYvH4Y';
    const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`;
    
    if (!videoBtn || !videoModal) return;
    
    function openModal() {
        videoModal.classList.add('active');
        videoIframe.src = YOUTUBE_EMBED_URL;
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        videoModal.classList.remove('active');
        videoIframe.src = '';
        document.body.style.overflow = '';
    }
    
    videoBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeModal();
        }
    });
}

initVideoModal();
