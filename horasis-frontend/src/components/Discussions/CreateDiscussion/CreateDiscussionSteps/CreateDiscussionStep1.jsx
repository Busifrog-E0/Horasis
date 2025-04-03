import { useState } from 'react'
import Input from '../../../ui/Input'
import TextArea from '../../../ui/TextArea'
import SelectDiscussionPrivacy from '../SelectDiscussionPrivacy'
import { SearchTags, SelectedTag } from '../../../Profile/AboutProfile'
import useGetList from '../../../../hooks/useGetList'

const CreateDiscussionStep1 = ({ postDiscussionData, setPostDiscussionData, validateSingle, errorObj }) => {
	const onSelectPrivacy = (value) => {
		setPostDiscussionData({ ...postDiscussionData, Privacy: value })
	}

	const addTag = (tag) => {
		setPostDiscussionData((prev) => {
			const tagExists = prev.Tags.some((existingTag) => existingTag.DocId === tag.DocId)
			if (tagExists) return prev

			return { ...prev, Tags: [...prev.Tags, tag] }
		})
	}

	const removeTag = (tag) => {
		setPostDiscussionData((prev) => {
			return { ...prev, Tags: prev.Tags.filter((interest) => interest.DocId !== tag.DocId) }
		})
	}

	const { data: tagsList } = useGetList('tags', { Limit: -1 })
	const MAX_CHAR_LIMIT = 500
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
				<div className='relative'>
					<TextArea
						rows={6}
						placeholder='Discussion description'
						width='full'
						variant='primary_outlined'
						value={postDiscussionData.Description}
						maxLength={MAX_CHAR_LIMIT}
						onChange={(e) => {
							if (e.target.value.length <= MAX_CHAR_LIMIT) {
								validateSingle({ ['Description']: e.target.value }, 'Description')
							}
						}}
					/>
					<p className='text-system-secondary-text absolute bottom-2 right-2'>
						{postDiscussionData.Description ? MAX_CHAR_LIMIT - postDiscussionData.Description.length : MAX_CHAR_LIMIT} /{' '}
						{MAX_CHAR_LIMIT}
					</p>
				</div>
				{errorObj['Description'] != undefined && <p className='text-brand-red m-0'>{errorObj['Description']}</p>}
			</div>

			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Tags</h1>
				{postDiscussionData.Tags && postDiscussionData.Tags.length > 0 && (
					<div className='flex gap-4 px-0 pb-4 my-2 flex-wrap'>
						{postDiscussionData.Tags.map((interest) => {
							return <SelectedTag tag={interest} removeTag={removeTag} key={interest.DocId} />
						})}
					</div>
				)}

				<div className='px-0'>
					<SearchTags data={tagsList} addTag={addTag} placeholder='Add tags to discussion' />
				</div>
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
