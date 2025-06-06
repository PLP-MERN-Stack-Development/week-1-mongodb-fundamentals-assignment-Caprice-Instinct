const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const dbName = "plp_bookstore";
const collectionName = "books";

async function runAggregates() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Calculate average price of books by genre
    const averagePriceByGenre = await collection
      .aggregate([
        {
          $group: {
            _id: "$genre",
            averagePrice: { $avg: "$price" },
          },
        },
      ])
      .toArray();
    console.log("Average price of books by genre:");
    console.table(averagePriceByGenre);

    // 2. Find the author with most books
    const authorWithMostBooks = await collection
      .aggregate([
        {
          $group: {
            _id: "$author",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ])
      .toArray();
    console.log("Author with most books:");
    console.table(authorWithMostBooks);

    // 3. Pipeline to group books by publication decade and count

    const booksByPublicationDecade = await collection
      .aggregate([
        {
          $group: {
            _id: {
              $concat: [
                {
                  $toString: {
                    $multiply: [
                      { $floor: { $divide: ["$published_year", 10] } },
                      10,
                    ],
                  },
                },
                "s",
              ],
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();
    console.log("Books grouped by publication decade:");
    console.table(booksByPublicationDecade);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

runAggregates().catch(console.error);
