import { useContext, useState } from "react"
import { AuthContext } from "../utils/AuthProvider"
import { useNavigate } from "react-router-dom"
import MiniTab from "../components/ui/MiniTab"
import SpeakerProfileTab from "../components/Events/SpeakerProfileTab"
import DropdownMenu from "../components/ui/DropdownMenu"
import { relativeTime } from "../utils/date"
import Button from "../components/ui/Button"

const SingleDiscussion = () => {

    const { currentUserData, scrollToTop } = useContext(AuthContext)
    const navigate = useNavigate()
    const OnClickFollow = () => {

    }
    const handleGoBack = () => {
        navigate(-1);
    };
    const miniEventTabs = () => [
        {
            title: "Speakers' Profile",
            render: () => <div className="py-3 pt-6 flex flex-col gap-8">
                <SpeakerProfileTab />
                <SpeakerProfileTab />
            </div>
        },
        {
            title: "Event Agenda",
            render: () => <div className="py-3 pt-6">

            </div>
        },
    ]
    return (<>
        <div className="overflow-hidden bg-red-400 h-80 lg:h-96 relative">
            <img src="https://th.bing.com/th/id/OIP.FFchRAWwk-emGNqgImzwaAHaEK?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
            <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 bg-brand-blue-transparent h-100 overflow-hidden overflow-y-auto">
                <div className="flex w-full items-start justify-between">
                    <div className="flex items-center cursor-pointer" onClick={handleGoBack}>
                        {/* back arrow */}
                        <h4 className="font-medium text-xl text-brand-secondary">Back</h4>
                    </div>
                    <div className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                        </svg>
                    </div>

                </div>
                <div>
                    <h4 className="font-medium shadow-lg text-4xl text-white mb-3">Artificial Intelligence</h4>
                    {/* <div className="flex flex-row flex-wrap gap-3">
                        <h4 className="text-2xl text-white">Virtual Event</h4>
                        <h4 className="text-2xl text-white">•</h4>
                        <h4 className="text-2xl text-white">140 Participants</h4>
                        <h4 className="text-2xl text-white">•</h4>
                        <h4 className="text-2xl text-white">Public</h4>
                    </div> */}

                </div>

            </div>
        </div>
        <div>
            <div className="grid lg:grid-cols-4 gap-0 bg-system-secondary-bg">
                <div>
                    <div className="p-5 lg:px-12 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8">
                        <div className="flex flex-row justify-between mt-1 lg:mt-3">
                            <h4 className="font-semibold text-2xl text-system-primary-text">Brief</h4>
                        </div>
                        <h4 className="text-xl text-brand-gray mt-2 mb-12 leading-8">Secure your place at the Horasis Meeting
                            Worldwide in Barcelona! Don't miss out on this transformative experience" Secure
                            Secure your place at the Horasis Meeting Worldwide in Barcelona! Don't miss out on this
                            transformative experience" Meeting
                            Secure your place at the Horasis Meeting
                            Worldwide in Barcelona! Don't miss out on this
                            transformative experience"</h4>
                        <Button
                            onClick={() => OnClickFollow()}
                            width="full"
                            variant="black"
                        >
                            Follow
                        </Button>
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <div className="p-5 lg:px-12 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8">
                        <div className="flex flex-row justify-between mt-1 lg:mt-3 text-system-primary-accent">
                            <h4 className="font-semibold text-2xl text-system-primary-text">Description</h4>
                            <svg className="w-6 h-6 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                            </svg>
                        </div>
                        <h4 className="text-xl text-brand-gray mt-2 lg:mt-6 mb-6 leading-8">
                            Horasis Worldwide Meeting in Barcelona a transformative gathering that transcends geographical boundaries, bringing together an illustrious assembly of global thought leaders, innovators, and visionaries. Delve into dynamic discussions, where the exchange of ideas sparks collaborative ideation and fosters deep insights into shaping a world of endless possibilities. Delve into dynamic discussions, where the exchange of ideas sparks collaborative ideation and fosters deep insights into shaping a world of endless possibilities.
                        </h4>
                        <h4 className="text-xl text-brand-gray mt-2 mb-6 leading-8">
                            This event is more than just a meeting; it's a convergence of diverse perspectives, an incubator for innovation, and a catalyst for forging connections that ripple across the globe. Join us on this enriching journey of global discourse and collective inspiration, where Barcelona becomes the epicenter for the synergy that propels us towards a future of unprecedented. This event is more than just a meeting; it's a convergence of diverse perspectives, an incubator for innovation, and a catalyst for forging connections that ripple across the globe. Join us on this enriching journey of global discourse and collective inspiration, where Barcelona becomes the epicenter for the synergy that propels us towards a future of unprecedented.
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </>)
}


export default SingleDiscussion
