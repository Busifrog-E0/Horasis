import { useRef } from 'react'
import Spinner from '../ui/Spinner'
import Button from '../ui/Button'
import avatar from '../../assets/icons/avatar.svg'
import cover from '../../assets/icons/cover.svg'

const PictureUpload = ({
  onImageSelect,
  onImageDelete,
  onUploadImage,
  selectedImage,
  setSelectedImage,
  isBanner = true,
  isUploading = false,
  altTitle,
}) => {
  const fileInputRef = useRef(null)

  // const handleImageChange = (event) => {
  //   const imageFile = event.target.files[0]
  //   if (imageFile !== undefined) {
  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       const arrayBuffer = e.target.result
  //       const fileDataUint8Array = new Uint8Array(e.target.result)
  //       const fileDataByteArray = Array.from(fileDataUint8Array)
  //       console.log(e.target.result)
  //       onImageSelect(
  //         {
  //           FileType: imageFile.type,
  //           FileData: fileDataByteArray,
  //           FileName: imageFile.name,
  //         },
  //         e.target.result
  //       )
  //     }
  //     reader.readAsDataURL(imageFile)
  //   }
  // }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    // URL.createObjectURL(new Blob([new Uint8Array(croppedImage)], { type: 'image/jpeg' })) : null}
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onload = (event) => {
          const arrayBuffer = event.target.result
          const fileDataUint8Array = new Uint8Array(arrayBuffer)
          const fileDataByteArray = Array.from(fileDataUint8Array)

          resolve({
            FileType: file.type,
            FileData: fileDataByteArray,
            FileName: file.name,
            FileFieldName: 'ProfilePicture',
          })
        }

        reader.readAsArrayBuffer(file)
      })
    })

    Promise.all(promises)
      .then((arr) => {
        if (arr.length === 1) {
          onImageSelect(arr[0])
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error)
      })
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className='w-full flex flex-col gap-6'>
      <div className='w-full flex items-center justify-center'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        {selectedImage ? (
          <div className=' w-full flex items-center justify-center'  >
            {isBanner ? (
              <>
                {isUploading ? (
                  <div className='h-[150px] w-[320px] rounded-md flex items-center justify-center border-2 border-dashed'>
                    <Spinner />
                  </div>
                ) : (
                  <img
                    src={selectedImage}
                    alt={altTitle}
                    // className='h-[150px] w-[320px] rounded-md object-cover'
                    className='w-full lg:w-full h-24 lg:h-60 rounded-md object-cover cursor-pointer'
                    onClick={handleClick}
                  />
                )}
              </>
            ) : (
              <>
                {isUploading ? (
                  <div className='h-32 w-32 rounded-full flex items-center justify-center border-2 border-dashed'>
                    <Spinner />
                  </div>
                ) : (
                  <div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center bg-black'>
                    <img
                      src={selectedImage}
                      alt={altTitle}
                      // className='h-32 w-32 rounded-full object-cover'
                      className='w-24 lg:w-60 h-24 lg:h-60 rounded-full object-cover cursor-pointer'
                      onClick={handleClick}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className='w-full flex items-center justify-center'>
            {isBanner ? (
              <div className='w-full lg:w-full h-24 lg:h-60 rounded-md flex items-center justify-center border-2 border-dashed bg-brand-light-gray'>
                {isUploading ? (
                  <Spinner />
                ) : (
                  // <ImagePlus className='text-border h-16 w-16' />
                  <>
                    <img
                      className='w-full h-full object-cover cursor-pointer'
                      src={cover}
                      alt='Rounded avatar'
                      onClick={handleClick}
                    />
                  </>
                )}
              </div>
            ) : (
              <div className='w-24 lg:w-60 h-24 lg:h-60 rounded-full flex items-center justify-center border-2 border-dashed bg-brand-light-gray'>
                {isUploading ? (
                  <Spinner />
                ) : (
                  // <UserPlus2 className='text-border h-12 w-12' />
                  <>
                     <img
                    className='w-full h-full rounded-full cursor-pointer object-cover'
                    src={avatar}
                    alt='Rounded avatar'
                    onClick={handleClick}
                  />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className='p-2 flex items-center justify-between w-full'>
        <p
          className='font-medium text-brand-gray-dim text-lg cursor-pointer'
          onClick={onImageDelete}
        >
          Delete Image
        </p>
        <div className='flex gap-2'>
          <Button onClick={handleClick} size='md' variant='outline' className='text-md'>
            Change Image
          </Button>
          <Button
            onClick={() => {
              onUploadImage()
            }}
            size='md'
            variant='black'
            className='text-md'
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PictureUpload
