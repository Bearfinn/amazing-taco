import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div className="container mx-auto">
        <h1 className="my-4 text-3xl">
          Shingulator{" "}
          <span className="px-2 py-1 text-sm bg-gray-200 rounded-full">
            Beta
          </span>
        </h1>
      </div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
