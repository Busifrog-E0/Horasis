import { getMonthsShort } from "../../utils/date"

const EventTab = ({ event, onClick,from='events' }) => {
    return (
        <div className={`rounded-lg mt-3 overflow-hidden h-full cursor-pointer  flex flex-col ${from === 'search'&& 'p-2'}`} onClick={() => onClick(event.DocId)}>
            <div className="h-28 w-full overflow-hidden rounded-lg bg-system-secondary-bg">
                <img src={event.CoverPicture} className="object-cover h-full w-full" />
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 flex-1">
                <div className="col-span-2  bg-system-secondary-bg rounded-lg shadow-lg border flex justify-center items-center flex-col">
                    <h4 className="text-xs text-center text-system-primary-text m-0">{getMonthsShort(event.Date)}</h4>
                    <h4 className=" font-semibold text-xl text-center text-system-primary-text m-0">{new Date(event.Date).getDate()}</h4>
                </div>
                <div className="col-span-5  rounded-lg shadow-lg border flex flex-col justify-between bg-system-secondary-bg">
                    <h4 className="text-base font-semibold text-system-primary-text line-clamp-1 px-2 pt-2 ">{event.EventName} </h4>
                    <div className="flex flex-wrap items-center gap-x-2 pb-1 px-2 ">
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