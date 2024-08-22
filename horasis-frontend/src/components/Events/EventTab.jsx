import { getMonthsShort } from "../../utils/date"

const EventTab = ({ event, onClick }) => {
    return (
        <div className="rounded-lg mt-3 overflow-hidden h-full cursor-pointer  flex flex-col" onClick={() => onClick(event.DocId)}>
            <div className="h-28 w-full overflow-hidden rounded-lg">
                <img src={event.DisplayPicture} className="object-cover h-full w-full" />
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 flex-1">
                <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col">
                    <h4 className="text-xs text-center text-system-primary-text m-0">{getMonthsShort(event.Date)}</h4>
                    <h4 className=" font-semibold text-xl text-center text-system-primary-text m-0">{new Date(event.Date).getDate()}</h4>
                </div>
                <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg flex flex-col justify-between">
                    <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">{event.EventName} </h4>
                    <div className="flex flex-wrap items-center gap-x-2">
                        <h4 className="text-xs text-brand-gray-dim">{event.Type} Event</h4>
                        <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                        <h4 className="text-xs text-brand-gray-dim">{event.NoOfMembers} Participants</h4>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default EventTab