import { useNavigate } from 'react-router-dom'
import Tab from '../components/ui/Tab'
import EventsList from '../components/Events/EventsList'
import { useContext, useEffect, useState } from 'react'
import { MAINTAB, _retrieveData, _storeData } from '../utils/LocalStorage'
import MembersSection from '../components/Connections/MembersSection'
import { relativeTime } from '../utils/date'
import DropdownMenu from '../components/ui/DropdownMenu'
import StaggeredList from '../components/ui/StaggeredList'
import VideoPlayer from '../components/ui/VideoPlayer'
import { getItem, patchItem, postItem } from '../constants/operations'
import { AuthContext } from '../utils/AuthProvider'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import AboutProfile from '../components/Profile/AboutProfile'
import Button from '../components/ui/Button'
import PictureUpload from '../components/Profile/PictureUpload'
import avatar from '../assets/icons/avatar.svg'
import cover from '../assets/icons/cover.svg'
import { ConnectionsTab } from './Connections'
import EmptyMembers from '../components/Common/EmptyMembers'

const tabs = (user,getUserDetails) => [
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
        <EmptyMembers emptyText={"You currently have nothing on your timeline"}/>
        {/* <div className='flex flex-col gap-3'>
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
        </div> */}
      </div>
    ),
  },
  {
    key: 1,
    title: 'About',
    render: () => <AboutTab user={user} getUserDetails={getUserDetails} isCurrentUser={true} />,
  },
  {
    key: 2,
    title: 'Connections',
    render: () => (
      <div className='bg-system-secondary-bg p-4 lg:p-6 rounded-b-lg '>
      <ConnectionsTab/>
      </div>
    ),
  },
  // {
  //   key: 3,
  //   title: 'Events',
  //   render: () => (
  //     <div className='bg-system-secondary-bg p-4 lg:p-10 rounded-b-lg '>
  //       <EventsList cols={4} gap='gap-1 lg:gap-x-16 lg:gap-y-10' />
  //     </div>
  //   ),
  // },
  // {
  //   key: 4,
  //   title: 'Videos',
  //   render: () => (
  //     <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
  //       <div className='grid grid-cols-2 gap-4 p-4'>
  //         <VideoPlayer
  //           url={'https://stor.oceansfutures.org/oceansfuture-storage/assets/wwf_fc9393fe1e.mp4'}
  //         />
  //         <VideoPlayer
  //           url={'https://stor.oceansfutures.org/oceansfuture-storage/assets/wwf_fc9393fe1e.mp4'}
  //         />
  //       </div>
  //     </div>
  //   ),
  // },
  // {
  //   key: 5,
  //   title: 'Photos',
  //   render: () => (
  //     <div className='bg-system-secondary-bg p-4 rounded-b-lg '>
  //       <StaggeredList />
  //     </div>
  //   ),
  // },
  // {
  //   key: 6,
  //   title: 'Discussions',
  //   render: () => (
  //     <div className='bg-system-secondary-bg p-4 lg:py-10 lg:px-12 rounded-b-lg '>
  //       <div className='flex flex-col gap-6'>
  //         <div className='border-b border-system-file-border pb-6'>
  //           <div className='flex items-start gap-2'>
  //             <div className='w-28 h-20 overflow-hidden rounded-lg'>
  //               <img
  //                 className='w-full h-full object-cover'
  //                 src='https://th.bing.com/th/id/OIP.fRpB3M9oOQSmhd5hwcmHtAHaFj?w=216&h=180&c=7&r=0&o=5&pid=1.7'
  //                 alt='Rounded avatar'
  //               />
  //             </div>

  //             <div className='flex-1'>
  //               <div className='flex items-start justify-between gap-10'>
  //                 <div>
  //                   <h4 className='font-semibold text-system-primary-text text-md'>Education</h4>
  //                   <h4 className='text-brand-gray-dim text-sm mt-1'>
  //                     joined the Eventorasis Global Meetingjoined the Event Horasis Global
  //                     Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis
  //                     Global Meetingjoined the Event Horasis Global Meetingjoined the Event
  //                     Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the
  //                     Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined
  //                     the Event Horasis Global Meetingjoined the Event Horasis Global
  //                     Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis
  //                     Global Meeting
  //                   </h4>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className='flex flex-col items-end justify-between gap-6'>
  //               <h4 className='font-medium text-sm text-brand-gray-dim'>
  //                 {relativeTime(new Date().getTime())}
  //               </h4>
  //               <DropdownMenu />
  //             </div>
  //           </div>
  //         </div>
  //         <div className='border-b border-system-file-border pb-6'>
  //           <div className='flex items-start gap-2'>
  //             <div className='w-28 h-20 overflow-hidden rounded-lg'>
  //               <img
  //                 className='w-full h-full object-cover'
  //                 src='https://th.bing.com/th/id/OIP.CL6wvO0RBhLq7raz1iCn_gHaEK?rs=1&pid=ImgDetMain'
  //                 alt='Rounded avatar'
  //               />
  //             </div>

  //             <div className='flex-1'>
  //               <div className='flex items-start justify-between gap-10'>
  //                 <div>
  //                   <h4 className='font-semibold text-system-primary-text text-md'>
  //                     health Care
  //                   </h4>
  //                   <h4 className='text-brand-gray-dim text-sm mt-1'>
  //                     joined the Eventorasis Global Meetingjoined the Event Horasis Global
  //                     Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis
  //                     Global Meetingjoined the Event Horasis Global Meetingjoined the Event
  //                     Horasis Global Meetingjoined the Event Horasis Global Meetingjoined the
  //                     Event Horasis Global Meetingjoined the Event Horasis Global Meetingjoined
  //                     the Event Horasis Global Meetingjoined the Event Horasis Global
  //                     Meetingjoined the Event Horasis Global Meetingjoined the Event Horasis
  //                     Global Meeting
  //                   </h4>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className='flex flex-col items-end justify-between gap-6'>
  //               <h4 className='font-medium text-sm text-brand-gray-dim'>
  //                 {relativeTime(new Date().getTime())}
  //               </h4>
  //               <DropdownMenu />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   ),
  // },
  // {
  //   key: 7,
  //   title: 'Documents',
  //   render: () => (
  //     <div className='bg-system-secondary-bg p-4 lg:py-10 lg:px-12 rounded-b-lg '>
  //       <div className='flex flex-col gap-6'>
  //         <div className='border-b border-system-file-border pb-6'>
  //           <div className='flex items-center gap-4'>
  //             <div className='w-12 h-12 overflow-hidden rounded-lg'>
  //               <img
  //                 className='w-full h-full object-contain'
  //                 src='https://th.bing.com/th/id/OIP.O-6F-svmDZRlmeu9Pyy2jQHaFV?w=273&h=197&c=7&r=0&o=5&pid=1.7'
  //                 alt='Rounded avatar'
  //               />
  //             </div>

  //             <div className='flex-1'>
  //               <div className='flex items-start justify-between gap-10'>
  //                 <div>
  //                   <h4 className='font-semibold text-system-primary-text text-md'>image</h4>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className='flex flex-col items-end justify-between gap-6'>
  //               <h4 className='font-medium text-sm text-brand-gray-dim'>
  //                 {relativeTime(new Date().getTime())}
  //               </h4>
  //               <DropdownMenu />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   ),
  // },
]

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState(
    _retrieveData(MAINTAB) && _retrieveData(MAINTAB)['MyProfile']
      ? Number(_retrieveData(MAINTAB)['MyProfile'])
      : 0
  )
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }



  const onTabChange = (item) => {
    setActiveTab(item.key)
    _storeData(MAINTAB, { MyProfile: item.key })
  }
  const { currentUserData, updateCurrentUser } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState()
  const getUserDetails = () => {
    setIsLoading(true)
    getItem(
      `users/${currentUserData.CurrentUser.UserId}`,
      (result) => {
        setIsLoading(false)
        setUser(result)
        if (result.ProfilePicture) {
          setSelectedProfileImage(result.ProfilePicture)
        } else {
          setSelectedProfileImage(null)
        }
      },
      (err) => {
        setIsLoading(false)
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }
  const [isProfilePictureOpen, setIsProfilePictureOpen] = useState(false)

  useEffect(() => {
    getUserDetails()
  }, [])

  // profile image upload logic
  const [selectedProfileImage, setSelectedProfileImage] = useState(null)
  const [profileImageToUpload, setProfileImageToUpload] = useState(null)
  const onProfileImageSelect = (imageData) => {
    setProfileImageToUpload(imageData)
    const tempUrl = URL.createObjectURL(new Blob([new Uint8Array(imageData.FileData)]))
    setSelectedProfileImage(tempUrl)
  }

  const onProfileImageDelete = () => {
    setProfileImageToUpload(null)
    setSelectedProfileImage(null)
  }

  const onProfileImageSet = (url) => {
    patchItem(
      `users/${currentUserData.CurrentUser.UserId}/picture`,
      { ProfilePicture: url },
      (result) => {
        if (result === true) {
          getUserDetails()
          setIsProfilePictureOpen(false)
        }
      },
      (err) => {
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  const onProfileImageUpload = () => {
    if (profileImageToUpload) {
      postItem(
        'files/users',
        profileImageToUpload,
        (result) => {
          onProfileImageSet(result.FileUrl)
        },
        (err) => {
          console.error(err)
        },
        updateCurrentUser,
        currentUserData
      )
    } else {
      onProfileImageSet('')
    }
  }

  // cover photo upload logic
  const [selectedCoverImage, setSelectedCoverImage] = useState(null)
  const [coverImageToUpload, setCoverImageToUpload] = useState(null)
  const [isCoverPictureOpen, setIsCoverPictureOpen] = useState(false)
  const onCoverImageSelect = (imageData) => {
    setCoverImageToUpload(imageData)
    const tempUrl = URL.createObjectURL(new Blob([new Uint8Array(imageData.FileData)]))
    setSelectedCoverImage(tempUrl)
  }
  const onCoverImageDelete = () => {
    setCoverImageToUpload(null)
    setSelectedCoverImage(null)
  }
  const onCoverImageSet = (url) => {
    patchItem(
      `users/${currentUserData.CurrentUser.UserId}/picture`,
      {
        CoverPicture: url,
      },
      (result) => {
        if (result === true) {
          getUserDetails()
          setIsCoverPictureOpen(false)
        }
      },
      (err) => {
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }
  const onCoverImageUpload = () => {
    if (coverImageToUpload) {
      postItem(
        'files/users',
        coverImageToUpload,
        (result) => {
          onCoverImageSet(result.FileUrl)
        },
        (err) => {
          console.log(err)
        },
        updateCurrentUser,
        currentUserData
      )
    } else {
      onCoverImageSet('')
    }
  }

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
              <div
                onClick={() => {
                  setIsCoverPictureOpen(true)
                  if (user.ProfilePicture) {
                    setSelectedCoverImage(user.CoverPicture)
                  } else {
                    setSelectedCoverImage(null)
                  }
                }}
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
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center cursor-pointer absolute left-5 -bottom-3 lg:left-20 lg:-bottom-8 z-30'>
            {user ? (
              <>
                {user.ProfilePicture ? (
                  <>
                    <div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center bg-black'>
                      <img
                        className='w-24 lg:w-60 h-24 lg:h-60 rounded-full object-cover'
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
              onClick={() => {
                setIsProfilePictureOpen(true)
              }}
            /> */}
          </div>
        </div>
      </div>
      <Modal isOpen={isProfilePictureOpen} maxWidth='max-w-4xl'>
        <Modal.Header>
          <div className='p-2 flex items-center justify-between w-full'>
            <p className='text-lg font-medium'>Profile Photo</p>
            <button
              onClick={() => {
                setIsProfilePictureOpen(false)
              }}
            >
              close
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className='text-lg font-medium text-center'>
            Your profile will be used on your profile and through out the site.
          </p>

          <div className=' flex flex-col items-center justify-center pt-10'>
            <PictureUpload
              isBanner={false}
              altTitle='Profile Picture'
              selectedImage={selectedProfileImage}
              setSelectedImage={setSelectedProfileImage}
              onImageSelect={onProfileImageSelect}
              onImageDelete={onProfileImageDelete}
              onUploadImage={onProfileImageUpload}
            />
          </div>
        </Modal.Body>
      </Modal>
      <Modal isOpen={isCoverPictureOpen} maxWidth='max-w-4xl'>
        <Modal.Header>
          <div className='p-2 flex items-center justify-between w-full'>
            <p className='text-lg font-medium'>Cover Photo</p>
            <button
              onClick={() => {
                setIsCoverPictureOpen(false)
              }}
            >
              close
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className='text-lg font-medium text-center'>
            Your cover photo will be used to customize the header of your profile.
          </p>
          <div className=' flex flex-col items-center justify-center pt-10'>
            <PictureUpload
              // isBanner={false}
              altTitle='Cover Picture'
              selectedImage={selectedCoverImage}
              setSelectedImage={setSelectedCoverImage}
              onImageSelect={onCoverImageSelect}
              onImageDelete={onCoverImageDelete}
              onUploadImage={onCoverImageUpload}
            />
          </div>
        </Modal.Body>
      </Modal>
      <div className='p-2 lg:px-10 lg:py-6 pt-6'>
        <div className='grid lg:grid-cols-4 gap-3 lg:gap-12 '>
          <div className='py-5 lg:py-8 px-16 bg-system-secondary-bg rounded-lg mb-3 lg:mb-8'>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <h4 className='font-medium text-2xl text-center text-system-primary-text'>
                  {user && user.FullName}
                </h4>
                <h4 className='font-medium text-xl text-brand-gray-dim text-center'>
                  @{user && user.Username}
                </h4>
                <div className='flex justify-center items-center mt-2 lg:mt-6'>
                  <div className='w-full p-3 rounded-full bg-system-secondary-accent text-center inline-block'>
                    <span className='text-system-primary-accent text-md font-semibold'>
                      {currentUserData.CurrentUser.Role}
                    </span>
                  </div>
                </div>
                <h4 className='font-semibold text-xl text-system-primary-text mt-3 lg:mt-6'>
                  About
                </h4>
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
                    <h4 className='font-medium text-xl text-brand-gray-dim truncate'>
                      {user && user.Email}
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
                    <h4 className='font-medium text-xl text-brand-gray-dim truncate'>
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
            )}
          </div>
          <div className='lg:col-span-3'>
            <Tab
              onTabChange={onTabChange}
              activeTab={activeTab}
              name='MyProfile'
              tabs={tabs(user,getUserDetails)}
              alignment='justify-start'
            />
          </div>
        </div>
      </div>
    </>
  )
}

const AboutTab = ({ user, getUserDetails, isCurrentUser }) => {
  return (
    <>
      <AboutProfile user={user} getUserDetails={getUserDetails} isCurrentUser={isCurrentUser} />
      <div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5'>
        <div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
          <h4 className='font-medium text-lg text-system-primary-text'>Notification</h4>
          <h4 className='font-medium text-lg text-system-primary-accent'>ON</h4>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <h4 className='font-medium text-lg text-system-primary-text'>Language</h4>
          <h4 className='font-medium text-lg text-system-primary-accent'>English</h4>
        </div>
      </div>
      <div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-lg mt-3 lg:mt-5'>
        <div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
          <h4 className='font-medium text-lg text-system-primary-text'>Security</h4>
        </div>
        <div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
          <h4 className='font-medium text-lg text-system-primary-text'>Help & Support</h4>
        </div>
        <div className='flex flex-row items-center justify-between pb-5 mb-5 border-b border-system-file-border'>
          <h4 className='font-medium text-lg text-system-primary-text'>Contact Us</h4>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <h4 className='font-medium text-lg text-system-primary-text'>Privacy Policy</h4>
        </div>
      </div>
    </>
  )
}

export default MyProfile
