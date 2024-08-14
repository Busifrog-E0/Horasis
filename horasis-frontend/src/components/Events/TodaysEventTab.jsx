import Button from "../ui/Button"

const TodaysEventTab = () => {

    return (<>
        <div className="bg-system-secondary-bg rounded-lg mt-3 overflow-hidden">
            <div className="h-24 bg-brand-green relative overflow-hidden">
                <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
                <div className="absolute top-0 right-0 p-2">
                    <Button
                        loading={false}
                        onClick={() => {
                            // handleLogin()
                        }}
                        variant="black"
                        width="full"
                    >
                        Join Event
                    </Button>
                </div>
            </div>
            <div className="p-3 px-2 grid grid-cols-5 gap-3 items-center">
                <div className="p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex flex-col items-center h-full justify-center">
                    <h4 className="text-sm text-center text-system-primary-text m-0">Jan</h4>
                    <h4 className="font-semibold text-xl text-center text-system-primary-text m-0">08</h4>
                </div>
                <div className="col-span-4 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg">
                    <h4 className="text-base text-system-primary-text m-0 leading-5">Horasis Meeting Worldwide Barcelona</h4>
                    <h4 className=" text-xs text-brand-gray-dim">Directly seated and inside for you to enjoy the show.</h4>

                </div>

            </div>
        </div>
    </>)
}

export default TodaysEventTab
