import React from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

interface GoogleMapsProviderProps {
  apiKey: string;
  children: React.ReactNode;
}

export function GoogleMapsProvider({ apiKey, children }: GoogleMapsProviderProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) {
    return <div className="text-red-500">Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div className="text-gray-500">Loading maps...</div>;
  }

  return <>{children}</>;
}