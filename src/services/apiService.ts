
import axios from 'axios';

// Define the API base URL
const API_URL = '';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API functions
export const apiService = {
  // Get user data by Telegram ID
  getUserData: async (tgId: number) => {
    try {
      const response = await api.get(`/users/${tgId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },
  
  // Get all available upgrades
  getUpgrades: async () => {
    try {
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
      // Format the request body correctly
      const requestBody = {
        tg_id: tgId
      };
      console.log("Creating user with request:", requestBody);
      const response = await api.post('/api/users/create', requestBody);
      console.log("Create user response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },
  
  // Add balance to user
  addBalance: async (tgId: number, coins: number) => {
    try {
      const response = await api.post(`/api/users/${tgId}/balance/add`);
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
