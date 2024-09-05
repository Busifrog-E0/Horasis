
const JoinToStream = ({ appId, channel, token, setChannel, setToken, setCalling, setAppId }) => {

    return (
        <div className="p-6 rounded-lg shadow-md max-w-md mx-auto bg-brand-secondary mt-5">
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
        </div>
    );
};

export default JoinToStream;
