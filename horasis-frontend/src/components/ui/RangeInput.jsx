import React, { useState } from 'react';

const RangeInput = () => {
    const [value, setValue] = useState(50); // Initial value for the range input

    // Function to handle range input change
    const handleRangeChange = (event) => {
        setValue(event.target.value); // Update the state with the new value
    };

    // Calculate the percentage value for styling the background gradient
    const percent = ((value - 0) / (100 - 0)) * 100;

    // Inline style for the range input background
    const rangeStyle = {
        background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percent}%, #ddd ${percent}%, #ddd 100%)`
    };

    return (
        <div className="range-container">
            <input
                type="range"
                className="w-full h-1 bg-brand-orange-transparent rounded-lg "
                min="0"
                max="100"
                value={value}
                onChange={handleRangeChange}
                style={rangeStyle} // Apply inline style for dynamic background
            />
            <p>Value: {value}</p>
        </div>
    );
};

export default RangeInput;
