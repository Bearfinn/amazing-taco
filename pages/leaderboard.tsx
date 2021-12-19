import { useEffect, useMemo, useState } from "react";
import { useCalculateShing } from "../hooks/useCalculate";
import { formatNumber } from "../utils/format";
import { getBalance, getTacoInventories } from "../utils/wax";

const Leaderboard = () => {
  const { isReady, calculateTotalShingPerHour, calculateTotalBonus } =
    useCalculateShing();
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // For leaderboard only
    const getPlayers = async () => {
      const inventories = await getTacoInventories();
      const totalRatePerHours = inventories.map((inventory) => {
        const totalShingPerHour = calculateTotalShingPerHour(
          inventory.extractors
        );
        const totalBonus = calculateTotalBonus(inventory.bonus);
        // const balance = await getBalance(inventory.account)

        return {
          account: inventory.account,
          value: totalShingPerHour * (1 + totalBonus / 100),
          balance: "Loading...",
        };
      });

      return totalRatePerHours;
    };

    if (isReady) {
      setIsLoading(true);
      getPlayers()
        .then(async (value) => {
          setPlayers(value);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isReady]);

  useEffect(() => {
    const sortAndBalance = async () => {
      players.sort((a, b) => {
        return b.value - a.value;
      });

      const leaderboard = players.slice(0, 20);
      setLeaderboard(leaderboard);
      for (const rate of leaderboard) {
        const balance = await getBalance(rate.account);
        rate.balance = balance;
      }
      setLeaderboard(leaderboard);
    };
    sortAndBalance();
  }, [players]);

  return (
    <div className="container mx-auto">
      <div className="text-xl text-center">Leaderboard</div>
      {isLoading && <div>Loading...</div>}

      {!isLoading && (
        <>
          <div className="grid grid-cols-12 gap-4 my-4 hover:gap-8">
            <div className="col-span-1 text-right">No.</div>
            <div className="col-span-5">Account</div>
            <div className="col-span-3 font-mono text-right">Balance</div>
            <div className="col-span-3 font-mono text-right">SHING/hr</div>
          </div>
          {leaderboard.map(({ account, value, balance }, index) => {
            return (
              <div
                className="grid grid-cols-12 gap-4 my-4 hover:gap-8"
                key={account}
              >
                <div className="col-span-1 text-right">{index + 1}</div>
                <div className="col-span-5">{account}</div>
                <div className="col-span-3 font-mono text-right">{balance}</div>
                <div className="col-span-3 font-mono text-right">
                  {formatNumber(value)} SHING/hr
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
