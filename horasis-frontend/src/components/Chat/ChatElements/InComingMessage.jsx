import { relativeTime } from "../../../utils/date"

const InComingMessage = ({ message }) => {
    return (
        <div className="received_msg">
            <div className="received_withd_msg">
                <p>
                    {message.Content}
                </p>
                <span className="time_date"> {relativeTime(message.CreatedIndex)}</span>

            </div>
        </div>
    )
}
export default InComingMessage