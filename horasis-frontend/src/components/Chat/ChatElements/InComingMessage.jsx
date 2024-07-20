import { relativeTime } from "../../../utils/date"

const InComingMessage = ({ message }) => {
    return (
        <div class="received_msg">
            <div class="received_withd_msg">
                <p>
                    {message.Content}
                </p>
                <span class="time_date"> {relativeTime(message.CreatedIndex)}</span>

            </div>
        </div>
    )
}
export default InComingMessage