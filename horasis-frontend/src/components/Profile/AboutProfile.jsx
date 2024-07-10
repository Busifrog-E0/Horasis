import React, { useContext, useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import { getItem, patchItem, postItem } from '../../constants/operations'
import { AuthContext } from '../../utils/AuthProvider'
import Input from '../ui/Input'
import Spinner from '../ui/Spinner'
import Button from '../ui/Button'
import TextArea from '../ui/TextArea'
import { updateValidation } from '../../utils/schema/users/updateValidation'

const AboutProfile = ({ user, getUserDetails, isCurrentUser }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [errorObj, setErrorObj] = useState({})
  const [usernameAvailable, setUsernameAvailable] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const { currentUserData, updateCurrentUser } = useContext(AuthContext)

  const [updateFormValue, setUpdateFormValue] = useState({
    FullName: user?.FullName,
    Username: user?.Username,
    // Email: user?.Email,
    JobTitle: user?.JobTitle,
    CompanyName: user?.CompanyName,
    Country: user?.Country,
    About: user?.About,
  })

  const validateSingle = (value, key, callback) => {
    setUpdateFormValue({ ...updateFormValue, ...value })
    const { error, warning } = updateValidation.extract(key).validate(value[key], {
      abortEarly: false,
      stripUnknown: true,
    })
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
    const { error, warning } = updateValidation.validate(updateFormValue, {
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
    // callback()
  }

  const checkUsernameAvailability = async (value) => {
    postItem(
      'users/edit/checkUsername',
      { Username: value },
      (result) => {
        console.log(result)
        if (result === true) {
          setUsernameAvailable({
            available: result,
            message: 'Username  available',
          })
        } else if (result === false) {
          setUsernameAvailable({ available: result, message: 'Username not available' })
        }
        // setUsernameAvailable(result)
      },
      (err) => console.log(err),
      updateCurrentUser,
      currentUserData
    )
  }

  const updateProfile = () => {
    setIsLoading(true)
    patchItem(
      `users/${currentUserData.CurrentUser.UserId}`,
      updateFormValue,
      (result) => {
        getUserDetails()
        setIsLoading(false)
      },
      (err) => {
        setIsLoading(false)
        console.log(err)
      },
      updateCurrentUser,
      currentUserData
    )
  }

  return (
    <>
      <Modal isOpen={isOpen} maxWidth={`max-w-4xl`}>
        <Modal.Header>
          <p className='text-lg font-medium'>Edit Profile</p>
          <button
            onClick={() => {
              setIsOpen(false)
            }}
          >
            close
          </button>
        </Modal.Header>
        <Modal.Body padding={20}>
          <div className='flex flex-col gap-4'>
            <div>
              <h1 className='text-system-primary-text font-medium text-lg'>Full Name</h1>
              {/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
              <Input
                className='px-4 py-3 rounded-xl'
                width='full'
                name='name'
                placeholder='Ex. Saul Ramirez'
                setValue={(e) => {
                  validateSingle({ ['FullName']: e }, 'FullName')
                }}
                value={updateFormValue.FullName}
                type='text'
              />
              {errorObj['FullName'] != undefined && (
                <p className='text-brand-red m-0'>{errorObj['FullName']}</p>
              )}
            </div>

            <div>
              <h1 className='text-system-primary-text font-medium text-lg'>Username</h1>
              {/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
              <Input
                className='px-4 py-3 rounded-xl'
                width='full'
                name='name'
                placeholder='Ex. Saul Ramirez'
                // setValue={(e) => {
                //   validateSingle({ ['Username']: e }, 'Username')
                // }}
                onChange={(e) => {
                  validateSingle({ ['Username']: e.target.value }, 'Username')
                  if (e.target.value.length > 3) checkUsernameAvailability(e.target.value)
                }}
                value={updateFormValue.Username}
                type='text'
              />
              {errorObj['Username'] != undefined && (
                <p className='text-brand-red m-0'>{errorObj['Username']}</p>
              )}
              {usernameAvailable && (
                <p
                  className={
                    usernameAvailable.available ? 'text-brand-green m-0' : 'text-brand-red m-0'
                  }
                >
                  {usernameAvailable.message} {usernameAvailable.available}
                </p>
              )}
            </div>
            {/* <div>
            <h1 className='text-system-primary-text font-medium text-lg'>
              Email
            </h1>
            <Input
              
              width='full'
              name='email'
              placeholder='Ex. abc@efg.com'
              setValue={(e) => {
                validateSingle({ ['Email']: e }, 'Email')
              }}
              value={updateFormValue.Email}
              type='text'
            />
            {errorObj['Email'] != undefined && (
              <p className='text-brand-red m-0'>{errorObj['Email']}</p>
            )}
          </div> */}
            <div>
              <h1 className='text-system-primary-text font-medium text-lg'>Job Title</h1>
              {/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
              <Input
                className='px-4 py-3 rounded-xl'
                width='full'
                name='jobTitle'
                placeholder='Ex. Consultant'
                setValue={(e) => {
                  validateSingle({ ['JobTitle']: e }, 'JobTitle')
                }}
                value={updateFormValue.JobTitle}
                type='text'
              />
              {errorObj['JobTitle'] != undefined && (
                <p className='text-brand-red m-0'>{errorObj['JobTitle']}</p>
              )}
            </div>
            <div>
              <h1 className='text-system-primary-text font-medium text-lg'>Company Name</h1>
              {/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
              <Input
                className='px-4 py-3 rounded-xl'
                width='full'
                name='companyName'
                placeholder='Ex. xyz Ltd.'
                setValue={(e) => {
                  validateSingle({ ['CompanyName']: e }, 'CompanyName')
                }}
                value={updateFormValue.CompanyName}
                type='text'
              />
              {errorObj['CompanyName'] != undefined && (
                <p className='text-brand-red m-0'>{errorObj['CompanyName']}</p>
              )}
            </div>
            <div>
              <h1 className='text-system-primary-text font-medium text-lg'>Country</h1>
              {/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
              <Input
                className='px-4 py-3 rounded-xl'
                width='full'
                name='country'
                placeholder='Ex. Australia'
                setValue={(e) => {
                  validateSingle({ ['Country']: e }, 'Country')
                }}
                value={updateFormValue.Country}
                type='text'
              />
              {errorObj['Country'] != undefined && (
                <p className='text-brand-red m-0'>{errorObj['Country']}</p>
              )}
            </div>
            <div>
              <h1 className='text-system-primary-text font-medium text-lg'>Bio</h1>
              {/* {errorObj[field] != undefined ? { borderColor: 'red' } : {}} */}
              <TextArea
                name='about'
                setValue={(e) => {
                  validateSingle({ ['About']: e }, 'About')
                }}
                value={updateFormValue.About}
                rows={6}
                placeholder='Enter something about you....'
                width='full'
                variant='primary_outlined'
              />
              {errorObj['About'] != undefined && (
                <p className='text-brand-red m-0'>{errorObj['About']}</p>
              )}
            </div>
          </div>
          <div className='mt-4 flex items-end justify-end'>
            <Button
              onClick={() => {
                validate(updateProfile)
              }}
              variant='black'
              // width='full'
            >
              Submit
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className='bg-system-secondary-bg p-4 lg:px-10 lg:py-8 rounded-b-lg '>
        {isCurrentUser ? (
          <div className='flex w-full items-start justify-end text-system-primary-text'>
            <svg
              className='w-6 h-6 cursor-pointer'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'
              onClick={() => {
                setIsOpen(true)
              }}
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
        ) : (
          <></>
        )}

        <div className='grid lg:grid-cols-4 gap-y-6'>
          <div>
            <h4 className='font-medium text-brand-gray-dim'>Full Name</h4>
          </div>
          <div className='lg:col-span-3'>
            <h4 className='font-medium text-system-primary-text'>{user && user.FullName}</h4>
          </div>
          <div>
            <h4 className='font-medium text-brand-gray-dim'>User Name</h4>
          </div>
          <div className='lg:col-span-3'>
            <h4 className='font-medium text-system-primary-text'>{user && user.Username}</h4>
          </div>
          <div>
            <h4 className='font-medium text-brand-gray-dim'>Email</h4>
          </div>
          <div className='lg:col-span-3'>
            <h4 className='font-medium text-system-primary-text'>{user && user.Email}</h4>
          </div>
          <div>
            <h4 className='font-medium text-brand-gray-dim'>Job Title</h4>
          </div>
          <div className='lg:col-span-3'>
            <h4 className='font-medium text-system-primary-text'>{user && user.JobTitle}</h4>
          </div>
          <div>
            <h4 className='font-medium text-brand-gray-dim'>Company Name</h4>
          </div>
          <div className='lg:col-span-3'>
            <h4 className='font-medium text-system-primary-text'>{user && user.CompanyName}</h4>
          </div>
          <div>
            <h4 className='font-medium text-brand-gray-dim'>Country</h4>
          </div>
          <div className='lg:col-span-3'>
            <h4 className='font-medium text-system-primary-text'>{user && user.Country}</h4>
          </div>
          <div>
            <h4 className='font-medium text-brand-gray-dim'>Bio</h4>
          </div>
          <div className='lg:col-span-3'>
            <h4 className='font-medium text-system-primary-text'>{user && user.About}</h4>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutProfile
