import { db } from "../core/config/knex.js";

export const getMasterNamaProduk = async () => {
  return await db("master_nama_produk");
};