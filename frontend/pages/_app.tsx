import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
            'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          min-height: 100vh;
          background: #f7fafc;
        }

        button {
          font-family: inherit;
        }

        input, textarea {
          font-family: inherit;
        }

        /* Ensure smooth scrolling on mobile */
        html {
          scroll-behavior: smooth;
        }

        /* Prevent iOS zoom on input focus */
        @media (max-width: 640px) {
          input, textarea, select {
            font-size: 16px !important;
          }
        }

        /* Add safe area insets for modern mobile devices */
        @supports (padding: max(0px)) {
          body {
            padding-top: max(0px, env(safe-area-inset-top));
            padding-bottom: max(0px, env(safe-area-inset-bottom));
            padding-left: max(0px, env(safe-area-inset-left));
            padding-right: max(0px, env(safe-area-inset-right));
          }
        }
      `}</style>
    </>
  );
}