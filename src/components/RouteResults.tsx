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
      {/* Original Structured Format */}
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
            key={`structured-${index}`}
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

      {/* Narrative Format */}
      <div className="mt-8 space-y-3">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="font-medium">Your total drive time is {Math.round(results.totalDuration)} minutes</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p>You will leave Home at {format(results.departureTime, 'h:mm a')} and drive to {results.stops[0].address}</p>
          {results.stops[0].stopDuration && (
            <p className="text-red-600">Your stop duration is {results.stops[0].stopDuration} minutes</p>
          )}
          <p>You will leave at {format(results.stops[0].departureTime, 'h:mm a')}</p>
        </div>

        {results.stops.slice(1).map((stop, index) => (
          <div key={`narrative-${index}`} className={`p-4 rounded-lg ${stop.isLastStop ? 'bg-orange-50' : 'bg-blue-50'}`}>
            <p>You will arrive at {stop.address} at {format(stop.arrivalTime, 'h:mm a')}</p>
            {!stop.isLastStop && (
              <>
                <p className="text-red-600">Your stop duration is {stop.stopDuration} minutes</p>
                <p>You will leave at {format(stop.departureTime, 'h:mm a')}</p>
              </>
            )}
            {stop.isLastStop && (
              <p className="font-medium mt-2">This is your last stop</p>
            )}
          </div>
        ))}

        <div className="bg-orange-100 p-4 rounded-lg text-center">
          <p className="font-medium">You will arrive at your last destination,</p>
          <p className="font-medium">{results.stops[results.stops.length - 1].address} at:</p>
          <p className="text-xl font-bold mt-2">
            {format(results.stops[results.stops.length - 1].arrivalTime, 'h:mm a')}
          </p>
        </div>
      </div>
    </div>
  );
}