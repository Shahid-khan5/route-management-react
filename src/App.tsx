import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { LocationInput } from './components/LocationInput';
import { RouteResultsDisplay } from './components/RouteResults';
import { Map } from './components/Map';
import { GoogleMapsProvider } from './components/GoogleMapsProvider';
import { Location, RouteResults } from './types';
import { addMinutes } from 'date-fns';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDaQrvZcKERjsCjOt7nJizrPfetsNVDMds';

function App() {
  const [locations, setLocations] = useState<Location[]>([
    { address: '', stopDuration: 0 },
    { address: '', stopDuration: 60 },
  ]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [results, setResults] = useState<RouteResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [targetTime, setTargetTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLocationUpdate = (index: number, location: Location) => {
    const newLocations = [...locations];
    newLocations[index] = location;
    setLocations(newLocations);
  };

  const handleLocationRemove = (index: number) => {
    if (locations.length > 2) {
      setLocations(locations.filter((_, i) => i !== index));
    }
  };

  const addLocation = () => {
    setLocations([...locations, { address: '', stopDuration: 60 }]);
  };

  const calculateRoute = async () => {
    if (!window.google || !locations[0].address) return;
    
    setLoading(true);
    
    try {
      const directionsService = new google.maps.DirectionsService();
      
      const waypoints = locations.slice(1, -1).map(location => ({
        location: { placeId: location.placeId || location.address },
        stopover: true
      }));

      const result = await directionsService.route({
        origin: { placeId: locations[0].placeId || locations[0].address },
        destination: { 
          placeId: locations[locations.length - 1].placeId || locations[locations.length - 1].address 
        },
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false
      });

      setDirections(result);

      // Calculate times
      let currentTime = targetTime 
        ? new Date(`2024-01-01 ${targetTime}`)
        : new Date();

      if (targetTime) {
        // Calculate backward from target time
        let totalDuration = 0;
        for (let i = locations.length - 1; i > 0; i--) {
          totalDuration += locations[i].stopDuration;
          if (result.routes[0].legs[i-1]) {
            totalDuration += result.routes[0].legs[i-1].duration!.value / 60;
          }
        }
        currentTime = addMinutes(new Date(`2024-01-01 ${targetTime}`), -totalDuration);
      }

      const routeResults: RouteResults = {
        homeAddress: locations[0].address,
        departureTime: currentTime,
        stops: [],
        totalDuration: 0
      };

      let totalDuration = 0;

      for (let i = 0; i < locations.length - 1; i++) {
        const leg = result.routes[0].legs[i];
        const arrivalTime = addMinutes(currentTime, leg.duration!.value / 60);
        const departureTime = addMinutes(arrivalTime, locations[i + 1].stopDuration);

        routeResults.stops.push({
          address: locations[i + 1].address,
          arrivalTime,
          departureTime,
          stopDuration: locations[i + 1].stopDuration,
          isLastStop: i === locations.length - 2
        });

        totalDuration += (leg.duration!.value / 60) + locations[i + 1].stopDuration;
        currentTime = departureTime;
      }

      routeResults.totalDuration = totalDuration;
      setResults(routeResults);
      setShowResults(true);
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleMapsProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Route Management
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {locations.map((location, index) => (
                <LocationInput
                  key={index}
                  location={location}
                  index={index}
                  isHome={index === 0}
                  onUpdate={handleLocationUpdate}
                  onRemove={handleLocationRemove}
                />
              ))}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={addLocation}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Location
                </button>

                <div className="flex-1 flex items-center gap-4">
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={calculateRoute}
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Calculating...' : 'Calculate Route'}
                  </button>
                </div>
              </div>

              {results && <RouteResultsDisplay results={results} visible={showResults} />}
            </div>

            <div className="lg:sticky lg:top-8 space-y-6">
              <Map
                locations={locations}
                directions={directions}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}

export default App;