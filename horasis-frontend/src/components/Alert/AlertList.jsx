import React, { useState, useRef, useEffect } from 'react';
import { relativeTime } from '../../utils/date';
import DropdownMenu from '../ui/DropdownMenu';
import AlertDetailsItem from './AlertDetailsItem';

const AlertList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return <>
        <div className="relative inline-block text-left " ref={dropdownRef}>
            <button
                type="button"
                className="inline-flex justify-center rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim"
                onClick={() => setIsOpen(!isOpen)}
            >
                Alerts
            </button>
            {isOpen && (
                <div className="overflow-hidden origin-top-right absolute z-10 right-0 mt-2 w-80 lg:w-96 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5">
                    <div className='bg-system-primary-accent p-3 px-5'>
                        <p className='text-brand-secondary text-md'>Notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">

                        <AlertDetailsItem />
                        <AlertDetailsItem />
                        <AlertDetailsItem />
                        <AlertDetailsItem />
                        <AlertDetailsItem />
                        <AlertDetailsItem />
                    </div>
                </div>
            )}
        </div>
    </>
}

export default AlertList