/**
 * Pushkala Organic Dairy Farm — Global Configuration
 * Centralized configuration for Neon PostgreSQL database & fallback settings.
 */

window.PODF_CONFIG = {
  // Neon PostgreSQL Connection String:
  // e.g. "postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
  // (You can also configure this in Vercel as DATABASE_URL, or in the Admin Portal)
  neonConnectionString: '',

  // Fallback defaults if offline or before database loads
  defaultPrimaryPhone: '9742216162',
  defaultSecondaryPhone: '7204726665',
  defaultFssaiNo: '21226007000022',
  defaultAddress: 'World School, Hulimangala, Jigani Hobli, Bangalore – 560105',
  defaultPrices: {
    a1: 65,
    a2: 120,
    buffalo: 120,
    paneer: 120
  }
};
