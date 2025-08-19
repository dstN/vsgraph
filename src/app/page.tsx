// app/page.tsx
'use client';
import VsLine from '@/components/charts/VsLine';
type Row = { year: number; pmkLeft: number; pmkRight: number };
const data: Row[] = [
	{ year: 2000, pmkLeft: 120, pmkRight: 340 },
	{ year: 2001, pmkLeft: 150, pmkRight: 360 },
	{ year: 2002, pmkLeft: 130, pmkRight: 390 },
];
export default function Page() {
	return (
		<main className="min-h-dvh p-6 bg-[radial-gradient(1200px_600px_at_0%_0%,#dbeafe_0%,#ffffff_40%,#ffffff_100%)]">
			<section className="glass-card p-6 max-w-5xl mx-auto">
				<h1 className="text-2xl font-semibold mb-2">VSGraph — Trend Overview</h1>
				<p className="text-neutral-600 mb-6">Dummy data.</p>
				<VsLine<Row> data={data} index="year" categories={['pmkLeft', 'pmkRight']} />
			</section>
		</main>
	);
}
