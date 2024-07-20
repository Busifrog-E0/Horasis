import { useParams } from "react-router-dom"
import ChatView from "../components/Chat/ChatView"

const ChatPage = () => {

    const { userid } = useParams()

    return (
        <div className=' fixed top-0 overflow-hidden w-full' style={{ height: "100svh" }} >
            <ChatView userId={userid} />
        </div>
    )
}

export default ChatPage
