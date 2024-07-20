import ChatView from "./ChatView"

const ChatPopup = ({ userId }) => {
    return (
        <div className="absolute bottom-0 right-12 shadow border border-system-file-border bg-system-secondary-bg">
            <div className="p-3 bg-system-plan1-bg border-b border-system-file-border ">
                <div className="flex flex-row justify-between cursor-pointer">
                    <p className="text-system-primary-text m-0 text-sm">Chat</p>
                    <p className="text-system-primary-text m-0 text-sm">close</p>

                </div>
            </div>
            <div className=" w-96 h-96">
                <ChatView userId={userId} />
            </div>
        </div>
    )
}

export default ChatPopup