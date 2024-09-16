import { useState } from 'react'

const PieChart = ({ data, setHoveredPieSlice, hoveredPieSlice, cursorPosition, setCursorPosition }) => {
	const total = data.reduce((acc, item) => acc + item.value, 0)
	let cumulativeValue = 0
	const radius = 16 // Radius of the pie chart
	const centerX = 0 // X-coordinate of the center of the SVG
	const centerY = 0 // Y-coordinate of the center of the SVG

	// Function to update the cursor position
	const handleMouseMove = (e) => {
		const { clientX, clientY } = e
		setCursorPosition({ x: clientX, y: clientY })
	}

	return (
		<>
			<svg
				viewBox='-20 -20 40 40'
				className='w-60 h-60 mx-auto'
				onMouseMove={handleMouseMove} // Track mouse movement over the SVG
			>
				{data.map((slice, index) => {
					const [startX, startY] = getCoordinatesForPercent(cumulativeValue / total, radius)
					cumulativeValue += slice.value
					const [endX, endY] = getCoordinatesForPercent(cumulativeValue / total, radius)
					const largeArcFlag = slice.value / total > 0.5 ? 1 : 0

					return (
						<path
							onMouseEnter={() => {
								setHoveredPieSlice({ value: slice.value + '%', label: slice.label + ' users' })
							}}
							onMouseLeave={() => {
								setHoveredPieSlice(null)
							}}
							key={index}
							d={`M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
							fill={slice.color}
							className='transition-transform duration-300 hover:scale-110 cursor-pointer '
						/>
					)
				})}
			</svg>

			{/* Tooltip - only show if a slice is hovered */}
			{hoveredPieSlice && (
				<div
					className='absolute bg-system-secondary-bg text-system-primary-text text-sm p-2 rounded flex flex-col items-center shadow'
					style={{
						left: `${cursorPosition.x -50}px`, // Slight offset from the cursor
						top: `${cursorPosition.y - 100}px`,
						whiteSpace: 'nowrap',
					}}>
					<p className='text-xl'>{hoveredPieSlice.value}</p>
					{hoveredPieSlice.label}
					<div className='tooltip-arrow'></div> {/* Arrow */}
				</div>
			)}

			<div className='flex flex-row justify-center items-center mt-2 gap-3 pb-5'>
				{data.map((slice, index) => {
					return (
						<div key={index} className='flex items-center gap-2'>
							<div className={`rounded-full h-2 w-2`} style={{ background: slice.color }}></div>
							<h4 className='font-semibold text-base text-center text-brand-gray-dim'>{slice.label}</h4>
						</div>
					)
				})}
			</div>
		</>
	)
}

const getCoordinatesForPercent = (percent, radius) => {
	const x = Math.cos(2 * Math.PI * percent) * radius
	const y = Math.sin(2 * Math.PI * percent) * radius
	return [x, y]
}

export default PieChart
