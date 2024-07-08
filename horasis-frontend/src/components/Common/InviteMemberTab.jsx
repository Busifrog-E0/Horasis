import Button from "../ui/Button"



const InviteMemberTab = () => {

    return (<>
        <div className="border-b border-system-file-border pb-4 pt-4">
            <div className="flex items-start gap-3">
                <img className="w-11 h-11 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />

                <div className="flex-1">
                    <h4 className="font-semibold text-system-primary-accent">James Lim</h4>
                    <h4 className="font-medium text-sm text-brand-gray-dim mt-1">@JamesL, Consultant United States (U.S.A)</h4>

                </div>
                <Button
                    variant="outline"
                >
                    Invite
                </Button>
            </div>
        </div>
    </>)
}

export default InviteMemberTab
