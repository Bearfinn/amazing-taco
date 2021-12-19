import { useEffect, useState } from "react";
import { useCalculateShing } from "../hooks/useCalculate";
import { formatNumber } from "../utils/format";
import { getBalance, getTacoInventories } from "../utils/wax";

const Leaderboard = () => {
  const { isReady, calculateTotalShingPerHour, calculateTotalBonus } =
    useCalculateShing();
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // For leaderboard only
    const leaderboard = async () => {
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
          balance: "0.00 SHING",
        };
      });

      return totalRatePerHours
    };

    if (isReady) {
      setIsLoading(true);
      leaderboard()
        .then(async (value) => {
          value.sort((a, b) => {
            return b.value - a.value;
          });

          const leaderboard = value.slice(0, 20)
          for (const rate of leaderboard) {
            const balance = await getBalance(rate.account)
            rate.balance = balance
          }
          setLeaderboard(leaderboard);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isReady]);

  return (
    <div className="container mx-auto">
      <div className="text-xl text-center">Leaderboard</div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && leaderboard.map(({ account, value, balance }, index) => {
        return (
          <div className="grid grid-cols-12 gap-4" key={account}>
            <div className="col-span-1 text-right">{index + 1}</div>
            <div className="col-span-5">{account}</div>
            <div className="col-span-3 font-mono text-right">{balance}</div>
            <div className="col-span-3 font-mono text-right">{formatNumber(value)} SHING/hr</div>
          </div>
        );
      })}
    </div>
  );
};

export default Leaderboard;
