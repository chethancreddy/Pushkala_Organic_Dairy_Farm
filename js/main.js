/**
 * Pushkala Organic Dairy Farm — Main JavaScript
 * Lead-generation, interactive calculator, WhatsApp message builders, and UI controllers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Dynamic Admin Settings Sync & State
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'podf_site_settings_v1';
  let adminSettings = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) adminSettings = JSON.parse(raw);
  } catch(e) {}

  let WA_PHONE = (adminSettings?.primaryPhone) ? '91' + adminSettings.primaryPhone.replace(/\D/g, '') : '917204736665';
  let TEL_PRIMARY = adminSettings?.primaryPhone || '7204736665';
  let TEL_SECONDARY = adminSettings?.secondaryPhone || '7204726665';

  const PRODUCTS = {
    a1: {
      id: 'a1',
      name: 'A1 Cow Milk (HF Breed)',
      shortName: 'A1 Cow Milk',
      breed: 'HF (Holstein Friesian)',
      type: 'A1',
      price: adminSettings?.prices?.a1 || 65,
      unit: 'Litre'
    },
    a2: {
      id: 'a2',
      name: 'A2 Cow Milk (Gir Breed)',
      shortName: 'A2 Gir Cow Milk',
      breed: 'Gir',
      type: 'A2',
      price: adminSettings?.prices?.a2 || 120,
      unit: 'Litre'
    },
    buffalo: {
      id: 'buffalo',
      name: 'Buffalo Milk (Murrah Breed)',
      shortName: 'Murrah Buffalo Milk',
      breed: 'Murrah',
      type: 'Buffalo',
      price: adminSettings?.prices?.buffalo || 120,
      unit: 'Litre'
    },
    paneer: {
      id: 'paneer',
      name: 'Fresh Farm Paneer',
      type: 'Dairy Product',
      price: adminSettings?.prices?.paneer || 120,
      unit: '250g'
    },
    ghee: {
      id: 'ghee',
      name: 'Pure Desi Ghee',
      type: 'Dairy Product',
      price: adminSettings?.prices?.ghee || 750,
      unit: '500ml'
    }
  };

  let calcState = {
    selectedProduct: 'a2',
    litersPerDay: 2
  };

  function applyDynamicAdminSettings() {
    if (!adminSettings) return;

    // 1. Update Prices
    document.querySelectorAll('.price-a1-val').forEach(el => el.textContent = `₹${PRODUCTS.a1.price}`);
    document.querySelectorAll('.price-a2-val').forEach(el => el.textContent = `₹${PRODUCTS.a2.price}`);
    document.querySelectorAll('.price-buffalo-val').forEach(el => el.textContent = `₹${PRODUCTS.buffalo.price}`);
    document.querySelectorAll('.price-paneer-val').forEach(el => el.textContent = `₹${PRODUCTS.paneer.price}`);
    document.querySelectorAll('.price-ghee-val').forEach(el => el.textContent = `₹${PRODUCTS.ghee.price}`);

    // 2. Update Phone Numbers & Hrefs
    document.querySelectorAll('.dynamic-phone-primary').forEach(el => el.textContent = TEL_PRIMARY);
    document.querySelectorAll('.dynamic-phone-secondary').forEach(el => el.textContent = TEL_SECONDARY);
    document.querySelectorAll('a[href^="tel:"]').forEach(a => a.href = `tel:${TEL_PRIMARY}`);

    // 3. Update Images
    const imgs = adminSettings.images || {};
    if (imgs.a1) document.querySelectorAll('img[src*="hf_cow_a1"]').forEach(img => img.src = imgs.a1);
    if (imgs.a2) document.querySelectorAll('img[src*="gir_cow_a2"]').forEach(img => img.src = imgs.a2);
    if (imgs.buffalo) document.querySelectorAll('img[src*="murrah_buffalo"]').forEach(img => img.src = imgs.buffalo);
    if (imgs.paneer) document.querySelectorAll('img[src*="fresh_paneer"]').forEach(img => img.src = imgs.paneer);
    if (imgs.ghee) document.querySelectorAll('img[src*="pure_ghee"]').forEach(img => img.src = imgs.ghee);
    if (imgs.visit) document.querySelectorAll('img[src*="farm_visit"]').forEach(img => img.src = imgs.visit);
    if (imgs.logo) document.querySelectorAll('img[src*="pushkala_logo"]').forEach(img => img.src = imgs.logo);
  }

  applyDynamicAdminSettings();

  // --------------------------------------------------------------------------
  // 2. Sticky Header & Active Navigation Scrollspy
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scrollspy
    let current = '';
    const scrollPosition = window.pageYOffset + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // --------------------------------------------------------------------------
  // 4. Interactive Milk Subscription & Quantity Calculator
  // --------------------------------------------------------------------------
  const choicePills = document.querySelectorAll('.choice-pill');
  const stepperMinus = document.getElementById('stepperMinus');
  const stepperPlus = document.getElementById('stepperPlus');
  const qtyDisplay = document.getElementById('qtyDisplay');
  const calcTotalDaily = document.getElementById('calcTotalDaily');
  const calcTotalMonthly = document.getElementById('calcTotalMonthly');
  const calcSummarySub = document.getElementById('calcSummarySub');
  const calcWaOrderBtn = document.getElementById('calcWaOrderBtn');

  function updateCalculator() {
    const prod = PRODUCTS[calcState.selectedProduct];
    if (!prod) return;

    const dailyPrice = prod.price * calcState.litersPerDay;
    const monthlyPrice = dailyPrice * 30;

    if (qtyDisplay) qtyDisplay.textContent = `${calcState.litersPerDay} L / day`;
    if (calcTotalDaily) calcTotalDaily.textContent = `₹${dailyPrice.toLocaleString('en-IN')}`;
    if (calcTotalMonthly) calcTotalMonthly.textContent = `₹${monthlyPrice.toLocaleString('en-IN')}`;
    
    if (calcSummarySub) {
      calcSummarySub.innerHTML = `
        <span><strong>Milk:</strong> ${prod.shortName} (₹${prod.price}/L)</span>
        <span><strong>Daily Quantity:</strong> ${calcState.litersPerDay} Litres (₹${dailyPrice}/day)</span>
        <span><strong>Monthly Estimate (30 days):</strong> ₹${monthlyPrice.toLocaleString('en-IN')}</span>
      `;
    }

    if (calcWaOrderBtn) {
      const msg = `Hello Pushkala Organic Dairy Farm, I want to start a daily milk subscription:\n\n• Product: ${prod.name}\n• Daily Quantity: ${calcState.litersPerDay} Litres\n• Rate: ₹${prod.price}/Litre\n• Est. Monthly: ₹${monthlyPrice.toLocaleString('en-IN')}\n\nPlease confirm availability and delivery in my area.`;
      calcWaOrderBtn.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    }
  }

  choicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      choicePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      calcState.selectedProduct = pill.getAttribute('data-product');
      updateCalculator();
    });
  });

  stepperMinus?.addEventListener('click', () => {
    if (calcState.litersPerDay > 1) {
      calcState.litersPerDay -= 1;
      updateCalculator();
    }
  });

  stepperPlus?.addEventListener('click', () => {
    if (calcState.litersPerDay < 20) {
      calcState.litersPerDay += 1;
      updateCalculator();
    }
  });

  // Initial calculation run
  updateCalculator();

  // --------------------------------------------------------------------------
  // 5. Comparison Guide Quick Selector Tabs
  // --------------------------------------------------------------------------
  const guideCards = document.querySelectorAll('.guide-tab-card');
  guideCards.forEach(card => {
    card.addEventListener('click', () => {
      guideCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const targetProduct = card.getAttribute('data-target-product');
      if (targetProduct) {
        // Switch calculator choice as well
        const correspondingPill = document.querySelector(`.choice-pill[data-product="${targetProduct}"]`);
        if (correspondingPill) {
          choicePills.forEach(p => p.classList.remove('active'));
          correspondingPill.classList.add('active');
          calcState.selectedProduct = targetProduct;
          updateCalculator();
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Quick Order Modal & Lead Generation
  // --------------------------------------------------------------------------
  const orderModal = document.getElementById('orderModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalProductSelect = document.getElementById('modalProductSelect');
  const modalQtyInput = document.getElementById('modalQtyInput');
  const modalForm = document.getElementById('modalOrderForm');
  const quickOrderTriggers = document.querySelectorAll('.trigger-quick-order');

  function openOrderModal(productId = 'a2', quantity = '1') {
    if (modalProductSelect) modalProductSelect.value = productId;
    if (modalQtyInput) modalQtyInput.value = quantity;
    orderModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeOrderModal() {
    orderModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  quickOrderTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prod = btn.getAttribute('data-product') || 'a2';
      const qty = btn.getAttribute('data-qty') || '1';
      openOrderModal(prod, qty);
    });
  });

  modalCloseBtn?.addEventListener('click', closeOrderModal);
  orderModal?.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      closeOrderModal();
    }
  });

  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('modalCustName')?.value.trim();
    const phone = document.getElementById('modalCustPhone')?.value.trim();
    const productKey = modalProductSelect?.value;
    const qty = modalQtyInput?.value;
    const address = document.getElementById('modalCustAddress')?.value.trim();
    const notes = document.getElementById('modalCustNotes')?.value.trim();

    const selectedProd = PRODUCTS[productKey] || { name: 'Dairy Product' };

    let msg = `*NEW ORDER INQUIRY — PUSHKALA ORGANIC DAIRY FARM*\n\n`;
    msg += `• *Customer Name:* ${name}\n`;
    msg += `• *Phone:* ${phone}\n`;
    msg += `• *Product:* ${selectedProd.name}\n`;
    msg += `• *Quantity:* ${qty} ${selectedProd.unit || 'Units'}\n`;
    if (selectedProd.price) {
      msg += `• *Estimated Amount:* ₹${selectedProd.price * parseInt(qty || 1)}\n`;
    }
    if (address) msg += `• *Delivery Address / Area:* ${address}\n`;
    if (notes) msg += `• *Notes:* ${notes}\n`;
    msg += `\nPlease confirm my order. Thank you!`;

    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    closeOrderModal();
    showToast('Redirecting to WhatsApp to complete your order...');
  });

  // --------------------------------------------------------------------------
  // 7. Farm Visit Booking Modal / Form
  // --------------------------------------------------------------------------
  const visitModal = document.getElementById('visitModal');
  const visitCloseBtn = document.getElementById('visitModalCloseBtn');
  const visitTriggers = document.querySelectorAll('.trigger-farm-visit');
  const visitForm = document.getElementById('visitForm');

  function openVisitModal() {
    visitModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeVisitModal() {
    visitModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  visitTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openVisitModal();
    });
  });

  visitCloseBtn?.addEventListener('click', closeVisitModal);
  visitModal?.addEventListener('click', (e) => {
    if (e.target === visitModal) {
      closeVisitModal();
    }
  });

  visitForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('visitName')?.value.trim();
    const phone = document.getElementById('visitPhone')?.value.trim();
    const date = document.getElementById('visitDate')?.value;
    const people = document.getElementById('visitPeople')?.value;
    const notes = document.getElementById('visitNotes')?.value.trim();

    let msg = `*FARM VISIT PLAN — PUSHKALA ORGANIC DAIRY FARM*\n\n`;
    msg += `• *Visitor Name:* ${name}\n`;
    msg += `• *Phone:* ${phone}\n`;
    if (date) msg += `• *Preferred Date:* ${date}\n`;
    if (people) msg += `• *Number of Visitors:* ${people}\n`;
    if (notes) msg += `• *Message:* ${notes}\n`;
    msg += `\nAddress: World School, Hulimangala, Jigani Hobli, Bangalore – 560105\n`;
    msg += `We would love to visit your farm and see the pure cows and facilities.`;

    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    closeVisitModal();
    showToast('Opening WhatsApp to schedule your farm visit...');
  });

  // --------------------------------------------------------------------------
  // 8. Lead Generation Contact Form
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactLeadForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const product = document.getElementById('contactProduct')?.value;
    const message = document.getElementById('contactMessage')?.value.trim();

    let msg = `*NEW INQUIRY — PUSHKALA ORGANIC DAIRY FARM*\n\n`;
    msg += `• *Name:* ${name}\n`;
    msg += `• *Phone / WhatsApp:* ${phone}\n`;
    msg += `• *Interested In:* ${product}\n`;
    if (message) msg += `• *Message:* ${message}\n`;
    msg += `\nPlease call me back with pricing and availability details.`;

    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    showToast('Thank you! Redirecting to WhatsApp...');
    contactForm.reset();
  });

  // --------------------------------------------------------------------------
  // 9. Toast Notification Helper
  // --------------------------------------------------------------------------
  function showToast(text) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${text}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // 10. Escape Key Closes All Modals
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeOrderModal();
      closeVisitModal();
    }
  });

  // --------------------------------------------------------------------------
  // 11. PWA: Offline / Online Network Detection
  // --------------------------------------------------------------------------
  function updateNetworkStatus() {
    if (!navigator.onLine) {
      document.body.classList.add('offline');
    } else {
      document.body.classList.remove('offline');
    }
  }

  window.addEventListener('online',  updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus(); // run on init
});
