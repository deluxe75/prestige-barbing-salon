/**
 * Prestige Barbing Salon - Vanilla JavaScript Logic
 * Features:
 * 1. Sticky navbar shrink & background change on scroll
 * 2. Active nav link highlighting
 * 3. Mobile menu auto-close on link click
 * 4. Smooth scrolling with offset
 * 5. Scroll-reveal animations (IntersectionObserver)
 * 6. Gallery filter functionality
 * 7. Appointment booking form validation & interactive success message
 * 8. Quick "Book Service" button preselection
 * 9. Testimonial carousel setup & pause on hover
 * 10. Back to top button
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. NAVBAR STICKY & SHRINK ON SCROLL ---
  const mainNavbar = document.getElementById('mainNavbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Sticky navbar styling
    if (scrollY > 60) {
      if (mainNavbar) mainNavbar.classList.add('navbar-scrolled');
    } else {
      if (mainNavbar) mainNavbar.classList.remove('navbar-scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 2. MOBILE HAMBURGER COLLAPSE AUTO-CLOSE ---
  const navLinks = document.querySelectorAll('#navbarContent .nav-link, #navbarContent .btn-gold');
  const navbarCollapse = document.getElementById('navbarContent');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show') && window.bootstrap) {
        const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // --- 3. ACTIVE NAV LINK HIGHLIGHTING VIA INTERSECTION OBSERVER ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('#navbarContent .nav-link[href^="#"]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // --- 4. SCROLL-REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal only once for performance
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 5. GALLERY FILTERING ---
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-col');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '1';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- 6. PRE-SELECT SERVICE FROM SERVICE CARDS ---
  const serviceSelect = document.getElementById('bookingService');
  const serviceButtons = document.querySelectorAll('.book-service-trigger');

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Set minimum date to today
  const bookingDateInput = document.getElementById('bookingDate');
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.setAttribute('min', today);
  }

  // --- 7. BOOKING FORM VALIDATION & INTERACTIVE CONFIRMATION ---
  const bookingForm = document.getElementById('appointmentForm');
  const bookingSuccessAlert = document.getElementById('bookingSuccessAlert');
  const summaryDetails = document.getElementById('bookingSummaryDetails');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Check HTML5 validity
      if (!bookingForm.checkValidity()) {
        bookingForm.classList.add('was-validated');
        return;
      }

      // Gather input values
      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const service = document.getElementById('bookingService').value;
      const barber = document.getElementById('bookingBarber') ? document.getElementById('bookingBarber').value : 'Lemuel Obiunu (Founder & Specialist)';
      const date = document.getElementById('bookingDate').value;
      const time = document.getElementById('bookingTime').value;
      const notes = document.getElementById('bookingMessage').value.trim();

      // Format date nicely
      let formattedDate = date;
      try {
        const d = new Date(date + 'T00:00:00');
        formattedDate = d.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (err) {
        formattedDate = date;
      }

      // Display customized success alert
      if (bookingSuccessAlert && summaryDetails) {
        summaryDetails.innerHTML = `
          <div class="mt-2 text-start">
            <p class="mb-1"><strong>Client:</strong> ${name} (<i class="bi bi-telephone text-gold"></i> ${phone})</p>
            <p class="mb-1"><strong>Service:</strong> <span class="text-gold">${service}</span></p>
            <p class="mb-1"><strong>Master Specialist:</strong> <span class="text-gold">${barber}</span></p>
            <p class="mb-1"><strong>Date & Time:</strong> ${formattedDate} at ${time}</p>
            ${notes ? `<p class="mb-0 text-muted"><strong>Special Note:</strong> "${notes}"</p>` : ''}
          </div>
        `;
        bookingSuccessAlert.style.display = 'block';
        bookingSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form fields and validation styles
      bookingForm.reset();
      bookingForm.classList.remove('was-validated');

      // Re-set min date
      if (bookingDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookingDateInput.setAttribute('min', today);
      }
    });
  }

  // --- 8. TESTIMONIALS CAROUSEL INITIALIZATION ---
  const testimonialCarouselEl = document.getElementById('testimonialCarousel');
  if (testimonialCarouselEl && window.bootstrap) {
    new window.bootstrap.Carousel(testimonialCarouselEl, {
      interval: 5000,
      pause: 'hover',
      wrap: true,
      keyboard: true
    });
  }
});
