
const HeroSection = () => {

    return (<>
        <div className="bg-system-primary-accent p-2 lg:px-10 lg:py-6">
            <div className="grid lg:grid-cols-2">
                <div className="flex flex-col gap-10">
                    <div >
                        <div className="flex flex-col">
                            <h4 className="font-bold text-4xl text-white mb-2">Horasis</h4>
                            <h4 className=" text-4xl text-white mb-2">Global Visions Community</h4>

                        </div>
                        <h4 className="text-xl text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h4>
                    </div>
                    <div className="flex flex-row flex-wrap gap-6">
                        <div className="rounded-full p-4 px-12 border-2 border-white bg-white">
                            <p className="text-system-primary-accent text-xl font-bold">Register</p>
                        </div>
                        <div className="rounded-full p-4 px-12 border-2 border-white">
                            <p className="text-system-primary-accent text-xl font-bold text-white">Learn More</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default HeroSection
