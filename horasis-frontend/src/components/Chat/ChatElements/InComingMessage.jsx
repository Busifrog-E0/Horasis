import { relativeTime } from "../../../utils/date"

const InComingMessage = ({ message }) => {
    return (
        <div className="received_msg">
            <div className="received_withd_msg flex flex-col items-start">
                <p className="font-medium max-w-max">
                    {message.Content}
                </p>
                <span className="time_date"> {relativeTime(message.CreatedIndex)}</span>

            </div>
        </div>
    )
}
export default InComingMessage