const EventTab = ({ event, onClick }) => {
    return (
        <div className="rounded-lg mt-3 overflow-hidden h-full cursor-pointer" onClick={() => onClick(event.DocId)}>
            <div className="h-28 overflow-hidden rounded-lg">
                <img src="https://th.bing.com/th/id/OIP.b6Wd5ElpRfRco6-8ZyL7NwHaE8?w=229&h=180&c=7&r=0&o=5&pid=1.7" className="object-cover h-full w-full" />
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 ">
                <div className="col-span-2 p-3 px-5 bg-system-secondary-bg rounded-lg shadow-lg flex justify-center items-center flex-col border border-system-file-border">
                    <h4 className="text-xs text-center text-system-primary-text m-0">Jan</h4>
                    <h4 className="text-sm font-semibold text-xl text-center text-system-primary-text m-0">08</h4>
                </div>
                <div className="col-span-5 p-2 px-3 pt-3 bg-system-secondary-bg rounded-lg shadow-lg border border-system-file-border">
                    <h4 className="text-base font-semibold text-system-primary-text mb-2 leading-6">Horasis India Meeting </h4>
                    <div className="flex flex-wrap items-center gap-x-2">
                        <h4 className="text-xs text-brand-gray-dim">Virtual Event</h4>
                        <h4 className="tetx-xs text-brand-gray-dim">•</h4>
                        <h4 className="text-xs text-brand-gray-dim">104 Participants</h4>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default EventTab