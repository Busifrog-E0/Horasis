import React, { useState } from 'react';

const TooltipForMap = ({ position, text = "Sample text" }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <div >
            <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)} >
                {(
                    <div className='absolute z-10 ' style={{ top: position.y, left: position.x, transform: "translate(-50%,-130%)" }} >
                        <div
                            className="p-1 px-4 opacity-75 bg-brand-primary text-white rounded-lg "
                        // Adjusted positioning
                        >
                            <span className='text-sm font-bold text-system-secondary-selected-accent'>{text}</span>

                        </div>
                        <div className='flex flex-row justify-center '>
                            <div className={'triangle'} ></div>
                        </div>
                    </div>
                )}
            </button>
        </div>
    );
};

export default TooltipForMap;
