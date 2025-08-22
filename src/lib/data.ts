import raw from '@/data/samples/pmk.json';

export type PmkRowRaw = { year: number; pmk_left: number; pmk_right: number };
export type ChartRow = { year: number; pmkLeft: number; pmkRight: number };

export function loadSample(): ChartRow[] {
	const arr = raw as PmkRowRaw[];
	return arr.map((r) => ({
		year: r.year,
		pmkLeft: r.pmk_left,
		pmkRight: r.pmk_right,
	}));
}
