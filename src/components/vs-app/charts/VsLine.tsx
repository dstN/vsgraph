'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, LineChart as RLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type NumLike = number | string;

export type VsLineProps<T extends Record<string, NumLike>> = {
	data: T[];
	index: keyof T; // x-axis key (e.g. "year")
	categories: (keyof T)[]; // series keys (e.g. ["pmkLeft","pmkRight"])
	colors?: string[]; // CSS colors; defaults use Tailwind-ish hues
	autoMinValue?: boolean;
	minValue?: number;
	maxValue?: number;
	valueFormatter?: (v: NumLike) => string;
	height?: number; // parent-controlled height
	showLegend?: boolean;
	showGrid?: boolean;
	showDots?: boolean;
};

const DEFAULT_COLORS = [
	'#3B82F6', // blue-500
	'#10B981', // emerald-500
	'#F59E0B', // amber-500
	'#8B5CF6', // violet-500
	'#06B6D4', // cyan-500
];

export default function VsLine<T extends Record<string, NumLike>>({ data, index, categories, colors = DEFAULT_COLORS, autoMinValue = true, minValue, maxValue, valueFormatter = (v) => new Intl.NumberFormat('de-DE').format(Number(v)), height = 320, showLegend = true, showGrid = true, showDots = false }: VsLineProps<T>) {
	const idx = String(index);
	const series = useMemo(() => categories.map((c, i) => ({ key: String(c), color: colors[i % colors.length] })), [categories, colors]);

	const domain: [number | 'auto', number | 'auto'] = [autoMinValue ? 'auto' : minValue ?? 0, maxValue ?? 'auto'];

	return (
		<div style={{ width: '100%', height }}>
			<ResponsiveContainer>
				<RLineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
					{showGrid && <CartesianGrid strokeDasharray="4 4" />}
					<XAxis dataKey={idx} />
					<YAxis domain={domain} tickFormatter={(v) => valueFormatter(v)} width={56} />
					<Tooltip formatter={(v) => valueFormatter(v as number)} labelFormatter={(l) => String(l)} />
					{showLegend && <Legend />}
					{series.map(({ key, color }) => (
						<Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={showDots} isAnimationActive={false} />
					))}
				</RLineChart>
			</ResponsiveContainer>
		</div>
	);
}
