import { relativeTime } from "../../utils/date"
import DropdownMenu from "../ui/DropdownMenu"
import MembersSectionTab from "./MemberSectionTab"

const MembersSection = () => {

    return (<>
        <div className="bg-system-secondary-bg p-4 rounded-b-lg ">
            <div className="flex flex-col gap-5">
                <MembersSectionTab />
                <MembersSectionTab />
                <MembersSectionTab />
                <MembersSectionTab />
                <MembersSectionTab />
                <MembersSectionTab />
                <div className="bg-system-secondary-bg">
                    <div className="flex items-start gap-4">
                        <img className="w-11 h-11 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />

                        <div className="flex-1">
                            <h4 className="font-semibold text-lg text-system-primary-accent">James Lim</h4>
                            <h4 className="font-semibold text-sm text-brand-gray-dim">@JamesL</h4>
                        </div>
                        <div className="flex flex-col items-end">
                            <h4 className="font-medium text-base text-brand-gray-dim mb-3">{relativeTime(new Date().getTime())}</h4>
                            <DropdownMenu />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </>)
}

export default MembersSection
