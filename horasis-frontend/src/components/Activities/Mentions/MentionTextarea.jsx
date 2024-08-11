// src/components/MentionTextarea.jsx

import React, { useContext, useEffect, useState } from 'react'
import Input from '../../ui/Input'
import { getItem } from '../../../constants/operations'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { useToast } from '../../Toast/ToastService'
import { AuthContext } from '../../../utils/AuthProvider'
import { getNextId } from '../../../utils/URLParams'
import avatar from '../../../assets/icons/avatar.svg'
import TextArea from '../../ui/TextArea'

const MentionTextarea = ({ user, newPost, handleContentChange, from = 'activity' }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [suggestions, setSuggestions] = useState([])
	const [mentionStart, setMentionStart] = useState(-1)
	const [pageDisabled, setPageDisabled] = useState(true)

	const [members, setMembers] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 15,
		Keyword: '',
	})
	const [mentionName, setMentionName] = useState('')

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getAllMembers = (tempMembers) => {
		getData(`users?&${jsonToQuery(filters)}`, tempMembers, setMembers)
	}

	const getData = (endpoint, tempData, setData) => {
		setLoadingCom(tempData, true)
		getItem(
			`${endpoint}&NextId=${getNextId(tempData)}`,
			(data) => {
				setData([...tempData, ...data])
				setLoadingCom(tempData, false)
			},
			(err) => {
				setLoadingCom(tempData, false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const hasAnyLeft = (endpoint, tempData) => {
		getItem(
			`${endpoint}?NextId=${getNextId(tempData)}&${jsonToQuery({ ...filters, Limit: 1 })}`,
			(data) => {
				if (data?.length > 0) {
					setPageDisabled(false)
				} else {
					setPageDisabled(true)
				}
			},
			(err) => {
				setPageDisabled(true)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	const fetchData = (initialRender = false) => {
		getAllMembers(initialRender ? [] : members)
	}
	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	const handleInputChange = (pureValue, e) => {
		const value = e.target.value
		handleContentChange(value)

		const cursorPosition = e.target.selectionStart
		const lastAtSymbol = value.lastIndexOf('@', cursorPosition - 1)
		const isFirstChar = lastAtSymbol === 0
		const prevChar = value.charAt(lastAtSymbol - 1)
		const isPrevCharSpace = prevChar === ' '

		if (lastAtSymbol !== -1 && (isFirstChar || isPrevCharSpace)) {
			const mentionText = value.slice(lastAtSymbol + 1, cursorPosition)
			if (mentionText.includes(' ')) {
				setSuggestions([])
				setMentionName('')
				setMentionStart(-1)
			} else {
				setMentionName(mentionText)
				setSuggestions(members.filter((user) => user.Username.toLowerCase().includes(mentionText.toLowerCase())))
				setMentionStart(lastAtSymbol)
			}
		} else {
			setSuggestions([])
			setMentionStart(-1)
		}
	}

	const handleSuggestionClick = (user) => {
		const mentionEnd = newPost.Content.indexOf(' ', mentionStart)
		const newInputValue =
			newPost.Content.slice(0, mentionStart) +
			`@${user} ` +
			newPost.Content.slice(mentionEnd === -1 ? newPost.Content.length : mentionEnd)
		handleContentChange(newInputValue)
		setSuggestions([])
		setMentionStart(-1)
	}

	useEffect(() => {
		if (members.length > 0) hasAnyLeft(`users`, members)
	}, [members])

	useEffect(() => {
		fetch()
	}, [mentionName])
	return (
		<>
			{from === 'reply' && (
				<TextArea
					setValue={handleInputChange}
					width={'full'}
					value={newPost.Content}
					className='p-0 border-none rounded-none hover:shadow-none'
					placeholder={`Leave a reply`}
				/>
			)}
			{from === 'comment' && (
				<TextArea
					setValue={handleInputChange}
					width={'full'}
					value={newPost.Content}
					className='p-0 border-none rounded-none hover:shadow-none'
					placeholder={`Leave a comment`}
				/>
			)}
			{from === 'activity' && (
				<Input
					setValue={handleInputChange}
					width={'full'}
					value={newPost.Content}
					className='p-0 border-none rounded-none hover:shadow-none'
					placeholder={`Share what's on your mind, ${user && user?.FullName ? user.FullName : ''}`}
				/>
			)}
			<div className='absolute z-40'>
				{/* {isLoading ? (
					<Spinner />
				) : ( */}
				{suggestions.length > 0 && (
					<ul className='absolute bg-white border rounded shadow-lg mt-1 top-3 w-max z-10 max-h-64 p-1 overflow-auto '>
						{suggestions.map((user, index) => (
							<div
								key={index}
								onClick={() => handleSuggestionClick(user.Username)}
								className='p-1 cursor-pointer hover:bg-brand-backg flex flex-row items-start gap-2'>
								{user.ProfilePicture ? (
									<>
										<img
											className='w-6 h-6 rounded-full object-cover'
											src={user?.ProfilePicture}
											alt='Rounded avatar'
										/>
									</>
								) : (
									<>
										<img className='w-6 h-6 rounded-full object-cover' src={avatar} alt='Rounded avatar' />
									</>
								)}
								<div>
									<p className='text-sm m-0 font-medium'> {user.FullName}</p>
									<p className='text-xs m-0 text-brand-gray'> {user.Username}</p>
								</div>
							</div>
						))}
					</ul>
				)}
				{/* )} */}
				{/* {isLoadingMore && (
					<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
						<Spinner />
					</div>
				)}
				{!pageDisabled && (
					<div
						onClick={() => {
							fetchMore()
						}}
						className='flex flex-row justify-end mt-4 mb-2'>
						<div className='cursor-pointer flex items-center gap-2'>
							<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
						</div>
					</div>
				)} */}
			</div>
		</>
	)
}

export default MentionTextarea
