import React, { useState, useRef, useEffect } from 'react'

const TooltipText = ({ children, toolTipText }) => {
	const textRef = useRef(null)

	return (
		<div className='relative group'>
			<div ref={textRef} title={toolTipText}>
				{children}
			</div>
		</div>
	)
}

export default TooltipText
