// Types for the Senior Frontend Training App

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  description: string;
}

export type SeatClass = "economy" | "business" | "first";

export interface FlightFormData {
  passengerName: string;
  email: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  seatClass: SeatClass;
}

export interface FlightValidationErrors {
  passengerName?: string;
  email?: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: string;
  seatClass?: string;
  general?: string;
}

export type Theme = "light" | "dark" | "system";

export type ExerciseTab = "exercise" | "hints" | "solution";

export interface ExerciseProps {
  activeTab: ExerciseTab;
  onTabChange: (tab: ExerciseTab) => void;
}
