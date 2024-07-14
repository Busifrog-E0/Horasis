import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../utils/AuthProvider"
import { getItem } from "../../constants/operations"
import avatar from '../../assets/icons/avatar.svg'
import Input from "../ui/Input"
import { useToast } from "../Toast/ToastService"

const PostComponent = () => {
	const { currentUserData, updateCurrentUser, scrollToTop } = useContext(AuthContext)
	const toast = useToast()
	const [user, setUser] = useState()
	const getUserDetails = () => {
		getItem(
			`users/${currentUserData.CurrentUser.UserId}`,
			(result) => {
				setUser(result)
			},
			(err) => {
				// console.log(err)
			},
			updateCurrentUser,
			currentUserData,toast
		)
	}

	useEffect(() => {
    console.log('rendered')
		getUserDetails()
	}, [])
	return (
		<div className='p-5 pr-10 bg-system-secondary-bg rounded-lg'>
			<div className='flex items-center gap-5'>
				{user ? (
					<>
						{user.ProfilePicture ? (
							<div className='w-16 h-16 rounded-full bg-black'>
								<img className='w-16 h-16  rounded-full object-cover' src={user.ProfilePicture} alt='avatar' />
							</div>
						) : (
							<>
								<div className='w-16 h-16 rounded-full bg-brand-light-gray'>
									<img src={avatar} className='object-cover h-full w-full rounded-lg' alt='No avatar' />
								</div>
							</>
						)}
					</>
				) : (
					<></>
				)}

				<Input
					className='py-3 rounded-xl border-2 border-system-secondary-accent'
					placeholder={`Share what's on  your mind, ${user && user.FullName}`}
					width='full'
				/>
			</div>
		</div>
	)
}

export default PostComponent