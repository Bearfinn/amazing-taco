import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col justify-between h-screen">
      <div>
        <div className="container flex items-baseline justify-between w-full mx-auto">
          <h1 className="my-4 text-3xl">
            Shingulator{" "}
            <span className="px-2 py-1 text-sm bg-gray-200 rounded-full">
              Beta
            </span>
          </h1>
          <div className="flex gap-4">
            <Link href="/" passHref>
              <span className="cursor-pointer hover:text-blue-900">Home</span>
            </Link>
            <Link href="/leaderboard" passHref>
              <span className="cursor-pointer hover:text-blue-900">
                Leaderboard
              </span>
            </Link>
          </div>
        </div>
        <Component {...pageProps} />
      </div>

      <footer className="container mx-auto mb-4">
        <hr className="my-4" />
        <a
          className="hover:text-blue-900"
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <span className="mx-1 underline">bananaminion</span>{" "}
          (Anchor Wallet 🥺 )
        </a>
      </footer>
    </div>
  );
}

export default MyApp;
