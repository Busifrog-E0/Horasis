import ChatView from "./ChatView"

const ChatPopup = ({ userId }) => {
    return (
        <div className="absolute hidden bottom-0 right-12 shadow overflow-hidden rounded-t-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5">
            <div className='bg-system-primary-accent p-3 px-5 cursor-pointer'>
                <p className='text-brand-secondary text-md'>Chat</p>
            </div>
            <div className=" w-96 h-96">
                <ChatView userId={userId} />
            </div>
        </div>
    )
}

export default ChatPopup