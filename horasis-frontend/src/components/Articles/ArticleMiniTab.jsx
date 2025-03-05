import { relativeTime } from "../../utils/date"
import DropdownMenu from "../ui/DropdownMenu"

const ArticleMiniTab = () => {

    return (<>
        <div className="mt-4 flex flex-row gap-2 border-b pb-4 border-system-file-border">

            <div className="h-18 w-28 overflow-hidden rounded-lg">
                <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-lg text-system-primary-text">
                    Education
                </h4>
                <div className="flex flex-row gap-3">
                    <p className="text-xs text-brand-gray-dim mt-1">
                        TCS Networking Platform Meeting Worldwide Barcelona
                        Directly seated and inside for you to enjoy the show.

                    </p>
                    <svg className="cursor-pointer w-12 h-12 text-system-primary-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                </div>
            </div>
        </div>
    </>)
}

export default ArticleMiniTab
