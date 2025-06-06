const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const dbName = "plp_bookstore";
const collectionName = "books";

async function indexing() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Index on title field
    await collection.createIndex({ title: 1 });
    console.log("Created index on title");

    // 2. Compound index on author and published_year
    await collection.createIndex({ author: 1, published_year: -1 });
    console.log("Created compound index on author and published_year");

    // 3. explain() method to show performance improvement with indexes
    // single index explanation
    const explainTitleQuery = await collection
      .find({ title: "1984" })
      .explain("executionStats");

    console.log("\nExplain result for title query:");
    console.dir(explainTitleQuery, { depth: null });

    // compound index exxplanation
    const explainCompoundQuery = await collection
      .find({ author: "George Orwell" })
      .sort({ published_year: -1 })
      .explain("executionStats");

    console.log("\nExplain result for compound index query:");
    console.dir(explainCompoundQuery, { depth: null });
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}


indexing();