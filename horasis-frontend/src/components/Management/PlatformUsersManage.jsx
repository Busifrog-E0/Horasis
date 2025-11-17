import { useContext, useRef, useState } from 'react'

import usePostData from '../../hooks/usePostData'
import useGetList from '../../hooks/useGetList'

import { AuthContext } from '../../utils/AuthProvider'

import Spinner from '../ui/Spinner'
import EmptyMembers from '../Common/EmptyMembers'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import TextArea from '../ui/TextArea'

import { registerValidation } from '../../utils/schema/users/registerValidation'
import { relativeTime } from '../../utils/date'

import avatar from '../../assets/icons/avatar.svg'
import close from '../../assets/icons/close.svg'
import eyeon from '../../assets/icons/eyeon.svg'
import eyeoff from '../../assets/icons/eyeoff.svg'
import countries from '../../assets/json/countries-with-coords.json'

const PlatformUsersManage = () => {
	const [addUserModalOpen, setAddUserModalOpen] = useState(false)

	const { data: users, isLoading, isLoadingMore, isPageDisabled, getList: getUsers } = useGetList('users')

	const { postData: addUser, isLoading: isAddingUser } = usePostData()

	const addNewUser = (user) => {
		addUser({
			endpoint: 'users',
			payload: user,
			onsuccess: (result) => {
				setAddUserModalOpen(false)
				getUsers([])
			},
		})
	}

	return (
		<>
			<AddPlatformUserModal
				addUserModalOpen={addUserModalOpen}
				setAddUserModalOpen={setAddUserModalOpen}
				isAddingUser={isAddingUser}
				addNewUser={addNewUser}
			/>

			<div className='flex gap-4 px-1 md:px-4 py-2 items-center  justify-between '>
				<h1 className='text-system-primary-text font-medium text-lg'>Users</h1>
				<Button
					variant='outline'
					size='md'
					onClick={() => {
						setAddUserModalOpen(true)
					}}>
					Add User
				</Button>
			</div>
			<UsersList
				users={users}
				isLoadingMore={isLoadingMore}
				isLoading={isLoading}
				pageDisabled={isPageDisabled}
				fetchMore={() => getUsers(users, false)}
			/>
		</>
	)
}

export default PlatformUsersManage

const AddPlatformUserModal = ({ isAddingUser, addUserModalOpen, setAddUserModalOpen, addNewUser = () => {} }) => {
	const [usernameAvailable, setUsernameAvailable] = useState()
	const [countryOptions, setCountryOptions] = useState(countries.countries.map((item) => item.name))
	const [errorObj, setErrorObj] = useState({})
	const [showpass, setShowpass] = useState(false)
	const [showConfirmPass, setShowConfirmPass] = useState(false)

	const passwordRef = useRef()
	const confirmPasswordRef = useRef()

	const handlePasswordChange = (e) => {
		passwordRef.current = e.target.value
		validateSingle({ ['Password']: e.target.value }, 'Password')
	}

	const handleConfirmPasswordChange = (e) => {
		confirmPasswordRef.current = e.target.value
		validateConfirmPassword({ ['ConfirmPassword']: e.target.value }, 'ConfirmPassword')
	}

	const validateSingle = (value, key, callback) => {
		setRegisterFormValue({ ...registerFormValue, ...value })
		const { error, warning } = registerValidation.extract(key).validate(value[key], {
			abortEarly: false,
			stripUnknown: true,
		})
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

	const validateConfirmPassword = (value, key, callback) => {
		setRegisterFormValue({ ...registerFormValue, ...value })
		const { error, warning } = registerValidation.validate(
			{ ...registerFormValue, ...value },
			{
				abortEarly: false,
				stripUnknown: true,
			}
		)
		if (error && error.details) {
			let obj = {}
			error.details.forEach((val) => {
				if (val.context.key === 'ConfirmPassword') {
					return (obj[val.context.key] = val.message)
				}
			})
			setErrorObj(obj)
		} else {
			setErrorObj({})
			if (callback) {
				callback()
			}
		}
	}

	const validate = (callback) => {
		const { error, warning } = registerValidation.validate(registerFormValue, {
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

	const [registerFormValue, setRegisterFormValue] = useState({
		FullName: '',
		Username: '',
		Password: '',
		ConfirmPassword: '',
		Email: '',
		Country: '',
		City: '',
		JobTitle: '',
		Industry: '',
		CompanyName: '',
		About: '',
		IsPrivate: false,
	})

	const { postData: checkUsername } = usePostData({
		onSuccess: (result) => {
			if (result === true) {
				setUsernameAvailable({
					available: result,
					message: 'Username  available',
				})
			} else if (result === false) {
				setUsernameAvailable({ available: result, message: 'Username not available' })
			}
		},
	})

	const checkUsernameAvailability = async (value) => {
		checkUsername({
			endpoint: 'users/register/checkUsername',
			payload: { Username: value },
		})
	}
	return (
		<Modal isOpen={addUserModalOpen}>
			<Modal.Header>
				<p className='font-medium'>Add New User</p>
				<button
					onClick={() => {
						setAddUserModalOpen(false)
					}}>
					<img src={close} className='h-6  cursor-pointer' alt='' />
				</button>
			</Modal.Header>
			<Modal.Body>
				<div className=' flex flex-col justify-center items-center'>
					<div
						style={{ borderRadius: 20 }}
						className='bg-system-secondary-bg flex flex-col gap-4 login-form  px-8 lg:px-16 '>
						{/* Name */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Full Name<span className='text-brand-red'>*</span>
							</h1>

							<Input
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='name'
								placeholder='Ex. Saul Ramirez'
								setValue={(e) => {
									validateSingle({ ['FullName']: e }, 'FullName')
								}}
								value={registerFormValue.FullName}
								type='text'
							/>
							{errorObj['FullName'] != undefined && <p className='text-brand-red m-0'>{errorObj['FullName']}</p>}
						</div>

						{/* Username */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Username<span className='text-brand-red'>*</span>
							</h1>

							<Input
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='name'
								placeholder='Ex. Saul Ramirez'
								onChange={(e) => {
									validateSingle({ ['Username']: e.target.value }, 'Username')
									if (e.target.value.length > 3) checkUsernameAvailability(e.target.value)
								}}
								value={registerFormValue.Username}
								type='text'
							/>
							{errorObj['Username'] != undefined && <p className='text-brand-red m-0'>{errorObj['Username']}</p>}
							{usernameAvailable && errorObj['Username'] === undefined && (
								<p className={usernameAvailable.available ? 'text-brand-green m-0' : 'text-brand-red m-0'}>
									{usernameAvailable.message} {usernameAvailable.available}
								</p>
							)}
						</div>

						{/* Email */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Email<span className='text-brand-red'>*</span>
							</h1>

							<Input
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='email'
								placeholder='Ex. abc@efg.com'
								setValue={(e) => {
									validateSingle({ ['Email']: e }, 'Email')
								}}
								value={registerFormValue.Email}
								type='text'
							/>
							{errorObj['Email'] != undefined && <p className='text-brand-red m-0'>{errorObj['Email']}</p>}
						</div>

						{/* Job Title */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Job Title<span className='text-brand-red'>*</span>
							</h1>

							<Input
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='jobTitle'
								placeholder='Ex. Consultant'
								setValue={(e) => {
									validateSingle({ ['JobTitle']: e }, 'JobTitle')
								}}
								value={registerFormValue.JobTitle}
								type='text'
							/>
							{errorObj['JobTitle'] != undefined && <p className='text-brand-red m-0'>{errorObj['JobTitle']}</p>}
						</div>

						{/* Company Name */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Company Name<span className='text-brand-red'>*</span>
							</h1>

							<Input
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='companyName'
								placeholder='Ex. xyz Ltd.'
								setValue={(e) => {
									validateSingle({ ['CompanyName']: e }, 'CompanyName')
								}}
								value={registerFormValue.CompanyName}
								type='text'
							/>
							{errorObj['CompanyName'] != undefined && <p className='text-brand-red m-0'>{errorObj['CompanyName']}</p>}
						</div>

						{/* Industry */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Industry<span className='text-brand-red'>*</span>
							</h1>

							<Input
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='industry'
								placeholder='Ex. Health Care'
								setValue={(e) => {
									validateSingle({ ['Industry']: e }, 'Industry')
								}}
								value={registerFormValue.Industry}
								type='text'
							/>
							{errorObj['Industry'] != undefined && <p className='text-brand-red m-0'>{errorObj['Industry']}</p>}
						</div>

						{/* Country */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Country</h1>
							<Select
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								placeholder='Select a country'
								setValue={(item) => {
									validateSingle({ ['Country']: item }, 'Country')
								}}
								value={registerFormValue.Country}
								options={countryOptions}
								isSearchable={true}
							/>
							{errorObj['Country'] != undefined && <p className='text-brand-red m-0'>{errorObj['Country']}</p>}
						</div>

						{/* City */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								City<span className='text-brand-red'>*</span>
							</h1>

							<Input
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='city'
								placeholder='Ex. Melbourne'
								setValue={(e) => {
									validateSingle({ ['City']: e }, 'City')
								}}
								value={registerFormValue.City}
								type='text'
							/>
							{errorObj['City'] != undefined && <p className='text-brand-red m-0'>{errorObj['City']}</p>}
						</div>
						{/* Password */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Password<span className='text-brand-red'>*</span>
							</h1>
							<Input
								ref={passwordRef}
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='password'
								placeholder='Enter the password'
								onChange={handlePasswordChange}
								type={showpass ? 'text' : 'password'}
								withIcon='true'
								icon={
									showpass ? (
										<img src={eyeon} className='h-6 cursor-pointer' />
									) : (
										<img src={eyeoff} className='h-6 cursor-pointer' />
									)
								}
								iconpos='right'
								iconClick={() => {
									setShowpass((prev) => !prev)
								}}
							/>
							{errorObj['Password'] != undefined && <p className='text-brand-red m-0'>{errorObj['Password']}</p>}
						</div>
						{/* Confirm Password */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Confirm Password<span className='text-brand-red'>*</span>
							</h1>
							<Input
								ref={confirmPasswordRef}
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								name='confirmPassword'
								placeholder='Confirm password'
								onChange={handleConfirmPasswordChange}
								type={showConfirmPass ? 'text' : 'password'}
								withIcon='true'
								icon={
									showConfirmPass ? (
										<img src={eyeon} className='h-6 cursor-pointer' />
									) : (
										<img src={eyeoff} className='h-6 cursor-pointer' />
									)
								}
								iconpos='right'
								iconClick={() => {
									setShowConfirmPass((prev) => !prev)
								}}
							/>
							{errorObj['ConfirmPassword'] != undefined && (
								<p className='text-brand-red m-0'>{errorObj['ConfirmPassword']}</p>
							)}
						</div>

						{/* Bio */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>About</h1>

							<TextArea
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								name='about'
								setValue={(e) => {
									validateSingle({ ['About']: e }, 'About')
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										if (!termsChecked || (usernameAvailable && !usernameAvailable.available)) {
											return
										} else {
											validate(register)
										}
									}
								}}
								value={registerFormValue.About}
								rows={6}
								placeholder='Enter something about user....'
								width='full'
								variant='primary_outlined'
							/>
							{errorObj['About'] != undefined && <p className='text-brand-red m-0'>{errorObj['About']}</p>}
						</div>

						<div className='mt-1'>
							<Button
								loading={isAddingUser}
								onClick={() => {
									validate(() => addNewUser(registerFormValue))
								}}
								size='md'
								variant='black'
								width='full'
								disabled={isAddingUser || (usernameAvailable && !usernameAvailable.available)}>
								Add User
							</Button>
						</div>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	)
}

const UsersList = ({ users = [], isLoadingMore, pageDisabled, fetchMore, isLoading }) => {
	if (isLoading)
		return (
			<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
				<Spinner />
			</div>
		)
	return (
		<div className='bg-system-secondary-bg  py-4 md:px-4 rounded-b-lg '>
			<div className='flex flex-col gap-5 border p-4 rounded-md'>
				{users ? (
					<>
						{users.length > 0 ? (
							<>
								{users.map((item, index) => {
									let lastElement = users.length === index + 1
									return <UserCard key={index} profile={item} lastElement={lastElement} />
								})}
							</>
						) : (
							<>
								<EmptyMembers emptyText={'No Users'} />
							</>
						)}
					</>
				) : (
					<></>
				)}
			</div>
			{isLoadingMore && (
				<div className='bg-system-secondary-bg p-4 rounded-b-lg '>
					<Spinner />
				</div>
			)}
			{!pageDisabled && (
				<div onClick={fetchMore} className='flex flex-row justify-end mt-4 mb-2'>
					<div className='cursor-pointer flex items-center gap-2'>
						<h4 className='font-semibold text-xl text-system-primary-accent'>Load More</h4>
					</div>
				</div>
			)}
		</div>
	)
}

const UserCard = ({ profile, lastElement }) => {
	const { currentUserData } = useContext(AuthContext)
	const goToProfile = () => {
		if (profile && currentUserData) {
			if (profile.DocId === currentUserData.CurrentUser.UserId) {
				window.open('/MyProfile')
			} else {
				window.open(`/ViewProfile/${profile.DocId}`)
			}
		}
	}
	return (
		<div className={`bg-system-secondary-bg ${lastElement === true ? '' : 'border-b border-system-file-border pb-2'}`}>
			<div className='flex items-start gap-4'>
				{profile ? (
					<>
						{profile.ProfilePicture ? (
							<div className='w-11 h-11 rounded-full bg-black'>
								<img
									className='w-11 h-11 rounded-full object-cover'
									src={profile.ProfilePicture}
									alt='Rounded avatar'
								/>
							</div>
						) : (
							<>
								<div className='w-11 h-11 rounded-full bg-brand-light-gray'>
									<img src={avatar} className='object-cover h-full w-full rounded-lg' />
								</div>
							</>
						)}
					</>
				) : (
					<>
						<img
							className='w-11 h-11 rounded-full'
							src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
							alt='Rounded avatar'
						/>
					</>
				)}

				<div className='flex-1'>
					<h4 className='font-semibold text-lg text-system-primary-accent cursor-pointer' onClick={goToProfile}>
						{profile && profile?.FullName}
					</h4>
					<h4 className='font-semibold text-sm text-brand-gray-dim'>@{profile && profile?.Username}</h4>
				</div>
				<div className='flex flex-col items-end'>
					<h4 className='font-medium text-base text-brand-gray-dim mb-3'>{relativeTime(profile?.CreatedIndex)}</h4>
				</div>
			</div>
		</div>
	)
}
