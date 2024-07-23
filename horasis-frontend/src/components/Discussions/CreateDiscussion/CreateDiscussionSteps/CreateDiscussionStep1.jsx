import { useState } from 'react'
import Input from '../../../ui/Input'
import TextArea from '../../../ui/TextArea'
import SelectDiscussionPrivacy from '../SelectDiscussionPrivacy'

const CreateDiscussionStep1 = ({ postDiscussionData, setPostDiscussionData, validateSingle, errorObj }) => {
	const onSelectPrivacy = (value) => {
		setPostDiscussionData({ ...postDiscussionData, Privacy: value })
	}
	return (
		<div className='flex flex-col gap-4'>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Discussion Name<span className='text-brand-red'>*</span>
				</h1>
				<Input
					placeholder='Discussion name'
					value={postDiscussionData.DiscussionName}
					width='full'
					variant='primary_outlined'
					onChange={(e) => {
						validateSingle({ ['DiscussionName']: e.target.value }, 'DiscussionName')
					}}
				/>
				{errorObj['DiscussionName'] != undefined && <p className='text-brand-red m-0'>{errorObj['DiscussionName']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Discussion Brief<span className='text-brand-red'>*</span>
				</h1>
				<TextArea
					rows={3}
					placeholder='Discussion brief'
					width='full'
					variant='primary_outlined'
					value={postDiscussionData.Brief}
					onChange={(e) => {
						validateSingle({ ['Brief']: e.target.value }, 'Brief')
					}}
				/>
				{errorObj['Brief'] != undefined && <p className='text-brand-red m-0'>{errorObj['Brief']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Discussion Description<span className='text-brand-red'>*</span>
				</h1>
				<TextArea
					rows={6}
					placeholder='Discussion description'
					width='full'
					variant='primary_outlined'
					value={postDiscussionData.Description}
					onChange={(e) => {
						validateSingle({ ['Description']: e.target.value }, 'Description')
					}}
				/>
				{errorObj['Description'] != undefined && <p className='text-brand-red m-0'>{errorObj['Description']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Discussion Privacy<span className='text-brand-red'>*</span>
				</h1>
				<SelectDiscussionPrivacy
					multiSelect={false}
					onSelect={onSelectPrivacy}
					selectedValue={postDiscussionData.Privacy}
				/>
			</div>
		</div>
	)
}

export default CreateDiscussionStep1
