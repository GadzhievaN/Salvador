// Карусель
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn-next');
    const prevButton = document.querySelector('.carousel-btn-prev');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    
    // Функция для обновления карусели
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Обновляем индикаторы
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Следующий слайд
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });
    
    // Предыдущий слайд
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
    
    // Клик по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Автоматическая прокрутка каждые 5 секунд
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }, 5000);
});