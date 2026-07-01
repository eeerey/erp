import { db } from "../core/config/knex.js";

export const createCompany = async (nama_perusahaan, trx = db) => {
  const [id] = await trx("companies").insert({
    nama_perusahaan,
  });

  return trx("companies")
    .where({ id })
    .first();
};

export const getCompanyByName = async (nama_perusahaan) => {
  return db("companies")
    .where({ nama_perusahaan })
    .first();
};

export const getCompanyById = async (id) => {
  return db("companies")
    .where({ id })
    .first();
};