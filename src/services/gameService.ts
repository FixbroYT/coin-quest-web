
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
export const buyUpgrade = async (tgId: number, upgradeId: number): Promise<boolean> => {
  const response = await apiService.buyUpgrade(tgId, upgradeId);
  return !!response;
};

// Buy a location
export const buyLocation = async (tgId: number, locationId: number): Promise<boolean> => {
  const response = await apiService.buyLocation(tgId, locationId);
  return !!response;
};

// Set current location
export const setUserLocation = async (tgId: number, locationId: number): Promise<boolean> => {
  const response = await apiService.setLocation(tgId, locationId);
  return !!response;
};

// Create a new user
export const createNewUser = async (tgId: number): Promise<boolean> => {
  const response = await apiService.createUser(tgId);
  return !!response;
};
