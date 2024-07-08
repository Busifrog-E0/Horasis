import DateAndTimePicker from "../../../ui/DateAndTimePicker"
import Input from "../../../ui/Input"
import TextArea from "../../../ui/TextArea"
import SelectEventCountry from "../SelectEventCountry"
import SelectEventTypeList from "../SelectEventTypeList"

const CreateEventStep1 = ({ eventDate, setEventDate, eventStartTime, setEventStartTime, eventEndTime, setEventEndTime }) => {


    return (<div className="flex flex-col gap-4">
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Event Name<span className="text-brand-red">*</span></h1>
            <Input placeholder="Event name" width="full" variant="primary_outlined" />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Event Description<span className="text-brand-red">*</span></h1>
            <TextArea rows={6} placeholder="Event description" width="full" variant="primary_outlined" />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Event Date<span className="text-brand-red">*</span></h1>
            <DateAndTimePicker
                value={eventDate} setValue={setEventDate}
                placeholder="Event date" width="full" variant="primary_outlined" />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Event Time<span className="text-brand-red">*</span></h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-16 items-center">
                <div className="flex-1 w-full">
                    <DateAndTimePicker
                        showTimeSelect={true}
                        showTimeSelectOnly={true}
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        value={eventStartTime} setValue={setEventStartTime}
                        placeholder="Event start time" width="full" variant="primary_outlined" />
                </div>
                <div>
                    <svg className="w-5 h-5 text-system-primary-text " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                </div>
                <div className="flex-1 w-full">
                    <DateAndTimePicker
                        showTimeSelect={true}
                        showTimeSelectOnly={true}
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        value={eventEndTime} setValue={setEventEndTime}
                        placeholder="Event end time" width="full" variant="primary_outlined" />
                </div>

            </div>

        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Event Agenda<span className="text-brand-red">*</span></h1>
            <div className="flex flex-row gap-4 items-end">
                <div className="flex-1">
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center mb-2">
                        <div className="flex-1 w-full">
                            <Input placeholder="Event name" width="full" variant="primary_outlined" />
                        </div>
                        <div className="flex-1 w-full">
                            <DateAndTimePicker
                                showTimeSelect={true}
                                showTimeSelectOnly={true}
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                value={eventStartTime} setValue={setEventStartTime}
                                placeholder="Event start time" width="full" variant="primary_outlined" />
                        </div>
                        <div>
                            <svg className="w-5 h-5 text-system-primary-text " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                            </svg>
                        </div>
                        <div className="flex-1 w-full">
                            <DateAndTimePicker
                                showTimeSelect={true}
                                showTimeSelectOnly={true}
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                value={eventEndTime} setValue={setEventEndTime}
                                placeholder="Event end time" width="full" variant="primary_outlined" />
                        </div>

                    </div>
                    <div className="bg-red-100">
                        <TextArea rows={2} placeholder="Event description" width="full" variant="primary_outlined" />

                    </div>
                </div>
                <div className="w-5 h-5 mb-3 cursor-pointer">
                    <svg className="w-5 h-5 text-system-primary-btn" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                </div>
            </div>
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Event Type<span className="text-brand-red">*</span></h1>
            <SelectEventTypeList />
        </div>
        <div>
            <h1 className="text-system-primary-text font-medium text-lg">Country Location<span className="text-brand-red">*</span></h1>
            <SelectEventCountry />
        </div>
    </div>)
}

export default CreateEventStep1
