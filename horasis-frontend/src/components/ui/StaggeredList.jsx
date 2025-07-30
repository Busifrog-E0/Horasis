// src/components/StaggeredList.js
import React from 'react';


const items = [
    { id: 1, title: 'Item 1', image: 'https://static.seekingalpha.com/cdn/s3/uploads/getty_images/1387900612/image_1387900612.jpg?io=getty-c-w750' },
    { id: 2, title: 'Item 3', image: 'https://png.pngtree.com/background/20230610/original/pngtree-business-people-meet-at-conference-room-picture-image_3091702.jpg' },
    { id: 3, title: 'Item 3', image: 'https://th.bing.com/th/id/OIP.epBpHxKNUNmF3B7aMVc5qQAAAA?w=198&h=198&c=7&r=0&o=5&pid=1.7' },
    { id: 4, title: 'Item 4', image: 'https://live.staticflickr.com/4224/34256380344_e2d662224a_b.jpg' },
    { id: 5, title: 'Item 5', image: 'https://hdwallpaperim.com/wp-content/uploads/2017/08/31/156558-New_York_City-Times_Square-USA-night-city-aerial_view.jpg' },
    { id: 5, title: 'Item 5', image: 'https://wallpapercave.com/wp/eJGOnhA.jpg' },
    { id: 6, title: 'Item 6', image: 'https://wallpapercave.com/wp/wp8708332.jpg' },
    { id: 7, title: 'Item 7', image: 'https://th.bing.com/th/id/OIP.7A7KnIr-YTdP8QjE-V83_AHaLH?rs=1&pid=ImgDetMain' },
    { id: 8, title: 'Item 8', image: 'https://th.bing.com/th/id/OIP.kaD6UkjAMxL3HVvGBlroGgHaLH?rs=1&pid=ImgDetMain' },
];
const StaggeredList = ({images}) => {
    return (
        // md:columns-3 lg:columns-4 
        <div className="columns-2 gap-4 p-4">
            {images.map(item => (
                <div key={item.DocId} className="mb-4 break-inside-avoid">
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                        <img src={item.FileUrl} alt={item.title} className="w-full" />

                    </div>
                </div>
            ))}
        </div>
    );
};

export default StaggeredList;