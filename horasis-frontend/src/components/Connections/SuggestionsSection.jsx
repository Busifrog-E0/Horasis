import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../utils/AuthProvider'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import { getItem } from '../../constants/operations'
import MemberSuggestionTab from './MemberSuggestionTab'
import { useToast } from '../Toast/ToastService'
import Spinner from '../ui/Spinner'

const SuggestionsSection = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [pageDisabled, setPageDisabled] = useState(true)
	const [suggested, setSuggested] = useState([])
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Keyword: '',
		Limit: 10,
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

	return (
		<>
			{suggested.map((item, index) => {
				const lastElement = suggested.length === index + 1
				// if (item.DocId === currentUserData.CurrentUser.UserId) return
				return <MemberSuggestionTab lastElement={lastElement} key={index} profile={item} updateList={getSuggested} />
			})}

			{isLoadingMore && (
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
						{/* <svg className="text-system-primary-accent h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg> */}
					</div>
				</div>
			)}
		</>
	)
}

export default SuggestionsSection
