document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navbar = document.querySelector('.navbar');

    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
            }
        });
    });

    const dropdown = document.querySelector('.dropdown');
    const dropBtn = document.querySelector('.dropbtn');

    if (dropdown && dropBtn) {
        dropBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            dropBtn.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', () => {
            if (dropdown.classList.contains('open')) {
                dropdown.classList.remove('open');
                dropBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const sections = document.querySelectorAll('section');
    const headerHeight = document.querySelector('.header').offsetHeight;

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (darkModeToggle) {
        function applyTheme(isDark) {
            if (isDark) {
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
            }
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            darkModeToggle.checked = true;
            applyTheme(true);
        } else {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && savedTheme !== 'light') {
                darkModeToggle.checked = true;
                applyTheme(true);
            } else {
                darkModeToggle.checked = false;
                applyTheme(false);
            }
        }

        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                applyTheme(true);
                localStorage.setItem('theme', 'dark');
            } else {
                applyTheme(false);
                localStorage.setItem('theme', 'light');
            }
        });
    }

});