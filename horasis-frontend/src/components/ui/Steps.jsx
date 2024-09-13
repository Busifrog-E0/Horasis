import React, { useState } from "react"

const Steps = ({ pressable = false, steps = [], activeStep = 1, changeStep = (step) => { } }) => {
    return (
        <div className="p-1.5 px-6 lg:px-14 bg-system-secondary-bg rounded-lg shadow-md">
            <div className={`flex items-center justify-center`}>
                {steps.map((step, index) => {
                    return (
                        <React.Fragment key={step.title + index} >
                            <div className={`flex flex-col justify-center items-center gap-1 ${pressable && "cursor-pointer"} `} onClick={() => pressable && changeStep(step.no)}>
                                <p className={`text-center text-xs text-${step.no === activeStep ? "system-primary-accent" : "brand-gray"}`}>Step</p>
                                <div className={`relative inline-flex items-center justify-center w-7 h-7 overflow-hidden rounded-full ${step.no === activeStep ? 'bg-system-primary-accent border border-system-primary-accent' : "bg-system-secondary-bg border border-brand-gray"} `}>
                                    <span className={`text-${step.no === activeStep ? "brand-secondary" : "brand-gray"}`}>{step.no}</span>
                                </div>
                                <p className={`text-center text-sm text-${step.no === activeStep ? "system-primary-accent" : "brand-gray"}`}>{step.title}</p>
                            </div>
                            {index !== steps.length - 1 &&
                                <div className="w-4 lg:w-24 px-1 lg:px-6">
                                    <div className="border-t border-brand-gray"></div>
                                </div>
                            }
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default Steps


// import React, { useState } from "react"

// const Steps = ({ pressable = false, steps = [], activeStep = 1, changeStep = (step) => { } }) => {

//     return (
//         <div className="p-1.5 px-6 lg:px-14 bg-system-secondary-bg rounded-lg shadow-md">

//             <div className={`grid grid-cols-${(steps.length * 2) - 1} items-center gap-3 lg:gap-4`}>

//                 {steps.map((step, index) => {
//                     return (
//                         <React.Fragment key={step.title + index} >
//                             <div className={`flex flex-col justify-center items-center gap-1 ${pressable && "cursor-pointer"} `} onClick={() => pressable && changeStep(step.no)}>
//                                 <p className={`text-center text-xs text-${step.no === activeStep ? "system-primary-accent" : "brand-gray"}`}>Step</p>
//                                 <div className={`relative inline-flex items-center justify-center w-7 h-7 overflow-hidden rounded-full ${step.no === activeStep ? 'bg-system-primary-accent border border-system-primary-accent' : "bg-system-secondary-bg border border-brand-gray"} `}>
//                                     <span className={`text-${step.no === activeStep ? "brand-secondary" : "brand-gray"}`}>{step.no}</span>
//                                 </div>
//                                 <p className={`text-center text-sm text-${step.no === activeStep ? "system-primary-accent" : "brand-gray"}`}>{step.title}</p>
//                             </div>
//                             {index !== steps.length - 1 &&
//                                 <div className="px-0 lg:px-2">
//                                     <div className="border-t border-brand-gray"></div>
//                                 </div>
//                             }
//                         </React.Fragment>
//                     )
//                 })}
//             </div>

//         </div>
//     )
// }

// export default Steps
