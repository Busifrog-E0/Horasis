import { relativeTime } from "../../../utils/date"

const OutGoingMessage = ({ message }) => {
    return (

        <div class="outgoing_msg">
            <div class="outgoing_withd_msg">
                <p>
                    {message.Content}
                </p>
                <span class="time_date"> {relativeTime(new Date().getTime())}</span>
            </div>
        </div>
    )
}
export default OutGoingMessage