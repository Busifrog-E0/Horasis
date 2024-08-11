import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../utils/AuthProvider'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { getItem } from '../../constants/operations'
import MemberSuggestionTab from './MemberSuggestionTab'
import { useToast } from '../Toast/ToastService'
import Spinner from '../ui/Spinner'
import arrowfor from '../../assets/icons/arrowfor.svg'

const SuggestionsSection = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [updatingId, setUpdatingId] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [suggested, setSuggested] = useState([])
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 4,
		Keyword: '',
	})

	function filter(oby, kw, lt) {
		var newFilter = { OrderBy: oby, Keyword: kw, Limit: lt }
		navigate(`?${jsonToQuery(newFilter)}`)
		setFilters(newFilter)
	}

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getSuggested = (tempSuggested) => {
		setLoadingCom(tempSuggested, true)
		getItem(
			`users/${currentUserData.CurrentUser.UsedId}/suggested?&${jsonToQuery(filters)}&NextId=${getNextId(
				tempSuggested
			)}`,
			(result) => {
				// console.log('Suggested')
				setSuggested([...tempSuggested, ...result])
				setLoadingCom(tempSuggested, false)
			},
			(err) => {
				setLoadingCom(tempSuggested, false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const hasAnyLeft = () => {
		getItem(
			`users/${currentUserData.CurrentUser.UserId}/suggested?&${jsonToQuery({
				...filters,
				Limit: 1,
			})}&NextId=${getNextId(suggested)}`,
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

	useEffect(() => {
		getSuggested([])
	}, [])

	useEffect(() => {
		hasAnyLeft()
	}, [suggested])

	const updateSingleData = (profile) => {
		setUpdatingId(profile.DocId)
		getItem(
			`users/${profile.DocId}`,
			(result) => {
				setSuggested(
					suggested.map((suggested) => (suggested.DocId === profile.DocId ? { ...suggested, ...result } : suggested))
				)
				setUpdatingId(null)
			},
			(err) => {
				setUpdatingId(null)
				console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<>
			<div className='p-5 bg-system-secondary-bg rounded-lg'>
				<div className='flex items-center justify-between gap-2 mb-5'>
					<h4 className='font-medium text-2xl text-system-primary-text'>Suggestions</h4>
					{/* arrow cursor-pointer */}

					<img src={arrowfor} alt='' className='h-6 w-6 cursor-pointer' />
				</div>
				<div className='flex flex-col gap-4'>
					<>
						{suggested.map((item, index) => {
							const lastElement = suggested.length === index + 1
							// if (item.DocId === currentUserData.CurrentUser.UserId) return
							return (
								<MemberSuggestionTab
									lastElement={lastElement}
									key={index}
									profile={item}
									updateList={() => {
										updateSingleData(item)
									}}
									updatingId={updatingId}
								/>
							)
						})}

						{/* {isLoadingMore && (
				<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
					<Spinner />
				</div>
			)}
			{!pageDisabled && (
				<div
					onClick={() => {
						getSuggested(suggested)
					}}
					className='flex flex-row justify-end mt-4 mb-2'>
					<div className='cursor-pointer flex items-center gap-2'>
						<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
				
					</div>
				</div>
			)} */}
					</>
				</div>
			</div>
		</>
	)
}

export default SuggestionsSection
