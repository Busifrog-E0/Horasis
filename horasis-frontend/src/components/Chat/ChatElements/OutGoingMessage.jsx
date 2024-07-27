import { relativeTime } from "../../../utils/date"

const OutGoingMessage = ({ message }) => {
    return (

        <div className="outgoing_msg">
            <div className="outgoing_withd_msg">
                <p>
                    {message.Content}
                </p>
                <span className="time_date"> {relativeTime(message.CreatedIndex)}</span>
            </div>
        </div>
    )
}
export default OutGoingMessage