import React from 'react';
import { format } from 'date-fns';
import { RouteResults } from '../types';

interface RouteResultsProps {
  results: RouteResults;
  visible: boolean;
}

export function RouteResultsDisplay({ results, visible }: RouteResultsProps) {
  if (!visible || !results) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">RESULTS</h2>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-semibold text-lg">Home</h3>
          <p className="text-gray-600">{results.homeAddress}</p>
          <p className="text-blue-600">
            Leave at {format(results.departureTime, 'h:mm a')}
          </p>
        </div>

        {results.stops.map((stop, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              stop.isLastStop
                ? 'bg-blue-50'
                : index % 2 === 0
                ? 'bg-gray-50'
                : 'bg-white'
            }`}
          >
            <h3 className="font-semibold">
              {stop.isLastStop ? 'Final Destination' : `Destination #${index + 1}`}
            </h3>
            <p className="text-blue-600 underline">{stop.address}</p>
            <p className="text-gray-600">
              Arrive at {format(stop.arrivalTime, 'h:mm a')}
              {!stop.isLastStop && ` - Leave at ${format(stop.departureTime, 'h:mm a')}`}
            </p>
            {!stop.isLastStop && (
              <p className="text-red-500">
                Stop duration: {stop.stopDuration} minutes
              </p>
            )}
            {stop.isLastStop && (
              <p className="mt-2 font-medium text-green-600">
                This is your last stop
              </p>
            )}
          </div>
        ))}

        <div className="mt-6 pt-4 border-t">
          <p className="text-lg font-semibold">
            Total Duration: {Math.round(results.totalDuration)} minutes
          </p>
        </div>
      </div>
    </div>
  );
}