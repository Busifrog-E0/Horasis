import { twMerge } from 'tailwind-merge'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { inputVariants } from '../../utils/app/FormElements'
import '../../style/date.css'
const DateAndTimePicker = ({
	variant,
	size,
	width,
	withIcon,
	className,
	value,
	placeholder,
	setValue,
	showTimeSelect = false,
	showTimeSelectOnly = false,
	timeIntervals,
	timeCaption,
	dateFormat,
	...props
}) => {
	return (
		<div className={`flex flex-col my-1 ${width === 'full' ? 'w-[100%]' : 'w-max'}`}>
			<DatePicker
				timeIntervals={timeIntervals}
				timeCaption={timeCaption}
				showTimeSelect={showTimeSelect}
				showTimeSelectOnly={showTimeSelectOnly}
				dateFormat={dateFormat}
				selected={value}
				wrapperClassName='w-full'
				className={twMerge(inputVariants({ variant, size, width, withIcon, className }))}
				calendarClassName='custom-calendar'
				onChange={setValue}
				minDate={new Date()}
				{...props}
			/>
		</div>
	)
}

export default DateAndTimePicker
