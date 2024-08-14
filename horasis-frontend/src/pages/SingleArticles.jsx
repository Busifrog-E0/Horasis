import { useNavigate, useParams } from 'react-router-dom'
import cover from '../assets/icons/cover.svg'
import { useEffect, useState } from 'react'
import { getItem } from '../constants/operations'
import { useAuth } from '../utils/AuthProvider'
import { useToast } from '../components/Toast/ToastService'
import arrowback from '../assets/icons/arrowback.svg'

const SingleArticles = () => {
	const { updateCurrentUser, currentUserData } = useAuth()
	const toast = useToast()
	const { articleid } = useParams()
	const [article, setArticle] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const handleGoBack = () => {
		navigate(-1)
	}
	const getArticle = () => {
		setIsLoading(true)
		getItem(
			`articles/${articleid}`,
			(result) => {
				setArticle(result)
				setIsLoading(false)
			},
			(err) => {
				console.log(err)
				setIsLoading(false)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	useEffect(() => {
		getArticle()
	}, [])
	return (
		<div  className='p-4 md:px-10 max-w-9xl md:py-10'>
			<div className='overflow-hidden h-80 lg:h-96 relative rounded-t-2xl'>
				{article.CoverPhoto ? (
					<>
						<img src={article.CoverPhoto} className='object-cover h-full w-full' />
					</>
				) : (
					<>
						<img src={cover} className='object-cover h-full w-full' />
					</>
				)}
				<div className='absolute top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6  h-100 overflow-hidden overflow-y-auto'>
					<div className='flex w-full items-start justify-between'>
						<div
							className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
							onClick={handleGoBack}>
							<img src={arrowback} alt='' className='h-6 cursor-pointer' />

							{/* <h4 className='font-medium text-xl text-brand-secondary'>Back</h4> */}
						</div>
					</div>
					<div>
						<h4 className='font-medium shadow-lg text-4xl text-white mb-3'>{article.ArticleName}</h4>
						<div className='flex flex-row flex-wrap gap-3'>
							{/* <h4 className='text-2xl text-white'>Virtual Event</h4>
							<h4 className='text-2xl text-white'>•</h4> */}
						</div>
					</div>
				</div>
			</div>
			<div className='lg:col-span-3 px-10 bg-system-secondary-bg py-10 rounded-b-2xl'>
				<h4 className='text-xl text-brand-gray  leading-8 whitespace-pre-line'>
					{article.Description}
				</h4>
			</div>
		</div>
	)
}

export default SingleArticles
