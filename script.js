// ===== CAROUSEL FUNCTIONALITY =====
/**
 * Инициализация карусели с автоматической прокруткой
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
});

function initializeCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn-next');
    const prevButton = document.querySelector('.carousel-btn-prev');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    
    /**
     * Обновляет позицию карусели и индикаторы
     */
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Обновляем индикаторы
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Обработчики событий для кнопок навигации
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });
    
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
    
    // Обработчики для индикаторов
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
}

// ===== ONLINE BOOKING FUNCTIONALITY =====

// Глобальные переменные для процесса записи
let currentStep = 1;
let selectedService = '';
let selectedServicePrice = 0;
let selectedDate = '';
let selectedTime = '';

/**
 * Открывает модальное окно онлайн-записи
 */
function openBookingModal() {
    document.getElementById('bookingModal').style.display = 'block';
    resetBookingForm();
}

/**
 * Закрывает модальное окно онлайн-записи
 */
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

/**
 * Сбрасывает форму записи к начальному состоянию
 */
function resetBookingForm() {
    currentStep = 1;
    selectedService = '';
    selectedServicePrice = 0;
    selectedDate = '';
    selectedTime = '';
    
    // Показываем первый шаг
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
}

/**
 * Выбирает услугу для записи
 * @param {string} service - Название услуги
 * @param {number} price - Цена услуги
 */
function selectService(service, price) {
    selectedService = service;
    selectedServicePrice = price;
    
    // Визуальное выделение выбранной услуги
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Добавляем класс selected к выбранной услуге
    event.currentTarget.classList.add('selected');
}

/**
 * Переход к следующему шагу записи
 */
function nextStep() {
    // Валидация шага 1
    if (currentStep === 1 && !selectedService) {
        alert('Пожалуйста, выберите услугу');
        return;
    }
    
    // Валидация шага 2
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
        alert('Пожалуйста, выберите дату и время');
        return;
    }
    
    // Переход к следующему шагу
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Генерация календаря при переходе к шагу 2
    if (currentStep === 2) {
        generateBookingCalendar();
    }
}

/**
 * Возврат к предыдущему шагу записи
 */
function prevStep() {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
}

/**
 * Генерирует календарь для выбора даты и времени
 */
function generateBookingCalendar() {
    const calendar = document.getElementById('bookingCalendar');
    let html = '<div class="time-grid">';
    
    // Настройки календаря
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    
    // Заголовок времени
    html += '<div class="time-header">Время</div>';
    
    // Заголовки дней
    const today = new Date();
    const currentDay = today.getDay(); // 0-6 (воскресенье-суббота)
    
    // Корректируем для отображения с понедельника
    let startOffset = currentDay === 0 ? 6 : currentDay - 1;
    
    days.forEach((day, index) => {
        const date = new Date();
        date.setDate(today.getDate() + index);
        html += `<div class="day-header">${day}<br>${date.getDate()}.${date.getMonth()+1}</div>`;
    });
    
    // Создание сетки времени
    times.forEach(time => {
        html += `<div class="time-slot">${time}</div>`;
        days.forEach((day, dayIndex) => {
            const slotId = `slot-${dayIndex}-${time}`;
            const isBooked = localStorage.getItem(slotId) === 'booked';
            const slotClass = isBooked ? 'booked' : 'available';
            const slotSymbol = isBooked ? '✗' : '✓';
            
            html += `<div class="slot ${slotClass}" onclick="selectTimeSlot('${slotId}', ${dayIndex}, '${time}')">${slotSymbol}</div>`;
        });
    });
    
    html += '</div>';
    calendar.innerHTML = html;
}

/**
 * Выбирает временной слот для записи
 * @param {string} slotId - ID слота
 * @param {number} dayIndex - Индекс дня
 * @param {string} time - Время
 */
function selectTimeSlot(slotId, dayIndex, time) {
    const slot = document.querySelector(`[onclick="selectTimeSlot('${slotId}', ${dayIndex}, '${time}')"]`);
    if (slot.classList.contains('booked')) return;
    
    // Сбрасываем предыдущий выбор
    document.querySelectorAll('.slot').forEach(s => {
        if (!s.classList.contains('booked')) {
            s.classList.remove('selected');
        }
    });
    
    // Выбираем новый слот
    slot.classList.add('selected');
    
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    selectedDate = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
    selectedTime = time;
}

/**
 * Подтверждает запись и сохраняет данные
 */
function confirmBooking() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    
    // Валидация полей
    if (!name || !phone) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    // Создание объекта записи
    const booking = {
        id: Date.now(),
        service: selectedService,
        price: selectedServicePrice,
        date: selectedDate,
        time: selectedTime,
        clientName: name,
        clientPhone: phone,
        status: 'новый',
        createdAt: new Date().toISOString()
    };
    
    // Сохранение в localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Блокировка выбранного слота
    const dayIndex = new Date().getDay() - 1;
    const slotId = `slot-${dayIndex}-${selectedTime}`;
    localStorage.setItem(slotId, 'booked');
    
    // Уведомление пользователя
    alert(`Запись подтверждена!\n${selectedService}\n${selectedDate} в ${selectedTime}`);
    closeBookingModal();
    
    // Логирование для отладки
    console.log('Новая запись:', booking);
}

// ===== AUTHENTICATION FUNCTIONALITY =====

/**
 * Открывает модальное окно авторизации
 */
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

/**
 * Закрывает модальное окно авторизации
 */
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

/**
 * Переключает на форму регистрации
 */
function showRegister() {
    document.querySelector('.auth-form').style.display = 'none';
    document.querySelector('.register-form').style.display = 'block';
}

/**
 * Переключает на форму авторизации
 */
function showLogin() {
    document.querySelector('.auth-form').style.display = 'block';
    document.querySelector('.register-form').style.display = 'none';
}

/**
 * Авторизация пользователя
 */
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeLoginModal();
        window.location.href = 'personal.html';
    } else {
        alert('Неверный email или пароль');
    }
}

/**
 * Регистрация нового пользователя
 */
function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Валидация полей
    if (!name || !email || !password) {
        alert('Заполните все поля');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Проверка существующего пользователя
    if (users.find(u => u.email === email)) {
        alert('Пользователь с таким email уже существует');
        return;
    }
    
    // Создание нового пользователя
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        phone: '',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    closeLoginModal();
    window.location.href = 'personal.html';
}

/**
 * Обрабатывает клик по кнопке личного кабинета
 */
function handlePersonalCabinetClick() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Пользователь авторизован - переходим в личный кабинет
        window.location.href = 'personal.html';
    } else {
        // Пользователь не авторизован - показываем окно входа
        openLoginModal();
    }
}

// ===== PAGE LOAD AUTHENTICATION =====

/**
 * Проверяет авторизацию при загрузке главной страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    checkMainPageAuth();
});

function checkMainPageAuth() {
    // Проверяем, есть ли временные данные авторизации из личного кабинета
    const tempUser = sessionStorage.getItem('tempUser');
    if (tempUser && !localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', tempUser);
        sessionStorage.removeItem('tempUser');
    }
    
    // Открываем модальное окно записи если нужно
    if (sessionStorage.getItem('openBookingModal') === 'true') {
        sessionStorage.removeItem('openBookingModal');
        setTimeout(() => {
            openBookingModal();
        }, 500);
    }
    
    // Обновляем интерфейс, если пользователь авторизован
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        updateHeaderForLoggedInUser(JSON.parse(currentUser));
    }
}

/**
 * Обновляет шапку для авторизованного пользователя
 * @param {Object} userData - Данные пользователя
 */
function updateHeaderForLoggedInUser(userData) {
    const personalCabinetBtn = document.querySelector('.personal-cabinet-btn button');
    if (personalCabinetBtn && userData.name) {
        personalCabinetBtn.innerHTML = `👤 ${userData.name}`;
        personalCabinetBtn.title = 'Перейти в личный кабинет';
    }
}

// ===== GLOBAL EVENT HANDLERS =====

/**
 * Закрытие модальных окон при клике вне их области
 */
window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const loginModal = document.getElementById('loginModal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
    if (event.target === loginModal) {
        closeLoginModal();
    }
}
