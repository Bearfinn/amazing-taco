import { useEffect, useMemo, useState } from "react";
import { Bonus, Extractor, ExtractorConfig } from "../types";
import { round } from "../utils/format";
import { getExtractorConfig, getBonusConfig } from "../utils/wax";

export const useCalculateShing = () => {
  const [extractorConfig, setExtractorConfig] = useState<ExtractorConfig[]>([]);
  const [bonusConfig, setBonusConfig] = useState<any[]>([]);
  
  useEffect(() => {
    getExtractorConfig().then((response) => {
      setExtractorConfig(response);
    });
    getBonusConfig().then((response) => {
      setBonusConfig(response);
    });
  }, []);

  const getExtractor = (key: number) => {
    if (extractorConfig.length === 0) throw new Error("Extractor not ready")
    return extractorConfig.find((config) => config.template_id === key);
  };

  const getShingPerHour = (value: number) => {
    // console.log(value, (value / 28) * 10.08, round(868.3199999999999), round(2314.08))
    return (value / 28) * 10.08
  };

  const calculateTotalBonus = (bonuses: Bonus[] = []) => {
    let sum = 0;
    if (bonusConfig.length === 0) throw new Error("Bonus config not ready")
    bonuses.forEach((bonus) => {
      const bonusConf = bonusConfig.find(
        (config) => config.template_id === bonus.key
      );
      if (bonusConf) {
        sum += Number(bonusConf.value) * bonus.value;
      }
    });
    const totalBonus = sum
    return Math.min(totalBonus, 10);
  };

  const calculateTotalShingPerHour = (extractors: Extractor[] = []) => {
    let sum = 0;
    extractors.forEach((extractorInfo) => {
      const extractor = getExtractor(extractorInfo.key);
      if (extractor) {
        sum += getShingPerHour(extractor.value) * extractorInfo.value;
      }
    });
    return sum;
  };

  const isReady = useMemo(() => {
    return extractorConfig.length > 0 && bonusConfig.length > 0
  }, [extractorConfig.length, bonusConfig.length])

  return {
    isReady,
    calculateTotalBonus,
    calculateTotalShingPerHour,
    getExtractor,
    getShingPerHour,
  }
}