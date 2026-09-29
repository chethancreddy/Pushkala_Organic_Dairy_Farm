/**
 * Pushkala Organic Dairy Farm — Admin Management Portal JS
 * Manages secure login, phone numbers, pricing, Ghee products category, and image assets.
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'podf_site_settings_v1';
  const AUTH_SESSION_KEY = 'podf_admin_session_auth';

  // --------------------------------------------------------------------------
  // 1. Admin Authentication Check & Login Controller
  // --------------------------------------------------------------------------
  const adminLoginView = document.getElementById('adminLoginView');
  const adminDashboardView = document.getElementById('adminDashboardView');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminUsername = document.getElementById('adminUsername');
  const adminPassword = document.getElementById('adminPassword');
  const btnTogglePassword = document.getElementById('btnTogglePassword');
  const loginErrorAlert = document.getElementById('loginErrorAlert');
  const btnLogout = document.getElementById('btnLogout');

  function checkAuthStatus() {
    const isAuth = sessionStorage.getItem(AUTH_SESSION_KEY) === 'authenticated';
    if (isAuth) {
      if (adminLoginView) adminLoginView.style.display = 'none';
      if (adminDashboardView) adminDashboardView.style.display = 'block';
    } else {
      if (adminLoginView) adminLoginView.style.display = 'flex';
      if (adminDashboardView) adminDashboardView.style.display = 'none';
    }
  }

  // Toggle Password Visibility
  btnTogglePassword?.addEventListener('click', () => {
    if (!adminPassword) return;
    if (adminPassword.type === 'password') {
      adminPassword.type = 'text';
      btnTogglePassword.textContent = '🔒';
    } else {
      adminPassword.type = 'password';
      btnTogglePassword.textContent = '👁️';
    }
  });

  // Handle Login Submit
  adminLoginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = adminUsername?.value.trim();
    const p = adminPassword?.value.trim();

    // Secure Verification against admin credentials
    if (u === 'admin' && p === 'Qwerty@123') {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'authenticated');
      if (loginErrorAlert) loginErrorAlert.style.display = 'none';
      checkAuthStatus();
      populateForm();
      showToast('Welcome back, Admin!');
    } else {
      if (loginErrorAlert) {
        loginErrorAlert.style.display = 'flex';
        adminPassword.value = '';
        adminPassword.focus();
      }
    }
  });

  // Handle Logout
  btnLogout?.addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    if (adminUsername) adminUsername.value = '';
    if (adminPassword) adminPassword.value = '';
    checkAuthStatus();
    showToast('Logged out successfully.');
  });

  // Initial Auth Check
  checkAuthStatus();

  // --------------------------------------------------------------------------
  // 2. Default Settings & Ghee Products Schema
  // --------------------------------------------------------------------------
  const DEFAULT_GHEE_PRODUCTS = [
    {
      id: 'ghee_a1',
      name: 'A1 Ghee',
      badge: 'HF COW MILK',
      price: 650,
      unit: 'per 500ml',
      description: 'Pure wholesome ghee prepared from 100% pure HF Cow milk. Golden texture, mild aroma, and nutrient-rich everyday cooking companion.',
      image: 'assets/pure_ghee.jpg',
      points: ['100% Pure HF Cow Milk', 'Nutritious & smooth texture', 'Slow-clarified traditional process'],
      visible: true
    },
    {
      id: 'ghee_a2',
      name: 'A2 Desi Ghee',
      badge: 'GIR COW BILONA',
      price: 950,
      unit: 'per 500ml',
      description: 'Handcrafted from pure Gir Cow A2 milk following traditional Vedic Bilona method. Incomparable aroma, rich golden grains, and superior digestive wellness.',
      image: 'assets/pure_ghee.jpg',
      points: ['100% Pure Gir Cow A2 Milk', 'Traditional Vedic Bilona Churned', 'Granular texture & rich aroma'],
      visible: true
    },
    {
      id: 'ghee_buffalo',
      name: 'Buffalo Ghee',
      badge: 'MURRAH BUFFALO',
      price: 750,
      unit: 'per 500ml',
      description: 'Rich, full-bodied pure ghee prepared from high-fat Murrah buffalo milk. Dense granularity, heavenly nutty aroma, exceptional for festive sweets and hearty dishes.',
      image: 'assets/pure_ghee.jpg',
      points: ['100% Pure Murrah Buffalo Milk', 'Dense white-gold graininess', 'Ideal for sweets & authentic cooking'],
      visible: true
    }
  ];

  const DEFAULT_SETTINGS = {
    primaryPhone: '7204736665',
    secondaryPhone: '7204726665',
    fssaiNo: '21226007000022',
    address: 'World School, Hulimangala, Jigani Hobli, Bangalore – 560105',
    prices: {
      a1: 65,
      a2: 120,
      buffalo: 120,
      paneer: 120
    },
    gheeProducts: JSON.parse(JSON.stringify(DEFAULT_GHEE_PRODUCTS)),
    images: {
      a1: '',
      a2: '',
      buffalo: '',
      paneer: '',
      visit: '',
      logo: ''
    }
  };

  // Load existing settings
  function getSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.gheeProducts || !Array.isArray(parsed.gheeProducts)) {
          parsed.gheeProducts = JSON.parse(JSON.stringify(DEFAULT_GHEE_PRODUCTS));
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  let currentSettings = getSettings();

  // Elements
  const elPrimaryPhone = document.getElementById('admPrimaryPhone');
  const elSecondaryPhone = document.getElementById('admSecondaryPhone');
  const elFssaiNo = document.getElementById('admFssaiNo');
  const elAddress = document.getElementById('admAddress');

  const elPriceA1 = document.getElementById('admPriceA1');
  const elPriceA2 = document.getElementById('admPriceA2');
  const elPriceBuffalo = document.getElementById('admPriceBuffalo');
  const elPricePaneer = document.getElementById('admPricePaneer');

  // Previews
  const prevA1 = document.getElementById('prevA1');
  const prevA2 = document.getElementById('prevA2');
  const prevBuffalo = document.getElementById('prevBuffalo');
  const prevPaneer = document.getElementById('prevPaneer');
  const prevVisit = document.getElementById('prevVisit');
  const prevLogo = document.getElementById('prevLogo');

  // Populate Form Fields
  function populateForm() {
    if (elPrimaryPhone) elPrimaryPhone.value = currentSettings.primaryPhone || DEFAULT_SETTINGS.primaryPhone;
    if (elSecondaryPhone) elSecondaryPhone.value = currentSettings.secondaryPhone || DEFAULT_SETTINGS.secondaryPhone;
    if (elFssaiNo) elFssaiNo.value = currentSettings.fssaiNo || DEFAULT_SETTINGS.fssaiNo;
    if (elAddress) elAddress.value = currentSettings.address || DEFAULT_SETTINGS.address;

    const p = currentSettings.prices || DEFAULT_SETTINGS.prices;
    if (elPriceA1) elPriceA1.value = p.a1 || 65;
    if (elPriceA2) elPriceA2.value = p.a2 || 120;
    if (elPriceBuffalo) elPriceBuffalo.value = p.buffalo || 120;
    if (elPricePaneer) elPricePaneer.value = p.paneer || 120;

    const imgs = currentSettings.images || {};
    if (imgs.a1 && prevA1) prevA1.src = imgs.a1;
    if (imgs.a2 && prevA2) prevA2.src = imgs.a2;
    if (imgs.buffalo && prevBuffalo) prevBuffalo.src = imgs.buffalo;
    if (imgs.paneer && prevPaneer) prevPaneer.src = imgs.paneer;
    if (imgs.visit && prevVisit) prevVisit.src = imgs.visit;
    if (imgs.logo && prevLogo) prevLogo.src = imgs.logo;

    renderAdminGheeList();
  }

  // Handle File Input Change to Base64
  function setupFileHandler(fileInputId, imgPreviewId, keyName) {
    const input = document.getElementById(fileInputId);
    const preview = document.getElementById(imgPreviewId);
    if (!input || !preview) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large! Please upload an image smaller than 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64Data = evt.target.result;
        preview.src = base64Data;
        if (!currentSettings.images) currentSettings.images = {};
        currentSettings.images[keyName] = base64Data;
      };
      reader.readAsDataURL(file);
    });
  }

  setupFileHandler('fileA1', 'prevA1', 'a1');
  setupFileHandler('fileA2', 'prevA2', 'a2');
  setupFileHandler('fileBuffalo', 'prevBuffalo', 'buffalo');
  setupFileHandler('filePaneer', 'prevPaneer', 'paneer');
  setupFileHandler('fileVisit', 'prevVisit', 'visit');
  setupFileHandler('fileLogo', 'prevLogo', 'logo');

  // --------------------------------------------------------------------------
  // 3. GHEE PRODUCTS CRUD CONTROLLER
  // --------------------------------------------------------------------------
  const adminGheeList = document.getElementById('adminGheeList');
  const gheeModal = document.getElementById('gheeModal');
  const gheeModalHeaderTitle = document.getElementById('gheeModalHeaderTitle');
  const gheeProductForm = document.getElementById('gheeProductForm');
  const btnOpenAddGhee = document.getElementById('btnOpenAddGhee');
  const btnCloseGheeModal = document.getElementById('btnCloseGheeModal');
  const btnCancelGheeModal = document.getElementById('btnCancelGheeModal');

  const gheeEditId = document.getElementById('gheeEditId');
  const gheeName = document.getElementById('gheeName');
  const gheeBadge = document.getElementById('gheeBadge');
  const gheePrice = document.getElementById('gheePrice');
  const gheeUnit = document.getElementById('gheeUnit');
  const gheeDescription = document.getElementById('gheeDescription');
  const gheePoints = document.getElementById('gheePoints');
  const gheeImageFile = document.getElementById('gheeImageFile');
  const gheeImagePreview = document.getElementById('gheeImagePreview');
  const gheeVisible = document.getElementById('gheeVisible');

  let currentGheeModalImageBase64 = '';

  // Render Ghee list in Admin Portal
  function renderAdminGheeList() {
    if (!adminGheeList) return;
    const list = currentSettings.gheeProducts || [];

    if (list.length === 0) {
      adminGheeList.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--color-muted);">No Ghee products found. Click "Add New Ghee Product" to create one.</div>`;
      return;
    }

    adminGheeList.innerHTML = list.map((item, idx) => {
      const isVisible = item.visible !== false;
      const statusBadge = isVisible 
        ? `<span class="badge-status badge-active">Active (Visible)</span>` 
        : `<span class="badge-status badge-hidden">Hidden</span>`;
      const itemImg = item.image || 'assets/pure_ghee.jpg';

      return `
        <div class="ghee-admin-card ${isVisible ? '' : 'is-hidden'}" data-id="${item.id}">
          <div class="ghee-admin-card-top">
            <img src="${itemImg}" alt="${escapeHtml(item.name)}" class="ghee-admin-thumb">
            <div class="ghee-admin-info">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px;">
                <div class="ghee-admin-title">${escapeHtml(item.name)}</div>
                ${statusBadge}
              </div>
              <div style="font-size: 0.78rem; color: var(--color-muted); margin-bottom: 4px;">Badge: <strong>${escapeHtml(item.badge || 'N/A')}</strong></div>
              <div class="ghee-admin-price">₹${item.price} <span style="font-size: 0.8rem; font-weight: 500; color: var(--color-muted);">${escapeHtml(item.unit || 'per 500ml')}</span></div>
              <p style="font-size: 0.8rem; color: var(--color-muted); margin-top: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${escapeHtml(item.description || '')}
              </p>
            </div>
          </div>

          <div class="ghee-admin-actions">
            <button type="button" class="btn-admin-action" onclick="window.editGheeProduct('${item.id}')">
              ✏️ Edit
            </button>
            <button type="button" class="btn-admin-action" onclick="window.toggleGheeVisibility('${item.id}')">
              ${isVisible ? '👁️ Hide' : '👁️ Show'}
            </button>
            <button type="button" class="btn-admin-action btn-admin-delete" onclick="window.deleteGheeProduct('${item.id}')">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Open Modal to Add Ghee Product
  btnOpenAddGhee?.addEventListener('click', () => {
    if (gheeProductForm) gheeProductForm.reset();
    if (gheeEditId) gheeEditId.value = '';
    if (gheeModalHeaderTitle) gheeModalHeaderTitle.textContent = '➕ Add New Ghee Product';
    currentGheeModalImageBase64 = 'assets/pure_ghee.jpg';
    if (gheeImagePreview) gheeImagePreview.src = 'assets/pure_ghee.jpg';
    if (gheeVisible) gheeVisible.checked = true;
    if (gheeModal) gheeModal.classList.add('open');
  });

  // Close Modal
  function closeGheeModal() {
    if (gheeModal) gheeModal.classList.remove('open');
  }
  btnCloseGheeModal?.addEventListener('click', closeGheeModal);
  btnCancelGheeModal?.addEventListener('click', closeGheeModal);

  // Ghee Image File Reader
  gheeImageFile?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File size too large! Please choose an image smaller than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      currentGheeModalImageBase64 = evt.target.result;
      if (gheeImagePreview) gheeImagePreview.src = currentGheeModalImageBase64;
    };
    reader.readAsDataURL(file);
  });

  // Save / Update Ghee Product
  gheeProductForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = gheeEditId?.value.trim();
    const name = gheeName?.value.trim();
    const badge = gheeBadge?.value.trim() || 'PURE GHEE';
    const price = parseFloat(gheePrice?.value) || 0;
    const unit = gheeUnit?.value.trim() || 'per 500ml';
    const description = gheeDescription?.value.trim();
    const rawPoints = gheePoints?.value.trim();
    const points = rawPoints ? rawPoints.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const isVisible = gheeVisible ? gheeVisible.checked : true;

    if (!name || price <= 0 || !unit) {
      alert('Please fill all required fields correctly.');
      return;
    }

    if (!currentSettings.gheeProducts) currentSettings.gheeProducts = [];

    if (id) {
      // Edit existing
      const existing = currentSettings.gheeProducts.find(p => p.id === id);
      if (existing) {
        existing.name = name;
        existing.badge = badge;
        existing.price = price;
        existing.unit = unit;
        existing.description = description;
        existing.points = points;
        existing.visible = isVisible;
        if (currentGheeModalImageBase64) existing.image = currentGheeModalImageBase64;
      }
    } else {
      // Add new
      const newId = 'ghee_' + Date.now();
      currentSettings.gheeProducts.push({
        id: newId,
        name: name,
        badge: badge,
        price: price,
        unit: unit,
        description: description,
        points: points,
        image: currentGheeModalImageBase64 || 'assets/pure_ghee.jpg',
        visible: isVisible
      });
    }

    closeGheeModal();
    renderAdminGheeList();
    showToast('Ghee product updated! Click "Save All Changes" to sync to live site.');
  });

  // Global actions for inline buttons
  window.editGheeProduct = (id) => {
    const item = currentSettings.gheeProducts?.find(p => p.id === id);
    if (!item) return;

    if (gheeEditId) gheeEditId.value = item.id;
    if (gheeName) gheeName.value = item.name;
    if (gheeBadge) gheeBadge.value = item.badge || '';
    if (gheePrice) gheePrice.value = item.price;
    if (gheeUnit) gheeUnit.value = item.unit || 'per 500ml';
    if (gheeDescription) gheeDescription.value = item.description || '';
    if (gheePoints) gheePoints.value = (item.points || []).join('\n');
    if (gheeVisible) gheeVisible.checked = item.visible !== false;

    currentGheeModalImageBase64 = item.image || 'assets/pure_ghee.jpg';
    if (gheeImagePreview) gheeImagePreview.src = currentGheeModalImageBase64;
    if (gheeModalHeaderTitle) gheeModalHeaderTitle.textContent = `✏️ Edit ${item.name}`;

    if (gheeModal) gheeModal.classList.add('open');
  };

  window.toggleGheeVisibility = (id) => {
    const item = currentSettings.gheeProducts?.find(p => p.id === id);
    if (!item) return;
    item.visible = !(item.visible !== false);
    renderAdminGheeList();
    showToast(`${item.name} is now ${item.visible ? 'Visible' : 'Hidden'} on website.`);
  };

  window.deleteGheeProduct = (id) => {
    const item = currentSettings.gheeProducts?.find(p => p.id === id);
    if (!item) return;
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      currentSettings.gheeProducts = currentSettings.gheeProducts.filter(p => p.id !== id);
      renderAdminGheeList();
      showToast(`Deleted ${item.name}. Click "Save All Changes" to apply.`);
    }
  };

  // --------------------------------------------------------------------------
  // 4. Save & Reset Handlers
  // --------------------------------------------------------------------------
  const btnSave = document.getElementById('btnSaveAdmin');
  btnSave?.addEventListener('click', () => {
    currentSettings.primaryPhone = elPrimaryPhone?.value.trim() || DEFAULT_SETTINGS.primaryPhone;
    currentSettings.secondaryPhone = elSecondaryPhone?.value.trim() || DEFAULT_SETTINGS.secondaryPhone;
    currentSettings.fssaiNo = elFssaiNo?.value.trim() || DEFAULT_SETTINGS.fssaiNo;
    currentSettings.address = elAddress?.value.trim() || DEFAULT_SETTINGS.address;

    currentSettings.prices = {
      a1: parseFloat(elPriceA1?.value) || 65,
      a2: parseFloat(elPriceA2?.value) || 120,
      buffalo: parseFloat(elPriceBuffalo?.value) || 120,
      paneer: parseFloat(elPricePaneer?.value) || 120
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
      showToast('All changes saved successfully! Live website updated.');
    } catch (err) {
      alert('Could not save to localStorage (storage quota may be exceeded). Try uploading smaller images.');
    }
  });

  const btnReset = document.getElementById('btnResetDefaults');
  btnReset?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all prices, Ghee products, numbers and images to default settings?')) {
      localStorage.removeItem(STORAGE_KEY);
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      populateForm();
      showToast('Reset to original default settings!');
    }
  });

  // Helpers
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  function showToast(msg) {
    let t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:90px;right:30px;background:#203b14;color:#fff;padding:14px 24px;border-radius:12px;font-weight:600;z-index:10000;box-shadow:0 8px 24px rgba(0,0,0,0.25);font-family:sans-serif;animation:fadeIn 0.2s ease;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  // Initial Load
  populateForm();
});
