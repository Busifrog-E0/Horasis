import Button from "../ui/Button"

const DiscussionTab = ({ discussion, onClick }) => {
    return (
        <div className="rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg" onClick={() => onClick(discussion.DocId)}>
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
    )
}

export default DiscussionTab