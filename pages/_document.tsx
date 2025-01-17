import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="CodingQuest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="description"
          content="Improve your problem-solving skills with coding challenges."
        />
        <meta name="theme-color" content="#0fa968" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme');
                    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    
                    if (theme === 'dark' || (!theme && systemPrefersDark)) {
                      document.documentElement.classList.add('dark');
                      document.documentElement.classList.remove('light');
                      document.documentElement.style.colorScheme = 'dark';
                    } else if (theme === 'light') {
                      document.documentElement.classList.add('light');
                      document.documentElement.classList.remove('dark');
                      document.documentElement.style.colorScheme = 'light';
                    } else {
                      // system
                      if (systemPrefersDark) {
                        document.documentElement.classList.add('dark');
                        document.documentElement.classList.remove('light');
                        document.documentElement.style.colorScheme = 'dark';
                      } else {
                        document.documentElement.classList.add('light');
                        document.documentElement.classList.remove('dark');
                        document.documentElement.style.colorScheme = 'light';
                      }
                    }
                  } catch (e) {
                    console.log(e);
                  }
                })();
              `,
        }}
      />
      <body className="bg-neutral-200 dark:bg-neutral-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
