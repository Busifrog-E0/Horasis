import React, { useState } from 'react';

const TooltipForPieChart = ({ position, heading = "", text = "Sample text" }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <div >
            <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)} >
                {(
                    <div className='absolute z-10' style={{ top: position.y, left: position.x, transform: "translate(-50%,-130%)" }} >
                        <div
                            className="p-1 px-4 bg-system-secondary-bg text-white rounded-lg "
                        // Adjusted positioning
                        >
                            <h1 className='text-3xl font-semibold text-brand-gray'>{heading}</h1>
                            <h1 className='text-sm font-semibold text-brand-gray'>{text}</h1>

                        </div>
                        <div className='flex flex-row justify-center '>
                            <div className={'triangle-system-secondary-bg'} ></div>
                        </div>
                    </div>
                )}
            </button>
        </div>
    );
};

export default TooltipForPieChart;


const SlantedRect = ({ color }) => {
    <div
        className={`inset-0 transform skew-y-6 ${color}`}
    >
        {/* Content inside the rectangle */}
        <p>This is a slanted edge rectangle</p>
    </div>
}