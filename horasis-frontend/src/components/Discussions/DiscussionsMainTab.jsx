import Button from "../ui/Button"

const DiscussionsMainTab = () => {

    return (<>
        <div className="rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg">
            <div className="h-28 overflow-hidden rounded-lg">
                <img src="https://www.charteredaccountants.ie/sf_images/default-source/sustainability-centre-images/bubble-sustainable-min.jpeg?sfvrsn=25dea27c_2" className="object-cover h-full w-full" />
            </div>
            <div className="p-2 px-6">
                <div className="flex flex-wrap items-center gap-x-2">
                    <h4 className="text-xs text-brand-gray-dim">Public Discussion</h4>
                    <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                    <h4 className="text-xs text-brand-gray-dim">104 Members</h4>
                </div>
                <h4 className="text-base font-semibold text-system-primary-text mb-1 leading-6">Sustainability </h4>
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
    </>)
}

export default DiscussionsMainTab
