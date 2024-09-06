
import cover from '../../assets/icons/cover.svg'
const JoinToStream = ({ event, appId, channel, token, setChannel, setToken, setCalling, setAppId }) => {

    return (
        <>
            {event.CoverPicture ? (
                <>
                    <img src={event.CoverPicture} className='object-cover h-full w-full' />
                </>
            ) : (
                <>
                    <img src={cover} className='object-cover h-full w-full' />
                </>
            )}

            <div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 md:p-16 lg:p-32 bg-black/30 h-100 overflow-hidden overflow-y-auto'>
                <div className='flex w-full items-start justify-between'>
                    {event?.Permissions?.IsAdmin && (
                        <div
                            // onClick={() => {
                            // 	setIsCoverPictureOpen(true)
                            // 	if (event.CoverPicture) {
                            // 		setSelectedCoverImage(event.CoverPicture)
                            // 	} else {
                            // 		setSelectedCoverImage(null)
                            // 	}
                            // }}
                            className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
                            <img src={camera} alt='' className='h-6 cursor-pointer' />
                        </div>
                    )}
                </div>
                <div>
                    <h4 className='font-bold text-4xl text-white mb-2'>{event.EventName}</h4>
                    <div className='flex flex-row flex-wrap gap-3'>
                        <h4 className='text-xl text-white'>{event.Type} Event</h4>
                        <h4 className='text-xl text-white'>•</h4>
                        <h4 className='text-xl text-white'>{event.NoOfMembers} Participants</h4>
                        <h4 className='text-xl text-white'>•</h4>
                        <h4 className='text-xl text-white'>{event.Privacy}</h4>
                    </div>
                    <div className='mt-10 flex flex-row flex-wrap gap-3'>
                        <h4 className='text-xl text-white'>{event.Description}</h4>
                    </div>
                    <button
                        className={`mt-6 p-2 px-24 text-white font-semibold rounded-lg ${!appId || !channel
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        disabled={!appId || !channel}
                        onClick={() => setCalling(true)}
                    >
                        Join Channel
                    </button>
                </div>

            </div>

            {/* <div className="p-6 rounded-lg shadow-md max-w-md mx-auto bg-brand-secondary mt-5">
                <input
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="Enter your App ID"
                    value={appId}
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <input
                    onChange={(e) => setChannel(e.target.value)}
                    placeholder="Enter your Channel Name"
                    value={channel}
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <input
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your Token"
                    value={token}
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <button
                    className={`w-full py-2 text-white font-semibold rounded-lg ${!appId || !channel
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    disabled={!appId || !channel}
                    onClick={() => setCalling(true)}
                >
                    Join Channel
                </button>
            </div> */}
        </>
    );
};

export default JoinToStream;
