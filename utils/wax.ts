import { JsonRpc } from "eosjs";
import { Inventory } from "../types";

const rpc = new JsonRpc("https://wax.pink.gg");

const getTacoInventory = async ({ address }: any) => {
  const { rows } = await rpc.get_table_rows({
    json: true,
    code: "g.taco",
    scope: "g.taco",
    table: "claimers",
    // index_position: 1,
    upper_bound: address,
    lower_bound: address,
    limit: 10,
  });

  return rows;
};

export const getTacoInventories = async (): Promise<Inventory[]> => {
  let inventories: any[] = [];
  let has_more = true
  let next_key_string: string = ""
  do {
    const response = await rpc.get_table_rows({
      json: true,
      code: "g.taco",
      scope: "g.taco",
      table: "claimers",
      lower_bound: next_key_string,
      limit: 500,
    });
  
    const { rows, more, next_key } = response;
    has_more = more
    next_key_string = next_key
    inventories = inventories.concat(rows)
  } while (has_more)

  return inventories;
};

export const getBalance = async (account: string) => {
  const rows = await rpc.get_currency_balance("t.taco", account, "SHING")
  return rows[0]
}

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

const getBonusConfig = async () => {
  const { rows } = await rpc.get_table_rows({
    json: true,
    code: "g.taco",
    scope: "g.taco",
    table: "configbonus",
    // index_position: 1,
    limit: 20,
  });

  return rows;
};

export { rpc, getTacoInventory, getBonusConfig, getExtractorConfig };
