// Mock data simulating API responses for all exercises
import type { Customer, Location } from './types';

// ============================================
// Customer List Mock Data
// ============================================
export const mockCustomers: Customer[] = [
  { id: '1', name: 'María García', email: 'maria.garcia@email.com', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', createdAt: new Date('2024-02-20') },
  { id: '3', name: 'Ana Martínez', email: 'ana.martinez@email.com', createdAt: new Date('2024-03-10') },
  { id: '4', name: 'Juan López', email: 'juan.lopez@email.com', createdAt: new Date('2024-04-05') },
  { id: '5', name: 'Laura Sánchez', email: 'laura.sanchez@email.com', createdAt: new Date('2024-05-12') },
  { id: '6', name: 'Pedro Fernández', email: 'pedro.fernandez@email.com', createdAt: new Date('2024-06-18') },
];

// ============================================
// HackerMaps Mock Data - Simulated API
// ============================================
export const mockLocations: Location[] = [
  { id: '1', name: 'Silicon Valley HQ', latitude: 37.3861, longitude: -122.0839, country: 'USA', description: 'Main tech hub headquarters' },
  { id: '2', name: 'Tokyo Innovation Lab', latitude: 35.6762, longitude: 139.6503, country: 'Japan', description: 'Asian innovation center' },
  { id: '3', name: 'Berlin Startup Hub', latitude: 52.5200, longitude: 13.4050, country: 'Germany', description: 'European startup ecosystem' },
  { id: '4', name: 'Sydney Tech Park', latitude: -33.8688, longitude: 151.2093, country: 'Australia', description: 'Oceania tech center' },
  { id: '5', name: 'São Paulo Digital', latitude: -23.5505, longitude: -46.6333, country: 'Brazil', description: 'Latin America digital hub' },
  { id: '6', name: 'London Fintech Center', latitude: 51.5074, longitude: -0.1278, country: 'UK', description: 'Financial technology center' },
  { id: '7', name: 'Singapore AI Lab', latitude: 1.3521, longitude: 103.8198, country: 'Singapore', description: 'AI research facility' },
  { id: '8', name: 'Toronto Cloud Campus', latitude: 43.6532, longitude: -79.3832, country: 'Canada', description: 'Cloud computing center' },
];

// Simulated API functions with artificial delay
export const fetchLocations = (): Promise<Location[]> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // 10% chance of API error for testing error states
      if (Math.random() < 0.1) {
        reject(new Error('API Error: Failed to fetch locations'));
      }
      resolve(mockLocations);
    }, 1500);
  });
};

export const fetchCustomers = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCustomers);
    }, 800);
  });
};

// Generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
