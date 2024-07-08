import Button from "../ui/Button"



const MemberSuggestionTab = () => {

    return (<>
        <div className="border-b border-system-file-border pb-3">
            <div className="flex items-start gap-4">
                <img className="w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Rounded avatar" />

                <div className="flex-1">
                    <h4 className="font-semibold text-system-primary-text">James Lim</h4>
                    <h4 className="font-medium text-sm text-brand-gray-dim mb-2">@JamesL, Consultant United States (U.S.A)</h4>

                </div>
                <Button
                    variant="outline"
                >
                    Follow
                </Button>
            </div>
        </div>
    </>)
}

export default MemberSuggestionTab
