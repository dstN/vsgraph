'use client';

import { useMemo, useState } from 'react';
import YearRangeFilter from '@app/filters/YearRangeFilter';
import VsLine from '@app/charts/VsLine';
import ThemeToggle from '@app/theme/ThemeToggle';
import { loadSample } from '@/lib/data';

const data = loadSample();
type Row = (typeof data)[number]; // derive the row type from the loaded sample

export default function Page() {
	const years = useMemo(() => data.map((d) => d.year), []);
	const [from, setFrom] = useState(Math.min(...years));
	const [to, setTo] = useState(Math.max(...years));
	const filtered = useMemo(() => data.filter((d) => d.year >= from && d.year <= to), [from, to]);

	return (
		<main className="min-h-dvh px-4 py-10 bg-[radial-gradient(1200px_600px_at_0%_0%,#dbeafe_0%,#ffffff_40%,#ffffff_100%)]">
			<section className="glass-card p-6 md:p-8 max-w-6xl mx-auto">
				{/* Header actions: filter on the left, theme toggle on the right */}
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					<YearRangeFilter
						years={years}
						from={from}
						to={to}
						onChange={({ from: f, to: t }) => {
							setFrom(f);
							setTo(t);
						}}
					/>
					<ThemeToggle />
				</div>

				<h1 className="text-3xl font-semibold tracking-tight mb-2">VSGraph — Trend Overview</h1>
				<p className="text-neutral-600 mb-6">Dummy data with year range filter.</p>

				<VsLine<Row> data={filtered} index="year" categories={['pmkLeft', 'pmkRight']} />
			</section>
		</main>
	);
}
