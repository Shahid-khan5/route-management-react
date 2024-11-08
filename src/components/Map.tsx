import React from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { Location } from '../types';

interface MapProps {
  locations: Location[];
  directions: google.maps.DirectionsResult | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 36.1699,
  lng: -115.1398
};

export function Map({ locations, directions }: MapProps) {
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={11}
      center={defaultCenter}
      options={{
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#2563eb',
              strokeWeight: 4
            }
          }}
        />
      )}
    </GoogleMap>
  );
}