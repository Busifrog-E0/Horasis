import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

const geoUrl = '/countries.json';

export default function WorldMap({
  zones,
  events,
  selectedZone,
  selectedEvent,
  onZoneSelect,
  onEventSelect
}) {
  const [countries, setCountries] = useState([]);
  const filteredEvents = useMemo(() => {
    return selectedZone
      ? events.filter(event => event.zone === selectedZone)
      : events;
  }, [events, selectedZone]);
  function getZoneByCountryId(countryId) {
    const zone = zones.find(zone => zone.countries.includes(countryId));
    if (!zone) {
      console.log(`No zone found for country ID: ${countryId}`);
    }
    return zone || {
      "color": '#EAEAEA',
      "name": 'Unknown Zone',
      "id": "unknown-zone",
      "countries": [],
      "description": "Unknown Zone"
    }; // Default zone if not found
  }
  const getCountryFill = (geo) => {
    const countryName = geo.properties.name;
    const countryId = geo.id;
    if (selectedEvent && countryName !== selectedEvent.country.name) {
      return '#EAEAEA';
    }
    const zoneOfCountry = getZoneByCountryId(countryId);
    const isInSelectedZone = selectedZone ? zoneOfCountry.id === selectedZone : true;
    const hasEvent = events.some(event => event.country.name === countryName);
    if (!selectedZone) {
      if (hasEvent) {
        return zoneOfCountry.color
      }
      return zoneOfCountry.color + "78" || '#EAEAEA';
    }
    if (isInSelectedZone) {
      if (hasEvent) {
        return zoneOfCountry.color
      }
      return zones.find(zone => zone.id === selectedZone)?.color + "78" || '#EAEAEA';
    }
    return '#EAEAEA';
  };

  useEffect(() => {
    fetch(geoUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load countries.json');
        }
        return response.json();
      })
      .then((data) => {
        setCountries(data.objects.world.geometries);
        console.log('Countries loaded:', data.objects.world.geometries);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, [])

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
          center: [0, 20]
        }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={2}>
          <svg style={{ height: 0 }}>
            <defs>
              <linearGradient id="gradient-india" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff9a9e" />
                <stop offset="100%" stopColor="#fad0c4" />
              </linearGradient>
              <linearGradient id="gradient-usa" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a18cd1" />
                <stop offset="100%" stopColor="#fbc2eb" />
              </linearGradient>
            </defs>
          </svg>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryFill(geo)}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    onClick={() => {
                      const selected = selectedEvent == null ? filteredEvents.find(event => event.country.name === geo.properties.name) : null;
                      onEventSelect(selected);
                    }}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                    className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  />
                );
              })
            }
          </Geographies>

          {/* {filteredEvents.map(event => (
            <Marker
              key={event.id}
              coordinates={event.country.coordinates}
              onClick={(e) => {
                e.stopPropagation();
                onEventSelect(event);
              }}
              className="cursor-pointer"
            >
              <circle
                r={4}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth={2}
                className="hover:scale-125 transition-transform"
              />
            </Marker>
          ))} */}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Zones</h3>
        <div className="space-y-1">
          {zones.map(zone => (
            <button
              key={zone.id}
              onClick={() => {
                const newSelectedZone = selectedZone === zone.id ? null : zone.id;
                onZoneSelect(newSelectedZone);
                onEventSelect(null);
              }}
              className={`flex items-center space-x-2 text-xs p-1 rounded w-full text-left ${selectedZone === zone.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: zone.color }}
              />
              <span className="text-gray-700">{zone.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full" />
          <span className="text-xs text-gray-700">Events</span>
        </div>
      </div> */}
    </div >
  );
}