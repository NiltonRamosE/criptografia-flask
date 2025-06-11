document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-left, .animate-slide-right');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Smooth scrolling for anchor links
    const smoothScroll = function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    // Initialize functions
    animateOnScroll();
    smoothScroll();
    
    // Hero section animations
    const title = document.querySelector('.title');
    const subtitle = document.querySelector('.subtitle');
    
    setTimeout(() => {
        title.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
        subtitle.style.opacity = '1';
    }, 600);
    
    // Card hover effect enhancement
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});