import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { config } from "process";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { formatNumber, round } from "../utils/format";
import {
  getBonusConfig,
  getExtractorConfig,
  getTacoInventory,
  rpc,
} from "../utils/wax";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<any>(null);
  const [extractorConfig, setExtractorConfig] = useState<any[]>([]);
  const [bonusConfig, setBonusConfig] = useState<any[]>([]);

  const getExtractor = (key: number) => {
    return extractorConfig.find((config) => config.template_id === key);
  };

  const getShingPerHour = (value: number) => {
    return round((value / 28) * 10.08)
  };

  const calculateTotalBonus = (bonuses: any[] = []) => {
    let sum = 0;
    bonuses.forEach((bonus) => {
      const extractor = bonusConfig.find(
        (config) => config.template_id === bonus.key
      );
      sum += Number(extractor.value) * bonus.value;
    });
    const totalBonus = Math.round(sum * 100 * 1e4) / 1e4;
    return Math.min(totalBonus, 10);
  };

  const calculateTotalShingPerHour = (extractors: any[] = []) => {
    let sum = 0;
    extractors.forEach((extractorInfo) => {
      const extractor = getExtractor(extractorInfo.key);
      sum += getShingPerHour(extractor.value) * extractorInfo.value;
    });
    return Number(sum.toFixed(4));
  };

  useEffect(() => {
    getExtractorConfig().then((response) => {
      setExtractorConfig(response);
    });
    getBonusConfig().then((response) => {
      setBonusConfig(response);
    });
  }, []);

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
        <h1 className="text-3xl my-4">
          Shingulator{" "}
          <span className="text-sm bg-gray-200 rounded-full px-2 py-1">
            Beta
          </span>
        </h1>

        <div className="flex gap-4">
          <input
            className="border px-2 py-2 rounded"
            value={address}
            placeholder={`cloud.wam or anchorwallet`}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
            onChange={(e) => setAddress(e.target.value)}
          ></input>
          <button
            className="bg-blue-900 text-yellow-400 px-4 py-2 rounded-md"
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

            <div className="grid grid-cols-2">
              <div className="col-span-1">Total SHING per hour</div>
              <div>
                {calculateTotalShingPerHour(data.extractors) *
                  (1 + calculateTotalBonus(data.bonus) / 100)}
              </div>
              <div className="col-span-1">Base SHING per hour</div>
              <div>{calculateTotalShingPerHour(data.extractors)}</div>
              <div className="col-span-1">Calculate Total Bonus</div>
              <div>+{calculateTotalBonus(data.bonus)}%</div>
              <div className="col-span-1">Last claimed</div>
              <div>{new Date(data?.last_claim * 1000).toString()}</div>
              <div className="col-span-1">Pending claim</div>
              <div>{data.to_claim}</div>
            </div>

            <div className="mt-4 text-lg">Extractors</div>
            <div className="flex flex-wrap gap-4">
              {data &&
                data.extractors.map(
                  (extractorInfo: { key: number; value: number }) => {
                    const extractor = getExtractor(extractorInfo.key);
                    return (
                      <div
                        className="shadow-md p-4 rounded-md w-48"
                        key={extractorInfo.key}
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="text-lg">{extractor.label}</div>
                          <div className="text-gray-500">
                            {extractorInfo.value}x
                          </div>
                        </div>
                        <hr />
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
                      className="shadow-md p-4 rounded-md w-48"
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
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by bananaminion
        </a>
      </footer>
    </div>
  );
};

export default Home;
