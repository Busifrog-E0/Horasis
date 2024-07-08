import { useContext, useState } from "react"
import { AuthContext } from "../utils/AuthProvider"
import { useNavigate } from "react-router-dom"
import MiniTab from "../components/ui/MiniTab"
import SpeakerProfileTab from "../components/Events/SpeakerProfileTab"
import DropdownMenu from "../components/ui/DropdownMenu"
import { relativeTime } from "../utils/date"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"

const SingleEvent = () => {

    const { currentUserData, scrollToTop } = useContext(AuthContext)
    const [joined, setJoined] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const navigate = useNavigate()
    const OnClickRegister = () => {
        OnModalOpen()
    }
    const handleGoBack = () => {
        navigate(-1);
    };
    const goToGome = () => {
        OnModalClose()
        navigate('/events')
    }
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

    const onConfirmRegister = () => {
        setIsRegistered(true)
    }

    const OnModalClose = () => {
        setIsModalOpen(false);
    };

    const OnModalOpen = () => {
        setIsRegistered(false)
        setIsModalOpen(true);
    };
    return (<>
        <Modal isOpen={isModalOpen} onClose={OnModalClose}>
            {isRegistered && <Modal.Header className="border-none">
                <p className="text-xl font-medium"></p>
                <svg
                    onClick={OnModalClose}
                    className="w-4 h-4 text-system-primary-text cursor-pointer"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
            </Modal.Header>}
            <Modal.Body>
                <div className="p-8">
                    {isRegistered ?
                        <>
                            <h1 className="text-system-primary-accent text-4xl font-bold text-center mb-6">Registration Done!</h1>
                            <h1 className="text-system-primary-text text-2xl font-medium text-center leading-9 mb-6">Thanks for registering for 'Horasis Meeting Worldwide Barcelona'. Details will be sent to your email address 'purvaa@email.com'</h1>
                            <div className="px-8">
                                <Button
                                    type="button"
                                    onClick={goToGome}
                                    width="full"
                                    variant="black"
                                    className="mt-4"
                                >
                                    Home
                                </Button>
                            </div>
                        </>
                        :
                        <>
                            <h1 className="text-system-primary-text text-2xl font-medium text-center leading-9">Do you want to register for 'Horasis Meeting Worldwide Barcelona'?</h1>
                            <div className="grid grid-cols-2 gap-2 px-4">
                                <Button
                                    type="button"
                                    onClick={OnModalClose}
                                    width="full"
                                    variant="outline"
                                    className="mt-4"
                                >
                                    No
                                </Button>
                                <Button
                                    type="button"
                                    onClick={onConfirmRegister}
                                    width="full"
                                    variant="black"
                                    className="mt-4"
                                >
                                    Yes
                                </Button>
                            </div>
                        </>
                    }

                </div>


            </Modal.Body>
        </Modal>
        <div className="overflow-hidden bg-red-400 h-80 lg:h-96 relative">
            <img src="https://images.hdqwalls.com/wallpapers/city-urban-modern-night-architecture-long-exposure-4k-ah.jpg" className="object-cover h-full w-full" />
            <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 bg-brand-blue-transparent h-100 overflow-hidden overflow-y-auto">
                <div className="flex w-full items-start justify-between">
                    <div className="flex items-center cursor-pointer" onClick={handleGoBack}>
                        {/* back arrow */}
                        <h4 className="font-medium text-lg text-brand-secondary">Back</h4>
                    </div>
                    <div className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}>
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                        </svg>
                    </div>

                </div>
                <div>
                    <h4 className="font-bold text-4xl text-white mb-2">Horasis Asia Meeting</h4>
                    <div className="flex flex-row flex-wrap gap-3">
                        <h4 className="text-xl text-white">Virtual Event</h4>
                        <h4 className="text-xl text-white">•</h4>
                        <h4 className="text-xl text-white">140 Participants</h4>
                        <h4 className="text-xl text-white">•</h4>
                        <h4 className="text-xl text-white">Public</h4>
                    </div>

                </div>

            </div>
        </div>
        <div className="p-2 lg:px-10 lg:py-6">
            <div className="grid lg:grid-cols-4 gap-3 lg:gap-12 ">
                <div>
                    <div className="p-5 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8">
                        <h4 className="font-semibold text-xl text-system-primary-text mt-1 lg:mt-3">About</h4>
                        <h4 className="font-semibold text-md text-system-primary-text mt-2.5 lg:mt-5 leading-8">Horasis Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</h4>
                        <div className="flex items-start gap-4 mt-3">
                            <img className="w-14 h-14 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />
                            <div className="flex-1">
                                <h4 className="text-xs text-brand-gray-dim mt-1">Organizer</h4>
                                <h4 className="font-semibold text-lg text-system-primary-accent mt-1">James Lim</h4>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 mt-4 lg:mb-6">
                            <div className="flex items-center flex-1 gap-3">
                                {/* icon goes here */}
                                <svg className="w-5 h-5 text-brand-gray-dim" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                                </svg>
                                <div>
                                    <h4 className="text-xs text-brand-gray-dim mb-1">When</h4>
                                    <h4 className="text-sm text-system-primary-text leading-6">29 January 2024</h4>
                                </div>
                            </div>
                            <div className="flex items-center flex-1 gap-3">
                                {/* icon goes here */}
                                <svg className="w-5 h-5 text-brand-gray-dim" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                                </svg>
                                <div>
                                    <h4 className="text-xs text-brand-gray-dim mb-1">Time</h4>
                                    <h4 className="text-sm text-system-primary-text leading-6">19:30 IST</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => OnClickRegister()}
                        width="full"
                        variant="black"
                    >
                        Register
                    </Button>
                </div>

                <div className="lg:col-span-2">
                    <div className={`rounded-lg ${!joined && "max-h-96 overflow-hidden relative "}`}>
                        {!joined &&
                            <div
                                className="absolute top-0 right-0 left-0 bottom-0 p-4 lg:px-10 lg:py-6 bg-brand-orange-transparent h-100 overflow-hidden overflow-y-auto z-10">
                                <div className="flex w-full items-start justify-end">
                                    <svg className="w-6 h-6 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                                    </svg>

                                </div>
                                <div className="flex flex-col justify-center items-center mt-6">
                                    <h4 className="font-bold text-center text-3xl text-system-primary-accent mb-3">Join the Event Discussions</h4>
                                    <h4 className="text-md text-center text-system-primary-accent">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</h4>
                                    <h4 className="text-md text-center text-system-primary-accent mt-4 mb-6">Lorem ipsum dolor sit amet - sed do eiusmod tempor</h4>
                                    <Button
                                        onClick={() => setJoined(true)}
                                        variant="success"
                                    >
                                        Join
                                    </Button>
                                </div>

                            </div>
                        }
                        <div className={`flex flex-col gap-2 ${!joined && "blur-lg"}`}>
                            <div className="p-5 bg-system-secondary-bg rounded-lg shadow-md">
                                <div className="flex items-start gap-2">
                                    <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Rounded avatar" />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-10">
                                            <h4 className="font-semibold text-md text-system-primary-accent mt-1">Tejeswara Rao Pedada</h4>
                                            <h4 className="font-medium text-xs text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                                        </div>


                                    </div>
                                </div>
                                <div className="mt-5">
                                    <h4 className="text-system-primary-text font-medium text-md">Have a great day!</h4>
                                </div>
                                <div className="flex items-center justify-between gap-10 mt-4">
                                    <div className="flex flex-wrap items-start justify-between gap-10">
                                        <div className="flex items-start gap-1 cursor-pointer">
                                            <p className="text-brand-gray-dim text-base mt-1">likes</p>
                                        </div>
                                        <div className="flex items-start gap-1 cursor-pointer">
                                            <p className="text-brand-gray-dim text-base mt-1">replies</p>
                                        </div>
                                    </div>
                                    <DropdownMenu />
                                </div>
                            </div>
                            <div className="p-5 bg-system-secondary-bg rounded-lg shadow-md">
                                <div className="flex items-start gap-2">
                                    <img className="w-12 h-12 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="Rounded avatar" />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-10">
                                            <h4 className="font-semibold text-md text-system-primary-accent mt-1">Lee Wen De</h4>
                                            <h4 className="font-medium text-xs text-brand-gray-dim">{relativeTime(1706194651000)}</h4>
                                        </div>


                                    </div>
                                </div>
                                <div className="mt-5">
                                    <h4 className="text-system-primary-text font-medium text-md">Any interesting events coming up?</h4>
                                </div>
                                <div className="flex items-center justify-between gap-10 mt-8">
                                    <div className="flex flex-wrap items-start justify-between gap-10">
                                        <div className="flex items-start gap-1 cursor-pointer">
                                            <p className="text-brand-gray-dim text-base mt-1">likes</p>
                                        </div>
                                        <div className="flex items-start gap-1 cursor-pointer">
                                            <p className="text-brand-gray-dim text-base mt-1">replies</p>
                                        </div>
                                    </div>
                                    <DropdownMenu />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div>
                    <div className="p-5 bg-system-secondary-bg rounded-lg">
                        <div className="lg:mt-1">
                            <MiniTab gap="gap-8" fontSize="text-md xl:text-xl" alignment="justify-center" tabs={miniEventTabs()} />

                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>)
}


export default SingleEvent
