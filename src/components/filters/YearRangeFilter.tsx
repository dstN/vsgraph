'use client';

import { useMemo } from 'react';
import Button from '@/components/button';
import { Select, SelectTrigger, SelectMenu, SelectOption } from '@/components/select';

type Props = {
	years: number[];
	from: number;
	to: number;
	onChange: (next: { from: number; to: number }) => void;
};

export default function YearRangeFilter({ years, from, to, onChange }: Props) {
	const items = useMemo(
		() =>
			Array.from(new Set(years))
				.sort((a, b) => a - b)
				.map((y) => ({ label: String(y), value: String(y) })),
		[years]
	);

	const isLocked = items.length <= 1; // nur 1 Jahr ⇒ UI deaktivieren

	return (
		<div className="flex flex-wrap items-end gap-4">
			{/* FROM */}
			<div className="min-w-40">
				<div className="text-sm font-medium mb-1">From year</div>
				<Select options={items} value={String(from)} onChange={(e) => onChange({ from: Math.min(Number(e.target.value), to), to })} name="from-year">
					<SelectTrigger aria-label="From year">
						<Button label={String(from)} variant="outline" size="md" disabled={isLocked} />
					</SelectTrigger>
					<SelectMenu cardProps={{ material: 'glass' }}>
						{items
							.filter((it) => Number(it.value) <= to)
							.map((it) => (
								<SelectOption key={it.value} value={it.value}>
									{it.label}
								</SelectOption>
							))}
					</SelectMenu>
				</Select>
			</div>

			{/* TO */}
			<div className="min-w-40">
				<div className="text-sm font-medium mb-1">To year</div>
				<Select options={items} value={String(to)} onChange={(e) => onChange({ from, to: Math.max(Number(e.target.value), from) })} name="to-year">
					<SelectTrigger aria-label="To year">
						<Button label={String(to)} variant="outline" size="md" disabled={isLocked} />
					</SelectTrigger>
					<SelectMenu cardProps={{ material: 'glass' }}>
						{items
							.filter((it) => Number(it.value) >= from)
							.map((it) => (
								<SelectOption key={it.value} value={it.value}>
									{it.label}
								</SelectOption>
							))}
					</SelectMenu>
				</Select>
			</div>
		</div>
	);
}
