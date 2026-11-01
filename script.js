/**
 * Portfolio Interactivity Script
 * Features:
 *  1. Dark / Light Theme Toggle with LocalStorage persistence
 *  2. Mobile Navigation Drawer Toggle & Accessibility Handling
 *  3. Interactive Project Category Filtering
 *  4. Accessible Form Validation & Interactive Feedback Toast
 *  5. Active Link Highlighting on Scroll
 *  6. Dynamic Copyright Year
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Theme Switcher (Dark / Light Mode)
  // =========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply saved theme or system preference
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.body.classList.add('dark-theme');
  }

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  });

  // =========================================================================
  // 2. Mobile Navigation Drawer
  // =========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMenu = () => {
    navMenu?.classList.add('show-menu');
    navToggle?.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    navMenu?.classList.remove('show-menu');
    navToggle?.setAttribute('aria-expanded', 'false');
  };

  navToggle?.addEventListener('click', openMenu);
  navClose?.addEventListener('click', closeMenu);

  // Close menu when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('show-menu')) {
      closeMenu();
    }
  });

  // =========================================================================
  // 3. Interactive Project Filtering
  // =========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button state and ARIA attributes
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Filter project cards with smooth transitions
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // =========================================================================
  // 4. Contact Form Validation & Interactive Feedback Toast
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const messageInput = document.getElementById('user-message');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const showToast = (message) => {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearErrors = () => {
    [nameError, emailError, messageError].forEach((el) => {
      if (el) el.textContent = '';
    });
    [nameInput, emailInput, messageInput].forEach((el) => {
      el?.classList.remove('is-invalid');
    });
  };

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      nameInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please enter your message.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Your message should be at least 10 characters long.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    }

    if (isValid) {
      showToast('Thank you, ' + nameInput.value.trim() + '! Your message was sent successfully.');
      contactForm.reset();
    }
  });

  // =========================================================================
  // 5. Active Link Highlighting on Scroll (Scroll Spy)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active-link');
        } else {
          targetNavLink.classList.remove('active-link');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  // =========================================================================
  // 6. Dynamic Year in Footer
  // =========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

