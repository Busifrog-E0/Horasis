import DateAndTimePicker from '../../../ui/DateAndTimePicker'
import Input from '../../../ui/Input'
import TextArea from '../../../ui/TextArea'
import SelectEventCountry from '../SelectEventCountry'
import SelectEventTypeList from '../SelectEventTypeList'
import arrowfor from '../../../../assets/icons/arrowfor.svg'
import addIcon from '../../../../assets/icons/add-icon.svg'
import deleteIcon from '../../../../assets/icons/delete.svg'
import { useState } from 'react'
import { Description } from '@headlessui/react'
import countries from '../../../../assets/json/countries-with-coords.json'
import Select from '../../../ui/Select'
import SelectDiscussionPrivacy from '../../../Discussions/CreateDiscussion/SelectDiscussionPrivacy'
import { SearchTags, SelectedTag } from '../../../Profile/AboutProfile'
import useGetList from '../../../../hooks/useGetList'

const CreateEventStep1 = ({ postEventData, setPostEventData, validateSingle, errorObj }) => {
	const [eventAgendas, setEventAgendas] = useState([1])
	const [date, setDate] = useState(new Date())
	const onSelectType = (value) => {
		setPostEventData({ ...postEventData, Type: value })
	}

	const [countryOptions, setCountryOptions] = useState(countries.countries.map((item) => item.name))

	const addTag = (tag) => {
		setPostEventData((prev) => {
			const tagExists = prev.Tags.some((existingTag) => existingTag.DocId === tag.DocId)
			if (tagExists) return prev

			return { ...prev, Tags: [...prev.Tags, tag] }
		})
	}

	const removeTag = (tag) => {
		setPostEventData((prev) => {
			return { ...prev, Tags: prev.Tags.filter((interest) => interest.DocId !== tag.DocId) }
		})
	}

	const { data: tagsList } = useGetList('tags', { Limit: -1 })
	return (
		<div className='flex flex-col gap-4'>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Event Name<span className='text-brand-red'>*</span>
				</h1>
				<Input
					placeholder='Event name'
					width='full'
					variant='primary_outlined'
					value={postEventData.EventName}
					onChange={(e) => {
						validateSingle({ ['EventName']: e.target.value }, 'EventName')
					}}
				/>
				{errorObj['EventName'] != undefined && <p className='text-brand-red m-0'>{errorObj['EventName']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Event Description<span className='text-brand-red'>*</span>
				</h1>
				<TextArea
					rows={6}
					placeholder='Event description'
					width='full'
					variant='primary_outlined'
					value={postEventData.Description}
					onChange={(e) => {
						validateSingle({ ['Description']: e.target.value }, 'Description')
					}}
				/>
				{errorObj['Description'] != undefined && <p className='text-brand-red m-0'>{errorObj['Description']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Event Date<span className='text-brand-red'>*</span>
				</h1>
				<DateAndTimePicker
					minDate={new Date()}
					selected={new Date(postEventData.Date)}
					onChange={(date) => {
						const selectedStartTime = new Date(postEventData.StartTime)
						const selectedEndTime = new Date(postEventData.EndTime)
						const eventDate = new Date(date)

						const combinedStartTime = new Date(
							eventDate.getFullYear(),
							eventDate.getMonth(),
							eventDate.getDate(),
							selectedStartTime.getHours(),
							selectedStartTime.getMinutes(),
							selectedStartTime.getSeconds()
						)
						const combinedEndTime = new Date(
							eventDate.getFullYear(),
							eventDate.getMonth(),
							eventDate.getDate(),
							selectedEndTime.getHours(),
							selectedEndTime.getMinutes(),
							selectedEndTime.getSeconds()
						)

						const combinedStartEpoch = combinedStartTime.getTime()
						const combinedEndEpoch = combinedEndTime.getTime()

						validateSingle(
							{ ['Date']: combinedStartEpoch, ['StartTime']: combinedStartEpoch, ['EndTime']: combinedEndEpoch },
							'Date'
						)
					}}
					placeholder='Event date'
					width='full'
					variant='primary_outlined'
				/>
				{errorObj['Date'] != undefined && <p className='text-brand-red m-0'>{errorObj['Date']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Event Time<span className='text-brand-red'>*</span>
				</h1>
				<div className='flex flex-col md:flex-row gap-4 md:gap-16 items-center'>
					<div className='flex-1 w-full'>
						<DateAndTimePicker
							minDate={new Date()}
							showTimeSelect={true}
							showTimeSelectOnly={true}
							timeIntervals={15}
							timeCaption='Time'
							dateFormat='h:mm aa'
							selected={new Date(postEventData.StartTime)}
							onChange={(date) => {
								if (postEventData.Date) {
									const eventDate = new Date(postEventData.Date)
									const selectedTime = new Date(date)

									const combinedDateTime = new Date(
										eventDate.getFullYear(),
										eventDate.getMonth(),
										eventDate.getDate(),
										selectedTime.getHours(),
										selectedTime.getMinutes(),
										selectedTime.getSeconds()
									)
									const combinedEpoch = combinedDateTime.getTime()
									validateSingle({ ['Date']: combinedEpoch, ['StartTime']: combinedEpoch }, 'Date')
								} else {
									console.error('Please select the event date first.')
								}
							}}
							placeholder='Event start time'
							width='full'
							variant='primary_outlined'
						/>
						{errorObj['StartTime'] != undefined && <p className='text-brand-red m-0'>{errorObj['StartTime']}</p>}
					</div>
					<div>
						<img src={arrowfor} alt='' className='h-8 rotate-90 md:rotate-0' />
					</div>
					<div className='flex-1 w-full'>
						<DateAndTimePicker
							minDate={new Date()}
							showTimeSelect={true}
							showTimeSelectOnly={true}
							timeIntervals={15}
							timeCaption='Time'
							dateFormat='h:mm aa'
							selected={new Date(postEventData.EndTime)}
							onChange={(date) => {
								if (postEventData.Date) {
									const eventDate = new Date(postEventData.Date)
									const selectedTime = new Date(date)

									const combinedDateTime = new Date(
										eventDate.getFullYear(),
										eventDate.getMonth(),
										eventDate.getDate(),
										selectedTime.getHours(),
										selectedTime.getMinutes(),
										selectedTime.getSeconds()
									)
									const combinedEpoch = combinedDateTime.getTime()
									validateSingle({ ['EndTime']: combinedEpoch }, 'EndTime')
								} else {
									console.error('Please select the event date first.')
								}
							}}
							placeholder='Event end time'
							width='full'
							variant='primary_outlined'
						/>
						{errorObj['EndTime'] != undefined && <p className='text-brand-red m-0'>{errorObj['EndTime']}</p>}
					</div>
				</div>
			</div>

			<div className='flex flex-col gap-4'>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Event Agenda<span className='text-brand-red'>*</span>
				</h1>
				{postEventData.Agenda.map((item, index) => {
					return (
						<div className='flex flex-row gap-4 items-end' key={index}>
							<div className='flex-1'>
								<div className='self-start lg:self-center'>
									<p className='text-system-primary-accent font-medium'>Agenda {index + 1} :</p>
								</div>
								<div className='flex flex-col lg:flex-row gap-4 lg:gap-8 items-center mb-2'>
									<div className='flex-1 w-full'>
										<Input
											placeholder='Ex. Registration'
											width='full'
											variant='primary_outlined'
											value={item.Name}
											onChange={(e) => {
												validateSingle({ ['Name']: e.target.value }, 'Name', index)
											}}
										/>
									</div>
									<div className='flex-1 w-full'>
										<DateAndTimePicker
											minDate={new Date()}
											showTimeSelect={true}
											showTimeSelectOnly={true}
											timeIntervals={15}
											timeCaption='Time'
											dateFormat='h:mm aa'
											selected={new Date(item.StartTime)}
											onChange={(date) => {
												if (postEventData.Date) {
													const eventDate = new Date(postEventData.Date)
													const selectedTime = new Date(date)

													const combinedDateTime = new Date(
														eventDate.getFullYear(),
														eventDate.getMonth(),
														eventDate.getDate(),
														selectedTime.getHours(),
														selectedTime.getMinutes(),
														selectedTime.getSeconds()
													)
													const combinedEpoch = combinedDateTime.getTime()
													validateSingle({ ['StartTime']: combinedEpoch }, 'StartTime', index)
												} else {
													console.error('Please select the event date first.')
												}
											}}
											placeholder='Event start time'
											width='full'
											variant='primary_outlined'
										/>
									</div>
									<div>
										<img src={arrowfor} alt='' className='h-8 rotate-90 lg:rotate-0' />
									</div>
									<div className='flex-1 w-full'>
										<DateAndTimePicker
											showTimeSelect={true}
											showTimeSelectOnly={true}
											timeIntervals={15}
											timeCaption='Time'
											dateFormat='h:mm aa'
											minDate={new Date()}
											selected={new Date(item.EndTime)}
											onChange={(date) => {
												if (postEventData.Date) {
													const eventDate = new Date(postEventData.Date)
													const selectedTime = new Date(date)

													const combinedDateTime = new Date(
														eventDate.getFullYear(),
														eventDate.getMonth(),
														eventDate.getDate(),
														selectedTime.getHours(),
														selectedTime.getMinutes(),
														selectedTime.getSeconds()
													)
													const combinedEpoch = combinedDateTime.getTime()
													validateSingle({ ['EndTime']: combinedEpoch }, 'EndTime', index)
												} else {
													console.error('Please select the event date first.')
												}
											}}
											placeholder='Event end time'
											width='full'
											variant='primary_outlined'
										/>
									</div>
								</div>
								{errorObj[`Agenda.${index}.Name`] != undefined && (
									<p className='text-brand-red m-0'>{errorObj[`Agenda.${index}.Name`]}</p>
								)}

								{errorObj[`Agenda.${index}.StartTime`] != undefined && (
									<p className='text-brand-red m-0'>{errorObj[`Agenda.${index}.StartTime`]}</p>
								)}

								{errorObj[`Agenda.${index}.EndTime`] != undefined && (
									<p className='text-brand-red m-0'>{errorObj[`Agenda.${index}.EndTime`]}</p>
								)}
								<div className=''>
									<TextArea
										rows={2}
										placeholder='Segment  Description'
										width='full'
										variant='primary_outlined'
										value={item.Description}
										onChange={(e) => {
											validateSingle({ ['Description']: e.target.value }, 'Description', index)
										}}
									/>
									{errorObj[`Agenda.${index}.Description`] != undefined && (
										<p className='text-brand-red m-0'>{errorObj[`Agenda.${index}.Description`]}</p>
									)}
								</div>

								<div className='flex-1 w-full mt-2'>
									<Input
										placeholder='Agenda Location'
										width='full'
										variant='primary_outlined'
										value={item.Location}
										onChange={(e) => {
											validateSingle({ ['Location']: e.target.value }, 'Location', index)
										}}
									/>
									{errorObj[`Agenda.${index}.Location`] != undefined && (
										<p className='text-brand-red m-0'>{errorObj[`Agenda.${index}.Location`]}</p>
									)}
								</div>
							</div>
							<div className='w-5 h-5 mb-3 cursor-pointer self-end'>
								<img
									src={deleteIcon}
									onClick={() => {
										const arr = postEventData.Agenda
										let currentIndex = index
										const newArr = arr.filter((_, index) => index !== currentIndex)
										setPostEventData((prev) => {
											return {
												...prev,
												Agenda: newArr,
											}
										})
									}}
									alt=''
								/>
							</div>
						</div>
					)
				})}
				<div className='w-5 h-5 mb-3 cursor-pointer self-end'>
					<img
						src={addIcon}
						onClick={() => {
							setPostEventData((prev) => {
								return {
									...prev,
									Agenda: [
										...prev.Agenda,
										{
											Name: '',
											Description: '',
											StartTime: new Date().getTime(),
											EndTime: new Date().getTime(),
										},
									],
								}
							})
							setEventAgendas((prev) => [...prev, 1])
						}}
						alt=''
						className='bg-system-primary-accent rounded-full'
					/>
				</div>
			</div>

			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Tags</h1>
				{postEventData.Tags && postEventData.Tags.length > 0 && (
					<div className='flex gap-4 px-0 pb-4 my-2 flex-wrap'>
						{postEventData.Tags.map((interest) => {
							return <SelectedTag tag={interest} removeTag={removeTag} key={interest.DocId} />
						})}
					</div>
				)}

				<div className='px-0'>
					<SearchTags data={tagsList} addTag={addTag} placeholder='Add tags to event' />
				</div>
			</div>

			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Event Type<span className='text-brand-red'>*</span>
				</h1>
				{/* <SelectEventTypeList multiSelect={false} onSelect={onSelectType} selectedValue={postEventData.Type} /> */}
				<Select
					className='rounded-xl border-2 border-system-file-border-accent'
					width='full'
					placeholder='Select a country'
					setValue={(item) => {
						validateSingle({ ['Type']: item }, 'Type')
					}}
					value={postEventData.Type}
					options={['Offline', 'Virtual']}
				/>
				{errorObj['Type'] != undefined && <p className='text-brand-red m-0'>{errorObj['Type']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Country<span className='text-brand-red'>*</span>
				</h1>
				<Select
					className='rounded-xl border-2 border-system-file-border-accent'
					width='full'
					placeholder='Select a country'
					setValue={(item) => {
						validateSingle({ ['Country']: item }, 'Country')
					}}
					value={postEventData.Country}
					options={countryOptions}
					isSearchable={true}
				/>
				{errorObj['Country'] != undefined && <p className='text-brand-red m-0'>{errorObj['Country']}</p>}
				{/* <SelectEventCountry /> */}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Location<span className='text-brand-red'>*</span>
				</h1>
				<Input
					placeholder='Event Location'
					width='full'
					variant='primary_outlined'
					value={postEventData.Location}
					onChange={(e) => {
						validateSingle({ ['Location']: e.target.value }, 'Location')
					}}
				/>
				{errorObj['Location'] != undefined && <p className='text-brand-red m-0'>{errorObj['Location']}</p>}
				{/* <SelectEventCountry /> */}
			</div>
		</div>
	)
}

export default CreateEventStep1
