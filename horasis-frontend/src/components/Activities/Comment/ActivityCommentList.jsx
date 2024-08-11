import { AuthContext, defaultComment, defaultCommentData } from '../../../utils/AuthProvider'
import ActivityComment from './ActivityComment'
import TextArea from '../../ui/TextArea'
import { getItem, postItem } from '../../../constants/operations'
import { useContext, useEffect, useState } from 'react'
import { useToast } from '../../Toast/ToastService'
import Spinner from '../../ui/Spinner'
import { commentValidation } from '../../../utils/schema/users/commentValidation'
import MentionTextarea from '../Mentions/MentionTextarea'

const ActivityCommentList = ({
	activity,
	comments,
	getAllActivityComments,
	getSingleActivity,
	isLoading,
	isLoadingMore,
	pageDisabled,
	fetchMore,
	setIsLoading,
	timeSize,
	titleSize,
	descriptionSize,
	iconSize,
}) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [newComment, setNewComment] = useState(defaultCommentData(currentUserData.CurrentUser.UserId, activity.DocId))
	const [user, setUser] = useState()
	const [errorOj, setErrorObj] = useState({})
	const validate = (callback) => {
		const { error, warning } = commentValidation.validate(newComment, {
			abortEarly: false,
			stripUnknown: true,
		})
		if (error && error.details) {
			let obj = {}
			error.details.forEach((val) => (obj[val.context.key] = val.message))
			setErrorObj(obj)
		} else {
			setErrorObj({})
			if (callback) {
				callback()
			}
		}
	}
	const validateSingle = (value, key, callback) => {
		setNewComment({ ...newComment, ...value })
		const { error, warning } = commentValidation
			.extract(key)
			.validate(value[key], { abortEarly: false, stripUnknown: true })
		if (error && error.details) {
			let obj = {}
			error.details.forEach((val) => (obj[key] = val.message))
			setErrorObj(obj)
		} else {
			setErrorObj({})
			if (callback) {
				callback()
			}
		}
	}

	const postComment = () => {
		setIsLoading(true)
		postItem(
			`activities/${activity.DocId}/comments`,
			newComment,
			(result) => {
				if (result) {
					getAllActivityComments([])
					getSingleActivity()
					setNewComment(defaultCommentData(currentUserData.CurrentUser.UserId, activity.DocId))
				}
			},
			(err) => {
				setIsLoading(false)
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const getUserDetails = () => {
		getItem(
			`users/${currentUserData.CurrentUser.UserId}`,
			(result) => {
				setUser(result)
			},
			(err) => {
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}
	useEffect(() => {
		getUserDetails()
	}, [])

	return (
		<div className='flex items-center justify-between flex-col w-full mt-4'>
			<div
				className={`flex-1 mt-2 rounded-md p-2 px-3 border ${
					Object.values(errorOj).some((error) => error) ? 'border-system-error' : 'border-system-secondary-accent'
				} bg-system-secondary-bg flex flex-col gap-4 w-full`}>
				<div className='flex items-start justify-between gap-2'>
					{/* <TextArea
						width='full'
						className='p-0 border-none rounded-none hover:shadow-none'
						placeholder='Leave a comment'
						value={newComment.Content}
						onChange={(e) => validateSingle({ Content: e.target.value }, 'Content')}
					/> */}
					<MentionTextarea
						errorOj={errorOj}
						user={user}
						handleContentChange={(e) => validateSingle({ Content: e }, 'Content')}
						newPost={newComment}
						from='comment'
					/>
					{isLoading ? (
						<Spinner />
					) : (
						<svg
							className='w-6 h-6 text-system-primary-accent cursor-pointer'
							onClick={() => {
								validate(postComment)
							}}
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 -960 960 960'>
							<path d='M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z' />
						</svg>
					)}
				</div>
			</div>
			{Object.values(errorOj).find((error) => error) && (
				<p className='m-0 text-system-error w-full'>{Object.values(errorOj).find((error) => error)}</p>
			)}
			<div className='flex items-center  justify-between mt-4 flex-col gap-1 w-full max-h-80 overflow-y-auto'>
				{comments.map((item) => (
					<ActivityComment
						key={item.DocId}
						comment={item}
						activity={activity}
						getSingleActivity={getSingleActivity}
						timeSize={timeSize}
						titleSize={titleSize}
						iconSize={iconSize}
						descriptionSize={descriptionSize}
					/>
				))}
			</div>
			{isLoadingMore && (
				<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
					<Spinner />
				</div>
			)}
			{!pageDisabled && (
				<div
					onClick={() => {
						fetchMore()
					}}
					className='flex flex-row justify-end mt-4 mb-2  w-full'>
					<div className='cursor-pointer flex items-center gap-2 '>
						<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
						{/* <svg className="text-system-primary-accent h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg> */}
					</div>
				</div>
			)}
		</div>
	)
}

export default ActivityCommentList
