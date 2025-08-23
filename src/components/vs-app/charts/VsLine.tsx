'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, LineChart as RLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type NumLike = number | string;

export type VsLineProps<T extends Record<string, NumLike>> = {
	data: T[];
	index: keyof T; // x-axis key (e.g. "year")
	categories: (keyof T)[]; // series keys (e.g. ["pmkLeft","pmkRight"])
	colors?: string[]; // series stroke colors
	autoMinValue?: boolean;
	minValue?: number;
	maxValue?: number;
	valueFormatter?: (v: NumLike) => string;
	height?: number; // parent-controlled height
	showLegend?: boolean;
	showGrid?: boolean;
	showDots?: boolean;
};

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

export default function VsLine<T extends Record<string, NumLike>>({ data, index, categories, colors = DEFAULT_COLORS, autoMinValue = true, minValue, maxValue, valueFormatter = (v) => new Intl.NumberFormat('de-DE').format(Number(v)), height = 320, showLegend = true, showGrid = true, showDots = false }: VsLineProps<T>) {
	const idx = String(index);
	const series = useMemo(() => categories.map((c, i) => ({ key: String(c), color: colors[i % colors.length] })), [categories, colors]);

	const domain: [number | 'auto', number | 'auto'] = [autoMinValue ? 'auto' : minValue ?? 0, maxValue ?? 'auto'];

	return (
		<div style={{ width: '100%', height }}>
			<ResponsiveContainer>
				<RLineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
					{showGrid && <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />}

					<XAxis dataKey={idx} stroke="var(--chart-axis)" tick={{ fill: 'var(--chart-legend-fg)' }} axisLine={{ stroke: 'var(--chart-axis)' }} tickLine={{ stroke: 'var(--chart-axis)' }} />
					<YAxis domain={domain} tickFormatter={(v) => valueFormatter(v)} width={56} stroke="var(--chart-axis)" tick={{ fill: 'var(--chart-legend-fg)' }} axisLine={{ stroke: 'var(--chart-axis)' }} tickLine={{ stroke: 'var(--chart-axis)' }} />

					<Tooltip
						formatter={(v) => valueFormatter(v as number)}
						labelFormatter={(l) => String(l)}
						contentStyle={{
							backgroundColor: 'var(--chart-tooltip-bg)',
							borderColor: 'var(--chart-axis)',
							color: 'var(--chart-tooltip-fg)',
						}}
						labelStyle={{ color: 'var(--chart-tooltip-fg)' }}
						wrapperStyle={{ outline: 'none' }}
					/>

					{showLegend && <Legend wrapperStyle={{ color: 'var(--chart-legend-fg)' }} />}

					{series.map(({ key, color }) => (
						<Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={showDots} isAnimationActive={false} />
					))}
				</RLineChart>
			</ResponsiveContainer>
		</div>
	);
}
