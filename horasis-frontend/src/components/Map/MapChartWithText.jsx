import React, { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps"

const geoUrl =
    "/countries.json"

export default function MapChartWithText({ cities = [] }) {
    const [hoveredCity, setHoveredCity] = useState(null);

    return (
        <>
            <ComposableMap >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#9ec8f7"
                                stroke="#ffffff17"
                            />
                        ))
                    }
                </Geographies>
                {
                    cities.map((city, index) => {
                        return <Marker
                            key={city.name + index}
                            coordinates={city.coordinates}
                            onMouseEnter={() => { setHoveredCity(city); }}
                            onMouseLeave={() => { setHoveredCity(null); }}
                        >
                            <g
                                fill="none"
                                stroke="#FF5533"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle
                                    style={{
                                        cursor: "pointer", filter: "drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.25))",
                                    }}
                                    r={15}
                                    fill="#0e4d96"
                                    stroke="white"
                                    strokeWidth={9}
                                />
                            </g>
                            {
                                hoveredCity === city &&
                                (
                                    <>
                                        <rect
                                            x="-50"
                                            y="-20"
                                            width="100"
                                            height="40"
                                            fill="#ffffff"
                                            fillOpacity="0.9"
                                            rx="5"
                                            style={{
                                                pointerEvents: "none", // Ensure the rect doesn't block mouse events
                                            }}
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            style={{
                                                fontFamily: "system-ui",
                                                fill: "#5D5A6D",
                                                pointerEvents: "none",
                                                zIndex: 1,
                                            }}
                                        >
                                            <tspan x="0" y="0">{city.name}</tspan>
                                        </text>

                                        {/* <text
                                        y={city.markerOffset}
                                        textAnchor="middle"
                                        style={{ fontFamily: "system-ui", overflow: 'hidden', fill: "#5D5A6D", fontSize: 32, fontWeight: 900, }}
                                    >
                                        {city.name}
                                    </text> */}
                                    </>
                                )}
                        </Marker>
                    })
                }
            </ComposableMap>
        </>
    );
}

