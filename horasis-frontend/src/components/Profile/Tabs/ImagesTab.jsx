import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import { useToast } from '../../Toast/ToastService'
import StaggeredList from '../../ui/StaggeredList'
import { getItem } from '../../../constants/operations'
import { getNextId } from '../../../utils/URLParams'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import Spinner from '../../ui/Spinner'

const ImagesTab = () => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [images, setImages] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
		Type: 'image',
	})
	const api = `users/${currentUserData.CurrentUser.UserId}/media`
	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getImages = (tempArr) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempArr, setImages)
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
		getImages(initialRender ? [] : images)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (images.length > 0) hasAnyLeft(`${api}`, images)
	}, [images])

	useEffect(() => {
		fetch()
	}, [filters])
	return (
		<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					{images && (
						<>
							{images.length > 0 ? (
								<>
									<StaggeredList images={images} />
								</>
							) : (
								<>
									<EmptyMembers emptyText={'No images uploaded'} />
								</>
							)}
						</>
					)}

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
							className='flex flex-row justify-center mt-2 mb-2'>
							<div className='cursor-pointer flex items-center gap-2'>
								<h4 className='text-sm font-medium text-system-primary-accent'>Load more images</h4>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default ImagesTab
