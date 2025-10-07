// ===== PERSONAL CABINET AUTHENTICATION =====

/**
 * Проверяет авторизацию пользователя при загрузке страницы
 */
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    const userData = JSON.parse(user);
    updateUserInterface(userData);
    loadUserBookings();
}

/**
 * Обновляет интерфейс личного кабинета данными пользователя
 * @param {Object} userData - Данные пользователя
 */
function updateUserInterface(userData) {
    document.getElementById('userName').textContent = userData.name || 'Пользователь';
    document.getElementById('userEmail').textContent = userData.email || '';
    
    // Заполняем форму профиля
    document.getElementById('profileName').value = userData.name || '';
    document.getElementById('profileEmail').value = userData.email || '';
    document.getElementById('profilePhone').value = userData.phone || '';
}

/**
 * Переключает между вкладками личного кабинета
 * @param {string} tabName - Название вкладки
 */
function showTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем активный класс у всех пунктов меню
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Показываем выбранную вкладку
    document.getElementById(tabName).classList.add('active');
    
    // Активируем соответствующий пункт меню
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}

/**
 * Обновляет профиль пользователя
 */
function updateProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    // Обновляем данные пользователя
    user.name = document.getElementById('profileName').value;
    user.email = document.getElementById('profileEmail').value;
    user.phone = document.getElementById('profilePhone').value;
    
    // Сохраняем изменения
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Обновляем интерфейс
    alert('Профиль обновлен!');
    checkAuth();
}

/**
 * Загружает историю записей пользователя
 */
function loadUserBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Фильтруем записи текущего пользователя
    const userBookings = bookings.filter(booking => 
        booking.clientName === currentUser.name || booking.clientPhone === currentUser.phone
    );
    
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '';
    
    // Проверяем наличие записей
    if (userBookings.length === 0) {
        bookingsList.innerHTML = '<p>У вас пока нет записей</p>';
        return;
    }
    
    // Отображаем записи пользователя
    userBookings.forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        bookingItem.innerHTML = `
            <strong>${booking.service}</strong>
            <p>Дата: ${booking.date}</p>
            <p>Время: ${booking.time}</p>
            <p>Стоимость: от ${booking.price} ₽</p>
            <p>Статус: ${booking.status || 'Подтверждено'}</p>
        `;
        bookingsList.appendChild(bookingItem);
    });
}

/**
 * Открывает модальное окно онлайн-записи
 */
function openBookingModal() {
    // Закрываем личный кабинет и переходим на главную с открытием модалки
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        sessionStorage.setItem('tempUser', currentUser);
        sessionStorage.setItem('openBookingModal', 'true');
    }
    window.location.href = 'index.html';
}

/* Выход из личного кабинета*/
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ===== NAVIGATION FUNCTIONS =====

/*Переход на главную страницу без выхода из аккаунта */
function goToMainPage() {
    // Сохраняем текущего пользователя в sessionStorage для быстрого доступа
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        sessionStorage.setItem('tempUser', currentUser);
    }
    
    // Переходим на главную страницу
    window.location.href = 'index.html';
}

// ===== INITIALIZATION =====

/**
 * Инициализация обработчиков событий для личного кабинета
 */
function initializePersonalHandlers() {
    const bookingBtn = document.getElementById('bookingFromPersonal');
    if (bookingBtn) {
        bookingBtn.addEventListener('click', function() {
            openBookingModal();
        });
    }
}

/**
 * Загружает данные при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializePersonalHandlers();
});