/* ============================================
   SARIS SARL - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Mobile Menu Toggle ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const headerNav = document.querySelector('.header__nav');
  const navOverlay = document.querySelector('.nav-overlay');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      headerNav.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = headerNav.classList.contains('active') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      headerNav.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  /* ---------- Header Scroll Effect ---------- */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  /* ---------- Hero Slideshow ---------- */
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  if (slides.length > 0) {
    goToSlide(0);
    slideInterval = setInterval(nextSlide, 5000);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        goToSlide(i);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });
  }

  /* ---------- Scroll Animations (Intersection Observer) ---------- */
  const animateElements = document.querySelectorAll('.animate, .animate-left, .animate-right');

  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('.counter__number');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, 16);
    });
  }

  /* ---------- Form Validation ---------- */
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e74c3c';
          field.addEventListener('input', () => {
            field.style.borderColor = '';
          }, { once: true });
        }
      });

      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          valid = false;
          emailField.style.borderColor = '#e74c3c';
        }
      }

      if (!valid) {
        e.preventDefault();
      }
    });
  });

  /* ---------- Language Switcher ---------- */
  const langBtns = document.querySelectorAll('.lang-switch button');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');
      document.documentElement.setAttribute('lang', lang);
      // In production, this would load translations or redirect
      console.log('Language switched to:', lang);
    });
  });

  /* ---------- Job Filters ---------- */
  const jobFilters = document.querySelectorAll('.job-filter');
  const jobCards = document.querySelectorAll('.job-card');

  jobFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      jobFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      const category = filter.getAttribute('data-category');

      jobCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const top = targetEl.offsetTop - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        if (menuToggle) {
          menuToggle.classList.remove('active');
          headerNav.classList.remove('active');
          if (navOverlay) navOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  /* ---------- Back to Top Button ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Employee Login Toggle ---------- */
  const loginForm = document.getElementById('loginForm');
  const dashboardContent = document.getElementById('dashboardContent');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Demo authentication (replace with real API call)
      if (username && password) {
        loginForm.classList.add('hidden');
        dashboardContent.classList.remove('hidden');
      }
    });
  }

  /* ---------- Contact Form Submission ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      // Simulate submission
      setTimeout(() => {
        submitBtn.textContent = 'Message envoyé !';
        submitBtn.style.background = '#27ae60';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2500);
      }, 1500);
    });
  }

  /* ---------- Newsletter Form ---------- */
  const newsletterForm = document.querySelector('.footer__newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value.trim()) {
        const btn = newsletterForm.querySelector('button');
        btn.textContent = '✓';
        setTimeout(() => { btn.textContent = '→'; }, 2000);
        input.value = '';
      }
    });
  }

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header__nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Typing Effect for Hero ---------- */
  const typingEl = document.querySelector('.hero__typing');
  if (typingEl) {
    const words = ['BTP', 'Logistique', 'Sécurité', 'Digital', 'Maintenance', 'Agriculture'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => { isDeleting = true; }, 1500);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }

      setTimeout(typeEffect, isDeleting ? 80 : 150);
    }

    typeEffect();
  }
});
