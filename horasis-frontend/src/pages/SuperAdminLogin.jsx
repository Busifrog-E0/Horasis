import { useContext, useRef, useState } from 'react'
import LoaderOverlay from '../components/Loader/LoaderOverlay'
import LoginForm from '../components/Login/LoginForm'
import Logo from '../components/Common/Logo'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

import { postItem } from '../constants/operations'
import { superLoginValidation } from '../utils/schema/superLoginValidation'
import { useToast } from '../components/Toast/ToastService'
import Select from '../components/ui/Select'
import eyeon from '../assets/icons/eyeon.svg'
import eyeoff from '../assets/icons/eyeoff.svg'
import { useSuperAuth } from '../context/SuperAdmin/SuperAuthService'

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

const SuperAdminLogin = () => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [showpass, setShowpass] = useState(false)
	const passwordRef = useRef()
	const { currentUserData, updateCurrentUser } = useSuperAuth()
	const toast = useToast()
	const [errorObj, setErrorObj] = useState({})
	const [loginFormValue, setLoginFormValue] = useState({
		Username: '',
		Password: '',
	})

	const validateSingle = (value, key, callback) => {
		setLoginFormValue({ ...loginFormValue, ...value })
		const { error, warning } = superLoginValidation
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
		const { error, warning } = superLoginValidation.validate(loginFormValue, {
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
		setLoading(true)
		let api = 'admin/login'
		postItem(
			api,
			loginFormValue,
			(result) => {
				setLoading(false)
				updateCurrentUser(result)
			},
			(errMsg) => {
				setLoading(false)
				console.log(errMsg)
				setErrorObj({
					Username: 'Incorrect Username',
					Password: 'Incorrect password',
				})
			},
			updateCurrentUser,
			currentUserData,
			toast
		)
	}

	return (
		<div style={{ minHeight: '100svh' }} className='flex flex-col justify-center items-center bg-system-primary-bg '>
			<div
				style={{ borderRadius: 20 }}
				className='bg-system-secondary-bg flex flex-col gap-4 login-form py-4 px-8 lg:px-16 lg:py-10'>
				<center>
					<Logo height={80} />
				</center>

				<div>
					<h1 className='text-system-primary-text font-medium text-lg'>Username</h1>
					{/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
					<Input
						className='py-4 rounded-xl border-2 border-system-file-border-accent'
						width='full'
						name='username'
						placeholder='Username'
						setValue={(e) => {
							validateSingle({ ['Username']: e }, 'Username')
						}}
						value={loginFormValue.Username}
						type='text'
					/>
					{errorObj['Username'] != undefined && <p className='text-brand-red m-0'>{errorObj['Username']}</p>}
				</div>
				<div>
					<h1 className='text-system-primary-text font-medium text-lg'>Password</h1>
					<Input
						ref={passwordRef}
						className='py-4 rounded-xl border-2 border-system-file-border-accent'
						width='full'
						name='password'
						placeholder='Password'
						// setValue={(e) => {
						// 	validateSingle({ ['Password']: e }, 'Password')
						// }}
						onChange={handlePasswordChange}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								validate(login)
							}
						}}
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
				</div>

				<div className='mt-4'>
					<Button
						loading={loading}
						onClick={() => {
							validate(login)
						}}
						size='md'
						variant='black'
						width='full'
						disabled={loginFormValue.Username === '' || loginFormValue.Password === ''}>
						Login
					</Button>
				</div>
			</div>
		</div>
	)
}

export default SuperAdminLogin
