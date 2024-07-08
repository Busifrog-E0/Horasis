import Button from "../ui/Button"

const DiscussionsAnalyticsTab = () => {

    return (<>
        <div className="rounded-lg mt-3 overflow-hidden h-full bg-system-secondary-bg border">
            <div className="h-32 overflow-hidden rounded-lg">
                <img src="https://www.charteredaccountants.ie/sf_images/default-source/sustainability-centre-images/bubble-sustainable-min.jpeg?sfvrsn=25dea27c_2" className="object-cover h-full w-full" />
            </div>
            <div className="p-1 px-3">
                <div className="flex flex-wrap items-center gap-x-2">
                    <h4 className="text-xs text-brand-gray-dim">Public Discussion</h4>
                    <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                    <h4 className="text-xs text-brand-gray-dim">104 Members</h4>
                </div>
                <h4 className="text-lg font-medium text-system-primary-text mb-1 mt-5">Sustainability</h4>
                <h4 className="text-sm text-brand-gray-dim leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h4>

            </div>
            <div className="flex items-center justify-center gap-1 cursor-pointer px-4">
                <p className="text-brand-gray-dim text-xs mt-1">267 Posts</p>
            </div>
        </div>
    </>)
}

export default DiscussionsAnalyticsTab
