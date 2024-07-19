import { useNavigate } from "react-router-dom"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import Button from "../components/ui/Button"
import TabItem from "../components/ui/TabItem"
import { useContext } from "react"
import { AuthContext } from "../utils/AuthProvider"
import SavedTab from "../components/Activities/Saved/SavedTab"
import DiscussionsList from "../components/Discussions/DiscussionsList"

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
                    <div className="flex-1 rounded-md p-2 px-4 border border-system-file-border flex items-center justify-between bg-system-secondary-bg">
                        <h4 className="font-medium text-lg text-brand-gray-dim italic ">Search Discussions</h4>

                    </div>
                    <h4 className="font-bold text-2xl text-system-primary-accent mt-4 mb-2">Community Discussions</h4>
                    <h4 className=" text-base text-system-primary-text mb-2">Find answers, ask questions, and connect with our community aroundthe world.</h4>
                    <div className="flex gap-6 flex-wrap mt-4 mb-6">

                        <TabItem variant="active">
                            All Discussions
                        </TabItem>
                        <TabItem variant="inactive">
                            Following
                        </TabItem>
                    </div>
                    <h4 className="font-bold mb-3 text-xl text-system-primary-text">Trending Discussions</h4>
                    <DiscussionsList data={[]} emptyText={'No discussions'} gap={'lg:gap-4'} cols={3} />
                </div>
                <div>
                    <Button
                        onClick={() => OnClickCreateNew('/discussions/create/new')}
                        width="full"
                        variant="black"
                    >
                        Create Discussion
                    </Button>
                    <SavedTab bordered={true} />
                </div>
            </div>
        </div>
    </>)
}


export default Discussions
