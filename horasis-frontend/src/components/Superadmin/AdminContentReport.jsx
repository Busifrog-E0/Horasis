import React, { useState } from 'react'
import empty from '../../assets/icons/empty.svg'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Spinner from '../ui/Spinner'
import useDeleteDataSuperadmin from '../../hooks/useDeleteDataSuperadmin'
import useGetListSuperadmin from '../../hooks/useGetListSuperadmin'
import useUpdateDataSuperadmin from '../../hooks/useUpdateDataSuperadmin'
import { useSuperAuth } from '../../context/SuperAdmin/SuperAuthService'

const isViewOptions = { All: '', Viewed: true, Unviewed: false }

const AdminContentReport = () => {
	const { currentUserData } = useSuperAuth()
	const [reportType, setReportType] = useState('Activity')
	const [isViewed, setIsViewed] = useState('All')

	const {
		data: reports,
		isLoading,
		isLoadingMore,
		isPageDisabled,
		getList,
		changeSingleFilter,
	} = useGetListSuperadmin('reports', { Type: reportType, IsViewed: isViewOptions[isViewed] }, true, true, true)

	const { deleteData, isLoading: isDeleting } = useDeleteDataSuperadmin('', {
		onSuccess: () => {
			getList([])
		},
		onError: () => {},
	})

	const { updateData, isLoading: isUpdating } = useUpdateDataSuperadmin({
		onSuccess: () => {
			getList([])
		},
		onError: () => {},
	})

	const handleReportTypeChange = (type) => {
		setReportType(type)
		changeSingleFilter('Type', type)
	}

	const handleIsViewedChange = (viewed) => {
		setIsViewed(viewed)
		changeSingleFilter('IsViewed', isViewOptions[viewed])
	}

	const handleDeleteReport = (reportId) => {
		deleteData({ endPoint: `reports/${reportId}/entity` })
	}

	const handleMarkAsRead = (reportId) => {
		updateData({ endpoint: `reports/${reportId}/markAsRead`, payload: {} })
	}

	return (
		<div className='p-4 lg:px-4 lg:py-6 bg-system-secondary-bg mt-4 mx-2 rounded-lg flex flex-col h-full'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0 w-full '>
				<h1 className='text-2xl font-medium text-system-primary-text'>Reported Contents</h1>
				<div className='flex flex-col md:flex-row gap-4 w-full md:w-max'>
					<div className='w-full md:w-64'>
						<h1 className='text-system-primary-text text-sm'>Report Type</h1>
						<Select
							name='reportType'
							value={reportType}
							setValue={handleReportTypeChange}
							options={['Activity', 'Podcast']}
							placeholder='Select Report Type'
							isSearchable={false}
							width='full'
						/>
					</div>
					<div className='w-full md:w-64'>
						<h1 className='text-system-primary-text text-sm'>Viewed Status</h1>
						<Select
							name='isViewed'
							value={isViewed}
							setValue={handleIsViewedChange}
							options={['All', 'Viewed', 'Unviewed']}
							placeholder='Select Viewed Status'
							isSearchable={false}
							width='full'
						/>
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className='flex justify-center items-center h-64'>
					<Spinner />
				</div>
			) : reports.length === 0 ? (
				<div className='flex flex-col items-center justify-center space-y-4 h-64'>
					<img src={empty} alt='No Reports' className='w-24 h-24 opacity-70' />
					<p className='text-system-primary-text text-center'>No reports found.</p>
				</div>
			) : (
				<>
					<div className='overflow-x-auto rounded-lg show-scrollbar'>
						<table className='min-w-full divide-y divide-gray-200 bg-system-secondary-bg'>
							<thead className='bg-gray-100'>
								<tr>
									<th
										scope='col'
										className='px-6 py-4 text-left text-base font-medium text-gray-500 uppercase tracking-wider'>
										Content Type
									</th>
									{currentUserData && (
										<th
											scope='col'
											className='px-6 py-4 text-left text-base font-medium text-gray-500 uppercase tracking-wider'>
											Content
										</th>
									)}
									<th
										scope='col'
										className='px-6 py-4 text-left text-base font-medium text-gray-500 uppercase tracking-wider'>
										Report Type
									</th>
									<th
										scope='col'
										className='px-6 py-4 text-left text-base font-medium text-gray-500 uppercase tracking-wider'>
										Comment
									</th>
									<th
										scope='col'
										className='px-6 py-4 text-left text-base font-medium text-gray-500 uppercase tracking-wider'>
										User
									</th>
									<th
										scope='col'
										className='px-6 py-4 text-left text-base font-medium text-gray-500 uppercase tracking-wider'>
										Date
									</th>
									<th
										scope='col'
										className='px-6 py-4 text-right text-base font-medium text-gray-500 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200'>
								{reports.map((report) => {
									return (
										<tr
											key={report.DocId}
											className={`transition duration-150 ease-in-out ${
												report.IsViewed ? 'bg-system-primary-bg' : 'font-medium bg-system-secondary-bg '
											}`}>
											<td
												className={` ${
													report.IsViewed ? '' : 'border-l-2 border-system-primary-accent'
												} px-6 py-5 whitespace-nowrap text-base text-gray-700`}>
												{report.Type}
											</td>
											{currentUserData && (
												<td className='px-6 py-5 whitespace-nowrap text-base text-gray-700'>
													{!report.IsDeleted && (
														<button
															className='text-system-primary-accent cursor-pointer hover:text-system-primary-accent transition-colors'
															onClick={() => {
																const link = {
																	Activity: 'Activities',
																	Podcast: 'Podcasts',
																	Article: 'Articles',
																	Discussion: 'Discussions',
																	Event: 'Events',
																}
																window.open(`/${link[report.Type]}/${report.EntityId}`, '_blank')
															}}>
															View Content
														</button>
													)}
												</td>
											)}

											<td className='px-6 py-5 whitespace-nowrap text-base text-gray-700'>{report.ReportType}</td>
											<td className='px-6 py-5 whitespace-normal text-base text-gray-700 max-w-[200px]'>
												<div className='line-clamp-3'>{report.Content}</div>
											</td>

											<td className='px-6 py-5 whitespace-nowrap text-base text-gray-700'>
												<button
													className='text-system-primary-accent cursor-pointer hover:text-system-primary-accent transition-colors'
													onClick={() => {
														if (report?.UserDetails?.DocId && currentUserData) {
															const link =
																currentUserData.CurrentUser.UserId === report?.UserDetails?.DocId
																	? 'MyProfile'
																	: `ViewProfile/${report?.UserDetails?.DocId}`
															window.open(`/${link}`, '_blank')
														}
													}}>
													{report?.UserDetails?.Username}
												</button>
											</td>

											<td className='px-6 py-5 whitespace-nowrap text-base text-gray-700'>
												{new Date(report.CreatedIndex).toLocaleString()}
											</td>
											<td
												className={` ${
													report.IsViewed ? '' : 'border-r-2 border-system-primary-accent'
												} px-6 py-5 whitespace-nowrap text-base text-gray-700`}>
												<div className='flex items-center justify-end space-x-4'>
													{!report.IsDeleted ? (
														<>
															{!report.IsViewed && (
																<Button
																	size='xs'
																	variant='outline'
																	onClick={() => handleMarkAsRead(report.DocId)}
																	className='flex items-center gap-2 hover:text-system-primary-accent transition-colors'>
																	<span className='text-sm'>Mark as Read</span>
																</Button>
															)}
															<Button
																size='xs'
																variant='danger_outlined'
																onClick={() => handleDeleteReport(report.DocId)}
																className='flex items-center gap-2 hover:text-system-error transition-colors'>
																<span className='text-sm'>Delete Reported Content</span>
															</Button>
														</>
													) : (
														<span className='text-gray-500 text-sm'>Content Deleted</span>
													)}
												</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
					<div className='flex justify-start  mt-4'>
						{isLoadingMore || isDeleting || isUpdating ? (
							<Spinner />
						) : !isPageDisabled ? (
							<Button size='md' variant='black' onClick={() => getList(reports, false)}>
								Load More
							</Button>
						) : null}
					</div>
				</>
			)}
		</div>
	)
}

export default AdminContentReport
