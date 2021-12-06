import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { rpc } from "../utils/wax";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<any>(null);
  const [extractors, setExtractors] = useState<any[]>([]);

  const getData = async ({ address }: any) => {
    const { rows } = await rpc.get_table_rows({
      json: true,
      code: "g.taco",
      scope: "g.taco",
      table: "claimers",
      // index_position: 1,
      upper_bound: "bananaminiox",
      lower_bound: "banabaminion",
      limit: 10,
    });

    return rows;
  };

  const getExtractorConfig = async () => {
    const { rows } = await rpc.get_table_rows({
      json: true,
      code: "g.taco",
      scope: "g.taco",
      table: "configextr",
      // index_position: 1,
      limit: 10,
    });

    return rows;
  };

  const getExtractor = (key: number) => {
    return extractors.find((extractor) => extractor.template_id === key);
  };

  const calculateShing = (value: number) => {
    return value / 28 * 10.08
  }

  const calculateTotalShingPerHour = (extractors: any[] = []) => {
    let sum = 0
    extractors.forEach((extractorInfo) => {
      const extractor = getExtractor(extractorInfo.key)
      sum += calculateShing(extractor.value) * extractorInfo.value
    })
    return sum
  }

  useEffect(() => {
    getExtractorConfig().then((response) => {
      setExtractors(response);
    });
  }, []);

  const fetchData = async () => {
    if (address) {
      getData(address).then((response) => {
        setData(response[0]);
      });
    }
  };

  // useEffect(() => {
  //   calculateTotalShingPerHour()
  // }, [address]);

  return (
    <div className="container mx-auto">
      <Head>
        <title>Shingilator</title>
        <meta name="description" content="Extractors to the moon!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-xl">
          Shingilator <span className="text-sm">Beta</span>
        </h1>

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></input>

        <div>
          {data?.extractors && calculateTotalShingPerHour(data.extractors)}
        </div>
        <button className="text-gray-500" onClick={() => fetchData()}>Check</button>
        <div>{JSON.stringify(data)}</div>
        <div>{data?.account}</div>
        <div className="flex gap-4">
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
                      <div>{calculateShing(extractor.value) * extractorInfo.value} SHING</div>
                      <div className="text-sm text-gray-500">{calculateShing(extractor.value)} SHING/hr each</div>
                    </div>
                  </div>
                );
              }
            )}
        </div>
        <div>
          {data &&
            data.bonus.map((bonus: { key: number; value: number }) => {
              <div>{bonus.value}</div>;
            })}
        </div>
        <div>Last claimed: {data && data.last_claim}</div>
        <div>To claim: {data && data.to_claim}</div>
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
