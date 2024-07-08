import { useState } from "react"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import RecentlyActiveMemebrsTab from "../components/Members/RecentlyActiveMemebrsTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import Button from "../components/ui/Button"
import Steps from "../components/ui/Steps"
import { useNavigate } from "react-router-dom"
import CreateArticleStep1 from "../components/Articles/CreateArticle/CreateArticleSteps/CreateArticleStep1"
import CreateArticleStep2 from "../components/Articles/CreateArticle/CreateArticleSteps/CreateArticleStep2"
import ArticleMiniTab from "../components/Articles/ArticleMiniTab"

const CreateArticle = () => {

    const [activeStep, setActiveStep] = useState(1)
    const navigate = useNavigate()

    const changeStep = (step) => {
        console.log(step)
        if (step >= 1 && step <= 2) {
            setActiveStep(step);
        }
        if (step === 3) {
            navigate(`/events/${123}`)
        }
    }

    const steps = [
        { "title": "Details", no: 1 },
        { "title": "Cover", no: 2 },
    ]

    const [coverPhoto, setCoverPhoto] = useState();

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
                    <h4 className="font-medium text-2xl text-system-primary-accent mt-5 mb-4">Create an Article</h4>
                    <div className="p-6 bg-system-secondary-bg rounded-lg">
                        {activeStep === 1 &&
                            <CreateArticleStep1 />
                        }
                        {activeStep === 2 &&
                            <CreateArticleStep2 coverPhoto={coverPhoto} setCoverPhoto={setCoverPhoto} />
                        }

                        {/* {activeStep !== 2 && */}
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
                                    {activeStep !== 2 ? <span>Next</span> : <span>Publish</span>}
                                </Button>
                            </div>
                        </div>
                        {/* } */}
                    </div>
                </div>
                <div>
                    <div className="p-5 bg-system-secondary-bg rounded-lg">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-2xl text-system-primary-text">Latest Articles</h4>
                            {/* arrow cursor-pointer */}
                        </div>
                        <ArticleMiniTab />
                        <ArticleMiniTab />
                    </div>
                </div>
            </div>
        </div>
    </>)
}


export default CreateArticle
