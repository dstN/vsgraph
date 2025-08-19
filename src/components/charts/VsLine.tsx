'use client';

import { ResponsiveContainer, LineChart as RLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

type NumberLike = number | string;

export type VsLineProps<T extends Record<string, NumberLike>> = {
	data: T[];
	index: keyof T; // x-Achse, z. B. "year"
	categories: (keyof T)[]; // y-Serien
	colors?: string[]; // CSS Colors, z. B. "#3B82F6" oder "var(--chart-1)"
	autoMinValue?: boolean;
	minValue?: number;
	maxValue?: number;
	valueFormatter?: (v: NumberLike) => string;
	height?: number;
	showGrid?: boolean;
	showLegend?: boolean;
	showDots?: boolean;
};

const FALLBACK_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

// CSS-Var lesen
function readCssVar(name: string): string | null {
	if (typeof window === 'undefined') return null;
	const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return v || null;
}

// Hook: bevorzugte Farben aus --chart-1..5 (falls gesetzt), sonst Fallback
function usePreferredColors(): string[] {
	return useMemo(() => {
		const vars = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'].map((v) => readCssVar(v)).filter((v): v is string => Boolean(v));
		return vars.length ? vars : FALLBACK_COLORS;
	}, []);
}

// streng getypte Y-Domain
function getYAxisDomain(autoMinValue: boolean, minValue?: number, maxValue?: number): readonly [number | 'auto', number | 'auto'] {
	const minDomain: number | 'auto' = autoMinValue ? 'auto' : minValue ?? 0;
	const maxDomain: number | 'auto' = maxValue ?? 'auto';
	return [minDomain, maxDomain] as const;
}

export function VsLine<T extends Record<string, NumberLike>>({ data, index, categories, colors, autoMinValue = true, minValue, maxValue, valueFormatter = (v) => new Intl.NumberFormat('de-DE').format(Number(v)), height = 320, showGrid = true, showLegend = true, showDots = false }: VsLineProps<T>) {
	// ✅ Hook immer aufrufen
	const themePalette = usePreferredColors();
	// dann entscheiden, welche Palette genutzt wird
	const palette = colors ?? themePalette;

	const series = useMemo(
		() =>
			categories.map((c, i) => ({
				key: String(c),
				color: palette[i % palette.length],
			})),
		[categories, palette]
	);

	const [yMin, yMax] = getYAxisDomain(autoMinValue, minValue, maxValue);
	const axisDomain: [number | 'auto', number | 'auto'] = [yMin, yMax];

	return (
		<div style={{ width: '100%', height }}>
			<ResponsiveContainer>
				<RLineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
					{showGrid && <CartesianGrid strokeDasharray="4 4" />}
					<XAxis dataKey={String(index)} />
					<YAxis domain={axisDomain} tickFormatter={(v: number | string) => valueFormatter(v)} width={56} />
					<Tooltip formatter={(value: number | string) => valueFormatter(value)} labelFormatter={(l: number | string) => String(l)} />
					{showLegend && <Legend />}
					{series.map(({ key, color }) => (
						<Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={showDots} isAnimationActive={false} />
					))}
				</RLineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default VsLine;
