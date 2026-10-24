/**
 * Pushkala Organic Dairy Farm — Database & Settings Synchronization Layer
 * Connects to Neon Serverless PostgreSQL with offline localStorage fallback
 * and cross-device synchronization.
 */

(function (window) {
  'use strict';

  const CACHE_KEY = 'podf_site_settings_v2';
  const CONFIG_STORAGE_KEY = 'podf_neon_config_v2';

  // Retrieve Neon config (check window.PODF_CONFIG, then localStorage override)
  function getNeonConfig() {
    let connStr = (window.PODF_CONFIG && window.PODF_CONFIG.neonConnectionString) || '';

    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.neonConnectionString) connStr = parsed.neonConnectionString.trim();
      }
    } catch (e) {}

    return { neonConnectionString: connStr.trim() };
  }

  function setNeonConfig(connStr) {
    const cleanStr = (connStr || '').trim();

    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({
        neonConnectionString: cleanStr
      }));
    } catch (e) {}

    if (window.PODF_CONFIG) {
      window.PODF_CONFIG.neonConnectionString = cleanStr;
    }
  }

  function getDefaultSettings() {
    const cfg = window.PODF_CONFIG || {};
    return {
      primaryPhone: cfg.defaultPrimaryPhone || '9742216162',
      secondaryPhone: cfg.defaultSecondaryPhone || '7204726665',
      fssaiNo: cfg.defaultFssaiNo || '21226007000022',
      address: cfg.defaultAddress || 'World School, Hulimangala, Jigani Hobli, Bangalore – 560105',
      prices: cfg.defaultPrices || { a1: 65, a2: 120, buffalo: 120, paneer: 120 },
      gheeProducts: [
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
      ],
      images: {
        a1: '',
        a2: '',
        buffalo: '',
        paneer: '',
        visit: '',
        logo: ''
      }
    };
  }

  // Get cached settings synchronously for immediate page render
  function getCachedSettings() {
    try {
      const stored = localStorage.getItem(CACHE_KEY) || localStorage.getItem('podf_site_settings_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return Object.assign(getDefaultSettings(), parsed);
        }
      }
    } catch (e) {}
    return getDefaultSettings();
  }

  // Save to local cache
  function cacheSettingsLocally(settings) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not cache settings locally', e);
    }
  }

  // Direct HTTP query to Neon Postgres if /api/settings is not running
  async function directNeonSql(connString, query, params) {
    const u = new URL(connString);
    const host = u.hostname;
    const username = decodeURIComponent(u.username);
    const password = decodeURIComponent(u.password);

    const endpoint = `https://${host}/sql`;
    const auth = 'Basic ' + btoa(`${username}:${password}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, params: params || [] }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Neon SQL error HTTP ${res.status}`);
    }
    return data;
  }

  function mapRowToSettings(row) {
    if (!row) return null;
    const defaults = getDefaultSettings();
    return {
      primaryPhone: row.primary_phone || defaults.primaryPhone,
      secondaryPhone: row.secondary_phone || defaults.secondaryPhone,
      fssaiNo: row.fssai_no || defaults.fssaiNo,
      address: row.address || defaults.address,
      prices: (row.prices && typeof row.prices === 'object') ? row.prices : defaults.prices,
      gheeProducts: Array.isArray(row.ghee_products) && row.ghee_products.length > 0 ? row.ghee_products : defaults.gheeProducts,
      images: (row.images && typeof row.images === 'object') ? row.images : defaults.images,
      updatedAt: row.updated_at || null
    };
  }

  // Fetch settings from Neon Database (via /api/settings or direct Neon HTTP SQL)
  async function fetchSettingsFromDatabase() {
    const { neonConnectionString } = getNeonConfig();

    // 1. Try Vercel Serverless API (/api/settings)
    try {
      const headers = {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      };
      if (neonConnectionString) {
        headers['x-neon-connection-string'] = neonConnectionString;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('/api/settings', {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          cacheSettingsLocally(json.data);
          return { ok: true, data: json.data, source: json.source || 'api' };
        }
      }
    } catch (apiErr) {
      // API not available, proceed to direct fallback
    }

    // 2. Direct Neon HTTP fallback if connection string is configured
    if (neonConnectionString) {
      try {
        const result = await directNeonSql(neonConnectionString, 'SELECT * FROM site_settings WHERE id = $1 LIMIT 1;', ['general']);
        if (result.rows && result.rows.length > 0) {
          const settings = mapRowToSettings(result.rows[0]);
          cacheSettingsLocally(settings);
          return { ok: true, data: settings, source: 'neon_direct' };
        }
      } catch (directErr) {
        console.warn('[Pushkala DB] Direct Neon query error:', directErr.message);
      }
    }

    return { ok: false, data: getCachedSettings(), source: 'cache_fallback' };
  }

  // Save settings to Neon Database and cache
  async function saveSettingsToDatabase(settings) {
    // Always update local cache first
    cacheSettingsLocally(settings);

    const { neonConnectionString } = getNeonConfig();

    // 1. Try Vercel Serverless API (/api/settings)
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      };
      if (neonConnectionString) {
        headers['x-neon-connection-string'] = neonConnectionString;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify(settings),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          cacheSettingsLocally(json.data);
          return { ok: true, savedLocally: true, savedRemote: true, data: json.data };
        }
      }
    } catch (apiErr) {}

    // 2. Direct Neon HTTP SQL fallback
    if (neonConnectionString) {
      try {
        const upsertSql = `
          INSERT INTO site_settings (id, primary_phone, secondary_phone, fssai_no, address, prices, ghee_products, images, updated_at)
          VALUES ('general', $1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, CURRENT_TIMESTAMP)
          ON CONFLICT (id) DO UPDATE SET
            primary_phone = EXCLUDED.primary_phone,
            secondary_phone = EXCLUDED.secondary_phone,
            fssai_no = EXCLUDED.fssai_no,
            address = EXCLUDED.address,
            prices = EXCLUDED.prices,
            ghee_products = EXCLUDED.ghee_products,
            images = EXCLUDED.images,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *;
        `;

        const result = await directNeonSql(neonConnectionString, upsertSql, [
          settings.primaryPhone || '9742216162',
          settings.secondaryPhone || '7204726665',
          settings.fssaiNo || '21226007000022',
          settings.address || '',
          JSON.stringify(settings.prices || {}),
          JSON.stringify(settings.gheeProducts || []),
          JSON.stringify(settings.images || {})
        ]);

        if (result.rows && result.rows.length > 0) {
          const confirmed = mapRowToSettings(result.rows[0]);
          cacheSettingsLocally(confirmed);
          return { ok: true, savedLocally: true, savedRemote: true, data: confirmed };
        }
      } catch (neonErr) {
        console.error('[Pushkala DB] Direct Neon save error:', neonErr);
        return {
          ok: false,
          savedLocally: true,
          savedRemote: false,
          error: neonErr.message
        };
      }
    }

    return {
      ok: true,
      savedLocally: true,
      savedRemote: false,
      warning: 'Saved to local browser. Configure Neon connection string in Admin or Vercel DATABASE_URL to sync across all devices permanently.'
    };
  }

  // Test database connection
  async function testConnection(customConnStr) {
    const connStr = (customConnStr || getNeonConfig().neonConnectionString || '').trim();

    // 1. Try test via API
    try {
      const headers = {};
      if (connStr) headers['x-neon-connection-string'] = connStr;

      const res = await fetch('/api/settings?action=test', {
        method: 'GET',
        headers
      });

      if (res.ok) {
        const json = await res.json();
        return { ok: true, message: json.message || 'Successfully connected to Neon PostgreSQL!' };
      }
    } catch (e) {}

    // 2. Try direct Neon HTTP test
    if (connStr) {
      try {
        await directNeonSql(connStr, 'SELECT 1 as test;');
        return { ok: true, message: 'Successfully connected to Neon PostgreSQL!' };
      } catch (err) {
        return { ok: false, message: `Could not connect to Neon: ${err.message}` };
      }
    }

    return {
      ok: false,
      message: 'Please provide a Neon connection string (e.g. postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require)'
    };
  }

  // Export globally
  window.PODF_DB = {
    getNeonConfig,
    setNeonConfig,
    getDefaultSettings,
    getCachedSettings,
    fetchSettingsFromDatabase,
    saveSettingsToDatabase,
    testConnection
  };

})(window);
