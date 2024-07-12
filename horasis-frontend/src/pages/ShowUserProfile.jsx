import { useNavigate, useParams } from 'react-router-dom'
import Tab from '../components/ui/Tab'
import EventsList from '../components/Events/EventsList'
import { useContext, useEffect, useState } from 'react'
import { MAINTAB, _retrieveData, _storeData } from '../utils/LocalStorage'
import MembersSection from '../components/Connections/MembersSection'
import { relativeTime } from '../utils/date'
import DropdownMenu from '../components/ui/DropdownMenu'
import StaggeredList from '../components/ui/StaggeredList'
import VideoPlayer from '../components/ui/VideoPlayer'
import { deleteItem, getItem, postItem } from '../constants/operations'
import { AuthContext } from '../utils/AuthProvider'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import AboutProfile from '../components/Profile/AboutProfile'
import Button from '../components/ui/Button'
import avatar from '../assets/icons/avatar.svg'
import cover from '../assets/icons/cover.svg'
const ShowUserProfile = () => {
  const { userid } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowLoading,setIsFollowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }

  const { currentUserData, updateCurrentUser } = useContext(AuthContext)
  const [user, setUser] = useState()

  const tabs = () => [
    {
      key: 0,
      title: 'Timeline',
      render: () => (
        <div className='bg-system-secondary-bg p-4 lg:py-8 lg:px-12 rounded-b-lg '>
          <div className='p-5 pr-10 bg-system-secondary-bg rounded-lg mb-3'>
            <div className='flex items-center gap-5'>
              <img
                className='w-16 h-16 rounded-full'
                src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                alt='Rounded avatar'
              />

              <div className='flex-1 rounded-md p-2 px-3 border border-system-file-border flex items-center justify-between bg-system-secondary-bg'>
                <h4 className='font-medium text-xl text-brand-gray-dim italic '>
                  Share what's on your mind, Frank
                </h4>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='p-5 bg-system-secondary-bg rounded-lg border border-system-file-border'>
              <div className='flex items-start gap-2'>
                <img
                  className='w-16 h-16 rounded-full'
                  src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                  alt='Rounded avatar'
                />

                <div className='flex-1'>
                  <div className='flex items-start justify-between gap-10'>
                    <h4 className='font-semibold text-xl text-system-primary-accent mt-1'>
                      Frank-Jurgen Ritcher
                    </h4>
                    <h4 className='font-medium text-base text-brand-gray-dim'>
                      {relativeTime(new Date().getTime())}
                    </h4>
                  </div>
                  <h4 className='text-system-primary-text mt-1'>updated his profile photo</h4>
                </div>
              </div>
              <div className='flex items-center justify-between gap-10 mt-8'>
                <div className='flex flex-wrap items-start justify-between gap-10'>
                  <div className='flex items-start gap-1 cursor-pointer'>
                    <p className='text-brand-gray-dim mt-1'>likes</p>
                  </div>
                  <div className='flex items-start gap-1 cursor-pointer'>
                    <p className='text-brand-gray-dim mt-1'>replies</p>
                  </div>
                </div>
                <DropdownMenu />
              </div>
            </div>
            <div className='p-5 bg-system-secondary-bg rounded-lg border border-system-file-border'>
              <div className='flex items-start gap-2'>
                <img
                  className='w-16 h-16 rounded-full'
                  src='https://flowbite.com/docs/images/people/profile-picture-2.jpg'
                  alt='Rounded avatar'
                />

                <div className='flex-1'>
                  <div className='flex items-start justify-between gap-10'>
                    <h4 className='font-semibold text-xl text-system-primary-accent mt-1'>
                      Frank-Jurgen Ritcher
                    </h4>
                    <h4 className='font-medium text-base text-brand-gray-dim'>
                      {relativeTime(new Date().getTime())}
                    </h4>
                  </div>
                </div>
              </div>
              <div className='mt-5'>
                <h4 className='text-system-primary-text font-medium text-xl'>Have a great day!</h4>
              </div>
              <div className='flex items-center justify-between gap-10 mt-8'>
                <div className='flex flex-wrap items-start justify-between gap-10'>
                  <div className='flex items-start gap-1 cursor-pointer'>
                    <p className='text-brand-gray-dim mt-1'>likes</p>
                  </div>
                  <div className='flex items-start gap-1 cursor-pointer'>
                    <p className='text-brand-gray-dim mt-1'>replies</p>
                  </div>
                </div>
                <DropdownMenu />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 1,
      title: 'About',
      render: () => <AboutTab user={user} getUserDetails={getUserDetails} />,
    },
    {
      key: 2,
      title: 'Connections',
      render: () => (
        <div className='bg-system-secondary-bg p-4 lg:p-6 rounded-b-lg '>
          <MembersSection />
        </div>
      ),
    },
  ]

  const onTabChange = (item) => {
    setActiveTab(item.key)
  }

  const getUserDetails = (setLoading) => {
    setLoading(true)
    getItem(
      `users/${userid}`,
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
        FolloweeId: userid,
      },
      (result) => {
        getUserDetails(setIsFollowLoading)
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
      `users/${currentUserData.CurrentUser.UserId}/follow/${userid}`,
      (result) => {
        getUserDetails(setIsFollowLoading)
      },
      (err) => {
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  useEffect(() => {
    getUserDetails(setIsLoading)
  }, [])

  return (
    <>
      <div className='p-2 lg:px-10 lg:py-6'>
        <div className='rounded-lg z-20 bg-red-400 h-40 lg:h-80 relative'>
        {user ? (
            <>
              {user.CoverPicture ? (
                <>
                  <img src={user.CoverPicture} className='object-cover h-full w-full rounded-lg' />
                </>
              ) : (
                <>
                  <div className='w-full h-full rounded-lg flex items-center justify-center  bg-slate-100'>
                  <img src={cover} className='object-cover h-full w-full rounded-lg' />

                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className='w-full h-full rounded-lg flex items-center justify-center bg-slate-100'>
                {isLoading ? <Spinner /> : <></>}
              </div>
            </>
          )}
          {/* <img
            src='https://th.bing.com/th/id/OIP.FFchRAWwk-emGNqgImzwaAHaEK?rs=1&pid=ImgDetMain'
            className='object-cover h-full w-full rounded-lg'
          /> */}
          <div className='absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col justify-between items-start p-4 lg:px-10 lg:py-6 bg-brand-blue-transparent h-100 overflow-hidden rounded-lg'>
            <div className='flex w-full items-start justify-between'>
              <div className='flex items-center cursor-pointer' onClick={handleGoBack}>
                {/* back arrow */}
                <h4 className='font-medium text-xl text-brand-secondary'>Back</h4>
              </div>
              {/* <div
                className={`inline-flex items-center justify-center w-12 h-12 p-3 overflow-hidden rounded-full border border-white bg-white cursor-pointer`}
              >
                <svg
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 20'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
                  />
                </svg>
              </div> */}
            </div>
          </div>
          <div className='flex justify-center items-center cursor-pointer absolute left-5 -bottom-3 lg:left-20 lg:-bottom-8 z-30'>
          {user ? (
              <>
                {user.ProfilePicture ? (
                  <>
                    <div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center bg-black'>
                      <img
                        className='w-24 lg:w-60 h-24 lg:h-60 rounded-full'
                        src={user.ProfilePicture}
                        alt='Rounded avatar'
                        onClick={() => {
                          setIsProfilePictureOpen(true)
                          if (user.ProfilePicture) {
                            setSelectedProfileImage(user.ProfilePicture)
                          } else {
                            setSelectedProfileImage(null)
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-brand-light-gray'
                      onClick={() => {
                        setIsProfilePictureOpen(true)
                        if (user.ProfilePicture) {
                          setSelectedProfileImage(user.ProfilePicture)
                        } else {
                          setSelectedProfileImage(null)
                        }
                      }}
                    >
                  <img src={avatar} className='object-cover h-full w-full rounded-lg' />

                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-slate-100'>
                  {isLoading ? <Spinner /> : <></>}
                </div>
              </>
            )}
            {/* <img
              className='w-24 lg:w-60 h-24 lg:h-60 rounded-full'
              src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
              alt='Rounded avatar'
            /> */}
          </div>
        </div>
      </div>
      <div className='p-2 lg:px-10 lg:py-6 pt-6'>
        <div className='grid lg:grid-cols-4 gap-3 lg:gap-12 '>
          <div className='py-5 lg:py-8 px-16 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8'>
            {
              isLoading?<Spinner/>:
            <>
              <h4 className='font-medium text-2xl text-center text-system-primary-text'>
                {user && user.FullName}
              </h4>
              <h4 className='font-medium text-xl text-brand-gray-dim text-center'>
                @{user && user.Username}
              </h4>
              <div className='flex justify-center items-center mt-2 lg:mt-6 flex-col gap-2'>
                {/* <div className='w-full p-3 rounded-full bg-system-secondary-accent text-center inline-block'>
                <span className='text-system-primary-accent text-md font-semibold'>Connect</span>
              </div> */}

                <Button
                  variant='outline'
                  width='full'
                  className='rounded-full font-semibold'
                  size='md'
                >
                  Connect
                </Button>

                {user && user.IsFollowing === true ? (
                  <>
                    <Button
                      variant='white'
                      width='full'
                      className='rounded-full font-semibold shadow-sm bg-system-secondary-accent text-system-primary-accent'
                      size='md'
                      onClick={() => {
                        unFollowUser()
                      }}
                      loading={isFollowLoading}
                      loadingTitle={'Unfollowing'}
                    >
                      Unfollow
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant='black'
                      width='full'
                      className='rounded-full font-semibold'
                      size='md'
                      onClick={() => {
                        followUser()
                      }}
                      loading={isFollowLoading}
                      loadingTitle={"Following"}
                    >
                      Follow
                    </Button>
                  </>
                )}
              </div>
              <h4 className='font-semibold text-xl text-system-primary-text mt-3 lg:mt-6'>About</h4>
              <div className='mt-4 flex  flex-col gap-4'>
                <div className='flex items-center gap-2'>
                  <div className='justify-end text-system-primary-accent'>
                    <svg
                      className='w-4 h-4 cursor-pointer'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 20 20'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
                      />
                    </svg>
                  </div>
                  <h4 className='font-medium text-xl text-brand-gray-dim truncate'>{user && user.Email}</h4>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='justify-end text-system-primary-accent'>
                    <svg
                      className='w-4 h-4 cursor-pointer'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 20 20'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
                      />
                    </svg>
                  </div>
                  <h4 className='font-medium text-xl text-brand-gray-dim truncate'>
                    {user && user.Country}
                  </h4>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='justify-end text-system-primary-accent'>
                    <svg
                      className='w-4 h-4 cursor-pointer'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 20 20'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
                      />
                    </svg>
                  </div>
                  <h4 className='font-medium text-xl text-brand-gray-dim truncate' >
                    {user && user.JobTitle}
                  </h4>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='justify-end text-system-primary-accent'>
                    <svg
                      className='w-4 h-4 cursor-pointer'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 20 20'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2'
                      />
                    </svg>
                  </div>
                  <h4 className='font-medium text-xl text-brand-gray-dim truncate'>
                    {user && user.CompanyName}
                  </h4>
                </div>
              </div>
            </>
            }
          </div>

          <div className='lg:col-span-3'>
            <Tab
              onTabChange={onTabChange}
              activeTab={activeTab}
              name='myprofile'
              tabs={tabs()}
              alignment='justify-start'
            />
          </div>
        </div>
      </div>
    </>
  )
}
const AboutTab = ({ user, getUserDetails, isCurrentUser = false }) => {
  return (
    <>
      <AboutProfile user={user} getUserDetails={getUserDetails} isCurrentUser={isCurrentUser} />
    </>
  )
}

export default ShowUserProfile
