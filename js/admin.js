/**
 * Pushkala Organic Dairy Farm — Admin Management Portal JS
 * Manages phone numbers, pricing, product images, and farm contact settings.
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'podf_site_settings_v1';

  // Default values
  const DEFAULT_SETTINGS = {
    primaryPhone: '7204736665',
    secondaryPhone: '7204726665',
    fssaiNo: '21226007000022',
    address: 'World School, Hulimangala, Jigani Hobli, Bangalore – 560105',
    prices: {
      a1: 65,
      a2: 120,
      buffalo: 120,
      paneer: 120,
      ghee: 750
    },
    images: {
      a1: '',
      a2: '',
      buffalo: '',
      paneer: '',
      ghee: '',
      visit: '',
      logo: ''
    }
  };

  // Load existing settings from localStorage or defaults
  function getSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
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
  const elPriceGhee = document.getElementById('admPriceGhee');

  // Previews
  const prevA1 = document.getElementById('prevA1');
  const prevA2 = document.getElementById('prevA2');
  const prevBuffalo = document.getElementById('prevBuffalo');
  const prevPaneer = document.getElementById('prevPaneer');
  const prevGhee = document.getElementById('prevGhee');
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
    if (elPriceGhee) elPriceGhee.value = p.ghee || 750;

    const imgs = currentSettings.images || {};
    if (imgs.a1 && prevA1) prevA1.src = imgs.a1;
    if (imgs.a2 && prevA2) prevA2.src = imgs.a2;
    if (imgs.buffalo && prevBuffalo) prevBuffalo.src = imgs.buffalo;
    if (imgs.paneer && prevPaneer) prevPaneer.src = imgs.paneer;
    if (imgs.ghee && prevGhee) prevGhee.src = imgs.ghee;
    if (imgs.visit && prevVisit) prevVisit.src = imgs.visit;
    if (imgs.logo && prevLogo) prevLogo.src = imgs.logo;
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
  setupFileHandler('fileGhee', 'prevGhee', 'ghee');
  setupFileHandler('fileVisit', 'prevVisit', 'visit');
  setupFileHandler('fileLogo', 'prevLogo', 'logo');

  // Save Settings
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
      paneer: parseFloat(elPricePaneer?.value) || 120,
      ghee: parseFloat(elPriceGhee?.value) || 750
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
      showToast('Settings saved successfully! Website updated.');
    } catch (err) {
      alert('Could not save to localStorage (storage quota may be exceeded). Try smaller images.');
    }
  });

  // Reset Defaults
  const btnReset = document.getElementById('btnResetDefaults');
  btnReset?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all prices, numbers and images to defaults?')) {
      localStorage.removeItem(STORAGE_KEY);
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      populateForm();
      showToast('Reset to original default settings!');
    }
  });

  // Toast Helper
  function showToast(msg) {
    let t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:90px;right:30px;background:#203b14;color:#fff;padding:14px 24px;border-radius:12px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);font-family:sans-serif;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  // Initial Load
  populateForm();
});
