import { relativeTime } from "../../utils/date"
import DropdownMenu from "../ui/DropdownMenu"

const PostTab = () => {

    return (<>
        <div className="p-4 pb-5 bg-system-secondary-bg rounded-lg mt-3 border border-system-file-border">
            <div className="flex items-start gap-2">
                <img className="w-11 h-11 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />

                <div className="flex-1">
                    <h4 className="font-semibold text-lg text-system-primary-accent">James Lim</h4>
                </div>
                <div>
                    <h4 className="font-medium text-xs text-brand-gray-dim">{relativeTime(new Date().getTime())}</h4>
                </div>
            </div>
            <div className="px-2">
                <div className="">
                    <h4 className="text-base text-system-primary-text mb-2 mt-3">Horasis
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</h4>
                </div>
                <div className="flex items-center justify-between gap-10">
                    <div className="flex flex-wrap items-start justify-between gap-10">
                        <div className="flex items-start gap-1 cursor-pointer">
                            <p className="text-brand-gray-dim mt-1">likes</p>
                        </div>
                        <div className="flex items-start gap-1 cursor-pointer">
                            <p className="text-brand-gray-dim mt-1">replies</p>
                        </div>
                    </div>
                    <DropdownMenu />
                </div>
            </div>
        </div>
    </>)
}

export default PostTab
