import React from 'react';
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
  const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

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
      }
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
            value={location.address}
            onChange={(e) => onUpdate(index, { ...location, address: e.target.value })}
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