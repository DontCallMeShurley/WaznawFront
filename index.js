document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initThemeSwitcher();
    initAnimations();
    initModals();
    initForms();
    initSmoothScroll();
    initAccessibility();
    initProjectCards();
    
    // Переключение темы с анимацией
    function initThemeSwitcher() {
        const themeSwitcher = document.getElementById('themeSwitcher');
        const themeIcon = themeSwitcher.querySelector('i');
        
        // Проверяем сохраненную тему или системные предпочтения
        const savedTheme = localStorage.getItem('theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        // Обработчик клика с анимацией
        themeSwitcher.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Анимация иконки
            themeSwitcher.style.transform = 'scale(1.1) rotate(180deg)';
            setTimeout(() => {
                themeSwitcher.style.transform = '';
            }, 300);
            
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
                updateMetaThemeColor('#0F172A');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
                updateMetaThemeColor('#7C3AED');
            }
        });
        
        // Поддержка клавиатуры
        themeSwitcher.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeSwitcher.click();
            }
        });
    }
    
    // Обновление meta theme-color
    function updateMetaThemeColor(color) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = color;
        }
    }
    
    // Улучшенные анимации при скролле
    function initAnimations() {
        const animateElements = document.querySelectorAll('[data-aos]');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Добавляем задержку для последовательной анимации
                    const delay = entry.target.getAttribute('data-aos-delay');
                    if (delay) {
                        entry.target.style.transitionDelay = delay + 'ms';
                    }
                }
            });
        }, observerOptions);
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
        
        // Parallax эффект для header
        const header = document.querySelector('header');
        const headerBg = document.querySelector('.header-bg');
        
        if (headerBg) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                headerBg.style.transform = `translateY(${rate}px)`;
            });
        }
    }
    
    // Модальные окна
    function initModals() {
        const requestModal = document.getElementById('requestModal');
        const openModalBtn = document.getElementById('openModal');
        const closeModalBtn = document.getElementById('closeModal');
        
        if (openModalBtn && requestModal) {
            openModalBtn.addEventListener('click', () => openModal(requestModal));
        }
        
        if (closeModalBtn && requestModal) {
            closeModalBtn.addEventListener('click', () => closeModalDialog(requestModal));
        }
        
        // Закрытие при клике вне окна
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('project-modal')) {
                const modal = e.target;
                closeModalDialog(modal);
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModals = document.querySelectorAll('.modal.active, .project-modal.active');
                activeModals.forEach(modal => closeModalDialog(modal));
            }
        });
    }
    
    // Функции открытия/закрытия модальных окон
    function openModal(modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Фокус на первом элементе формы
        setTimeout(() => {
            const firstInput = modal.querySelector('input, textarea, button');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    function closeModalDialog(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    // Карточки проектов
    function initProjectCards() {
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        
        portfolioCards.forEach(card => {
            // Поддержка клавиатуры
            card.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
            
            // Добавляем hover эффект при фокусе
            card.addEventListener('focus', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('blur', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Формы с валидацией
    function initForms() {
        const forms = [
            { id: 'requestForm', fields: ['modalName', 'modalContact', 'modalSubject', 'modalMessage'] },
            { id: 'contactForm', fields: ['name', 'contact2', 'subject', 'message'] }
        ];
        
        forms.forEach(formConfig => {
            const form = document.getElementById(formConfig.id);
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Валидация
                    let isValid = true;
                    const formData = {};
                    
                    formConfig.fields.forEach(fieldId => {
                        const field = document.getElementById(fieldId);
                        if (field) {
                            const value = field.value.trim();
                            
                            if (!value) {
                                isValid = false;
                                showFieldError(field, 'Это поле обязательно для заполнения');
                            } else {
                                clearFieldError(field);
                                formData[fieldId.replace('modal', '').toLowerCase()] = value;
                            }
                        }
                    });
                    
                    // Email или телефон валидация
                    const contactField = formConfig.fields.find(f => f.includes('contact'));
                    if (contactField) {
                        const contactInput = document.getElementById(contactField);
                        if (contactInput) {
                            const value = contactInput.value.trim();
                            if (value && !isValidContact(value)) {
                                isValid = false;
                                showFieldError(contactInput, 'Введите корректный email или телефон');
                            }
                        }
                    }
                    
                    if (isValid) {
                        sendContactRequest(formData, formConfig.id);
                    }
                });
                
                // Очистка ошибок при вводе
                formConfig.fields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.addEventListener('input', () => clearFieldError(field));
                    }
                });
            }
        });
    }
    
    // Валидация контактов
    function isValidContact(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return emailRegex.test(value) || phoneRegex.test(value);
    }
    
    // Показать ошибку поля
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Удаляем старую ошибку если есть
        const oldError = field.parentElement.querySelector('.field-error');
        if (oldError) oldError.remove();
        
        // Добавляем новую
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--danger)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '4px';
        field.parentElement.appendChild(errorDiv);
    }
    
    // Очистить ошибку поля
    function clearFieldError(field) {
        field.classList.remove('error');
        const error = field.parentElement.querySelector('.field-error');
        if (error) error.remove();
    }
    
    // Отправка запроса
    function sendContactRequest(data, formId) {
        const formElement = document.getElementById(formId);
        const submitButton = formElement.querySelector('button[type="submit"]');
        const originalButtonContent = submitButton.innerHTML;
        
        // Показываем индикатор загрузки
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Отправка...';
        
        // Подготовка данных для API
        const apiData = {
            name: data.name || '',
            email: data.contact || data.email || '',
            subject: data.subject || '',
            message: data.message || ''
        };
        
        fetch('https://waznaw.ru/api/Contact/send', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            // Успешная отправка
            showAlert(
                'Отлично!',
                'Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.',
                'success'
            );
            
            // Сброс формы
            formElement.reset();
            
            // Закрытие модального окна если это форма заявки
            if (formId === 'requestForm') {
                const modal = document.getElementById('requestModal');
                setTimeout(() => closeModalDialog(modal), 1000);
            }
            
            // Добавляем конфетти эффект
            createConfetti();
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert(
                'Упс, что-то пошло не так',
                'Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.',
                'error'
            );
        })
        .finally(() => {
            // Восстанавливаем кнопку
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent;
        });
    }
    
    // Показать уведомление
    function showAlert(title, message, type = 'success') {
        const alert = document.getElementById('customAlert');
        const alertTitle = document.getElementById('alertTitle');
        const alertMessage = document.getElementById('alertMessage');
        const alertIcon = alert.querySelector('.alert-icon i');
        
        alertTitle.textContent = title;
        alertMessage.textContent = message;
        
        alert.className = `custom-alert ${type}`;
        alertIcon.className = type === 'success' 
            ? 'fas fa-check-circle' 
            : 'fas fa-exclamation-circle';
        
        alert.classList.add('show');
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            alert.classList.remove('show');
        }, 5000);
    }
    
    // Закрытие алерта
    const closeAlertBtn = document.getElementById('closeAlert');
    if (closeAlertBtn) {
        closeAlertBtn.addEventListener('click', function() {
            document.getElementById('customAlert').classList.remove('show');
        });
    }
    
    // Плавная прокрутка
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // Улучшенная доступность
    function initAccessibility() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#services';
        skipLink.className = 'visually-hidden';
        skipLink.textContent = 'Перейти к содержанию';
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('services').focus();
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Анимация только если пользователь не предпочитает reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.removeAttribute('data-aos');
                el.removeAttribute('data-aos-delay');
            });
        }
    }
    
    // Конфетти эффект при успешной отправке
    function createConfetti() {
        const colors = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: ${Math.random() + 0.5};
                transform: rotate(${Math.random() * 360}deg);
                animation: confetti-fall ${Math.random() * 3 + 2}s ease-out;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }
    
    // CSS для анимации конфетти
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Управление модальными окнами проектов (глобальные функции для onclick)
function openProjectModal(projectId) {
    const modal = document.getElementById(`${projectId}Modal`);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Анимация появления
        setTimeout(() => {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(1) translateY(0)';
            }
        }, 10);
    }
}

function closeModal(projectId) {
    const modal = document.getElementById(`${projectId}Modal`);
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Preloader (опционально)
window.addEventListener('load', function() {
    // Убираем preloader если он есть
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 300);
    }
    
    // Добавляем класс loaded для анимаций
    document.body.classList.add('loaded');
});

// Обработка ошибок изображений (fallback)
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRTJFOEYwIi8+CjxwYXRoIGQ9Ik0xNTAgMTUwSDI1MFYyMDBIMTUwVjE1MFoiIGZpbGw9IiM5NEEzQjgiLz4KPC9zdmc+';
        e.target.alt = 'Изображение недоступно';
    }
}, true);

// Performance monitoring (опционально)
if (window.performance && performance.navigation.type === 0) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
            }
        }, 0);
    });
}
