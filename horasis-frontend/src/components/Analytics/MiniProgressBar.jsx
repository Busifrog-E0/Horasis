const MiniProgressBar = ({ title, value, color = "brand-green" }) => {

    return (
        <div>
            <h4 className="text-sm text-system-primary-text">{title}</h4>
            <div className="flex justify-between items-center mt-2 gap-3">
                <div className="flex-1 bg-system-secondary-selected-accent rounded h-2.5 mb-1">
                    <div
                        className={`${color} h-2.5 rounded`}
                        style={{ width: `${value}%` }}
                    ></div>
                </div>
                <h4 className="font-semibold text-xs text-center text-system-primary-text">{value}%</h4>
            </div>
        </div>
    );
};


export default MiniProgressBar;


