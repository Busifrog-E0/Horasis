import { useState, useEffect, useRef } from 'react';
import { RemoteUser } from 'agora-rtc-react'
import avatar from '../../assets/icons/avatar.svg'
import fullscreen from '../../assets/icons/streaming/fullscreen.svg'
import mic from '../../assets/icons/streaming/mic.svg'
import mic_off from '../../assets/icons/streaming/mic_off.svg'
import right from '../../assets/icons/streaming/right.svg'
import left from '../../assets/icons/streaming/left.svg'

const ScrollableRemoteUsersList = ({ participants, remoteUsers, setMainScreenUser, mainScreenUser }) => {
    const [isScrollable, setIsScrollable] = useState(false);
    const scrollableDivRef = useRef(null);

    // Check if the content overflows
    useEffect(() => {
        const handleResize = () => {
            const scrollableDiv = scrollableDivRef.current;
            if (scrollableDiv) {
                setIsScrollable(scrollableDiv.scrollWidth > scrollableDiv.clientWidth);
            }
        };
        handleResize(); // Check initially
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [remoteUsers]); // Run effect when remoteUsers change

    return (
        <div className='relative w-full'>
            {/* Left Arrow (shown only if scrollable) */}
            {isScrollable && (
                <div
                    className='absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-system-primary-accent opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full p-1'
                    onClick={() => scrollableDivRef.current.scrollBy({ left: -200, behavior: 'smooth' })}
                >
                    <img className='inline-block h-5' src={left}></img>
                </div>
            )}
            {/* Scrollable Container */}
            {/* <div className=' grid grid-cols-2 lg:grid-cols-5 3xl:grid-cols-6 gap-2 pt-2'> */}
            <div ref={scrollableDivRef} id="scrollable-div" className='flex flex-row w-full overflow-x-auto gap-2 mt-2 whitespace-nowrap scroll-smooth'>
                {
                    mainScreenUser !== null &&
                    remoteUsers
                        .filter(user => user.uid !== mainScreenUser.uid)
                        .map((user) => {
                            return (
                                <div className='relative h-36 w-64 flex-shrink-0 flex flex-col items-center rounded-lg overflow-hidden' key={user.uid}>
                                    <div className='absolute top-0 right-0 mx-2 my-2 z-10 cursor-pointer' onClick={() => setMainScreenUser(user)}>
                                        <span className="material-symbols-outlined">
                                            <img className='inline-block h-5' src={fullscreen}></img>
                                        </span>
                                    </div>
                                    <RemoteUser
                                        cover={participants.find(participant => participant.UserDetails.DocId === user.uid)?.CoverPicture ?
                                            participants.find(participant => participant.UserDetails.DocId === user.uid)?.CoverPicture : avatar}
                                        user={user} className='w-32 h-32 bg-red-500'>
                                        <div className='absolute text-xs md:text-sm truncate right-0 rounded-full m-2 bottom-0 font-semibold text-brand-secondary bg-system-primary-accent px-3'>
                                            {user.uid}
                                            {user.hasAudio ? <img className='inline-block h-3' src={mic}></img> : <img src={mic_off} className='inline-block h-3'></img>}
                                        </div>
                                    </RemoteUser>
                                </div>
                            )
                        })
                }
            </div>

            {/* Right Arrow (shown only if scrollable) */}
            {isScrollable && (
                <div
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-system-primary-accent opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full p-1'
                    onClick={() => scrollableDivRef.current.scrollBy({ left: 200, behavior: 'smooth' })}
                >
                    <img className='inline-block h-5' src={right}></img>
                </div>
            )}
        </div>
    );
};


export default ScrollableRemoteUsersList