'use client';

import React from 'react';
import Container from '@ui/container'; // LiftKit
import Card from '@ui/card'; // LiftKit (default export in registry)

type AppShellProps = {
	title?: string;
	actions?: React.ReactNode;
	children: React.ReactNode;
};

export default function AppShell({ title = 'VSGraph', actions, children }: AppShellProps) {
	return (
		<div className="min-h-dvh bg-background">
			{/* Header */}
			<header className="sticky top-0 z-20">
				<Container maxWidth="md" className="px-4 py-3">
					{/* Use LiftKit Card instead of custom .glass-card */}
					<Card material="glass">
						<div className="px-4 py-3 md:px-6 md:py-4">
							<div className="flex items-center justify-between gap-4">
								<h1 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h1>
								<div className="flex items-center gap-3">{actions}</div>
							</div>
						</div>
					</Card>
				</Container>
			</header>

			{/* Main content */}
			<main className="py-8">
				<Container maxWidth="md" className="px-4">
					<Card material="glass">
						<div className="p-6 md:p-8">{children}</div>
					</Card>
				</Container>
			</main>
		</div>
	);
}
