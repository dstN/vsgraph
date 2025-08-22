'use client';

import React from 'react';

type AppShellProps = {
	title?: string;
	actions?: React.ReactNode; // YearRangeFilter, Buttons, etc.
	children: React.ReactNode;
};

export default function AppShell({ title = 'VSGraph', actions, children }: AppShellProps) {
	return (
		<div className="min-h-dvh bg-[radial-gradient(1200px_600px_at_0%_0%,#dbeafe_0%,#ffffff_40%,#ffffff_100%)]">
			{/* Header */}
			<header className="sticky top-0 z-10">
				<div className="glass-card max-w-6xl mx-auto mt-4 px-6 py-4 md:px-8 md:py-5">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<h1 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h1>
						<div className="flex items-center gap-3">{actions}</div>
					</div>
				</div>
			</header>

			{/* Content */}
			<main className="px-4 py-8">
				<section className="glass-card p-6 md:p-8 max-w-6xl mx-auto">{children}</section>
			</main>
		</div>
	);
}
