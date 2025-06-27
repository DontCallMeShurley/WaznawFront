   document.addEventListener('DOMContentLoaded', function() {
            // Переключение темы
            const themeSwitcher = document.getElementById('themeSwitcher');
            const themeIcon = themeSwitcher.querySelector('i');
            
            // Проверяем сохраненную тему
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            
            // Обработчик клика
            themeSwitcher.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                
                if (document.body.classList.contains('dark-mode')) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    localStorage.setItem('theme', 'dark');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    localStorage.setItem('theme', 'light');
                }
            });
            
            // Анимации при скролле
            const animateElements = document.querySelectorAll('[data-aos]');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                    }
                });
            }, { threshold: 0.1 });
            
            animateElements.forEach(el => {
                observer.observe(el);
                
                // Установка задержки
                const delay = el.getAttribute('data-aos-delay');
                if (delay) {
                    el.style.transitionDelay = delay + 'ms';
                }
            });
            
            // Модальное окно
            const modal = document.getElementById('requestModal');
            const openModalBtn = document.getElementById('openModal');
            const closeModalBtn = document.getElementById('closeModal');
            
            openModalBtn.addEventListener('click', () => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            closeModalBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
            
            // Закрытие при клике вне окна
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Отправка формы заявки
            const requestForm = document.getElementById('requestForm');
            requestForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('modalName').value,
                    email: document.getElementById('modalContact').value,
                    subject: document.getElementById('modalSubject').value,
                    message: document.getElementById('modalMessage').value
                };
 
                sendContactRequest(formData, 'requestForm');
            });
            
            // Отправка контактной формы
            const contactForm = document.getElementById('contactForm');
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('contact').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };
                
                sendContactRequest(formData, 'contactForm');
            });
            
            // Функция отправки запроса
            function sendContactRequest(data, formId) {
                const formElement = document.getElementById(formId);
                const submitButton = formElement.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                
                // Показываем индикатор загрузки
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                
                fetch('http://83.136.235.129:8880/api/Contact/send', {
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка сети');
                    }
                    return response.json();
                })
                .then(data => {
                    // Успешная отправка
                    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
                    
                    // Сброс формы
                    formElement.reset();
                    
                    // Закрытие модального окна, если это форма заявки
                    if (formId === 'requestForm') {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже или свяжитесь с нами другим способом.');
                })
                .finally(() => {
                    // Восстанавливаем кнопку
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                });
            }
            
            // Инициализация темы из системных предпочтений
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            if (!localStorage.getItem('theme')) {
                if (prefersDarkScheme.matches) {
                    document.body.classList.add('dark-mode');
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    localStorage.setItem('theme', 'light');
                }
            }
            
            // Отслеживание изменений системных предпочтений
            prefersDarkScheme.addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                        themeIcon.classList.remove('fa-moon');
                        themeIcon.classList.add('fa-sun');
                    } else {
                        document.body.classList.remove('dark-mode');
                        themeIcon.classList.remove('fa-sun');
                        themeIcon.classList.add('fa-moon');
                    }
                }
            });
        });

        // Управление модальными окнами проектов
        function openProjectModal(projectId) {
            const modal = document.getElementById(`${projectId}Modal`);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(projectId) {
            const modal = document.getElementById(`${projectId}Modal`);
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Закрытие при клике вне окна
        document.querySelectorAll('.project-modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });

        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.project-modal').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = 'auto';
            }
        });