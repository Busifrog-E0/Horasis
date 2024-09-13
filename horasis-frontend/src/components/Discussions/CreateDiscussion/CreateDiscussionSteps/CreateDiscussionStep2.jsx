const CreateDiscussionStep2 = ({ selectedImage, onImageSelect, fileFieldName }) => {
	const handleImageChange = (e) => {
		const files = Array.from(e.target.files)
		const notAllow = files.some((file) => file.size > 3000000)
		if (notAllow) {
			toast.open('error', 'Max File Size', 'File size should be less than 3MB')
		} else {
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
							FileFieldName: fileFieldName,
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
	}
	return (
		<div className='flex flex-col gap-4'>
			<div>
				<input
					onChange={handleImageChange}
					type='file'
					id='createDiscussionCoverPhotoPicker'
					className='hidden'></input>
				<div className='flex flex-row items-center justify-center mb-8'>
					{selectedImage ? (
						<label htmlFor='createDiscussionCoverPhotoPicker' className='w-full cursor-pointer'>
							<div className='h-36 w-full bg-system-file-border rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden'>
								<img src={selectedImage} className='object-cover h-full w-full' />
							</div>
						</label>
					) : (
						<label htmlFor='createDiscussionCoverPhotoPicker' className='w-full cursor-pointer'>
							<div className='h-36 w-full bg-system-file-border rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden'>
								<svg
									className='text-brand-secondary h-8 w-8'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 20 20'>
									<path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
								</svg>
							</div>
						</label>
					)}
				</div>
				<h1 className='text-system-primary-text font-medium text-lg'>Upload Cover Photo</h1>
				<p className='text-brand-gray mt-1 mb-2 text-base'>
					The cover photo will be used to communicate the header of your group.
				</p>
				<p className='text-brand-gray mt-2 mb-2 text-base'>
					For best result, upload an image that is 1950px by 450px or larger.
				</p>
			</div>
		</div>
	)
}

export default CreateDiscussionStep2
