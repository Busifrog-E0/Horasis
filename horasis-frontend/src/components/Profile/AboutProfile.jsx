import React, { useContext, useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import { getItem, patchItem, postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import Input from '../ui/Input'
import Spinner from '../ui/Spinner'
import Button from '../ui/Button'
import TextArea from '../ui/TextArea'
import { updateValidation } from '../../utils/schema/users/updateValidation'
import { useToast } from '../Toast/ToastService'
import countries from '../../assets/json/countries-with-coords.json'
import Select from '../ui/Select'
import edit from '../../assets/icons/edit.svg'
import close from '../../assets/icons/close.svg'
import useGetList from '../../hooks/useGetList'
import { useNavigate } from 'react-router-dom'
import Switch from '../ui/Switch'

export const extractLinkedInUsername = (url) => {
	// Define the regular expression to match LinkedIn profile URLs
	const pattern = /linkedin\.com\/in\/([a-zA-Z0-9\-]+)/

	// Use the regex to find the match in the URL
	const match = url.match(pattern)

	// Return the matched username or null if not found
	return match ? `@${match[1]}` : null
}

const AboutProfile = ({ user, getUserDetails, isCurrentUser }) => {
	const navigate = useNavigate()

	const handleNavigate = (e, tagName) => {
		e.preventDefault()
		navigate('/Search', { state: { TagName: tagName } })
	}
	const [isOpen, setIsOpen] = useState(false)
	const [errorObj, setErrorObj] = useState({})
	const [usernameAvailable, setUsernameAvailable] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const { currentUserData, updateCurrentUser } = useContext(AuthContext)
	const toast = useToast()
	const [countryOptions, setCountryOptions] = useState(countries.countries.map((item) => item.name))

	const [updateFormValue, setUpdateFormValue] = useState({
		FullName: user?.FullName,
		Username: user?.Username,
		// Email: user?.Email,
		JobTitle: user?.JobTitle,
		CompanyName: user?.CompanyName,
		Country: user?.Country,
		About: user?.About,
		LinkedIn: user?.LinkedIn,
		City: user?.City,
		Interests: user?.Interests ? user?.Interests : [],
		IsPrivate: user?.IsPrivate ? user?.IsPrivate : false,
	})


	const validateSingle = (value, key, callback) => {
		setUpdateFormValue({ ...updateFormValue, ...value })
		const { error, warning } = updateValidation.extract(key).validate(value[key], {
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
	const validate = (callback, formValue) => {
		const { error, warning } = updateValidation.validate({ ...updateFormValue, ...formValue }, {
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
				callback({ ...updateFormValue, ...formValue })
			}
		}
		// callback()
	}

	const checkUsernameAvailability = async (value) => {
		postItem(
			'users/edit/checkUsername',
			{ Username: value },
			(result) => {
				console.log(result)
				if (result === true) {
					setUsernameAvailable({
						available: result,
						message: 'Username  available',
					})
				} else if (result === false) {
					setUsernameAvailable({ available: result, message: 'Username not available' })
				}
				// setUsernameAvailable(result)
			},
			(err) => {
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const updateProfile = (formValue) => {
		setIsLoading(true)
		patchItem(
			`users/${currentUserData.CurrentUser.UserId}`,
			formValue ? formValue : updateFormValue,
			(result) => {
				getUserDetails()
				setIsLoading(false)
			},
			(err) => {
				setIsLoading(false)
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	const addTag = (tag) => {
		setUpdateFormValue((prev) => {
			const tagExists = prev.Interests.some((existingTag) => existingTag.DocId === tag.DocId)
			if (tagExists) return prev

			return { ...prev, Interests: [...prev.Interests, tag] }
		})
	}

	const removeTag = (tag) => {
		setUpdateFormValue((prev) => {
			return { ...prev, Interests: prev.Interests.filter((interest) => interest.DocId !== tag.DocId) }
		})
	}

	const { data: tagsList } = useGetList('tags', { Limit: -1 })

	return (
		<>
			<Modal isOpen={isOpen} maxWidth={`max-w-4xl`}>
				<Modal.Header>
					<p className='text-lg font-medium'>Edit Profile</p>
					<button
						onClick={() => {
							setIsOpen(false)
						}}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body padding={10}>
					<div className='flex flex-col gap-4'>
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Full Name</h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
							<Input
								className='px-4 py-3 rounded-xl'
								width='full'
								name='name'
								placeholder='Ex. Saul Ramirez'
								setValue={(e) => {
									validateSingle({ ['FullName']: e }, 'FullName')
								}}
								value={updateFormValue.FullName}
								type='text'
							/>
							{errorObj['FullName'] != undefined && <p className='text-brand-red m-0'>{errorObj['FullName']}</p>}
						</div>

						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Username</h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
							<Input
								className='px-4 py-3 rounded-xl'
								width='full'
								name='name'
								placeholder='Ex. Saul Ramirez'
								// setValue={(e) => {
								//   validateSingle({ ['Username']: e }, 'Username')
								// }}
								onChange={(e) => {
									validateSingle({ ['Username']: e.target.value }, 'Username')
									if (e.target.value.length > 3) checkUsernameAvailability(e.target.value)
								}}
								value={updateFormValue.Username}
								type='text'
							/>
							{errorObj['Username'] != undefined && <p className='text-brand-red m-0'>{errorObj['Username']}</p>}
							{usernameAvailable && errorObj['Username'] === undefined && (
								<p className={usernameAvailable.available ? 'text-brand-green m-0' : 'text-brand-red m-0'}>
									{usernameAvailable.message} {usernameAvailable.available}
								</p>
							)}
						</div>

						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Linkedin URL</h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
							<Input
								className='px-4 py-3 rounded-xl'
								width='full'
								name='name'
								placeholder='LinkedIn Url'
								setValue={(e) => {
									validateSingle({ ['LinkedIn']: e }, 'LinkedIn')
								}}
								value={updateFormValue.LinkedIn}
								type='text'
							/>
							{errorObj['LinkedIn'] != undefined && <p className='text-brand-red m-0'>{errorObj['LinkedIn']}</p>}
						</div>

						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Interests</h1>
							{updateFormValue.Interests && updateFormValue.Interests.length > 0 && (
								<div className='flex gap-4 px-0 pb-4 my-2 flex-wrap'>
									{updateFormValue.Interests.map((interest) => {
										return <SelectedTag tag={interest} removeTag={removeTag} key={interest.DocId} />
									})}
								</div>
							)}

							<div className='px-0'>
								<SearchTags data={tagsList} addTag={addTag} />
							</div>
						</div>

						{/* <div>
            <h1 className='text-system-primary-text font-medium text-lg'>
              Email
            </h1>
            <Input
              
              width='full'
              name='email'
              placeholder='Ex. abc@efg.com'
              setValue={(e) => {
                validateSingle({ ['Email']: e }, 'Email')
              }}
              value={updateFormValue.Email}
              type='text'
            />
            {errorObj['Email'] != undefined && (
              <p className='text-brand-red m-0'>{errorObj['Email']}</p>
            )}
          </div> */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Job Title</h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
							<Input
								className='px-4 py-3 rounded-xl'
								width='full'
								name='jobTitle'
								placeholder='Ex. Consultant'
								setValue={(e) => {
									validateSingle({ ['JobTitle']: e }, 'JobTitle')
								}}
								value={updateFormValue.JobTitle}
								type='text'
							/>
							{errorObj['JobTitle'] != undefined && <p className='text-brand-red m-0'>{errorObj['JobTitle']}</p>}
						</div>
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Company Name</h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
							<Input
								className='px-4 py-3 rounded-xl'
								width='full'
								name='companyName'
								placeholder='Ex. xyz Ltd.'
								setValue={(e) => {
									validateSingle({ ['CompanyName']: e }, 'CompanyName')
								}}
								value={updateFormValue.CompanyName}
								type='text'
							/>
							{errorObj['CompanyName'] != undefined && <p className='text-brand-red m-0'>{errorObj['CompanyName']}</p>}
						</div>
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>City </h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
							<Input
								className='px-4 py-3 rounded-xl'
								width='full'
								name='city'
								placeholder='Ex. Melbourne'
								setValue={(e) => {
									validateSingle({ ['City']: e }, 'City')
								}}
								value={updateFormValue.City}
								type='text'
							/>
							{errorObj['City'] != undefined && <p className='text-brand-red m-0'>{errorObj['City']}</p>}
						</div>
						{/* <div>
              <h1 className='text-system-primary-text font-medium text-lg'>Country</h1>
            
              <Input
                className='px-4 py-3 rounded-xl'
                width='full'
                name='country'
                placeholder='Ex. Australia'
                setValue={(e) => {
                  validateSingle({ ['Country']: e }, 'Country')
                }}
                value={updateFormValue.Country}
                type='text'
              />
              {errorObj['Country'] != undefined && (
                <p className='text-brand-red m-0'>{errorObj['Country']}</p>
              )}
            </div> */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Country</h1>
							<Select
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
								width='full'
								placeholder='Select a country'
								setValue={(item) => {
									validateSingle({ ['Country']: item }, 'Country')
								}}
								value={updateFormValue.Country}
								options={countryOptions}
								isSearchable={true}
							/>
							{errorObj['Country'] != undefined && <p className='text-brand-red m-0'>{errorObj['Country']}</p>}
						</div>
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>Bio</h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
							<TextArea
								name='about'
								setValue={(e) => {
									validateSingle({ ['About']: e }, 'About')
								}}
								value={updateFormValue.About}
								rows={6}
								placeholder='Enter something about you....'
								width='full'
								variant='primary_outlined'
							/>
							{errorObj['About'] != undefined && <p className='text-brand-red m-0'>{errorObj['About']}</p>}
						</div>
						{/* <div>
							<div
								className={`flex items-center  gap-2 border   border-system-primary-bg justify-between  py-2 px-4 rounded-xl `}
								onClick={(e) => {
									e.stopPropagation()
									// validateSingle({ ['IsPrivate']: !updateFormValue.IsPrivate })
								}}>
								<div>
									<h1 className='text-system-primary-text font-medium '>Email & Location Privacy</h1>
									<p className='text-brand-gray mt-1 mb-2 text-sm'>
										Restrict people visiting your profile to view your email and location.
									</p>
								</div>
								<Switch
									checked={updateFormValue?.IsPrivate}
									onChange={(e) => {
										e.stopPropagation()
										validateSingle({ ['IsPrivate']: !updateFormValue.IsPrivate })
									}}
								/>
							</div>
						</div> */}
					</div>
					<div className='mt-4 flex items-end justify-end'>
						<Button
							onClick={() => {
								validate(updateProfile)
							}}
							size='md'
							variant='black'
						// width='full'
						>
							Submit
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-b-lg '>
				{isCurrentUser ? (
					<div className='flex w-full items-start justify-end text-system-primary-text'>
						<img src={edit} alt='' className='h-6 cursor-pointer' onClick={() => setIsOpen(true)} />
					</div>
				) : (
					<></>
				)}

				<div className='grid lg:grid-cols-4 gap-y-6'>
					<div>
						<h4 className='font-medium text-brand-gray-dim'>Full Name</h4>
					</div>
					<div className='lg:col-span-3'>
						<h4 className='font-medium text-system-primary-text'>{user && user.FullName}</h4>
					</div>
					<div>
						<h4 className='font-medium text-brand-gray-dim'>User Name</h4>
					</div>
					<div className='lg:col-span-3'>
						<h4 className='font-medium text-system-primary-text'>{user && user.Username}</h4>
					</div>

					{user && user.LinkedIn && (
						<>
							<div>
								<h4 className='font-medium text-brand-gray-dim'>Linkedin</h4>
							</div>
							<div className='lg:col-span-3'>
								<h4
									className='font-semibold text-system-primary-text cursor-pointer hover:text-blue-500'
									onClick={() => window.open("https://" + user.LinkedIn, '_blank')}>
									{user && extractLinkedInUsername(user.LinkedIn)}
								</h4>
							</div>
						</>
					)}

					{(isCurrentUser === true || user && user.IsPrivate == false) ? (
						<>
							<div>
								<h4 className='font-medium text-brand-gray-dim'>Email</h4>
							</div>
							<div className='lg:col-span-3'>
								<h4 className='font-medium text-system-primary-text'>{user && user.Email}</h4>
							</div>
						</>
					) : (
						<>
							{user && user?.IsPrivate && (
								<>
									{user?.IsPrivate === false ? (
										<>
											<div>
												<h4 className='font-medium text-brand-gray-dim'>Email</h4>
											</div>
											<div className='lg:col-span-3'>
												<h4 className='font-medium text-system-primary-text'>{user && user.Email}</h4>
											</div>
										</>
									) : (
										<></>
									)}
								</>
							)}
						</>
					)}

					<div>
						<h4 className='font-medium text-brand-gray-dim'>Job Title</h4>
					</div>
					<div className='lg:col-span-3'>
						<h4 className='font-medium text-system-primary-text'>{user && user.JobTitle}</h4>
					</div>

					<div>
						<h4 className='font-medium text-brand-gray-dim'>Company Name</h4>
					</div>
					<div className='lg:col-span-3'>
						<h4 className='font-medium text-system-primary-text'>{user && user.CompanyName}</h4>
					</div>
					{(isCurrentUser === true || user && user.IsPrivate == false) ? (
						<>
							<div>
								<h4 className='font-medium text-brand-gray-dim'>City</h4>
							</div>
							<div className='lg:col-span-3'>
								<h4 className='font-medium text-system-primary-text'>{user && user.City}</h4>
							</div>
						</>
					) : (
						<>
							{user && user?.IsPrivate && (
								<>
									{user?.IsPrivate === false ? (
										<>
											<div>
												<h4 className='font-medium text-brand-gray-dim'>City</h4>
											</div>
											<div className='lg:col-span-3'>
												<h4 className='font-medium text-system-primary-text'>{user && user.City}</h4>
											</div>
										</>
									) : (
										<></>
									)}
								</>
							)}
						</>
					)}

					{(isCurrentUser === true || user && user.IsPrivate == false) ? (
						<>
							<div>
								<h4 className='font-medium text-brand-gray-dim'>Country</h4>
							</div>
							<div className='lg:col-span-3'>
								<h4 className='font-medium text-system-primary-text'>{user && user.Country}</h4>
							</div>
						</>
					) : (
						<>
							{user && user?.IsPrivate && (
								<>
									{user?.IsPrivate === false ? (
										<>
											<div>
												<h4 className='font-medium text-brand-gray-dim'>Country</h4>
											</div>
											<div className='lg:col-span-3'>
												<h4 className='font-medium text-system-primary-text'>{user && user.Country}</h4>
											</div>
										</>
									) : (
										<></>
									)}
								</>
							)}
						</>
					)}

					<div>
						<h4 className='font-medium text-brand-gray-dim'>Bio</h4>
					</div>
					<div className='lg:col-span-3'>
						<h4 className='font-medium text-system-primary-text whitespace-pre-line'>{user && user?.About}</h4>
					</div>

					{isCurrentUser && (
						<>
							{user && user.Interests && user.Interests.length > 0 && (
								<>
									<div>
										<h4 className='font-medium text-brand-gray-dim'>Interests</h4>
									</div>
									<div className='lg:col-span-3'>
										<div className='flex flex-wrap gap-2'>
											{' '}
											{user.Interests.map((item) => (
												<div
													onClick={(e) => handleNavigate(e, item.TagName)}
													key={item.DocId}
													className='cursor-pointer rounded-full px-6 py-1 bg-system-tertiary-bg hover:bg-system-secondary-bg border  transition duration-200 ease-in-out'
													role='button' // For better accessibility
													tabIndex={0} // Making it focusable
												>
													{item.TagName}
												</div>
											))}
										</div>
									</div>
								</>
							)}
						</>
					)}


				</div>
				{isCurrentUser && <div className='mt-12'>
					<div
						className={`flex items-center  gap-2 border   border-system-primary-bg justify-between  py-2 px-4 rounded-xl `}
						onClick={(e) => {
							e.stopPropagation()
							// validateSingle({ ['IsPrivate']: !updateFormValue.IsPrivate })
						}}>
						<div>
							<h1 className='text-system-primary-text font-medium '>Email & Location Privacy</h1>
							<p className='text-brand-gray mt-1 mb-2 text-sm'>
								Restrict people visiting your profile to view your email and location.
							</p>
						</div>
						<Switch
							checked={updateFormValue?.IsPrivate}
							onChange={(e) => {
								e.stopPropagation()
								validate(updateProfile, { ['IsPrivate']: !updateFormValue.IsPrivate })
							}}
						/>
					</div>
				</div>}
			</div>
		</>
	)
}

export const SelectedTag = ({ tag, removeTag }) => {
	return (
		<>
			<div className=' flex justify-between items-center  py-1 px-3 rounded-full border border-system-primary-accent bg-system-primary-accent-light gap-2 '>
				<div className='text-system-primary-accent'>
					<p className='text-sm font-semibold'>{tag.TagName}</p>
					{/* <p className='text-sm text-system-primary-accent-transparent font-medium'>@{tag.UserDetails.Username}</p> */}
				</div>
				<div>
					<img src={close} className='h-5 cursor-pointer' alt='' onClick={() => removeTag(tag)} />
				</div>
			</div>
		</>
	)
}

export const SearchTags = ({ placeholder = 'Add your interests', data, addTag = () => { } }) => {
	const [searchKey, setSearchKey] = useState('') // Local state for search key
	const [filteredData, setFilteredData] = useState(data) // State for filtered data

	// Effect to filter data whenever searchKey changes
	useEffect(() => {
		const filtered = data.filter((item) => item.TagName.toLowerCase().includes(searchKey.toLowerCase()))
		setFilteredData(filtered)
	}, [searchKey, data]) // Depend on searchKey and data

	return (
		<div>
			<Input
				className='py-3 rounded-xl border-2 border-system-secondary-accent'
				placeholder={placeholder}
				width='full'
				value={searchKey}
				onChange={(e) => setSearchKey(e.target.value)} // Update searchKey on input change
			/>
			{/* Optionally render the filtered results */}
			{filteredData && filteredData.length > 0 && searchKey !== '' && (
				<div className='mt-4'>
					<div className='flex flex-wrap gap-2'>
						{' '}
						{/* Container for flex items */}
						{filteredData.map((item, index) => (
							<div
								key={item.DocId}
								onClick={() => addTag(item)}
								className='cursor-pointer rounded-full px-6 py-1 bg-system-tertiary-bg hover:bg-system-secondary-bg border  transition duration-200 ease-in-out'
								role='button' // For better accessibility
								tabIndex={0} // Making it focusable
							>
								{item.TagName}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default AboutProfile
