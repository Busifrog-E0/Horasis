import Button from "../ui/Button"

const EventBriefTab = () => {

    return (<>
        <div className="aspect-square w-60 relative overflow-hidden rounded-lg">
            <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
            <div className="absolute top-0 right-0 left-0 bottom-0 p-3 py-8 bg-gradient-to-b from-brand-blue-transparent h-100 overflow-hidden overflow-y-auto">
                <h4 className="text-md font-bold text-white m-0 leading-5 mb-2">Horasis Meeting Worldwide Barcelona</h4>
                <h4 className="text-sm font-medium text-white mb-2">25 December 2023</h4>
                <div className="flex flex-row flex-wrap gap-3">
                    <h4 className="text-xs text-white">Public Event</h4>
                    <h4 className="text-xs text-white">Active 2 weeks ago</h4>
                </div>
            </div>

        </div>
    </>)
}

export default EventBriefTab
