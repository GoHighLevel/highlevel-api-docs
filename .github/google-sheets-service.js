const { google } = require('googleapis');

// Google Sheets configuration
const SPREADSHEET_ID = '1M41yAqW5XcfMUaHA6h6ewJ6tabF_eOVoyu7JfD1iC_U';
const SHEETS_RANGE = 'A:C'; // Assuming columns: Product Area, Engineering Manager, Team
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

/**
 * Create Google Sheets API client using service account credentials
 */
function createSheetsClient() {
  try {
    // Parse the service account credentials from environment variable
    const serviceAccountJson = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      throw new Error('GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON environment variable is not set');
    }

    const credentials = JSON.parse(serviceAccountJson);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error creating Google Sheets client:', error);
    throw error;
  }
}

/**
 * Fetch product area and engineering manager data from Google Sheets
 * @returns {Promise<Object>} Object containing product mapping and all product areas
 */
async function fetchProductAreaData() {
  try {
    const sheets = createSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEETS_RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in the Google Sheet');
      return { productMapping: {}, allProductAreas: [] };
    }

    // Skip header row and process data
    const dataRows = rows.slice(1);
    const productMapping = {};
    const allProductAreas = [];

    dataRows.forEach(row => {
      if (row.length >= 2) {
        const productArea = row[0]?.trim().toLowerCase();
        const engineeringManager = row[1]?.trim();
        const team = row[2]?.trim();

        if (productArea && engineeringManager) {
          productMapping[productArea] = {
            em: engineeringManager,
            team: team || 'unknown',
            product: productArea
          };
          allProductAreas.push(productArea);
        }
      }
    });

    console.log(`Loaded ${Object.keys(productMapping).length} product areas from Google Sheets`);
    
    return {
      productMapping,
      allProductAreas: [...new Set(allProductAreas)].sort() // Remove duplicates and sort
    };
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    
    // Return fallback data based on existing process-issue.js configuration
    console.log('Falling back to hardcoded product areas');
    return getFallbackProductData();
  }
}

/**
 * Get fallback product data from the existing configuration
 * @returns {Object} Fallback product mapping and areas
 */
function getFallbackProductData() {
  // Extract from existing PRODUCT_CHANNELS in process-issue.js
  const fallbackAreas = [
    'ad-publishing', 'blogs', 'bulk-actions', 'calendars', 'certificates',
    'client-portal', 'communities', 'contacts', 'conversations', 'conversations-ai',
    'custom-objects', 'emails', 'forms', 'funnels', 'gokollab', 'integrations',
    'launchpad', 'lc-email', 'lc-phone', 'lc-phone-sms', 'lc-phone-voice',
    'lc-whatsapp', 'marketplace', 'marketplace-modules', 'membership',
    'onboarding', 'opportunities', 'payment-products', 'payments', 'proposals',
    'prospecting', 'reporting', 'reputation', 'reselling', 'saas', 'snapshots',
    'social-planner', 'surveys', 'templates', 'text', 'voice', 'wordpress',
    'workflows', 'yext'
  ];

  return {
    productMapping: {}, // Empty as we'll use existing PRODUCT_CHANNELS
    allProductAreas: fallbackAreas
  };
}

/**
 * Get engineering manager and team info for a specific product area
 * @param {string} productArea - The product area to look up
 * @returns {Promise<Object|null>} Manager and team info or null if not found
 */
async function getProductInfo(productArea) {
  try {
    const { productMapping } = await fetchProductAreaData();
    const normalizedProductArea = productArea?.toLowerCase().trim();
    
    return productMapping[normalizedProductArea] || null;
  } catch (error) {
    console.error('Error getting product info:', error);
    return null;
  }
}

/**
 * Get all available product areas
 * @returns {Promise<string[]>} Array of all product areas
 */
async function getAllProductAreas() {
  try {
    const { allProductAreas } = await fetchProductAreaData();
    return allProductAreas;
  } catch (error) {
    console.error('Error getting all product areas:', error);
    return getFallbackProductData().allProductAreas;
  }
}

module.exports = {
  fetchProductAreaData,
  getProductInfo,
  getAllProductAreas,
  getFallbackProductData
};