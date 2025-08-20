'use client';
import { useMemo, useState } from 'react';
import YearRangeFilter from '@/components/filters/YearRangeFilter';
import VsLine from '@/components/charts/VsLine';

type Row = { year: number; pmkLeft: number; pmkRight: number };
const data: Row[] = [
	{ year: 2000, pmkLeft: 120, pmkRight: 340 },
	{ year: 2001, pmkLeft: 150, pmkRight: 360 },
	{ year: 2002, pmkLeft: 130, pmkRight: 390 },
];

export default function Page() {
	const years = useMemo(() => data.map((d) => d.year), []);
	const [from, setFrom] = useState(Math.min(...years));
	const [to, setTo] = useState(Math.max(...years));
	const filtered = useMemo(() => data.filter((d) => d.year >= from && d.year <= to), [from, to]);

	return (
		<main className="min-h-dvh px-4 py-10 bg-[radial-gradient(1200px_600px_at_0%_0%,#dbeafe_0%,#ffffff_40%,#ffffff_100%)]">
			<section className="glass-card p-6 md:p-8 max-w-6xl mx-auto">
				<div className="mb-6">
					<YearRangeFilter
						years={years}
						from={from}
						to={to}
						onChange={({ from: f, to: t }) => {
							setFrom(f);
							setTo(t);
						}}
					/>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight mb-2">VSGraph — Trend Overview</h1>
				<p className="text-neutral-600 mb-6">Dummy data with year range filter.</p>
				<VsLine<Row> data={filtered} index="year" categories={['pmkLeft', 'pmkRight']} />
			</section>
		</main>
	);
}
