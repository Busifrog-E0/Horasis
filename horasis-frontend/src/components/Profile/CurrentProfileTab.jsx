import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'
import { useFollow } from '../../context/Follow/FollowService'
import useGetData from '../../hooks/useGetData'
import { useAuth } from '../../utils/AuthProvider'
import Spinner from '../ui/Spinner'

const CurrentProfileTab = () => {
	const navigate = useNavigate()
	const { currentUserData, scrollToTop } = useAuth()
	const { isLoading, data: user } = useGetData(`users/${currentUserData.CurrentUser.UserId}`)
	const { followCount, getFollowCount } = useFollow()

	const [expand, setExpand] = useState(false)

	useEffect(() => {
		getFollowCount()
	}, [])

	return (
		<>
			<div className='p-6 bg-system-secondary-bg rounded-lg'>
				{isLoading ? (
					<Spinner />
				) : (
					<>
						{' '}
						<div className='flex flex-col lg:flex-col gap-6'>
							<div
								className='flex justify-center items-center cursor-pointer'
								onClick={() => {
									scrollToTop()
									navigate('/MyProfile')
								}}>
								<div className='w-28 h-28 rounded-full bg-brand-light-gray overflow-hidden'>
									{user ? (
										<>
											{user.ProfilePicture ? (
												<div className='bg-black'>
													<img
														className='w-28 h-28 rounded-full object-cover'
														src={user.ProfilePicture}
														alt='Rounded avatar'
													/>
												</div>
											) : (
												<div className='bg-brand-light-gray'>
													<img src={avatar} className='object-cover h-full w-full rounded-lg' />
												</div>
											)}
										</>
									) : (
										<></>
									)}
								</div>
							</div>
							<div>
								<h4 className='font-medium text-xl text-center text-system-primary-text mt-2'>
									{user && user.FullName}
								</h4>
								<h4 className='font-medium text-xl text-brand-gray-dim text-center'>@{user && user.Username}</h4>
								{currentUserData.CurrentUser.Role === 'Admin' && (
									<div className='flex justify-center items-center mt-2'>
										<div className='px-20 py-1 rounded-full bg-system-secondary-accent text-center inline-block'>
											<span className='text-system-primary-accent font-semibold'>
												{currentUserData.CurrentUser.Role}
											</span>
										</div>
									</div>
								)}
								<div className='flex justify-center items-center mt-2 gap-3'>
									<h4 className='font-semibold text-base text-center text-system-primary-text mt-2'>
										{followCount && followCount.NoOfFollowings} Following
									</h4>
									<h4 className='font-semibold text-base text-center text-system-primary-text mt-2'>
										{followCount && followCount.NoOfFollowers} Followers
									</h4>
								</div>
							</div>
						</div>
						{user && user?.ProfileCompletionPercentage != 100 && (
							<div className='p-3 pb-2 px-5 bg-system-secondary-bg rounded-lg shadow-lg'>
								<div
									className='flex justify-between items-center mt-2 gap-3 cursor-pointer'
									onClick={() => {
										setExpand(!expand)
									}}>
									<h4 className='font-semibold text-sm text-center text-system-primary-accent mt-2'>
										Complete Your Profile
									</h4>
									<h4 className='font-semibold text-base text-center text-system-primary-accent mt-2'>
										{user && user.ProfileCompletionPercentage && user.ProfileCompletionPercentage}%
									</h4>
								</div>
								<div className='w-full bg-system-secondary-selected-accent rounded-full h-2 mt-3 mb-1'>
									<div
										className='bg-brand-green h-2 rounded-full'
										style={{
											width: `${user?.ProfileCompletionPercentage ? user.ProfileCompletionPercentage : '0'}%`,
										}}></div>
								</div>
								{expand && (
									<>
										<div className='pt-2'>
											<div className='relative '>
												<div className='flex flex-row items-center gap-1'>
													<div
														className={`w-4 h-4 p-2 rounded-full flex items-center justify-center bg-${
															user.JobTitle === '' || user.CompanyName === '' || user.Industry === ''
																? 'brand-gray-dim'
																: 'brand-green'
														} text-${
															user.JobTitle === '' || user.CompanyName === '' || user.Industry === ''
																? 'brand-gray-dim'
																: 'white'
														}`}>
														{user.JobTitle === '' || user.CompanyName === '' || user.Industry === '' ? (
															<></>
														) : (
															<span>✓</span>
														)}
													</div>
													<p
														className={`text-sm font-medium text-${
															user.JobTitle === '' || user.CompanyName === '' || user.Industry === ''
																? 'brand-gray-dim'
																: 'brand-green'
														} text-system-primary-text`}>
														Work Information
													</p>
												</div>
												<div className=' pt-3 '></div>
												<div className='flex flex-row items-center gap-1'>
													<div
														className={`w-4 h-4 p-2 rounded-full flex items-center justify-center bg-${
															user.ProfilePicture !== '' ? 'brand-green' : 'brand-gray-dim'
														} text-${user.ProfilePicture !== '' ? 'white' : 'brand-gray-dim'}`}>
														{user.ProfilePicture !== '' && <span>✓</span>}
													</div>
													<p
														className={`text-sm font-medium text-${
															user.ProfilePicture !== '' ? 'brand-green' : 'brand-gray-dim'
														} text-system-primary-text`}>
														Profile Photo
													</p>
												</div>
												<div className='pt-3 '></div>
												<div className='flex flex-row items-center gap-1'>
													<div
														className={`w-4 h-4 p-2 rounded-full flex items-center justify-center bg-${
															user.About !== '' ? 'brand-green' : 'brand-gray-dim'
														} text-${user.About !== '' ? 'white' : 'brand-gray-dim'}`}>
														{user.About !== '' && <span>✓</span>}
													</div>
													<p
														className={`text-sm font-medium text-${
															user.About !== '' ? 'brand-green' : 'brand-gray-dim'
														} text-system-primary-text`}>
														Biography
													</p>
												</div>
											</div>
										</div>
										<h1
											className='text-center cursor-pointer text-sm font-semibold underline text-system-primary-accent mt-2'
											onClick={() => {
												scrollToTop()
												navigate('/MyProfile')
											}}>
											Complete Your Profile
										</h1>
									</>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</>
	)
}

export default CurrentProfileTab
