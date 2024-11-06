import { useState } from 'react'
import Input from '../../../ui/Input'
import TextArea from '../../../ui/TextArea'
import { SearchTags, SelectedTag } from '../../../Profile/AboutProfile'
import useGetList from '../../../../hooks/useGetList'
import SelectDiscussionPrivacy from '../../../Discussions/CreateDiscussion/SelectDiscussionPrivacy'

const CreatePodcastStep1 = ({ postPodcastData, setPostPodcastData, validateSingle, errorObj }) => {
	const onSelectPrivacy = (value) => {
		setPostPodcastData({ ...postPodcastData, Privacy: value })
	}

	const addTag = (tag) => {
		setPostPodcastData((prev) => {
			const tagExists = prev.Tags.some((existingTag) => existingTag.DocId === tag.DocId)
			if (tagExists) return prev

			return { ...prev, Tags: [...prev.Tags, tag] }
		})
	}

	const removeTag = (tag) => {
		setPostPodcastData((prev) => {
			return { ...prev, Tags: prev.Tags.filter((interest) => interest.DocId !== tag.DocId) }
		})
	}

	const { data: tagsList } = useGetList('tags', { Limit: -1 })
	return (
		<div className='flex flex-col gap-4'>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Podcast Name<span className='text-brand-red'>*</span>
				</h1>
				<Input
					placeholder='Podcast name'
					value={postPodcastData.PodcastName}
					width='full'
					variant='primary_outlined'
					onChange={(e) => {
						validateSingle({ ['PodcastName']: e.target.value }, 'PodcastName')
					}}
				/>
				{errorObj['PodcastName'] != undefined && <p className='text-brand-red m-0'>{errorObj['PodcastName']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Podcast Brief<span className='text-brand-red'>*</span>
				</h1>
				<TextArea
					rows={3}
					placeholder='Podcast brief'
					width='full'
					variant='primary_outlined'
					value={postPodcastData.Brief}
					onChange={(e) => {
						validateSingle({ ['Brief']: e.target.value }, 'Brief')
					}}
				/>
				{errorObj['Brief'] != undefined && <p className='text-brand-red m-0'>{errorObj['Brief']}</p>}
			</div>
			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Podcast Description<span className='text-brand-red'>*</span>
				</h1>
				<TextArea
					rows={6}
					placeholder='Podcast description'
					width='full'
					variant='primary_outlined'
					value={postPodcastData.Description}
					onChange={(e) => {
						validateSingle({ ['Description']: e.target.value }, 'Description')
					}}
				/>
				{errorObj['Description'] != undefined && <p className='text-brand-red m-0'>{errorObj['Description']}</p>}
			</div>

			<div>
				<h1 className='text-system-primary-text font-medium text-lg'>Tags</h1>
				{postPodcastData.Tags && postPodcastData.Tags.length > 0 && (
					<div className='flex gap-4 px-0 pb-4 my-2 flex-wrap'>
						{postPodcastData.Tags.map((interest) => {
							return <SelectedTag tag={interest} removeTag={removeTag} key={interest.DocId} />
						})}
					</div>
				)}

				<div className='px-0'>
					<SearchTags data={tagsList} addTag={addTag} placeholder='Add tags to Podcast' />
				</div>
			</div>
			{/* <div>
				<h1 className='text-system-primary-text font-medium text-lg'>
					Podcast Privacy<span className='text-brand-red'>*</span>
				</h1>
				<SelectDiscussionPrivacy
					multiSelect={false}
					onSelect={onSelectPrivacy}
					selectedValue={postPodcastData.Privacy}
				/>
			</div> */}
		</div>
	)
}

export default CreatePodcastStep1
