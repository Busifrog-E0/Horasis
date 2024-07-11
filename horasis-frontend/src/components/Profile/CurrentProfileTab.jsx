import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../utils/AuthProvider'
import { getItem } from '../../constants/operations'
import Spinner from '../ui/Spinner'

const CurrentProfileTab = () => {
  const { currentUserData, updateCurrentUser, scrollToTop } = useContext(AuthContext)
  const [expand, setExpand] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState()
  const [followCount, setFollowCount] = useState({})

  const navigate = useNavigate()
  const GoToProfilePage = () => {
    scrollToTop()
    navigate('/myprofile')
  }

  const steps = [
    {
      title: 'Profile Photo',
    },
    {
      title: 'Work Information',
    },
    {
      title: 'Biography',
    },
  ]

  const getUserDetails = () => {
    setIsLoading(true)
    getItem(
      `users/${currentUserData.CurrentUser.UserId}`,
      (result) => {
        setIsLoading(false)
        setUser(result)
      },
      (err) => {
        setIsLoading(false)
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  const getFollowCount = () => {
    setIsLoading(true)
    getItem(
      `users/${currentUserData.CurrentUser.UserId}/follow/count`,
      (result) => {
        setIsLoading(false)
        setFollowCount(result)
      },
      (err) => {
        setIsLoading(false)
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  useEffect(() => {
    getUserDetails()
    getFollowCount()
  }, [])

  return (
    <>
      <div className='p-6 bg-system-secondary-bg rounded-lg'>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {' '}
            <div
              className='flex justify-center items-center cursor-pointer'
              onClick={GoToProfilePage}
            >
              <div className='w-28 h-28 rounded-full bg-brand-light-gray'>
                {user && user.ProfilePicture && (
                  <img
                    className='w-28 h-28 rounded-full'
                    src={user.ProfilePicture}
                    alt='Rounded avatar'
                  />
                )}
                {/* <img
                  className='w-28 h-28 rounded-full'
                  src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                  alt='Rounded avatar'
                /> */}
              </div>
            </div>
            <h4 className='font-medium text-xl text-center text-system-primary-text mt-2'>
              {user && user.FullName}
            </h4>
            <h4 className='font-medium text-xl text-brand-gray-dim text-center'>
              @{user && user.Username}
            </h4>
            <div className='flex justify-center items-center mt-2'>
              <div className='px-20 py-1 rounded-full bg-system-secondary-accent text-center inline-block'>
                <span className='text-system-primary-accent font-semibold'>
                  {currentUserData.CurrentUser.Role}
                </span>
              </div>
            </div>
            <div className='flex justify-center items-center mt-2 gap-3'>
              <h4 className='font-semibold text-base text-center text-system-primary-text mt-2'>
                {followCount && followCount.NoOfFollowings} Following
              </h4>
              <h4 className='font-semibold text-base text-center text-system-primary-text mt-2'>
                {followCount && followCount.NoOfFollowers} Followers
              </h4>
            </div>
            <div className='p-3 pb-2 px-5 bg-system-secondary-bg rounded-lg shadow-lg'>
              <div
                className='flex justify-between items-center mt-2 gap-3 cursor-pointer'
                onClick={() => {
                  setExpand(!expand)
                }}
              >
                <h4 className='font-semibold text-sm text-center text-system-primary-accent mt-2'>
                  Complete Your Profile
                </h4>
                <h4 className='font-semibold text-base text-center text-system-primary-accent mt-2'>
                  40%
                </h4>
              </div>
              <div className='w-full bg-system-secondary-selected-accent rounded-full h-2 mt-3 mb-1'>
                <div className='bg-brand-green h-2 rounded-full' style={{ width: `${40}%` }}></div>
              </div>
              {expand && (
                <>
                  <div className='pt-2'>
                    <div className='relative '>
                      {steps.map((event, index) => (
                        <div key={index} className=''>
                          <div className='flex flex-row items-center gap-1'>
                            <div
                              className={` w-3.5 h-3.5
                          bg-${index !== 2 ? 'brand-green' : 'brand-gray-dim'} rounded-full
                           text-${index !== 2 ? 'white' : 'brand-gray-dim'} border
                             border-${index !== 2 ? 'brand-green' : 'brand-gray-dim'} 
                             flex items-center justify-center`}
                            >
                              {index !== 2 && <span>✓</span>}
                            </div>
                            <p
                              className={`text-sm font-medium text-${
                                index !== 2 ? 'brand-green' : 'brand-gray-dim'
                              } text-system-primary-text`}
                            >
                              {event.title}
                            </p>
                          </div>
                          {index !== 2 && (
                            <div className='border-l-2 border-gray-200 pt-3 mx-1.5'></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <h1 className='text-center cursor-pointer text-sm font-semibold underline text-system-primary-accent mt-2'>
                    Complete Your Profile
                  </h1>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CurrentProfileTab
