'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '@/components/button'; // LiftKit default export

type Theme = 'dark' | 'light';

// Reads the current theme from the DOM (set by the boot script in layout.tsx)
function readThemeFromDOM(): Theme {
	if (typeof document === 'undefined') return 'light';
	return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// Applies the theme by toggling the `dark` class on <html>
function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Writes a session cookie (no Max-Age/Expires) so the server can read the preference next time if needed
function setThemeCookie(theme: Theme) {
	document.cookie = `theme=${theme}; path=/; SameSite=Lax`;
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>('light');

	// Sync with whatever the boot script already applied before hydration
	useEffect(() => {
		setTheme(readThemeFromDOM());
	}, []);

	// Toggle theme, update DOM + cookie + local state
	const toggle = useCallback(() => {
		const next: Theme = theme === 'dark' ? 'light' : 'dark';
		applyTheme(next);
		setThemeCookie(next); // session cookie
		setTheme(next);
	}, [theme]);

	return <Button variant="outline" size="md" aria-pressed={theme === 'dark'} label={theme === 'dark' ? 'Dark' : 'Light'} onClick={toggle} title="Toggle color theme" />;
}
