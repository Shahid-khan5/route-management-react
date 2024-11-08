import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Trash2 } from 'lucide-react';
import { Location } from '../types';
import { Autocomplete } from '@react-google-maps/api';

interface LocationInputProps {
  location: Location;
  index: number;
  isHome?: boolean;
  onUpdate: (index: number, location: Location) => void;
  onRemove: (index: number) => void;
}

export function LocationInput({ location, index, isHome, onUpdate, onRemove }: LocationInputProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(location.address);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setInputValue(location.address);
  }, [location.address]);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onUpdate(index, {
          ...location,
          address: place.formatted_address,
          placeId: place.place_id,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        });
        setIsTyping(false);
      }
    }
  };

  const handleManualInput = (value: string) => {
    setInputValue(value);
    setIsTyping(true);

    // Update the location with just the address for now
    onUpdate(index, {
      ...location,
      address: value,
      // Clear other location data since we don't have them yet
      placeId: undefined,
      lat: undefined,
      lng: undefined,
    });
  };

  const handleInputBlur = async () => {
    if (isTyping && inputValue) {
      try {
        // Create a Geocoder instance
        const geocoder = new google.maps.Geocoder();
        
        // Geocode the manually entered address
        const result = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
          geocoder.geocode(
            { address: inputValue },
            (results, status) => {
              if (status === 'OK' && results && results[0]) {
                resolve(results[0]);
              } else {
                reject(new Error('Geocoding failed'));
              }
            }
          );
        });

        // Update with the geocoded information
        onUpdate(index, {
          ...location,
          address: result.formatted_address,
          placeId: result.place_id,
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        });
      } catch (error) {
        // If geocoding fails, keep the manually entered address
        console.warn('Geocoding failed:', error);
        onUpdate(index, {
          ...location,
          address: inputValue,
          placeId: undefined,
          lat: undefined,
          lng: undefined,
        });
      }
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-500" />
        <span className="font-medium">
          {isHome ? 'Home Address' : `Destination #${index}`}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          restrictions={{ country: 'us' }}
          fields={['formatted_address', 'geometry.location', 'place_id']}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleManualInput(e.target.value)}
            onBlur={handleInputBlur}
            placeholder="Enter address"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Autocomplete>

        {!isHome && (
          <>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <input
                type="number"
                value={location.stopDuration}
                onChange={(e) => onUpdate(index, { ...location, stopDuration: parseInt(e.target.value) || 0 })}
                placeholder="Duration (min)"
                className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => onRemove(index)}
              className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}