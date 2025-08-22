'use client';

import { useMemo, useState } from 'react';
import AppShell from '@app/layout/AppShell';
import YearRangeFilter from '@app/filters/YearRangeFilter';
import ThemeToggle from '@app/theme/ThemeToggle';
import VsLine from '@app/charts/VsLine';
import { loadSample } from '@/lib/data';

const data = loadSample();
type Row = (typeof data)[number]; // derive row type

export default function Page() {
	const years = useMemo(() => data.map((d) => d.year), []);
	const [from, setFrom] = useState(Math.min(...years));
	const [to, setTo] = useState(Math.max(...years));
	const filtered = useMemo(() => data.filter((d) => d.year >= from && d.year <= to), [from, to]);

	const actions = (
		<>
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
		</>
	);

	return (
		<AppShell title="VSGraph — Trend Overview" actions={actions}>
			<p className="text-muted-foreground mb-6">Dummy data with year range filter.</p>
			<VsLine<Row> data={filtered} index="year" categories={['pmkLeft', 'pmkRight']} />
		</AppShell>
	);
}
