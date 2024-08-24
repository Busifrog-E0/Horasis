import { useState } from "react"
import ArticleTab from "../../Articles/ArticleTab"

const ArticleAnalyticsSection = () => {

    return (<>
        <div className="bg-system-secondary-bg rounded-lg p-3 px-6 pr-20">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                    {/* icon goes here */}
                    <h4 className="font-semibold text-xl text-system-primary-text">Articles</h4>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                    <div className="flex-1 rounded-md cursor-pointer p-1 px-4 border border-system-file-border flex items-center justify-between bg-system-secondary-bg">
                        <h4 className="text-lg text-brand-gray-dim ">Dec 19 - Jan 19</h4>

                    </div>
                </div>
            </div>
            <div className="mt-8 mb-6">
                <div className="grid lg:grid-cols-3 gap-16">

                    <div className={`rounded-lg cursor-pointer`}>
                        <div className="flex items-center gap-1 mb-2">
                            <h4 className="text-base text-brand-gray-dim">{'No. of Articles'}</h4>
                            {/* info icon goes here */}
                        </div>
                        <p className={`font-semibold text-2xl text-system-primary-text`}>
                            34 <sup className="text-xs text-brand-green">+10.8%</sup>
                        </p>
                    </div>
                    <div className={`rounded-lg cursor-pointer`}>
                        <div className="flex items-center gap-1 mb-2">
                            <h4 className="text-base text-brand-gray-dim">{'No. of Engagements'}</h4>
                            {/* info icon goes here */}
                        </div>
                        <p className={`font-semibold text-2xl text-system-primary-text`}>
                            2654 <sup className="text-xs text-brand-green">+25%</sup>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-system-secondary-bg rounded-lg p-3 px-6 pr-40 mt-6">
            <h4 className="font-semibold text-xl text-system-primary-text mb-1 mt-3">Top Articles</h4>
            <div className="flex items-center gap-1 mb-2">
                <h4 className="text-xs text-brand-gray-dim">{'Most Engagements'}</h4>
                {/* info icon goes here */}
            </div>
            <div className="my-6">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* <ArticleTab />
                    <ArticleTab />
                    <ArticleTab /> */}
                </div>
            </div>
        </div>
    </>)
}


export default ArticleAnalyticsSection
