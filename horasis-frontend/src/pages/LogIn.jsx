import { useContext, useRef, useState } from 'react'
import LoaderOverlay from '../components/Loader/LoaderOverlay'
import LoginForm from '../components/Login/LoginForm'
import Logo from '../components/Common/Logo'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { AuthContext, defaultUserData, useAuth } from '../utils/AuthProvider'
import { postItem } from '../constants/operations'
import { loginValidation } from '../utils/schema/loginValidation'
import { useToast } from '../components/Toast/ToastService'
import Select from '../components/ui/Select'
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

const LogIn = () => {
	const navigate = useNavigate()
	const { updateCurrentUser } = useAuth()
	const toast = useToast()
	const { isLoading, postData } = usePostData({
		onSuccess: (result) => {
			if (result === 'REGISTER_REDIRECT') {
				navigate('/Register')
				toast.open('error', 'No user found', 'Redirecting to registration')
			} else {
				updateCurrentUser(result)
			}
		},
	})

	const [showpass, setShowpass] = useState(false)
	const passwordRef = useRef()

	const [errorObj, setErrorObj] = useState({})
	const [loginFormValue, setLoginFormValue] = useState({
		Email: '',
		Password: '',
	})

	const validateSingle = (value, key, callback) => {
		setLoginFormValue({ ...loginFormValue, ...value })
		const { error, warning } = loginValidation
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
	const validate = (callback) => {
		const { error, warning } = loginValidation.validate(loginFormValue, {
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

	const handlePasswordChange = (e) => {
		passwordRef.current = e.target.value
		validateSingle({ ['Password']: e.target.value }, 'Password')
	}

	const login = () => {
		postData({
			endpoint: 'users/login',
			payload: loginFormValue,
		})
	}

	return (
		<div style={{ backgroundImage: `url(${HeroCoverImage})` }} className='bg-cover bg-no-repeat'>
			<div
				style={{ minHeight: '100svh' }}
				className='flex flex-col justify-center items-center bg-system-primary-accent-transparent p-2'>
				<div
					style={{ borderRadius: 20 }}
					className='bg-system-secondary-bg flex flex-col gap-4 login-form py-4 px-8 lg:px-16 lg:py-10'>
					<center>
						<Logo height={80} />
					</center>
					<div>
						<h1 className='text-3xl font-semibold text-system-primary-accent'>Login</h1>
						<p className='text-system-primary-text text-lg font-medium'>
							Login to your account to access all the features of Horasis!
						</p>
					</div>
					<div>
						<h1 className='text-system-primary-text font-medium text-lg'>Email</h1>
						{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
						<Input
							className='py-4 rounded-xl border-2 border-system-file-border-accent'
							width='full'
							name='email'
							placeholder='Ex. abc@efg.com'
							setValue={(e) => {
								validateSingle({ ['Email']: e }, 'Email')
							}}
							value={loginFormValue.Email}
							type='text'
						/>
						{errorObj['Email'] != undefined && <p className='text-brand-red m-0'>{errorObj['Email']}</p>}
					</div>
					<div>
						<h1 className='text-system-primary-text font-medium text-lg'>Password</h1>
						<Input
							ref={passwordRef}
							className='py-4 rounded-xl border-2 border-system-file-border-accent'
							width='full'
							name='password'
							placeholder='Enter the password'
							// setValue={(e) => {
							// 	validateSingle({ ['Password']: e }, 'Password')
							// }}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault()
									validate(login)
								}
							}}
							onChange={handlePasswordChange}
							// value={loginFormValue.Password}
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
						<div className='mt-4'>
							<div className='text-base font-medium text-end'>
								<p
									className='cursor-pointer text-system-primary-accent font-medium underline'
									onClick={() => navigate('/ForgotPassword')}>
									Forgot Password?
								</p>
							</div>
						</div>
					</div>

					<div className='mt-4'>
						<Button
							loading={isLoading}
							onClick={() => {
								validate(login)
							}}
							size='md'
							variant='black'
							width='full'
							disabled={loginFormValue.Email === '' || loginFormValue.Password === ''}>
							Login
						</Button>
					</div>
					<div className='mt-1'>
						<div className='text-base font-medium text-center'>
							Don't have an account?{' '}
							<span
								onClick={() => {
									navigate('/register')
								}}
								className='cursor-pointer text-system-primary-accent text-lg font-medium underline'>
								Register
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LogIn
