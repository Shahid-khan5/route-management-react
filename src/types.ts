export interface Location {
  address: string;
  stopDuration: number;
  placeId?: string;
  lat?: number;
  lng?: number;
}

export interface Stop {
  address: string;
  arrivalTime: Date;
  departureTime: Date;
  stopDuration: number;
  isLastStop: boolean;
}

export interface RouteResults {
  homeAddress: string;
  departureTime: Date;
  stops: Stop[];
  totalDuration: number;
}