export interface Inventory {
  account: string;
  bonus: Bonus[];
  extractors: Extractor[];
  last_claim: number;
  to_claim: number;
}

export interface Bonus {
  key: number;
  value: number;
}

export interface Extractor {
  key: number;
  value: number;
}

export interface ExtractorConfig {
  template_id: number;
  value: number;
  label: string;
}