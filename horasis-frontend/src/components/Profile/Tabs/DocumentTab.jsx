import { relativeTime } from '../../../utils/date'
import DropdownMenu from '../../ui/DropdownMenu'
import doc from '../../../assets/icons/document.svg'
import { getNextId } from '../../../utils/URLParams'
import { jsonToQuery } from '../../../utils/searchParams/extractSearchParams'
import { getItem } from '../../../constants/operations'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../utils/AuthProvider'
import Spinner from '../../ui/Spinner'
import EmptyMembers from '../../Common/EmptyMembers'
import { useToast } from '../../Toast/ToastService'

const DocumentTab = ({ showOther = false, userId = '' }) => {
	const { updateCurrentUser, currentUserData } = useContext(AuthContext)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [documents, setDocuments] = useState([])
	const [pageDisabled, setPageDisabled] = useState(true)
	const [filters, setFilters] = useState({
		OrderBy: 'Index',
		Limit: 10,
		Keyword: '',
		Type: 'document',
	})
	const api = showOther === true ? `users/${userId}/media` : `users/${currentUserData.CurrentUser.UserId}/media`
	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getDocuments = (tempArr) => {
		getData(`${api}?&${jsonToQuery(filters)}`, tempArr, setDocuments)
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
		getDocuments(initialRender ? [] : documents)
	}

	const fetch = () => fetchData(true)
	const fetchMore = () => fetchData(false)

	useEffect(() => {
		if (documents.length > 0) hasAnyLeft(`${api}`, documents)
	}, [documents])

	useEffect(() => {
		fetch()
	}, [filters])
	return (
		<div className='bg-system-secondary-bg p-4 lg:py-10 lg:px-12 rounded-b-lg '>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<div className='flex flex-col gap-6'>
						{documents && (
							<>
								{documents.length > 0 ? (
									<>
										{documents.map((document, index) => {
											let lastItem = documents.length - 1 === index
											return <Document key={document.DocId} document={document} lastItem={lastItem} />
										})}
									</>
								) : (
									<>
										<EmptyMembers emptyText={'No documents uploaded'} />
									</>
								)}
							</>
						)}
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
							className='flex flex-row justify-center mt-4 mb-2'>
							<div className='cursor-pointer flex items-center gap-2'>
								<h4 className='text-sm font-medium text-system-primary-accent'>Load more documents</h4>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}

const Document = ({ document, lastItem }) => {
	// Regular expression to find the file name ending in .pdf
	const regex = /([^/]+\.pdf)/
	const match = document.FileUrl.match(regex)

	// Extract the file name if there's a match
	const fileName = match ? match[1] : 'No file name found'
	return (
		<div className={`${!lastItem && 'border-b'} border-system-file-border pb-6`}>
			<div className='flex items-center gap-4'>
				<div className='w-12 h-12 overflow-hidden rounded-lg'>
					<img className='w-full h-full object-contain' src={doc} alt='Rounded avatar' />
				</div>

				<div className='flex-1'>
					<div className='flex items-start justify-between gap-10'>
						<div>
							<a
								href={document.FileUrl}
								target='_blank'
								className='font-semibold text-system-primary-text text-md'
								onClick={() => {}}>
								{fileName}
							</a>
						</div>
					</div>
				</div>
				<div className='flex flex-col items-end justify-between gap-6'>
					<h4 className='font-medium text-sm text-brand-gray-dim'>{relativeTime(document.CreatedIndex)}</h4>
					{/* <DropdownMenu /> */}
				</div>
			</div>
		</div>
	)
}

export default DocumentTab
