import knexInit from 'knex';
import knexConfig from './knexfile.js';

// Menggunakan konfigurasi environment 'development'
const config = knexConfig.development || knexConfig;
const knex = knexInit(config);

async function compareTables() {
  try {
    // 1. Ambil daftar migrasi yang sudah dieksekusi
    const executed = await knex('knex_migrations').select('name');
    const migratedList = executed.map(m => m.name);

    // 2. Ambil semua tabel yang ada di database
    const [tables] = await knex.raw('SHOW TABLES');
    const dbTables = tables.map(t => Object.values(t)[0]);

    console.log('=== TOTAL TABEL DI DATABASE ===:', dbTables.length);
    console.log('=== TOTAL MIGRASI TERDIAGNOSA ===:', migratedList.length);
    console.log('\n--- TABEL DI DB YANG TIDAK ADA DI RECORD MIGRASI ---');
    
    const unmigrated = dbTables.filter(t => 
      !t.startsWith('knex_migrations') && 
      !migratedList.some(m => m.toLowerCase().includes(t.toLowerCase()))
    );

    console.log(unmigrated.length ? unmigrated : 'Semua tabel tercatat di migrasi!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await knex.destroy();
  }
}

compareTables();