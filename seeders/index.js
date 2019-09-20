const { Seeder } = require('mongo-seeding')
const path = require('path')
const _config = require('../config')

const collectionsPath = path.resolve(process.cwd(), __dirname);
console.log('Collections Path: %s', collectionsPath);

const config = {
  database: _config.MONGO_URI
};

const seeder = new Seeder(config);

const collections = seeder.readCollectionsFromPath(collectionsPath, {
  extensions: ['js']
});

async function seedDB() {
  try {
    await seeder.import(collections);
    collections.forEach(({ name }, idx) => console.log(`${idx + 1}. Seeded collection: ${name}`));
    console.log('Seeded all collections.');
  } catch (err) {
    console.error(err);
  }
}

seedDB();
