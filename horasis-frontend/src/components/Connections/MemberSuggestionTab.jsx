import { useContext, useState } from 'react'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'
import { deleteItem, postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'



const MemberSuggestionTab = ({ lastElement, profile,updateList }) => {
  const navigate = useNavigate()
  const goToProfile = () => {
    if (profile) {
      navigate(`/ViewProfile/${profile.DocId}`)
    }
  }

  const { currentUserData, updateCurrentUser } = useContext(AuthContext)
  const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const getUserDetails = (setLoading) => {
    setLoading(true)
    getItem(
      `users/${profile.DocId}`,
      (result) => {
        setLoading(false)
        setUser(result)
      },
      (err) => {
        setLoading(false)
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  const followUser = () => {
    postItem(
      'follow',
      {
        FolloweeId: profile.DocId,
      },
      (result) => {
        updateList([])
        // getUserDetails(setIsFollowLoading)
      },
      (err) => {
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  const unFollowUser = () => {
    deleteItem(
      `users/${currentUserData.CurrentUser.UserId}/follow/${profile.DocId}`,
      (result) => {
        updateList([])
        // getUserDetails(setIsFollowLoading)
      },
      (err) => {
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  return (
    <>
      <div className={`${lastElement === true ? '' : 'border-b border-system-file-border pb-3'}`}>
        <div className='flex items-start gap-4'>
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
          {/* <img
            className='w-16 h-16 rounded-full'
            src='https://flowbite.com/docs/images/people/profile-picture-1.jpg'
            alt='Rounded avatar'
          /> */}

          <div className='flex-1'>
            <h4
              className='font-semibold text-system-primary-text cursor-pointer'
              onClick={() => {
                goToProfile()
              }}
            >
              {profile && profile.FullName}
            </h4>
            <h4 className='font-medium text-sm text-brand-gray-dim mb-2'>
              @{profile && profile.Username}, {profile && profile.JobTitle}{' '}
              {profile && profile.Country}
            </h4>
          </div>
          {profile.IsFollowing === true ? (
            <>
              <Button
                variant='outline'
                onClick={() => {
                  unFollowUser()
                }}
              >
                Unfollow
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                onClick={() => {
                  followUser()
                }}
              >
                Follow
              </Button>
            </>
          )}
          {/* <Button variant='outline'>Follow</Button> */}
        </div>
      </div>
    </>
  )
}

export default MemberSuggestionTab
