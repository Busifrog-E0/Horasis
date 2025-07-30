import React, { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography, Line, Marker } from 'react-simple-maps'
import coords from '../../assets/json/countries-with-coords.json'

const geoUrl = '/countries.json'

export default function MapChart({ eventLocations, cursorPosition, setCursorPosition, setHoveredCity, onCitySelect }) {
	useEffect(() => {
		const handleMouseMove = (e) => {
			setCursorPosition({ x: e.clientX, y: e.clientY })
		}
		document.addEventListener('mousemove', handleMouseMove)
		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
		}
	}, [])

	return (
		<>
			<ComposableMap>
				<Geographies geography={geoUrl}>
					{({ geographies }) =>
						geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} fill='#9ec8f7' stroke='#ffffff17' />)
					}
				</Geographies>
				{eventLocations &&
					eventLocations.map((city, index) => {
						return (
							<Marker
								key={city.name + index}
								coordinates={coords.countries.find((item) => item.name === city.EntityName).coordinates}
								onClick={() => onCitySelect(city)}
								onMouseEnter={() => {
									setHoveredCity(city)
								}}
								onMouseLeave={() => {
									setHoveredCity(null)
								}}>
								<g fill='none' stroke='#FF5533' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
									<circle
										style={{
											cursor: 'pointer',
											filter: 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.25))',
										}}
										r={10}
										fill='#0e4d96'
										stroke='white'
										strokeWidth={5}
									/>
								</g>
							</Marker>
						)
					})}
			</ComposableMap>
		</>
	)
}
