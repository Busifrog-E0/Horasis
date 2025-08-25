export const getCroppedImg = (imageSrc, pixelCrop) => {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	return new Promise((resolve, reject) => {
		const image = new Image()
		image.src = imageSrc
		image.onload = () => {
			const { width, height } = image
			const { x, y, width: cropWidth, height: cropHeight } = pixelCrop

			canvas.width = cropWidth
			canvas.height = cropHeight
			ctx.drawImage(image, x, y, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

			canvas.toBlob((blob) => {
				if (blob) {
					
					resolve(blob)
				} else {
					reject('Failed to crop image')
				}
			}, 'image/jpeg')
		}
		image.onerror = (error) => reject(error)
	})
}
