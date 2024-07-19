import { useContext } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { useNavigate } from "react-router-dom"
import EventTab from "./EventTab"
import EmptyMembers from "../Common/EmptyMembers"

//     <div className="rounded-lg mt-3 overflow-hidden h-full">
//     <div className="h-28 overflow-hidden rounded-lg">
//         <img src="https://th.bing.com/th/id/OIP.TMjzM_W0Yn61ahSvOtBD-QHaEP?w=278&h=180&c=7&r=0&o=5&pid=1.7" className="object-cover h-full w-full" />
//     </div>
//     <div className="mt-1 grid grid-cols-7 gap-1 ">
//         <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col border border-system-file-border">
//             <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
//             <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">14</h4>
//         </div>
//         <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg border border-system-file-border">
//             <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis USA Meeting </h4>
//             <div className="flex flex-wrap items-center gap-x-2">
//                 <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
//                 <h4 className="tetx-xs text-brand-gray-dim">•</h4>
//                 <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
//             </div>
//         </div>
//     </div>
// </div>

const EventsList = ({ cols = 3, gap = "gap-1 lg:gap-4", data = [], emptyText }) => {
    const { currentUserData, scrollToTop } = useContext(AuthContext)
    const navigate = useNavigate()

    const GoToSingleEvent = (id) => {
        scrollToTop()
        navigate(`/events/${id}`)
    }

    return (
        <>
            {data ? (
                <>
                    {data.length > 0 ? (
                        <>
                            <div className={`grid lg:grid-cols-${cols} ${gap}`}>
                                {data.map((item, index) => {
                                    return (
                                        <EventTab event={item} key={index} onClick={() => { }} />
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            <EmptyMembers emptyText={emptyText} />
                        </>
                    )}
                </>
            ) : (
                <></>
            )}
        </>
    )
}

export default EventsList
