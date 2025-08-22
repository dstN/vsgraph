import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
	title: 'VSGraph',
	description: 'Interactive dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		// React should not control dynamic classes on <html> (theme toggles it)
		<html lang="en" suppressHydrationWarning>
			<body className={`${GeistSans.className} antialiased`}>
				{/* Initialize theme before hydration; also set a session cookie */}
				<Script id="theme-boot" strategy="beforeInteractive">
					{`(function(){
            try{
              // read cookie
              var m = document.cookie.match(/(?:^|; )theme=([^;]+)/);
              var raw = m ? decodeURIComponent(m[1]) : "";
              var has = raw === "dark" || raw === "light";

              // prefer cookie, otherwise OS preference
              var isDark = has ? (raw === "dark")
                : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

              // apply class
              document.documentElement.classList.toggle("dark", !!isDark);

              // write session cookie if not set yet
              if(!has){
                document.cookie = "theme=" + (isDark ? "dark" : "light") + "; path=/; SameSite=Lax";
              }

              // react to OS changes within this session
              try{
                if(window.matchMedia){
                  var mq = window.matchMedia("(prefers-color-scheme: dark)");
                  mq.addEventListener("change", function(e){
                    var nowDark = !!e.matches;
                    document.documentElement.classList.toggle("dark", nowDark);
                    document.cookie = "theme=" + (nowDark ? "dark" : "light") + "; path=/; SameSite=Lax";
                  });
                }
              }catch(_e){}
            }catch(e){}
          })();`}
				</Script>
				{children}
			</body>
		</html>
	);
}
