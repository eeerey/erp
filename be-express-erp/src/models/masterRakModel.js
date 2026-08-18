import { db } from "../core/config/knex.js";

/**
 * Get all rak - DENGAN JOIN GUDANG
 **/
export const getAllRak = async (companyId) => {
  return db("MASTER_RAK as r")
    .leftJoin("MASTER_GUDANG as g", function () {
      this.on("r.KODE_GUDANG", "=", "g.KODE_GUDANG").andOn(
        "r.id_company",
        "=",
        "g.id_company",
      );
    })
    .where("r.id_company", companyId)
    .select("r.*", "g.NAMA_GUDANG", "g.ALAMAT")
    .orderBy("r.KODE_RAK", "asc");
};

/**
 * Get rak by ID - DENGAN JOIN GUDANG
 **/
export const getRakById = async (ID_RAK, companyId) => {
  return db("MASTER_RAK")
    .leftJoin(
      "MASTER_GUDANG",
      "MASTER_RAK.KODE_GUDANG",
      "MASTER_GUDANG.KODE_GUDANG",
    )
    .select("MASTER_RAK.*", "MASTER_GUDANG.NAMA_GUDANG")
    .where({
      "MASTER_RAK.ID_RAK": ID_RAK,
      "MASTER_RAK.id_company": companyId,
    })
    .first();
};

/**
 * Get rak by KODE_RAK
 **/
export const getRakByKode = async (kode, companyId) => {
  return db("MASTER_RAK")
    .where({
      KODE_RAK: kode,
      id_company: companyId,
    })
    .first();
};

/**
 * Get all rak based on a specific gudang
 **/
export const getRakByGudang = async (kodeGudang, companyId) => {
  return db("MASTER_RAK")
    .leftJoin(
      "MASTER_GUDANG",
      "MASTER_RAK.KODE_GUDANG",
      "MASTER_GUDANG.KODE_GUDANG",
    )
    .select("MASTER_RAK.*", "MASTER_GUDANG.NAMA_GUDANG")
    .where({
      "MASTER_RAK.KODE_GUDANG": kodeGudang,
      "MASTER_RAK.id_company": companyId,
    })
    .orderBy("MASTER_RAK.KODE_RAK", "asc");
};

/**
 * Create new rak
 **/
export const createRak = async ({
  company_id,
  KODE_GUDANG,
  KODE_RAK,
  NAMA_RAK,
}) => {
  if (!KODE_GUDANG || !KODE_RAK) {
    throw new Error("KODE_GUDANG dan KODE_RAK wajib diisi");
  }

  const gudangExist = await db("MASTER_GUDANG")
    .where({
      KODE_GUDANG,
      id_company: company_id,
    })
    .first();

  if (!gudangExist) {
    throw new Error("KODE_GUDANG tidak terdaftar");
  }

  const [insertedId] = await db("MASTER_RAK").insert({
    id_company: company_id,
    KODE_GUDANG,
    KODE_RAK,
    NAMA_RAK,
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  });

  // PERBAIKAN DI SINI
  return getRakById(insertedId, company_id);
};

/**
 * Update rak
 **/
export const updateRak = async (
  ID_RAK,
  companyId,
  { KODE_GUDANG, KODE_RAK, NAMA_RAK },
) => {
  const dataToUpdate = {
    updated_at: db.fn.now(),
  };

  if (KODE_GUDANG) dataToUpdate.KODE_GUDANG = KODE_GUDANG;
  if (KODE_RAK) dataToUpdate.KODE_RAK = KODE_RAK;
  if (NAMA_RAK !== undefined) dataToUpdate.NAMA_RAK = NAMA_RAK;

  await db("MASTER_RAK")
    .where({
      ID_RAK,
      id_company: companyId,
    })
    .update(dataToUpdate);

  return getRakById(ID_RAK);
};

/**
 * Delete rak
 **/
export const deleteRak = async (ID_RAK, companyId) => {
  return db("MASTER_RAK")
    .where({
      ID_RAK,
      id_company: companyId,
    })
    .del();
};
