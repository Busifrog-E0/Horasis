
const InsightTab = ({ insight, onClick }) => {
    return (
        <div className="mt-2" onClick={() => onClick(insight.DocId)}>
            <div className="h-52 overflow-hidden rounded-lg">
                <img src="https://th.bing.com/th/id/OIP.SgzRjfgw5p1_0XYONbExogHaE8?rs=1&pid=ImgDetMain" className="object-cover h-full w-full" />
            </div>
            <h4 className="font-semibold text-lg text-system-primary-accent mt-4">
                Horasis Lorem ipsum dolor sit ame..
            </h4>
            <h4 className="text-base mt-2 text-system-primary-accent">
                by Frank-Jurgen Richter
            </h4>
            <h4 className="text-xs text-brand-gray-dim mt-2">
                March 15 2023
            </h4>
        </div>
    )
}

export default InsightTab