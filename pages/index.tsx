import dayjs from "dayjs";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCalculateShing } from "../hooks/useCalculate";
import styles from "../styles/Home.module.css";
import { formatNumber, getExtractorImageUrl } from "../utils/format";
import {
  getTacoInventory
} from "../utils/wax";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<any>(null);
  const [extractorConfig, setExtractorConfig] = useState<any[]>([]);
  const [bonusConfig, setBonusConfig] = useState<any[]>([]);

  const {
    calculateTotalBonus,
    calculateTotalShingPerHour,
    getExtractor,
    getShingPerHour,
  } = useCalculateShing();

  const { query } = useRouter();

  const fetchData = async (_address: any = address) => {
    if (_address) {
      getTacoInventory({ address: _address }).then((response) => {
        setData(response[0]);
      });
    }
  };

  useEffect(() => {
    if (query.address) {
      setAddress(query.address as string);
      fetchData(query.address);
    }
  }, [query?.address]);

  return (
    <div className="container mx-auto">
      <Head>
        <title>Shingulator</title>
        <meta name="description" content="Extractors to the moon!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex gap-4">
          <input
            className="px-2 py-2 border rounded"
            value={address}
            placeholder={`cloud.wam or anchorwallet`}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
            onChange={(e) => setAddress(e.target.value)}
          ></input>
          <button
            className="px-4 py-2 text-yellow-400 bg-blue-900 rounded-md"
            onClick={() => fetchData()}
          >
            Check
          </button>
        </div>

        {data && (
          <div className="my-4">
            <div className="my-4">
              <div className="text-xl">{data?.account}</div>
              <div className="text-sm text-gray-500 hover:underline">
                <a
                  href={`https://shingulator.vercel.app/?address=${address}`}
                >{`https://shingulator.vercel.app/?address=${address}`}</a>
              </div>
            </div>

            <div className="grid grid-cols-2 p-4 border rounded-md">
              <div className="col-span-1">Total SHING per hour</div>
              <div>
                {formatNumber(
                  calculateTotalShingPerHour(data.extractors) *
                    (1 + calculateTotalBonus(data.bonus) / 100)
                )}
              </div>
              <div className="col-span-1">Base SHING per hour</div>
              <div>
                {formatNumber(calculateTotalShingPerHour(data.extractors))}
              </div>
              <div className="col-span-1">Calculate Total Bonus</div>
              <div>+{formatNumber(calculateTotalBonus(data.bonus))}%</div>
              <div className="col-span-1">Last claimed</div>
              <div>
                {dayjs(data?.last_claim * 1000).format("D MMM YYYY HH:mm:ssZ")}
              </div>
              <div className="col-span-1">Pending claim</div>
              <div>{formatNumber(data.to_claim / 1e4)} SHING</div>
            </div>

            <div className="mt-4 text-lg">Extractors</div>
            <div className="flex flex-wrap gap-4">
              {data &&
                data.extractors.map(
                  (extractorInfo: { key: number; value: number }) => {
                    const extractor = getExtractor(extractorInfo.key);
                    return extractor && (
                      <div
                        className="w-48 p-4 rounded-md shadow-md"
                        key={extractorInfo.key}
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="text-lg">{extractor?.label}</div>
                          <div className="text-gray-500">
                            {extractorInfo.value}x
                          </div>
                        </div>
                        <Image
                          src={getExtractorImageUrl(extractor.label)}
                          width="100"
                          height="100"
                          alt="Extractor"
                        />
                        <div className="pt-4">
                          <div>
                            {getShingPerHour(extractor.value) *
                              extractorInfo.value}{" "}
                            SHING
                          </div>
                          <div className="text-sm text-gray-500">
                            {getShingPerHour(extractor.value)} SHING/hr each
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>

            <div className="mt-4 text-lg">Bonuses</div>
            <div className="flex flex-wrap gap-4">
              {data &&
                data.bonus.map((bonusInfo: { key: number; value: number }) => {
                  const extractor = bonusConfig.find(
                    (config) => config.template_id === bonusInfo.key
                  );
                  return (
                    <div
                      className="w-48 p-4 rounded-md shadow-md"
                      key={bonusInfo.key}
                    >
                      <div className="flex items-baseline justify-between">
                        <div className="text-lg">{extractor.label}</div>
                        <div className="text-gray-500">{bonusInfo.value}x</div>
                      </div>
                      <hr />
                      <div className="pt-4">
                        <div>
                          +
                          {Number(Number(extractor.value).toFixed(4)) *
                            bonusInfo.value *
                            100}
                          %
                        </div>
                        <div className="text-sm text-gray-500">
                          {Number(Number(extractor.value).toFixed(4)) * 100}{" "}
                          each
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <span className="mx-1 underline">bananaminion</span>{" "}
          (Anchor Wallet 🥺)
        </a>
      </footer>
    </div>
  );
};

export default Home;
