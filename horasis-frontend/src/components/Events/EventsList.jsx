import { useContext } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { useNavigate } from "react-router-dom"

const EventsList = ({ cols = 3, gap = "gap-1 lg:gap-4" }) => {
    const { currentUserData, scrollToTop } = useContext(AuthContext)
    const navigate = useNavigate()

    const GoToSingleEvent = (id) => {
        scrollToTop()
        navigate(`/events/${id}`)
    }

    return (
        <div className={`grid lg:grid-cols-${cols} ${gap}`}>
            <div className="rounded-lg mt-3 overflow-hidden h-full cursor-pointer" onClick={() => GoToSingleEvent("123")}>
                <div className="h-28 overflow-hidden rounded-lg">
                    <img src="https://th.bing.com/th/id/OIP.b6Wd5ElpRfRco6-8ZyL7NwHaE8?w=229&h=180&c=7&r=0&o=5&pid=1.7" className="object-cover h-full w-full" />
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1 ">
                    <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col border border-system-file-border">
                        <h4 className="text-xs text-center text-system-primary-text m-0">Jan</h4>
                        <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">08</h4>
                    </div>
                    <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg border border-system-file-border">
                        <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis India Meeting </h4>
                        <div className="flex flex-wrap items-center gap-x-2">
                            <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
                            <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                            <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
                        </div>

                    </div>

                </div>
            </div>
            <div className="rounded-lg mt-3 overflow-hidden h-full">
                <div className="h-28 overflow-hidden rounded-lg">
                    <img src="https://th.bing.com/th/id/OIP.TMjzM_W0Yn61ahSvOtBD-QHaEP?w=278&h=180&c=7&r=0&o=5&pid=1.7" className="object-cover h-full w-full" />
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1 ">
                    <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col border border-system-file-border">
                        <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
                        <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">14</h4>
                    </div>
                    <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg border border-system-file-border">
                        <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis USA Meeting </h4>
                        <div className="flex flex-wrap items-center gap-x-2">
                            <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
                            <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                            <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
                        </div>

                    </div>

                </div>
            </div>
            <div className="rounded-lg mt-3 overflow-hidden h-full">
                <div className="h-28 overflow-hidden rounded-lg">
                    <img src="https://partyslate.imgix.net/photos/221661/photo-e6d5744c-9727-4394-9593-19ed63113ab6.jpg?ixlib=js-2.3.2&w=1200&h=800&fit=crop" className="object-cover h-full w-full" />
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1 ">
                    <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col border border-system-file-border">
                        <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
                        <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">18</h4>
                    </div>
                    <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg border border-system-file-border">
                        <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis Meeting </h4>
                        <div className="flex flex-wrap items-center gap-x-2">
                            <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
                            <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                            <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
                        </div>

                    </div>

                </div>
            </div>
            <div className="rounded-lg mt-3 overflow-hidden h-full">
                <div className="h-28 overflow-hidden rounded-lg">
                    <img src="https://th.bing.com/th/id/OIP.kHXBiCvkXaeAtHwvS9uBbwHaEu?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1 ">
                    <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col border border-system-file-border">
                        <h4 className="text-xs text-center text-system-primary-text m-0">Jan</h4>
                        <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">08</h4>
                    </div>
                    <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg border border-system-file-border">
                        <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis India Meeting </h4>
                        <div className="flex flex-wrap items-center gap-x-2">
                            <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
                            <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                            <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
                        </div>

                    </div>

                </div>
            </div>
            <div className="rounded-lg mt-3 overflow-hidden h-full">
                <div className="h-28 overflow-hidden rounded-lg">
                    <img src="https://i2-prod.manchestereveningnews.co.uk/incoming/article12751862.ece/ALTERNATES/s615b/161006_mpaawards_themidlandhotel_042.jpg" className="object-cover h-full w-full" />
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1 ">
                    <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col border border-system-file-border">
                        <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
                        <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">14</h4>
                    </div>
                    <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg border border-system-file-border">
                        <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis USA Meeting </h4>
                        <div className="flex flex-wrap items-center gap-x-2">
                            <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
                            <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                            <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
                        </div>

                    </div>

                </div>
            </div>
            <div className="rounded-lg mt-3 overflow-hidden h-full">
                <div className="h-28 overflow-hidden rounded-lg">
                    <img src="https://americanpavilion.com/wp-content/uploads/2018/04/Corporate-Event.jpg" className="object-cover h-full w-full" />
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1 ">
                    <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col border border-system-file-border">
                        <h4 className="text-xs text-center text-system-primary-text m-0">Apr</h4>
                        <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">18</h4>
                    </div>
                    <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg border border-system-file-border">
                        <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis Meeting </h4>
                        <div className="flex flex-wrap items-center gap-x-2">
                            <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
                            <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                            <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
                        </div>

                    </div>

                </div>
            </div>
        </div>)
}

export default EventsList
