'use client';

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ChartData } from 'recharts/types/state/chartDataSlice';

interface ChartsProps {
    width?: number | `${number}%`;
    height?: number | `${number}%`;
    data: ChartData;
    dataKey: string;
    containerClassName?: string;
    titleClassName?: string;
    fill?: string;
    stroke?: string;
}

export const LinearCharts = ({
    data,
    dataKey,
    containerClassName,
    titleClassName,
    width,
    height,
    fill,
    stroke,
}: ChartsProps) => (
    <div className={containerClassName || ''}>
        <h3 className={titleClassName || ''}>Page Views Over Time</h3>
        <LineChart responsive data={data} width={width} height={height}>
            <CartesianGrid strokeDasharray="3 3" stroke={stroke} />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={fill || '#3b82f6'} strokeWidth={2} dot={false} />
        </LineChart>
    </div>
);

export const BarCharts = ({
    data,
    dataKey,
    containerClassName,
    titleClassName,
    width,
    height,
    fill,
    stroke,
}: ChartsProps) => (
    <div className={containerClassName || ''}>
        <h3 className={titleClassName || ''}>Data Transfer Over Time</h3>
        <BarChart responsive data={data} width={width} height={height}>
            <CartesianGrid strokeDasharray="3 3" stroke={stroke} />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey={dataKey} fill={fill} />
        </BarChart>
    </div>
);

export const AreaCharts = ({
    data,
    dataKey,
    containerClassName,
    titleClassName,
    width,
    height,
    fill,
    stroke,
}: ChartsProps) => (
    <div className={containerClassName || ''}>
        <h3 className={titleClassName || ''}>Avg Session Duration Over Time</h3>
        <AreaChart responsive data={data} width={width} height={height}>
            <CartesianGrid strokeDasharray="3 3" stroke={stroke} />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Area type="monotone" dataKey={dataKey} fill={fill} stroke="#059669" />
        </AreaChart>
    </div>
);