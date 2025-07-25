import { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Common/Logo'
import Button from '../components/ui/Button'
import Checkbox from '../components/ui/Checkbox'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import TextArea from '../components/ui/TextArea'
import { postItem } from '../constants/operations'
import { AuthContext, useAuth } from '../utils/AuthProvider'
import { registerValidation } from '../utils/schema/users/registerValidation'
import { useToast } from '../components/Toast/ToastService'
import TimerComponent from '../components/Timer/TimerComponent'
import countries from '../assets/json/countries-with-coords.json'
import Select from '../components/ui/Select'
import close from '../assets/icons/close.svg'
import eyeon from '../assets/icons/eyeon.svg'
import eyeoff from '../assets/icons/eyeoff.svg'
import HeroCoverImage from '../assets/images/hero-cover-image.png'
import usePostData from '../hooks/usePostData'

const logoText = {
	fontSize: '1.7rem',
	fontWeight: '700',
	margin: 0,
	marginLeft: '10px',
}
const branding = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	marginBottom: 20,
}

const Register = () => {
	const navigate = useNavigate()
	const { updateCurrentUser } = useAuth()

	const [showpass, setShowpass] = useState(false)
	const [showConfirmPass, setShowConfirmPass] = useState(false)
	const [errorObj, setErrorObj] = useState({})
	const [otpError, setOtpError] = useState({})
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

	const [usernameAvailable, setUsernameAvailable] = useState()
	const [otpid, setOtpid] = useState('')
	const [otp, setOtp] = useState('')
	const [otpOpen, setOtpOpen] = useState(false)
	const [timerValue, setTimerValue] = useState(30)

	const [termsChecked, setTermsChecked] = useState(false)
	const [countryOptions, setCountryOptions] = useState(countries.countries.map((item) => item.name))

	const passwordRef = useRef()
	const confirmPasswordRef = useRef()

	const { isLoading, postData: submitRegister } = usePostData({
		onSuccess: (result) => {
			setOtpid(result)
			if (!otpOpen) {
				setTimerValue(30)
				setOtpOpen(true)
			}
		},
	})
	const { isVerifying, postData: submitOtp } = usePostData({
		onSuccess: (result) => {
			updateCurrentUser(result)
		},
		onError: (err) => {
			setOtpError({ OTPERROR: err })
		},
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
		// callback()
	}

	const register = () => {
		submitRegister({
			endpoint: 'users/register',
			payload: registerFormValue,
		})
	}

	const verifyotp = () => {
		submitOtp({
			endpoint: 'users/verify',
			payload: { OTPId: otpid, OTP: otp },
		})
	}

	const checkUsernameAvailability = async (value) => {
		checkUsername({
			endpoint: 'users/register/checkUsername',
			payload: { Username: value },
		})
	}

	return (
		<>
			<Modal isOpen={otpOpen}>
				<Modal.Header>
					<p className='font-medium'>Verify OTP</p>
					<button
						onClick={() => {
							setOtpOpen(false)
						}}>
						<img src={close} className='h-6  cursor-pointer' alt='' />
					</button>
				</Modal.Header>
				<Modal.Body>
					<p className='text-system-secondary-text mb-2'>
						Please verify the OTP number received in your registered email.
					</p>
					<h1 className='text-system-primary-text font-medium text-lg'>OTP</h1>
					<Input
						className='py-4 rounded-xl border-2 border-system-file-border-accent'
						width='full'
						placeholder='Enter OTP recieved in registered email'
						setValue={(e) => {
							setOtpError({})
							setOtp(e)
						}}
						type='number'
					/>
					{otpError['OTPERROR'] != undefined && <p className='text-brand-red m-0'>{otpError['OTPERROR']}</p>}
					<div className='my-2'>
						{timerValue !== 0 ? (
							<TimerComponent timerValue={timerValue} setTimerValue={setTimerValue} />
						) : (
							<>
								<p className='text-md'>
									Didn't receive an OTP?{' '}
									<span
										className='text-system-primary-accent cursor-pointer font-medium'
										onClick={() => {
											setTimerValue(30)
											validate(register)
										}}
										style={{}}>
										RESEND OTP
									</span>
								</p>
							</>
						)}
					</div>
					<div className='mt-4'>
						<Button
							loading={isVerifying}
							onClick={() => {
								verifyotp()
							}}
							size='md'
							variant='black'
							width='full'
							disabled={otp === ''}>
							Verify OTP
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			<div style={{ backgroundImage: `url(${HeroCoverImage})` }} className='bg-cover bg-no-repeat'>
				<div
					style={{ minHeight: '100svh' }}
					className='p-2 flex flex-col justify-center items-center bg-system-primary-accent-transparent'>
					<div
						style={{ borderRadius: 20 }}
						className='bg-system-secondary-bg flex flex-col gap-4 login-form py-4 px-8 lg:px-16 lg:py-10 bg-red-500'>
						<center>
							<Logo height={80} />
						</center>
						<div>
							<h1 className='text-3xl font-semibold text-system-primary-accent'>Register</h1>
							<p className='text-system-primary-text text-lg font-medium'>
								Login to your account to access all the features of Horasis!
							</p>
						</div>
						{/* Name */}
						<div>
							<h1 className='text-system-primary-text font-medium text-lg'>
								Your Name<span className='text-brand-red'>*</span>
							</h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
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
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
							<Input
								className='py-4 rounded-xl border-2 border-system-file-border-accent'
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
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
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
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
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
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
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
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
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
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
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
								// setValue={(e) => {
								// 	validateSingle({ ['Password']: e }, 'Password')
								// }}
								// value={registerFormValue.Password}
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
								// setValue={(e) => {
								// 	validateConfirmPassword({ ['ConfirmPassword']: e }, 'ConfirmPassword')
								// }}
								// value={registerFormValue.ConfirmPassword}
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
							<h1 className='text-system-primary-text font-medium text-lg'>About Yourself</h1>
							{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
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
								placeholder='Enter something about you....'
								width='full'
								variant='primary_outlined'
							/>
							{errorObj['About'] != undefined && <p className='text-brand-red m-0'>{errorObj['About']}</p>}
						</div>

						<div className='mt-4'>
							<Checkbox
								onChange={() => {
									setTermsChecked((prev) => !prev)
								}}
								checked={termsChecked}
								label={
									<div className='text-brand-gray-dim text-base font-medium'>
										By registering, you are agreeing with our{' '}
										<a href='#' target='_blank' className='text-system-primary-accent text-base font-medium underline'>
											Terms of Use
										</a>{' '}
										and{' '}
										<a href='#' target='_blank' className='text-system-primary-accent text-base font-medium underline'>
											Privacy Policy
										</a>
									</div>
								}
							/>
						</div>
						<div className='mt-1'>
							<Button
								loading={isLoading}
								onClick={() => {
									validate(register)
									// setOtpOpen(true)
								}}
								size='md'
								variant='black'
								width='full'
								disabled={!termsChecked || (usernameAvailable && !usernameAvailable.available)}>
								Register
							</Button>
						</div>
						<div className='mt-1'>
							<div className='text-base font-medium text-center'>
								Already have an account?{' '}
								<span
									onClick={() => {
										navigate('/login')
									}}
									className='cursor-pointer text-system-primary-accent text-lg font-medium underline'>
									Login
								</span>
							</div>
						</div>
					</div>
				</div>{' '}
			</div>
		</>
	)
}

export default Register

{
	/* <div>
						<h1 className='text-system-primary-text font-medium text-lg'>
							Country<span className='text-brand-red'>*</span>
						</h1>
						<Input
							className='py-4 rounded-xl border-2 border-system-file-border-accent'
							width='full'
							name='country'
							placeholder='Ex. Australia'
							setValue={(e) => {
								validateSingle({ ['Country']: e }, 'Country')
							}}
							value={registerFormValue.Country}
							type='text'
						/>
						{errorObj['Country'] != undefined && <p className='text-brand-red m-0'>{errorObj['Country']}</p>}
					</div> */
}
