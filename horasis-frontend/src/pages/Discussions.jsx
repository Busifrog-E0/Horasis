import { useNavigate } from "react-router-dom"
import DiscussionsMainTab from "../components/Discussions/DiscussionsMainTab"
import TodaysEventTab from "../components/Events/TodaysEventTab"
import PostTab from "../components/Posts/PostTab"
import CurrentProfileTab from "../components/Profile/CurrentProfileTab"
import Button from "../components/ui/Button"
import DropdownMenu from "../components/ui/DropdownMenu"
import TabItem from "../components/ui/TabItem"
import { relativeTime } from "../utils/date"
import { useContext } from "react"
import { AuthContext } from "../utils/AuthProvider"
import SavedTab from "../components/Activities/Saved/SavedTab"

const Discussions = () => {
    const { currentUserData, scrollToTop } = useContext(AuthContext)
    const navigate = useNavigate()
    const OnClickCreateNew = (path) => {
        scrollToTop()
        navigate(path)
    }

    const GoToSingleDiscussion = (id) => {
        scrollToTop()
        navigate(`/discussions/${id}`)
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
                    <h4 className="font-bold text-xl text-system-primary-text">Trending Discussions</h4>
                    <div className="grid lg:grid-cols-3 gap-2 lg:gap-4">

                        <DiscussionsMainTab />
                        <div className="rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg cursor-pointer" onClick={() => GoToSingleDiscussion("12345")}>
                            <div className="h-28 overflow-hidden rounded-lg">
                                <img src="https://th.bing.com/th/id/OIP.FFchRAWwk-emGNqgImzwaAHaEK?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
                            </div>
                            <div className="p-2 px-6">
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <h4 className="text-xs text-brand-gray-dim">Public Discussion</h4>
                                    <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                                    <h4 className="text-xs text-brand-gray-dim">104 Members</h4>
                                </div>
                                <h4 className="text-base font-semibold text-system-primary-text mb-1 leading-6">Artificial Intelligence </h4>
                                <h4 className=" text-xs text-brand-gray-dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h4>

                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="black"
                                >
                                    Follow
                                </Button>
                            </div>
                        </div>
                        <div className="rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg">
                            <div className="h-28 overflow-hidden rounded-lg">
                                <img src="https://i1.wp.com/www.geopolitika.hu/wp-content/uploads/2018/05/shutterstock_1009265824.jpg?fit=1200%2C801" className="object-cover h-full w-full" />
                            </div>
                            <div className="p-2 px-6">
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <h4 className="text-xs text-brand-gray-dim">Public Discussion</h4>
                                    <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                                    <h4 className="text-xs text-brand-gray-dim">104 Members</h4>
                                </div>
                                <h4 className="text-base font-semibold text-system-primary-text mb-1 leading-6">Geopolitics </h4>
                                <h4 className=" text-xs text-brand-gray-dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h4>

                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="black"
                                >
                                    Follow
                                </Button>
                            </div>
                        </div>
                        <div className="rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg">
                            <div className="h-28 overflow-hidden rounded-lg">
                                <img src="https://st.adda247.com/https://wpassets.adda247.com/wp-content/uploads/multisite/sites/2/2022/10/06181046/Trade-and-Commerce-01.png" className="object-cover h-full w-full" />
                            </div>
                            <div className="p-2 px-6">
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <h4 className="text-xs text-brand-gray-dim">Public Discussion</h4>
                                    <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                                    <h4 className="text-xs text-brand-gray-dim">104 Members</h4>
                                </div>
                                <h4 className="text-base font-semibold text-system-primary-text mb-1 leading-6">Trade & Commerce </h4>
                                <h4 className=" text-xs text-brand-gray-dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h4>

                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="secondary"
                                >
                                    Unfollow
                                </Button>
                            </div>
                        </div>
                        <div className="rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg">
                            <div className="h-28 overflow-hidden rounded-lg">
                                <img src="https://denver-south.com/wp-content/uploads/2018/04/what_is_econ_dev_april_12_2018-2048x1152.jpg" className="object-cover h-full w-full" />
                            </div>
                            <div className="p-2 px-6">
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <h4 className="text-xs text-brand-gray-dim">Public Discussion</h4>
                                    <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                                    <h4 className="text-xs text-brand-gray-dim">104 Members</h4>
                                </div>
                                <h4 className="text-base font-semibold text-system-primary-text mb-1 leading-6">Economic Development </h4>
                                <h4 className=" text-xs text-brand-gray-dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h4>

                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="black"
                                >
                                    Follow
                                </Button>
                            </div>
                        </div>
                        <div className="rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg">
                            <div className="h-28 overflow-hidden rounded-lg">
                                <img src="https://thumbs.dreamstime.com/b/multiple-national-country-flags-waving-several-top-flag-poles-62247929.jpg" className="object-cover h-full w-full" />
                            </div>
                            <div className="p-2 px-6">
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <h4 className="text-xs text-brand-gray-dim">Public Discussion</h4>
                                    <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                                    <h4 className="text-xs text-brand-gray-dim">104 Members</h4>
                                </div>
                                <h4 className="text-base font-semibold text-system-primary-text mb-1 leading-6">Horasis Global Discussion </h4>
                                <h4 className=" text-xs text-brand-gray-dim">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h4>

                            </div>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="black"
                                >
                                    Follow
                                </Button>
                            </div>
                        </div>

                    </div>

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
