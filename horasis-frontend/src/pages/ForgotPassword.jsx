import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import close from '../assets/icons/close.svg'
import eyeoff from '../assets/icons/eyeoff.svg'
import eyeon from '../assets/icons/eyeon.svg'
import HeroCoverImage from '../assets/images/hero-cover-image.png'
import Logo from '../components/Common/Logo'
import TimerComponent from '../components/Timer/TimerComponent'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import usePostData from '../hooks/usePostData'
import { forgotSchema, newPassSchema } from '../utils/schema/forgotValidation'

const ForgotPassword = () => {
	const navigate = useNavigate()
	const [errorObj, setErrorObj] = useState({})
	const [forgotFormValue, setForgotFormValue] = useState({ Email: '' })

	// otp
	const [otp, setOtp] = useState('')
	const [otpid, setOtpid] = useState('')
	const [otpOpen, setOtpOpen] = useState(false)
	const [otpError, setOtpError] = useState({})
	const [timerValue, setTimerValue] = useState(30)
	const [otpVerified, setOtpVerified] = useState(false)

	const validateEmailSingle = (value, key, callback) => {
		setForgotFormValue({ ...forgotFormValue, ...value })
		const { error, warning } = forgotSchema.extract(key).validate(value[key], { abortEarly: false, stripUnknown: true })
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
	const validateEmail = (callback) => {
		const { error, warning } = forgotSchema.validate(forgotFormValue, {
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

	// new password
	const [newPassFormValue, setNewPassFormValue] = useState({
		Password: '',
		ConfirmPassword: '',
	})
	const [showpass, setShowpass] = useState(false)
	const [showConfirmPass, setShowConfirmPass] = useState(false)

	const passwordRef = useRef()
	const confirmPasswordRef = useRef()

	const handlePasswordChange = (e) => {
		passwordRef.current = e.target.value
		validateNewPassSingle({ ['Password']: e.target.value }, 'Password')
	}

	const handleConfirmPasswordChange = (e) => {
		confirmPasswordRef.current = e.target.value
		validateConfirmPassword({ ['ConfirmPassword']: e.target.value }, 'ConfirmPassword')
	}

	const validateNewPassSingle = (value, key, callback) => {
		setNewPassFormValue({ ...newPassFormValue, ...value })
		const { error, warning } = newPassSchema
			.extract(key)
			.validate(value[key], { abortEarly: false, stripUnknown: true })
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
		setNewPassFormValue({ ...newPassFormValue, ...value })
		const { error, warning } = newPassSchema.validate(
			{ ...newPassFormValue, ...value },
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

	const validateNewPass = (callback) => {
		const { error, warning } = newPassSchema.validate(newPassFormValue, {
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

	const { isLoading, postData: postPasswordChange } = usePostData({
		onSuccess: (result) => {
			setOtpid(result)
			if (!otpOpen) {
				setTimerValue(30)
				setOtpOpen(true)
			}
		},
	})

	const { isLoading: verifying, postData: postVerifyOtp } = usePostData({
		onSuccess: (result) => {
			if (result === true) {
				setOtpVerified(true)
				setOtpOpen(false)
			}
		},
		onError: (err) => {
			setOtpError({ OTPERROR: err })
		},
	})

	const { isLoading: isChanging, postData: postResetPass } = usePostData({
		onSuccess: (result) => {
			if (result === true) {
				navigate('/Login')
			}
		},
	})

	const changePassword = () => {
		postPasswordChange({ endpoint: 'users/forgotPassword', payload: forgotFormValue })
	}

	const verifyotp = () => {
		postVerifyOtp({ endpoint: 'users/forgotPassword/verify', payload: { OTPId: otpid, OTP: otp } })
	}

	const resetPass = () => {
		postResetPass({ endpoint: 'users/forgotPassword/reset', payload: { ...newPassFormValue, OTPId: otpid } })
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
											validateEmail(changePassword)
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
							loading={verifying}
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
					style={{ height: '100svh' }}
					className='p-2 flex  flex-col  justify-center items-center bg-system-primary-accent-transparent '>
					<div
						style={{ borderRadius: 20 }}
						className='bg-system-secondary-bg flex flex-col gap-4 login-form py-4 px-8 lg:px-16 lg:py-10'>
						<center className='mb-10'>
							<Logo height={80} />
						</center>
						{otpVerified ? (
							<>
								<div>
									<h1 className='text-2xl font-semibold text-system-primary-accent'>Enter New Password</h1>
									<p className='text-system-primary-text text-lg font-medium'>Enter your new password</p>
								</div>
								<div>
									<h1 className='text-system-primary-text font-medium text-lg'>
										Password<span className='text-brand-red'>*</span>
									</h1>
									<Input
										ref={passwordRef}
										onChange={handlePasswordChange}
										className='py-4 rounded-xl border-2 border-system-file-border-accent'
										width='full'
										name='password'
										placeholder='Enter the password'
										// setValue={(e) => {
										// 	validateNewPassSingle({ ['Password']: e }, 'Password')
										// }}
										// value={newPassFormValue.Password}
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
								<div>
									<h1 className='text-system-primary-text font-medium text-lg'>
										Confirm Password<span className='text-brand-red'>*</span>
									</h1>
									<Input
										ref={confirmPasswordRef}
										onChange={handleConfirmPasswordChange}
										className='py-4 rounded-xl border-2 border-system-file-border-accent'
										width='full'
										name='confirmPassword'
										placeholder='Confirm password'
										// setValue={(e) => {
										// 	validateConfirmPassword({ ['ConfirmPassword']: e }, 'ConfirmPassword')
										// }}
										// value={newPassFormValue.ConfirmPassword}
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
								<div className='mt-1'>
									<Button
										loading={isChanging}
										onClick={() => {
											validateNewPass(resetPass)
											// setOtpOpen(true)
										}}
										size='md'
										variant='black'
										width='full'
										disabled={newPassFormValue.Password === '' || newPassFormValue.ConfirmPassword === ''}>
										Change Password
									</Button>
								</div>
							</>
						) : (
							<>
								<div>
									<h1 className='text-2xl font-semibold text-system-primary-accent'>Forgot Password</h1>
									<p className='text-system-primary-text text-lg font-medium'>
										Enter your email to reset your password
									</p>
								</div>
								<div>
									<h1 className='text-system-primary-text font-medium text-lg'>Email</h1>
									<Input
										className='py-4 rounded-xl border-2 border-system-file-border-accent'
										width='full'
										name='email'
										placeholder='Ex. abc@efg.com'
										setValue={(e) => {
											validateEmailSingle({ ['Email']: e }, 'Email')
										}}
										value={forgotFormValue.Email}
										type='text'
									/>
									{errorObj['Email'] != undefined && <p className='text-brand-red m-0'>{errorObj['Email']}</p>}
								</div>

								<div className='mt-1'>
									<Button
										loading={isLoading}
										onClick={() => {
											validateEmail(changePassword)
										}}
										size='md'
										variant='black'
										width='full'
										disabled={forgotFormValue.Email === '' || forgotFormValue.Password === ''}>
										Send OTP
									</Button>
								</div>
							</>
						)}
						<div className='mt-1'>
							<div className='text-base font-medium text-center'>
								<span
									onClick={() => {
										navigate('/login')
									}}
									className='cursor-pointer text-system-primary-accent text-lg font-medium underline'>
									Back to login
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ForgotPassword
