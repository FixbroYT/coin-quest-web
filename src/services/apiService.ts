
import axios from 'axios';

// Define the API base URL directly
const API_URL = 'https://apple-combat-backend-production.up.railway.app';

// Create axios instance with detailed logging
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Simple cache for API responses
const responseCache = new Map();
const CACHE_TTL = 60000; // 1 minute in milliseconds

// Add request interceptor for logging
api.interceptors.request.use(request => {
  console.log('API Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    baseURL: request.baseURL
  });
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Helper for cached GET requests
const cachedGet = async (url) => {
  const cacheKey = url;
  const now = Date.now();
  
  // Check if we have a valid cached response
  if (responseCache.has(cacheKey)) {
    const { data, timestamp } = responseCache.get(cacheKey);
    // Use cache if it's less than TTL old
    if (now - timestamp < CACHE_TTL) {
      console.log(`Using cached response for: ${url}`);
      return data;
    }
  }
  
  // No valid cache, make the request
  try {
    const response = await api.get(url);
    // Store in cache
    responseCache.set(cacheKey, {
      data: response.data,
      timestamp: now
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// Clear cache for a specific endpoint or user
const clearCache = (pattern) => {
  if (!pattern) {
    responseCache.clear();
    return;
  }
  
  // Clear specific cache entries that match the pattern
  for (const key of responseCache.keys()) {
    if (key.includes(pattern)) {
      responseCache.delete(key);
    }
  }
};

// API functions
export const apiService = {
  // Get user data by Telegram ID
  getUserData: async (tgId: number) => {
    try {
      console.log(`Fetching user data for ID: ${tgId}`);
      // This shouldn't be cached as it changes frequently
      const response = await api.get(`/users/${tgId}`);
      console.log("getUserData response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },
  
  // Get all available upgrades - can be cached
  getUpgrades: async () => {
    try {
      console.log("Fetching all upgrades");
      return await cachedGet('/upgrades');
    } catch (error) {
      console.error('Error fetching upgrades:', error);
      return [];
    }
  },
  
  // Buy an upgrade for a user
  buyUpgrade: async (tgId: number, upgradeId: number) => {
    try {
      const response = await api.post(`/users/${tgId}/buy_upgrade/${upgradeId}`);
      // Clear user-specific cache since data has changed
      clearCache(`/users/${tgId}`);
      return response.data;
    } catch (error) {
      console.error('Error buying upgrade:', error);
      return null;
    }
  },
  
  // Get all available locations - can be cached
  getLocations: async () => {
    try {
      console.log("Fetching all locations");
      return await cachedGet('/locations');
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  },
  
  // Buy a location for a user
  buyLocation: async (tgId: number, locationId: number) => {
    try {
      const response = await api.post(`/users/${tgId}/buy_location/${locationId}`);
      // Clear user-specific cache since data has changed
      clearCache(`/users/${tgId}`);
      return response.data;
    } catch (error) {
      console.error('Error buying location:', error);
      return null;
    }
  },
  
  // Set current location for a user
  setLocation: async (tgId: number, locationId: number) => {
    try {
      const response = await api.post(`/users/${tgId}/set_location/${locationId}`);
      // Clear user-specific cache since data has changed
      clearCache(`/users/${tgId}`);
      return response.data;
    } catch (error) {
      console.error('Error setting location:', error);
      return null;
    }
  },
  
  // Create a new user
  createUser: async (tgId: number) => {
    try {
      console.log(`Creating user with ID: ${tgId}`);
      const requestBody = {
        tg_id: tgId
      };
      console.log("Create user request body:", requestBody);
      
      const response = await api.post('/users/create', requestBody);
      console.log("Create user response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      console.error('Error details:', error.response?.data || error.message);
      return null;
    }
  },
  
  // Add balance to user
  addBalance: async (tgId: number, coins: number) => {
    try {
      const response = await api.post(`/users/${tgId}/balance/add`, { amount: coins });
      // Clear user-specific cache since data has changed
      clearCache(`/users/${tgId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding balance:', error);
      return null;
    }
  },
  
  // Get user's current income
  getUserIncome: async (tgId: number) => {
    try {
      const response = await api.get(`/users/${tgId}/income`);
      return response.data;
    } catch (error) {
      console.error('Error getting user income:', error);
      return null;
    }
  },
  
  // Clear cache manually if needed
  clearCache
};
