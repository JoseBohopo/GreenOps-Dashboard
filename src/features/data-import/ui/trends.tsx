'use client'

import React from 'react'
import { UsageDataRow } from '../domain/types'
import { AreaCharts, BarCharts, LinearCharts } from './Charts'

const containerClassNameStyle = 'rounded-md shadow-sm p-5 h-80 bg-gray-50'
const titleClassNameStyle = 'text-lg font-semibold mb-4 text-gray-800'

const Trends: React.FC<{ data: UsageDataRow[] }> = ({ data }) => {
    return (
        <div className='grid mt-24 min-h-screen grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6'>
            <LinearCharts
                width="100%"
                height={280}
                data={data}
                dataKey="pageViews"
                containerClassName={containerClassNameStyle}
                titleClassName={titleClassNameStyle}
                stroke="#e5e7eb"
            />
            <BarCharts
                width="100%"
                height={280}
                data={data}
                dataKey="dataTransfer"
                containerClassName={containerClassNameStyle}
                titleClassName={titleClassNameStyle}
                fill="#f97316"
                stroke="#e5e7eb"
            />
            <AreaCharts
                width="100%"
                height={280}
                data={data}
                dataKey="avgSessionDuration"
                containerClassName={containerClassNameStyle}
                titleClassName={titleClassNameStyle}
                fill="#10b981"
                stroke="#e5e7eb"
            />
        </div>
    )
}

export default Trends
