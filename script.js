/**
 * CureMe Home Nursing Care Services - Client Logic & Interactivity
 * Vanilla JavaScript (ES6+)
 * Fully Compatible with GitHub Pages & Static Hosting
 */

(function () {
  'use strict';

  // Master Configuration
  const CONFIG = {
    phoneDisplay: '+91 98765 43210',
    phoneDial: '+919876543210',
    whatsappNumber: '919876543210',
    email: 'support@cureme.in',
    officeAddress: 'CureMe Healthcare Hub, 4th Floor, Green Valley Towers, Outer Ring Road, Bengaluru, Karnataka 560103'
  };

  function initCureMe() {
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    const serviceSelect = document.getElementById('serviceSelect');
    const preferredDateInput = document.getElementById('preferredDate');
    const bookingConfirmModal = document.getElementById('bookingConfirmModal');
    const authModal = document.getElementById('authModal');
    const policyModal = document.getElementById('policyModal');
    const toastContainer = document.getElementById('toastContainer');

    // 1. Resilient Image Fallback for GitHub Pages
    initImageFallbacks();

    // 2. Set min date for booking to today
    if (preferredDateInput) {
      const today = new Date().toISOString().split('T')[0];
      preferredDateInput.setAttribute('min', today);
    }

    // 3. Sticky Navbar & Scroll Effects
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (navbar) {
        if (scrollPos > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      if (backToTopBtn) {
        if (scrollPos > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      updateActiveNavLink();
    }, { passive: true });

    // Back to top click
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 4. Mobile Hamburger Navigation
    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          closeMobileNav();
        } else {
          openMobileNav();
        }
      });

      mobileDrawer.querySelectorAll('.nav-link, .btn').forEach(link => {
        link.addEventListener('click', () => {
          closeMobileNav();
        });
      });

      document.addEventListener('click', (e) => {
        if (
          mobileDrawer.classList.contains('open') &&
          !mobileDrawer.contains(e.target) &&
          !hamburgerBtn.contains(e.target)
        ) {
          closeMobileNav();
        }
      });
    }

    function openMobileNav() {
      if (!hamburgerBtn || !mobileDrawer) return;
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('open');
    }

    function closeMobileNav() {
      if (!hamburgerBtn || !mobileDrawer) return;
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('open');
    }

    // Active Navigation Link Tracking
    function updateActiveNavLink() {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const navLinks = document.querySelectorAll(`.nav-link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.add('active'));
        } else {
          navLinks.forEach(link => link.classList.remove('active'));
        }
      });
    }

    // 5. Service Cards "Book This Service" Handling
    const bookServiceBtns = document.querySelectorAll('.js-book-service-btn');
    bookServiceBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceValue = btn.getAttribute('data-service');
        if (serviceSelect && serviceValue) {
          serviceSelect.value = serviceValue;
        }
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          const offset = 80;
          const targetPos = bookingSection.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });

          // Flash highlight on the booking card
          const bookingCard = document.querySelector('.booking-card');
          if (bookingCard) {
            bookingCard.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
            bookingCard.style.borderColor = 'var(--sage-green)';
            bookingCard.style.boxShadow = '0 0 0 4px rgba(107, 155, 130, 0.28)';
            setTimeout(() => {
              bookingCard.style.borderColor = '';
              bookingCard.style.boxShadow = '';
            }, 1400);
          }
        }
      });
    });

    // 6. Payment Method Selection (in Payment Section & Booking Form)
    const paymentCards = document.querySelectorAll('.payment-card');
    const bookingPaymentSelect = document.getElementById('paymentMethodSelect');

    paymentCards.forEach(card => {
      card.addEventListener('click', () => {
        const method = card.getAttribute('data-method');
        paymentCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        if (bookingPaymentSelect && method) {
          bookingPaymentSelect.value = method;
        }

        const methodName = card.querySelector('.payment-card-name')?.textContent || method;
        showToast(`Selected payment method: ${methodName}`, 'info');
      });
    });

    if (bookingPaymentSelect) {
      bookingPaymentSelect.addEventListener('change', () => {
        const selectedValue = bookingPaymentSelect.value;
        paymentCards.forEach(card => {
          if (card.getAttribute('data-method') === selectedValue) {
            card.classList.add('selected');
          } else {
            card.classList.remove('selected');
          }
        });
      });
    }

    // 7. Booking Form Validation & Submission
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        const fullName = document.getElementById('customerName');
        const mobileNumber = document.getElementById('mobileNumber');
        const email = document.getElementById('customerEmail');
        const patientName = document.getElementById('patientName');
        const patientAge = document.getElementById('patientAge');
        const patientGender = document.getElementById('patientGender');
        const service = document.getElementById('serviceSelect');
        const preferredDate = document.getElementById('preferredDate');
        const preferredTime = document.getElementById('preferredTime');
        const homeAddress = document.getElementById('homeAddress');
        const city = document.getElementById('city');
        const pinCode = document.getElementById('pinCode');
        const duration = document.getElementById('duration');
        const paymentMethod = document.getElementById('paymentMethodSelect');
        const medicalNotes = document.getElementById('medicalNotes');

        function validateInput(input, condition, errorMsg) {
          if (!input) return;
          const errorEl = input.parentElement?.querySelector('.error-message');
          if (!condition) {
            input.classList.add('error');
            if (errorEl) {
              errorEl.textContent = errorMsg;
              errorEl.classList.add('visible');
            }
            isValid = false;
          } else {
            input.classList.remove('error');
            if (errorEl) {
              errorEl.classList.remove('visible');
            }
          }
        }

        // 1. Full name
        validateInput(fullName, fullName && fullName.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters)');

        // 2. Mobile (Indian 10-digit)
        const cleanPhone = mobileNumber ? mobileNumber.value.replace(/[^0-9]/g, '') : '';
        const isIndianPhone = /^[6-9]\d{9}$/.test(cleanPhone) || (cleanPhone.length === 12 && cleanPhone.startsWith('91'));
        validateInput(mobileNumber, isIndianPhone, 'Please enter a valid 10-digit Indian mobile number');

        // 3. Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateInput(email, email && emailPattern.test(email.value.trim()), 'Please enter a valid email address');

        // 4. Patient Name
        validateInput(patientName, patientName && patientName.value.trim().length >= 2, 'Please enter patient name');

        // 5. Patient Age
        const ageNum = patientAge ? parseInt(patientAge.value, 10) : NaN;
        validateInput(patientAge, !isNaN(ageNum) && ageNum >= 0 && ageNum <= 125, 'Please enter a valid age (0-125)');

        // 6. Patient Gender
        validateInput(patientGender, patientGender && patientGender.value !== '', 'Please select patient gender');

        // 7. Service
        validateInput(service, service && service.value !== '', 'Please choose a nursing service');

        // 8. Date (must be today or future)
        let isDateValid = false;
        if (preferredDate && preferredDate.value) {
          const selectedDate = new Date(preferredDate.value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          isDateValid = selectedDate >= today;
        }
        validateInput(preferredDate, isDateValid, 'Please select today or a future date');

        // 9. Time
        validateInput(preferredTime, preferredTime && preferredTime.value !== '', 'Please select preferred time slot');

        // 10. Address
        validateInput(homeAddress, homeAddress && homeAddress.value.trim().length >= 8, 'Please enter full home address for nurse visit');

        // 11. City
        validateInput(city, city && city.value.trim().length >= 2, 'Please enter city');

        // 12. PIN Code (6 digits)
        const isPinValid = pinCode && /^\d{6}$/.test(pinCode.value.trim());
        validateInput(pinCode, isPinValid, 'Please enter a valid 6-digit Indian PIN code');

        // 13. Duration
        validateInput(duration, duration && duration.value !== '', 'Please select expected duration');

        if (!isValid) {
          showToast('Please correct the highlighted fields in the booking form.', 'error');
          const firstError = bookingForm.querySelector('.form-control.error');
          if (firstError) {
            firstError.focus();
          }
          return;
        }

        const submitBtn = document.getElementById('submitBookingBtn');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <svg style="width: 18px; height: 18px; animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing Request...</span>
          `;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }

          const bookingRefId = 'CM-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
          
          const bookingData = {
            refId: bookingRefId,
            customerName: fullName.value.trim(),
            mobile: mobileNumber.value.trim(),
            email: email.value.trim(),
            patientName: patientName.value.trim(),
            patientAge: patientAge.value.trim(),
            patientGender: patientGender.value,
            service: service.options[service.selectedIndex].text,
            date: preferredDate.value,
            time: preferredTime.options[preferredTime.selectedIndex].text,
            address: homeAddress.value.trim(),
            city: city.value.trim(),
            pinCode: pinCode.value.trim(),
            duration: duration.options[duration.selectedIndex].text,
            paymentMethod: paymentMethod ? paymentMethod.options[paymentMethod.selectedIndex].text : 'Cash After Service',
            medicalNotes: medicalNotes ? medicalNotes.value.trim() : ''
          };

          renderBookingConfirmation(bookingData);

          bookingForm.reset();
          if (preferredDateInput) {
            const today = new Date().toISOString().split('T')[0];
            preferredDateInput.setAttribute('min', today);
          }

          showToast('Booking request submitted successfully!', 'success');
        }, 600);
      });
    }

    // Render Confirmation Modal
    function renderBookingConfirmation(data) {
      if (!bookingConfirmModal) return;

      const modalBody = document.getElementById('bookingConfirmContent');
      if (!modalBody) return;

      let paymentNote = 'You can pay the nurse directly via Cash or UPI upon service completion.';
      if (data.paymentMethod.includes('UPI') || data.paymentMethod.includes('Google Pay') || data.paymentMethod.includes('PhonePe') || data.paymentMethod.includes('Paytm')) {
        paymentNote = 'Official CureMe UPI QR / handle will be shared via SMS and confirmed before the visit. No advance deposit needed.';
      } else if (data.paymentMethod.includes('Card') || data.paymentMethod.includes('Net Banking')) {
        paymentNote = 'A secure digital payment link (Razorpay-ready) will be generated and sent via SMS after nurse matching.';
      }

      const waText = encodeURIComponent(
        `Hello CureMe Team, I have submitted a Home Nursing request.\n\n` +
        `📋 Booking ID: ${data.refId}\n` +
        `👤 Customer: ${data.customerName} (${data.mobile})\n` +
        `🩺 Patient: ${data.patientName}, Age ${data.patientAge} (${data.patientGender})\n` +
        `🩹 Service: ${data.service}\n` +
        `📅 Schedule: ${data.date} | ${data.time}\n` +
        `⏳ Duration: ${data.duration}\n` +
        `📍 Address: ${data.address}, ${data.city} - ${data.pinCode}\n` +
        `💳 Preferred Payment: ${data.paymentMethod}\n` +
        (data.medicalNotes ? `📝 Medical Notes: ${data.medicalNotes}\n` : '') +
        `\nPlease verify nurse availability and confirm my schedule. Thank you!`
      );
      const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;

      modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 60px; height: 60px; background-color: var(--light-mint); color: var(--dark-green); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 6px; color: var(--dark-green);">Booking Request Received!</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">Reference ID: <strong style="color: var(--dark-green);">${data.refId}</strong></p>
        </div>

        <div style="background: var(--cream); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px 20px; margin-bottom: 20px; font-size: 0.88rem; line-height: 1.6;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
            <div><span style="color: var(--text-muted); font-size: 0.775rem; text-transform: uppercase; display: block;">Service</span><strong>${data.service}</strong></div>
            <div><span style="color: var(--text-muted); font-size: 0.775rem; text-transform: uppercase; display: block;">Patient</span><strong>${data.patientName} (${data.patientAge}y, ${data.patientGender})</strong></div>
            <div><span style="color: var(--text-muted); font-size: 0.775rem; text-transform: uppercase; display: block;">Date & Time</span><strong>${data.date} (${data.time})</strong></div>
            <div><span style="color: var(--text-muted); font-size: 0.775rem; text-transform: uppercase; display: block;">Duration</span><strong>${data.duration}</strong></div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.775rem; text-transform: uppercase; display: block;">Address for Home Visit</span>
            <p style="color: var(--text-main); font-weight: 500; margin: 0;">${data.address}, ${data.city} - ${data.pinCode}</p>
          </div>
        </div>

        <div style="background-color: var(--light-mint-soft); border-left: 4px solid var(--sage-green); padding: 14px 16px; border-radius: var(--radius-sm); margin-bottom: 20px;">
          <div style="font-weight: 600; color: var(--dark-green); font-size: 0.88rem; margin-bottom: 4px;">Payment Method: ${data.paymentMethod}</div>
          <p style="font-size: 0.825rem; color: var(--text-secondary); margin: 0;">${paymentNote}</p>
        </div>

        <div style="background: var(--accent-gold-bg); border: 1px solid #F6E2B5; border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 24px;">
          <p style="font-size: 0.825rem; color: #78520A; line-height: 1.5; margin: 0;">
            <strong>Important Note:</strong> Submitting this request does not automatically guarantee nurse availability. The CureMe coordination team will contact you at <strong>${data.mobile}</strong> within 30 minutes to confirm nurse schedule and finalize pricing.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width: 100%;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Share Details via WhatsApp</span>
          </a>
          <button type="button" class="btn btn-secondary js-close-modal" style="width: 100%;">
            Close Window
          </button>
        </div>
      `;

      openModal(bookingConfirmModal);

      modalBody.querySelectorAll('.js-close-modal').forEach(btn => {
        btn.addEventListener('click', () => closeModal(bookingConfirmModal));
      });
    }

    // Direct WhatsApp Button in Booking Sidebar
    const directWaBookingBtn = document.getElementById('directWaBookingBtn');
    if (directWaBookingBtn) {
      directWaBookingBtn.addEventListener('click', () => {
        const selectedService = serviceSelect ? serviceSelect.value || 'Home Nursing Care' : 'Home Nursing Care';
        const patientNameVal = document.getElementById('patientName')?.value.trim();
        const message = encodeURIComponent(
          `Hi CureMe, I would like to inquire about home nursing support for service: "${selectedService}". ` +
          (patientNameVal ? `Patient name: ${patientNameVal}. ` : '') +
          `Please share nurse availability and charges.`
        );
        window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${message}`, '_blank');
      });
    }

    // 8. Interactive FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question-btn');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          if (!isActive) {
            item.classList.add('active');
            questionBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });

    // 9. Contact Us Form
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const phone = document.getElementById('contactPhone');
        const message = document.getElementById('contactMessage');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        let isContactValid = true;

        if (!name || name.value.trim().length < 2) {
          showToast('Please enter your name.', 'error');
          name?.classList.add('error');
          isContactValid = false;
        } else {
          name?.classList.remove('error');
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email.value.trim())) {
          showToast('Please enter a valid email address.', 'error');
          email?.classList.add('error');
          isContactValid = false;
        } else {
          email?.classList.remove('error');
        }

        if (!message || message.value.trim().length < 10) {
          showToast('Please enter your message (at least 10 characters).', 'error');
          message?.classList.add('error');
          isContactValid = false;
        } else {
          message?.classList.remove('error');
        }

        if (!isContactValid) return;

        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Sending Message...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          contactForm.reset();
          showToast('Thank you! Your message has been sent. The CureMe support team will respond shortly.', 'success');
        }, 600);
      });
    }

    // 10. Auth Modal (Login / Register)
    const authTriggerBtns = document.querySelectorAll('.js-auth-trigger');
    if (authModal) {
      authTriggerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openModal(authModal);
        });
      });

      const loginTabBtn = document.getElementById('tabLoginBtn');
      const registerTabBtn = document.getElementById('tabRegisterBtn');
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');

      if (loginTabBtn && registerTabBtn && loginForm && registerForm) {
        loginTabBtn.addEventListener('click', () => {
          loginTabBtn.classList.add('active');
          registerTabBtn.classList.remove('active');
          loginForm.style.display = 'flex';
          registerForm.style.display = 'none';
        });

        registerTabBtn.addEventListener('click', () => {
          registerTabBtn.classList.add('active');
          loginTabBtn.classList.remove('active');
          registerForm.style.display = 'flex';
          loginForm.style.display = 'none';
        });

        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          showToast('Welcome back! Successfully signed in.', 'success');
          closeModal(authModal);
        });

        registerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          showToast('Account created successfully! Welcome to CureMe.', 'success');
          closeModal(authModal);
        });
      }
    }

    // 11. Policy Modals (Privacy, Terms, Cancellation)
    const policyTriggers = document.querySelectorAll('.js-policy-trigger');
    if (policyModal) {
      policyTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const policyType = trigger.getAttribute('data-policy');
          renderPolicyContent(policyType);
          openModal(policyModal);
        });
      });
    }

    function renderPolicyContent(type) {
      const titleEl = document.getElementById('policyModalTitle');
      const bodyEl = document.getElementById('policyModalBody');
      if (!titleEl || !bodyEl) return;

      if (type === 'privacy') {
        titleEl.textContent = 'Privacy Policy';
        bodyEl.innerHTML = `
          <p style="margin-bottom: 14px;"><strong>1. Information Collection:</strong> CureMe collects contact details (Name, Phone number, Email) and patient health indicators solely to evaluate service requirements and match you with suitable home nursing professionals.</p>
          <p style="margin-bottom: 14px;"><strong>2. Confidentiality & Security:</strong> We respect medical privacy. We do not sell or lease patient records to third-party marketing companies.</p>
          <p style="margin-bottom: 14px;"><strong>3. Nurse Verification:</strong> All registered home nursing personnel adhere to professional healthcare confidentiality guidelines.</p>
          <p><strong>Contact Us:</strong> For any privacy inquiries, write to <strong>support@cureme.in</strong>.</p>
        `;
      } else if (type === 'terms') {
        titleEl.textContent = 'Terms and Conditions';
        bodyEl.innerHTML = `
          <p style="margin-bottom: 14px;"><strong>1. Platform Nature:</strong> CureMe serves as an organized platform connecting patient families with qualified nurses. Submitting a request does not constitute an instant contract until confirmed by our care coordinator.</p>
          <p style="margin-bottom: 14px;"><strong>2. Non-Emergency Services:</strong> CureMe provides planned home nursing, post-surgery recovery, elderly care, and routine monitoring. We do NOT provide emergency trauma care or active ICU ambulance dispatch.</p>
          <p style="margin-bottom: 14px;"><strong>3. Client Responsibilities:</strong> The family must provide safe home access, clear prescribed medical directions from treating doctors, and valid emergency contacts.</p>
        `;
      } else if (type === 'cancellation') {
        titleEl.textContent = 'Cancellation & Rescheduling Policy';
        bodyEl.innerHTML = `
          <p style="margin-bottom: 14px;"><strong>1. Notice Period:</strong> You can reschedule or cancel any scheduled visit with at least 4 hours advance notice without any cancellation fee.</p>
          <p style="margin-bottom: 14px;"><strong>2. Transparent Adjustments:</strong> If a scheduled nurse is indisposed due to illness, CureMe arranges a substitute verified nurse or offers full schedule adjustment.</p>
          <p><strong>3. Queries:</strong> Call our coordination desk at ${CONFIG.phoneDisplay} or contact via WhatsApp.</p>
        `;
      }
    }

    // Modal Generic Controls
    function openModal(modal) {
      if (!modal) return;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });

      modal.querySelectorAll('.modal-close-btn, .js-modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
          closeModal(modal);
        });
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(modal => closeModal(modal));
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          closeMobileNav();
        }
      }
    });

    // 12. Toast Helper
    function showToast(message, type = 'info') {
      if (!toastContainer) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let iconSvg = '';
      if (type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      } else if (type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-error)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sage-green)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
      }

      toast.innerHTML = `
        ${iconSvg}
        <span style="font-size: 0.88rem; color: var(--text-main); font-weight: 500;">${message}</span>
      `;

      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('visible');
      }, 20);

      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
          if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 300);
      }, 4000);
    }

    // 13. Resilient Image Loader for Static / GitHub Pages
    function initImageFallbacks() {
      const allImgs = document.querySelectorAll('img');
      allImgs.forEach(img => {
        img.addEventListener('error', function () {
          const currentSrc = img.getAttribute('src');
          if (currentSrc && currentSrc.startsWith('./src/assets/images/')) {
            // Try ./assets/images/
            const altPath = currentSrc.replace('./src/assets/images/', './assets/images/');
            img.src = altPath;
          } else if (currentSrc && currentSrc.startsWith('./assets/images/')) {
            // Try ./src/assets/images/
            const altPath = currentSrc.replace('./assets/images/', './src/assets/images/');
            img.src = altPath;
          }
        });
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCureMe);
  } else {
    initCureMe();
  }
})();
