const ActivityDocuments = ({ documents }) => {
	return (
		<div className="flex flex-col gap-2 my-4">
			{documents.map((item) => {
				// Regular expression to find the file name ending in .pdf
				const regex = /([^/]+\.pdf)/
				const match = item.match(regex)

				// Extract the file name if there's a match
				const fileName = match ? match[1] : 'No file name found'

				return (
					<a key={item} className='border p-2 rounded-md flex justify-between items-center' href={item} target="_blank">
						<p className='text-system-primary-accent font-medium'>{fileName}</p>
						<a href={item} target="_blank" className="text-system-primary-accent text-sm">View File</a>
					</a>
				)
			})}
		</div>
	)
}

export default ActivityDocuments

