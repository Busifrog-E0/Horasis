import { relativeTime } from "../../utils/date"
import DropdownMenu from "../ui/DropdownMenu"

const ArticleTab = () => {

    return (<>
        <div className="p-2 bg-system-secondary-bg rounded-lg mt-3 border border-system-file-border">
            <div className="h-52 overflow-hidden rounded-lg">
                <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
            </div>
            <h4 className="font-semibold text-lg text-system-primary-accent mt-2">
                Horasis Lorem ipsum dolor sit ame..
            </h4>
            <h4 className="text-xs text-system-primary-accent">
                by Frank-Jurgen Richter
            </h4>
            <h4 className="text-sm text-brand-gray-dim mt-2">
                March 15 2023
            </h4>
            <div className="px-2 mt-1" >
                <div className="flex items-center justify-between gap-10">
                    <div className="flex flex-wrap items-start justify-between gap-10">
                        <div className="flex items-start gap-1 cursor-pointer">
                            <p className="text-brand-gray-dim mt-1">likes</p>
                        </div>
                        <div className="flex items-start gap-1 cursor-pointer">
                            <p className="text-brand-gray-dim mt-1">replies</p>
                        </div>
                    </div>
                    {/* <DropdownMenu /> */}
                </div>
            </div>
        </div>
    </>)
}

export default ArticleTab
