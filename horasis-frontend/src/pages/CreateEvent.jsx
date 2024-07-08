import { useState } from "react"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import RecentlyActiveMemebrsTab from "../components/Members/RecentlyActiveMemebrsTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import Button from "../components/ui/Button"
import Steps from "../components/ui/Steps"
import CreateEventStep1 from "../components/Events/CreateEvent/CreateEventSteps/CreateEventStep1"
import CreateEventStep2 from "../components/Events/CreateEvent/CreateEventSteps/CreateEventStep2"
import CreateEventStep3 from "../components/Events/CreateEvent/CreateEventSteps/CreateEventStep3"
import CreateEventStep6 from "../components/Events/CreateEvent/CreateEventSteps/CreateEventStep6"
import CreateEventStep5 from "../components/Events/CreateEvent/CreateEventSteps/CreateEventStep5"
import CreateEventStep4 from "../components/Events/CreateEvent/CreateEventSteps/CreateEventStep4"
import { useNavigate } from "react-router-dom"

const CreateEvent = () => {

    const [activeStep, setActiveStep] = useState(1)
    const navigate = useNavigate()

    const changeStep = (step) => {
        console.log(step)
        if (step >= 1 && step <= 6) {
            setActiveStep(step);
        }
        if (step === 7) {
            navigate(`/events/${123}`)
        }
    }

    const steps = [
        { "title": "Details", no: 1 },
        { "title": "Settings", no: 2 },
        { "title": "Forum", no: 3 },
        { "title": "Photo", no: 4 },
        { "title": "Cover", no: 5 },
        { "title": "Invites", no: 6 },
    ]

    const [eventDate, setEventDate] = useState(new Date());
    const [eventStartTime, setEventStartTime] = useState(new Date());
    const [eventEndTime, setEventEndTime] = useState(new Date());


    const [coverPhoto, setCoverPhoto] = useState();
    const [photo, setPhoto] = useState();

    return (<>
        <div className="p-2 lg:px-10 lg:py-6">
            <div className="grid lg:grid-cols-4 gap-3 lg:gap-12">
                <div className="hidden lg:block">
                    <CurrentProfileTab />
                    <h4 className="font-medium text-xl text-system-primary-text mt-3 lg:mt-5">Today's Event</h4>
                    <TodaysEventTab />

                    <div className="p-6 bg-system-secondary-bg rounded-lg mt-3 lg:mt-5">
                        <h4 className="font-medium text-md text-system-primary-text mb-4">Recently Active Members</h4>
                        <RecentlyActiveMemebrsTab />
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <Steps changeStep={changeStep} activeStep={activeStep} steps={steps} />
                    <h4 className="font-medium text-2xl text-system-primary-accent mt-5 mb-4">Create an Event</h4>
                    <div className="p-6 bg-system-secondary-bg rounded-lg">
                        {activeStep === 1 &&
                            <CreateEventStep1 eventDate={eventDate} eventEndTime={eventEndTime} eventStartTime={eventStartTime}
                                setEventDate={setEventDate} setEventEndTime={setEventEndTime} setEventStartTime={setEventStartTime} />
                        }
                        {activeStep === 2 &&
                            <CreateEventStep2 />
                        }
                        {activeStep === 3 &&
                            <CreateEventStep3 />
                        }
                        {activeStep === 4 &&
                            <CreateEventStep4 photo={photo} setPhoto={setPhoto} />
                        }
                        {activeStep === 5 &&
                            <CreateEventStep5 coverPhoto={coverPhoto} setCoverPhoto={setCoverPhoto} />
                        }
                        {activeStep === 6 &&
                            <CreateEventStep6 changeStep={changeStep} activeStep={activeStep} />
                        }
                        {/* {activeStep !== 6 && */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                            <div className="hidden lg:block"></div>
                            <div className="col-span-1">
                                {activeStep !== 1 &&
                                    <Button
                                        onClick={() => changeStep(activeStep - 1)}
                                        variant="outline"
                                        width='full'
                                    >
                                        Back
                                    </Button>
                                }
                            </div>
                            <div className="col-span-1">
                                <Button
                                    onClick={() => changeStep(activeStep + 1)}
                                    width='full'
                                    variant="black"
                                >
                                    {activeStep !== 6 ? <span>Next</span> : <span>Done</span>}
                                </Button>
                            </div>
                        </div>
                        {/* } */}
                    </div>
                </div>
                <div>
                    <div className="p-5 bg-system-secondary-bg rounded-lg">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-2xl text-system-primary-text">Upcoming Event</h4>
                            {/* arrow cursor-pointer */}
                        </div>
                        <div className="bg-system-secondary-bg rounded-lg mt-3 border border-brand-gray">
                            <div className="h-44 overflow-hidden rounded-lg">
                                <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
                            </div>
                            <div className="p-2 pt-5">
                                <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis Meeting </h4>
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
                                    <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                                    <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
                                </div>

                            </div>
                            <div className="p-2 pt-4">
                                <h4 className="text-xs text-brand-gray-dim">When</h4>
                                <h4 className="text-base text-system-primary-text mb-2 leading-6">29 January 2024 19:30</h4>
                            </div>
                            <div className="p-2 pt-0">
                                <h4 className="text-base text-brand-gray-dim">About the event</h4>
                                <h4 className="text-sm text-system-primary-text mb-2 mt-3">Horasis
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</h4>
                            </div>
                            <div className="flex items-center justify-center pb-4">
                                <Button
                                    variant="outline"
                                >
                                    Register
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}


export default CreateEvent
