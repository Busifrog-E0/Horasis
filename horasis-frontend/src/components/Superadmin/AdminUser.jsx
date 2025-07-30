import { useEffect, useState } from 'react'
import Spinner from '../../components/ui/Spinner'
import { getItem, patchItem } from '../../constants/operations'
import { useSuperAuth } from '../../context/SuperAdmin/SuperAuthService'
import { jsonToQuery } from '../../utils/searchParams/extractSearchParams'
import { getNextId } from '../../utils/URLParams'
import EmptyMembers from '../Common/EmptyMembers'
import { useToast } from '../Toast/ToastService'
import Button from '../ui/Button'
import AddAdminModal, { MemberTab } from './Permissions/AddAdminModal'
import SearchComponent from '../Search/SearchBox/SearchComponent'

const AdminUser = () => {
	const { currentUserData, updateCurrentUser } = useSuperAuth()
	const toast = useToast()
	const [adminUsers, setAdminUsers] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [isPageDisabled, setIsPageDisabled] = useState(true)
	const [isRemoving, setIsRemoving] = useState(false)
	const [filters, setFilters] = useState({
		Keyword: '',
		Limit: 10,
		OrderBy: 'Index',
		Role: 'Admin',
	})

	const setLoadingCom = (tempArr, value) => {
		if (tempArr.length > 0) {
			setIsLoadingMore(value)
		} else {
			setIsLoading(value)
		}
	}

	const getAdminUsers = (tempUsers) => {
		setLoadingCom(tempUsers, true)
		getItem(
			`admin/users?${jsonToQuery(filters)}&NextId=${getNextId(tempUsers)}`,
			(result) => {
				setLoadingCom(tempUsers, false)
				setAdminUsers([...tempUsers, ...result])
			},
			(err) => {
				setLoadingCom(tempUsers, false)
			},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}

	const hasAnyLeft = (tempData) => {
		getItem(
			`admin/users?${jsonToQuery({ ...filters, Limit: 1 })}&NextId=${getNextId(tempData)}`,
			(data) => {
				if (data?.length > 0) {
					setIsPageDisabled(false)
				} else {
					setIsPageDisabled(true)
				}
			},
			(err) => {
				setIsPageDisabled(true)
			},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}

	useEffect(() => {
		getAdminUsers([])
	}, [filters])

	useEffect(() => {
		if (adminUsers.length > 0) hasAnyLeft(adminUsers)
	}, [adminUsers])

	const [isAddPeopleModal, setAddPeopleModal] = useState(false)

	const removeUserPermission = (member) => {
		setIsRemoving(true)
		patchItem(
			`admin/removeAdmin`,
			{
				UserId: member.DocId,
			},
			(result) => {
				if (result === true) {
					getAdminUsers([])
				}
				setIsRemoving(false)
			},
			(err) => {
				setIsRemoving(false)
			},
			updateCurrentUser,
			currentUserData,
			toast,
			'admin'
		)
	}

	return (
		<>
			<>
				<AddAdminModal isAddPeopleModal={isAddPeopleModal} setAddPeopleModal={setAddPeopleModal} permissionChangeCallback={() => getAdminUsers([])} />
				{/* <div className='container mx-auto w-full overflow-hidden rounded-md'>
						<table className='min-w-full w-full bg-white border border-gray-200 rounded-md'>
							<thead>
								<tr>
									<th className='px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Username</th>
									<th className='px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
										<div className='text-sm leading-5 text-gray-900'>john_doe</div>
									</td>
									<td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
										<Switch />
									</td>
								</tr>
							</tbody>
						</table>
					</div> */}
				<div className=' flex flex-col rounded-md justify-between'>
					<h1 className='text-system-primary-text font-medium text-lg'>Add Admin User</h1>
					<div className='flex flex-col md:flex-row gap-2 justify-between mt-2 mb-6  md:items-center'>
						<div>
							<SearchComponent searchKey={filters.Keyword} setSearchKey={(value) => setFilters((prev) => ({ ...prev, Keyword: value }))} placeholder='Search admin' />
						</div>
						<div className='flex gap-4 items-start '>
							<>
								<Button
									variant='outline'
									size='md'
									onClick={() => {
										setAddPeopleModal(true)
									}}>
									Add Admin
								</Button>
							</>
						</div>
					</div>
					{isLoading || isRemoving ? (
						<div className='h-10 py-20'>
							<Spinner />
						</div>
					) : (
						<>
							<>
								<div className='flex flex-col border p-4 rounded-md'>
									{adminUsers && adminUsers.length > 0 ? (
										<>
											{adminUsers.map((member, index) => {
												const lastItem = adminUsers.length - 1 === index
												return <MemberTab member={member} lastItem={lastItem} key={member.DocId} onDeleteClick={removeUserPermission} />
											})}
										</>
									) : (
										<>
											<EmptyMembers emptyText={'No users with admin permissions'} />
										</>
									)}
								</div>
								{isLoadingMore && (
									<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
										<Spinner />
									</div>
								)}
								{!isPageDisabled && (
									<div onClick={() => getAdminUsers(adminUsers)} className='flex flex-row justify-end mt-4 mb-2'>
										<div className='cursor-pointer flex items-center gap-2'>
											<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
										</div>
									</div>
								)}
							</>
						</>
					)}
				</div>
			</>
		</>
	)
}

export default AdminUser
