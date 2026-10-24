/**
 * Pushkala Organic Dairy Farm — Vercel Serverless Function for Neon PostgreSQL
 * Handles GET (fetch settings) and POST (save settings)
 */

const DEFAULT_SETTINGS = {
  primaryPhone: '9742216162',
  secondaryPhone: '7204726665',
  fssaiNo: '21226007000022',
  address: 'World School, Hulimangala, Jigani Hobli, Bangalore – 560105',
  prices: { a1: 65, a2: 120, buffalo: 120, paneer: 120 },
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
  images: { a1: '', a2: '', buffalo: '', paneer: '', visit: '', logo: '' }
};

function getConnectionString(req) {
  const customHeader = req.headers['x-neon-connection-string'];
  if (customHeader && typeof customHeader === 'string' && customHeader.trim()) {
    return customHeader.trim();
  }
  return (
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    ''
  ).trim();
}

async function executeNeonSql(connString, query, params = []) {
  if (!connString) {
    throw new Error('Neon connection string not provided');
  }

  const u = new URL(connString);
  const host = u.hostname;
  const username = decodeURIComponent(u.username);
  const password = decodeURIComponent(u.password);

  const endpoint = `https://${host}/sql`;
  const auth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, params }),
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Neon HTTP error ${res.status}`);
  }

  return data;
}

async function ensureTableExists(connString) {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY DEFAULT 'general',
      primary_phone TEXT NOT NULL DEFAULT '9742216162',
      secondary_phone TEXT NOT NULL DEFAULT '7204726665',
      fssai_no TEXT NOT NULL DEFAULT '21226007000022',
      address TEXT NOT NULL DEFAULT 'World School, Hulimangala, Jigani Hobli, Bangalore – 560105',
      prices JSONB NOT NULL DEFAULT '{"a1": 65, "a2": 120, "buffalo": 120, "paneer": 120}'::jsonb,
      ghee_products JSONB DEFAULT '[]'::jsonb,
      images JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;
  await executeNeonSql(connString, createTableSql);
}

function mapRowToSettings(row) {
  if (!row) return DEFAULT_SETTINGS;
  return {
    primaryPhone: row.primary_phone || DEFAULT_SETTINGS.primaryPhone,
    secondaryPhone: row.secondary_phone || DEFAULT_SETTINGS.secondaryPhone,
    fssaiNo: row.fssai_no || DEFAULT_SETTINGS.fssaiNo,
    address: row.address || DEFAULT_SETTINGS.address,
    prices: (row.prices && typeof row.prices === 'object') ? row.prices : DEFAULT_SETTINGS.prices,
    gheeProducts: Array.isArray(row.ghee_products) && row.ghee_products.length > 0 ? row.ghee_products : DEFAULT_SETTINGS.gheeProducts,
    images: (row.images && typeof row.images === 'object') ? row.images : DEFAULT_SETTINGS.images,
    updatedAt: row.updated_at || null
  };
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-neon-connection-string');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const connString = getConnectionString(req);

  // Test action
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (urlObj.searchParams.get('action') === 'test') {
    if (!connString) {
      return res.status(400).json({ ok: false, message: 'No connection string provided' });
    }
    try {
      await ensureTableExists(connString);
      const test = await executeNeonSql(connString, 'SELECT 1 as connected;');
      return res.status(200).json({ ok: true, message: 'Successfully connected to Neon PostgreSQL!' });
    } catch (err) {
      return res.status(500).json({ ok: false, message: err.message });
    }
  }

  // GET: Fetch settings
  if (req.method === 'GET') {
    if (!connString) {
      return res.status(200).json({
        ok: true,
        source: 'default_fallback',
        data: DEFAULT_SETTINGS,
        warning: 'Neon connection string not configured'
      });
    }

    try {
      await ensureTableExists(connString);
      const result = await executeNeonSql(connString, 'SELECT * FROM site_settings WHERE id = $1 LIMIT 1;', ['general']);
      
      if (result.rows && result.rows.length > 0) {
        return res.status(200).json({
          ok: true,
          source: 'neon',
          data: mapRowToSettings(result.rows[0])
        });
      } else {
        // Table created but no row, insert default
        const insertSql = `
          INSERT INTO site_settings (id, primary_phone, secondary_phone, fssai_no, address, prices)
          VALUES ('general', $1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const inserted = await executeNeonSql(connString, insertSql, [
          DEFAULT_SETTINGS.primaryPhone,
          DEFAULT_SETTINGS.secondaryPhone,
          DEFAULT_SETTINGS.fssaiNo,
          DEFAULT_SETTINGS.address,
          JSON.stringify(DEFAULT_SETTINGS.prices)
        ]);
        return res.status(200).json({
          ok: true,
          source: 'neon_initialized',
          data: mapRowToSettings(inserted.rows[0])
        });
      }
    } catch (err) {
      console.error('[API settings GET error]', err);
      return res.status(200).json({
        ok: false,
        source: 'default_on_error',
        data: DEFAULT_SETTINGS,
        error: err.message
      });
    }
  }

  // POST: Save settings
  if (req.method === 'POST') {
    if (!connString) {
      return res.status(400).json({
        ok: false,
        error: 'Neon connection string is not configured on the server or in the request.'
      });
    }

    try {
      if (!req.body) {
        try {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString('utf8');
          if (raw) req.body = JSON.parse(raw);
        } catch(e) {}
      }

      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(e) {}
      }
      body = body || {};

      const primaryPhone = (body.primaryPhone || DEFAULT_SETTINGS.primaryPhone).trim();
      const secondaryPhone = (body.secondaryPhone || DEFAULT_SETTINGS.secondaryPhone).trim();
      const fssaiNo = (body.fssaiNo || DEFAULT_SETTINGS.fssaiNo).trim();
      const address = (body.address || DEFAULT_SETTINGS.address).trim();
      const prices = JSON.stringify(body.prices || DEFAULT_SETTINGS.prices);
      const gheeProducts = JSON.stringify(body.gheeProducts || DEFAULT_SETTINGS.gheeProducts);
      const images = JSON.stringify(body.images || DEFAULT_SETTINGS.images);

      await ensureTableExists(connString);

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

      const result = await executeNeonSql(connString, upsertSql, [
        primaryPhone,
        secondaryPhone,
        fssaiNo,
        address,
        prices,
        gheeProducts,
        images
      ]);

      const savedSettings = mapRowToSettings(result.rows[0]);
      return res.status(200).json({
        ok: true,
        source: 'neon',
        data: savedSettings
      });
    } catch (err) {
      console.error('[API settings POST error]', err);
      return res.status(500).json({
        ok: false,
        error: err.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
