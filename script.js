document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        document.querySelector('#menu nav ul').classList.toggle('show');
    });

    // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000, // 5 seconds delay between slides
            disableOnInteraction: false, // Continue autoplay after interaction
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Add text and button to each slide
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach(slide => {
        const text = document.createElement('div');
        text.className = 'slide-content';
        text.innerHTML = `
            <div class="slide-text">Your text here</div>
            <a href="mailto:your.email@gmail.com" class="slide-button">Inquire Now</a>
        `;
        slide.appendChild(text);
    });
});
