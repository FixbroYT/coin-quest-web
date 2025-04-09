
import { apiService } from "./apiService";
import { Player, Upgrade, Location } from "@/types/game";

// Load user data
export const loadUserData = async (tgId: number): Promise<Player | null> => {
  return await apiService.getUserData(tgId);
};

// Load upgrades
export const loadUpgrades = async (): Promise<Upgrade[]> => {
  return await apiService.getUpgrades();
};

// Load locations
export const loadLocations = async (): Promise<Location[]> => {
  return await apiService.getLocations();
};

// Add coins to user balance
export const addCoinsToBalance = async (tgId: number, amount: number): Promise<number | null> => {
  const response = await apiService.addBalance(tgId, amount);
  return response ? response.new_balance : null;
};

// Purchase an upgrade
export const buyUpgrade = async (tgId: number, upgradeId: number): Promise<{success: boolean, newCoins?: number} | null> => {
  const response = await apiService.buyUpgrade(tgId, upgradeId);
  if (response) {
    return {
      success: response.success,
      newCoins: response.new_coins
    };
  }
  return null;
};

// Buy a location
export const buyLocation = async (tgId: number, locationId: number): Promise<{success: boolean, newCoins?: number, ownedLocations?: number[]} | null> => {
  const response = await apiService.buyLocation(tgId, locationId);
  if (response) {
    return {
      success: response.success,
      newCoins: response.new_coins,
      ownedLocations: response.owned_locations
    };
  }
  return null;
};

// Set current location
export const setUserLocation = async (tgId: number, locationId: number): Promise<{success: boolean, currentLocation?: string} | null> => {
  const response = await apiService.setLocation(tgId, locationId);
  return response;
};

// Create a new user
export const createNewUser = async (tgId: number): Promise<Player | null> => {
  console.log("Creating new user with Telegram ID:", tgId);
  return await apiService.createUser(tgId);
};

// Get user's current income
export const getUserIncome = async (tgId: number): Promise<number | null> => {
  const response = await apiService.getUserIncome(tgId);
  return response ? response.income : null;
};
