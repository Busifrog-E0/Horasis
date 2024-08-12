import  attach from  '../../assets/icons/attach.svg'
const ActivityDocuments = ({ documents }) => {
	return (
		<div className='flex flex-col gap-2 my-4'>
			{documents.map((item) => {
				// Regular expression to find the file name ending in .pdf
				const regex = /([^/]+\.pdf)/
				const match = item.match(regex)

				// Extract the file name if there's a match
				const fileName = match ? match[1] : 'No file name found'

				return (
					<div key={item} className='border p-2 rounded-md flex justify-between items-center'>
						<div className='flex flex-row items-start'>
							<img src={attach} alt="" className='h-6' />
							{/* <svg
								xmlns='http://www.w3.org/2000/svg'
								aria-hidden='true'
								className='w-6 h-6 text-brand-gray'
								viewBox='0 -960 960 960'>
								<path
									className='text-brand-gray '
									d='M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z'
								/>
							</svg> */}
							<p className='text-system-primary-accent font-medium'>{fileName}</p>
						</div>
						<a href={item} target='_blank' className='text-system-primary-accent text-sm'>
							View File
						</a>
					</div>
				)
			})}
		</div>
	)
}

export default ActivityDocuments
