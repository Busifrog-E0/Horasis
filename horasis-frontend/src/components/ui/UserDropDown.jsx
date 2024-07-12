import React, { useState, useRef, useEffect, useContext } from 'react'
import { deleteItem, getItem, postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

const connnectionStatus = {
  'No Connection': 'Connect',
  Connected: 'Remove Connection',
  'Connection Recieved': 'Connection Received',
  'Connection Requested': 'Cancel Request',
}

const UserDropDown = ({ memberProfile }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const { updateCurrentUser, currentUserData } = useContext(AuthContext)
  const [profile, setProfile] = useState(memberProfile)
  const [loading, setLoading] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }
  const goToProfile = () => {
    navigate(`/ViewProfile/${profile.DocId}`)
  }

  useEffect(() => {
    // getUserDetails()
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getUserDetails = () => {
    setLoading(true)
    getItem(
      `users/${profile.DocId}`,
      (result) => {
        setLoading(false)
        setProfile(result)
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
    setFollowLoading(true)
    postItem(
      'follow',
      {
        FolloweeId: profile.DocId,
      },
      (result) => {
        if (result === true) {
          getUserDetails()
        }
        setFollowLoading(false)
      },
      (err) => {
        console.log(err)
        setFollowLoading(false)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  const unFollowUser = () => {
    setFollowLoading(true)
    deleteItem(
      `users/${currentUserData.CurrentUser.UserId}/follow/${profile.DocId}`,
      (result) => {
        if (result === true) {
          getUserDetails()
        }
        setFollowLoading(false)
      },
      (err) => {
        console.log(err)
        setFollowLoading(false)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      <button
        type='button'
        className='inline-flex justify-center w-full rounded-md border-none bg-system-secondary-bg text-md px-0 font-medium text-brand-gray-dim'
        onClick={() => setIsOpen(!isOpen)}
      >
        •••
      </button>
      {isOpen && (
        <div className='origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-system-secondary-bg ring-1 ring-black ring-opacity-5'>
          <div
            className='py-1'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            <span
              className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
              role='menuitem'
            >
              {profile && profile.ConnectionStatus && connnectionStatus[profile.ConnectionStatus]}
            </span>

            {profile ? (
              <>
                {profile.IsFollowing ? (
                  <>
                    <span
                      className='cursor-pointer flex px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
                      role='menuitem'
                      onClick={() => {
                        unFollowUser()
                      }}
                      disabled={followLoading}
                    >
                      {followLoading ? 'Unfollowing' : 'Unfollow'}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className='cursor-pointer flex px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
                      role='menuitem'
                      onClick={() => {
                        followUser()
                      }}
                      disabled={followLoading}
                    >
                      {followLoading ? 'Following' : 'Follow'}
                    </span>
                  </>
                )}
              </>
            ) : (
              <></>
            )}

            <span
              className='cursor-pointer block px-4 py-2 text-sm text-brand-gray-dim hover:bg-system-primary-bg'
              role='menuitem'
              onClick={() => {
                goToProfile()
              }}
            >
              View Profile
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDropDown
