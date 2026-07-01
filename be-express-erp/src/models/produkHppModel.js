import { db } from "../core/config/knex.js";

export const getProdukHpp = async () => {
  return db("hpp as h")
    .select(
      "m.id",
      "m.nama_produk_jadi",
      "h.hpp_per_pcs"
    )
    .join(
      "master_nama_produk as m",
      "h.produk_id",
      "m.id"
    )
    .orderBy(
      "m.nama_produk_jadi",
      "asc"
    );
};