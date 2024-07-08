const CreateEventStep4 = ({ photo, setPhoto }) => {


    return (<div className="flex flex-col gap-4">
        <div>
            <input onChange={e => {
                if (e.target.files[0])
                    setPhoto(e.target.files[0])
            }} type="file" id="createEventPhotoPicker" className="hidden"></input>
            <div className="flex flex-row items-center justify-center mb-8">
                {photo ?
                    <label htmlFor="createEventPhotoPicker" className="cursor-pointer">
                        <div className="h-36 w-36 bg-brand-black-transparent rounded-lg flex flex-col items-center justify-center overflow-hidden">
                            <img src={URL.createObjectURL(photo)} className="object-cover h-full w-full" />
                        </div>
                    </label>
                    :
                    <label htmlFor="createEventPhotoPicker" className="cursor-pointer">
                        <div className="h-36 w-36 bg-brand-black-transparent rounded-lg flex flex-col items-center justify-center overflow-hidden">
                            <svg className="text-brand-secondary h-8 w-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                        </div>
                    </label>
                }
            </div>
            <h1 className="text-system-primary-text font-medium text-lg">Upload Photo</h1>
            <p className="text-brand-gray mt-1 mb-2 text-base">Upload a photo that represents this group, This image will be shown on the main group page, and in search results.</p>
        </div>

    </div>)
}

export default CreateEventStep4
