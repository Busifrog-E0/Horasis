const PieChart = ({ data, setHoveredPieSlice, hoveredPieSlice, cursorPosition, setCursorPosition }) => {
	const total = data.reduce((acc, item) => acc + item.value, 0)
	let cumulativeValue = 0
	const radius = 16 // Radius of the pie chart
	const centerX = 0 // X-coordinate of the center of the SVG
	const centerY = 0 // Y-coordinate of the center of the SVG

	return (
		<>
			
			<svg viewBox='-20 -20 40 40' className='w-60 h-60 mx-auto'>
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
							className='transition-transform duration-300 hover:scale-110 '
						/>
					)
				})}
			</svg>
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
