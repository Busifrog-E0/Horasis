import { useNavigate } from "react-router-dom"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import Button from "../components/ui/Button"
import TabItem from "../components/ui/TabItem"
import { useContext } from "react"
import { AuthContext } from "../utils/AuthProvider"
import DiscussionsList from "../components/Discussions/DiscussionsList"
import DiscussionSection from "../components/Discussions/DiscussionSection"
import SavedDiscussionTab from "../components/Discussions/Saved/SavedDiscussionTab"
import SavedActivityTab from "../components/Activities/Saved/SavedActivityTab"

const Discussions = () => {
    const { currentUserData, scrollToTop } = useContext(AuthContext)
    const navigate = useNavigate()
    const OnClickCreateNew = (path) => {
        scrollToTop()
        navigate(path)
    }


    return (<>
        <div className="p-2 lg:px-10 lg:py-6">
            <div className="grid lg:grid-cols-4 gap-3 lg:gap-12">
                <div className="hidden lg:block">
                    <CurrentProfileTab />
                    <h4 className="font-medium text-xl text-system-primary-text mt-3 lg:mt-5">Today's Event</h4>
                    <TodaysEventTab />
                </div>
                <div className="lg:col-span-2">
                    <DiscussionSection />
                </div>
                <div  className="flex flex-col gap-4">
                    <Button
                        onClick={() => OnClickCreateNew('/discussions/create/new')}
                        width="full"
                        variant="black"
                    >
                        Create Discussion
                    </Button>
                    <SavedDiscussionTab bordered={true} />
                    {/* <SavedActivityTab/> */}
                </div>
            </div>
        </div>
    </>)
}


export default Discussions
