
import axios from 'axios';

// Define the API base URL
const API_URL = import.meta.env.DEV ? window.location.origin : window.location.origin;

// Create axios instance with detailed logging
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

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

// API functions
export const apiService = {
  // Get user data by Telegram ID
  getUserData: async (tgId: number) => {
    try {
      console.log(`Fetching user data for ID: ${tgId}`);
      const response = await api.get(`/users/${tgId}`);
      console.log("getUserData response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },
  
  // Get all available upgrades
  getUpgrades: async () => {
    try {
      console.log("Fetching all upgrades");
      const response = await api.get('/upgrades');
      return response.data;
    } catch (error) {
      console.error('Error fetching upgrades:', error);
      return [];
    }
  },
  
  // Buy an upgrade for a user
  buyUpgrade: async (tgId: number, upgradeId: number) => {
    try {
      const response = await api.post(`/users/${tgId}/buy_upgrade/${upgradeId}`);
      return response.data;
    } catch (error) {
      console.error('Error buying upgrade:', error);
      return null;
    }
  },
  
  // Get all available locations
  getLocations: async () => {
    try {
      console.log("Fetching all locations");
      const response = await api.get('/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  },
  
  // Buy a location for a user
  buyLocation: async (tgId: number, locationId: number) => {
    try {
      const response = await api.post(`/users/${tgId}/buy_location/${locationId}`);
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
  }
};
