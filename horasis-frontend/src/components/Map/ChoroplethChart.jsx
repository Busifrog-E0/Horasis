import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from "react-simple-maps";

const geoUrl = "/features.json";


// Helper to convert hex to RGB
const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
};

// Helper to convert RGB to hex
const rgbToHex = (r, g, b) => {
    return (
        "#" +
        [r, g, b]
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
    );
};
// Custom color scale without d3

const ChoroplethChart = ({
    zones,
    trees,
    selectedZone,
    selectedTree,
    onZoneSelect,
    onTreeSelect,
}) => {
    const [data, setData] = useState([]);

    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    useEffect(() => {
        setData(trees);
        const values = trees.map(d => {
            return parseFloat(d["no"])
        }).filter(v => !isNaN(v));
        setMin(Math.min(...values));
        setMax(Math.max(...values));
    }, [trees]);

    const getColor = (geo, value, min = 0.29, max = 0.68, startColor = "#0B6A00", endColor = "#C8F7C5") => {
        if (value == null || isNaN(value)) return "#F5F4F6";

        // If selectedTree is set, only highlight the selected country
        if (selectedTree && geo.id !== selectedTree.ISO3) return "#F5F4F6";

        const zoneOfCountry = getZoneByCountryId(geo.id);
        const isInSelectedZone = !selectedZone || zoneOfCountry.id === selectedZone;

        if (!isInSelectedZone) return "#F5F4F6";

        const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
        const [r1, g1, b1] = hexToRgb(startColor);
        const [r2, g2, b2] = hexToRgb(endColor);

        const r = Math.round(r1 + ratio * (r2 - r1));
        const g = Math.round(g1 + ratio * (g2 - g1));
        const b = Math.round(b1 + ratio * (b2 - b1));

        return rgbToHex(r, g, b);
    };


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
    return (
        <div className="bg-white rounded-lg border border-gray-200 ">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 100,
                    center: [0, 20]
                }}
            // className="w-full h-full"
            >
                {data.length > 0 && (
                    <ZoomableGroup center={[0, 0]} zoom={8}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const d = data.find((s) => s.ISO3 === geo.id);
                                    const color = d ? getColor(geo, parseFloat(d["no"]), min, max) : "#F5F4F6";
                                    return (
                                        <Geography
                                            onClick={() => {
                                                const tree = selectedTree == null ? data.find(tree => tree.ISO3 === geo.id) : null;
                                                onTreeSelect(tree);
                                            }}
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={color}
                                            className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                            stroke="#ffffff"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: 'none' },
                                                hover: { outline: 'none' },
                                                pressed: { outline: 'none' },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                )}
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
                                onTreeSelect(null);
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
        </div>
    );
};

export default ChoroplethChart;
