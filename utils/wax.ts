import { JsonRpc } from "eosjs";

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