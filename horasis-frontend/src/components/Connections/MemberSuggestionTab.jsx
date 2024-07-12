import { useState } from 'react'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/icons/avatar.svg'

const MemberSuggestionTab = ({ lastElement, profile }) => {
  const navigate = useNavigate()
  const goToProfile = () => {
    if (profile) {
      navigate(`/viewprofile/${profile.DocId}`)
    }
  }

  return (
    <>
      <div className={`${lastElement === true ? '' : 'border-b border-system-file-border pb-3'}`}>
        <div className='flex items-start gap-4'>
          {profile.ProfilePicture ? (
            <div className='w-11 h-11 rounded-full bg-black'>
              <img
                className='w-11 h-11 rounded-full'
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
          <Button variant='outline'>Follow</Button>
        </div>
      </div>
    </>
  )
}

export default MemberSuggestionTab
