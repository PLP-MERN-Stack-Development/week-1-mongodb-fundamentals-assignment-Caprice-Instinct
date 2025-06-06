const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const dbName = "plp_bookstore";
const collectionName = "books";

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Find all books in a specific genre
    const genre = "Fiction";
    const genreBooks = await collection.find({ genre: genre }).toArray();
    console.log(`\nBooks in genre "${genre}":`);
    console.table(genreBooks);

    // 2. Find books published after a certain year
    const year = 1950;
    const recentBooks = await collection
      .find({ published_year: { $gt: year } })
      .toArray();
    console.log(`\nBooks published after ${year}:`);
    console.table(recentBooks);

    // 3. Find books by a specific author
    const author = "George Orwell";
    const authorBooks = await collection.find({ author: author }).toArray();
    console.log(`\nBooks by ${author}:`);
    console.table(authorBooks);

    // 4. Update the price of a specific book
    const titleToUpdate = "The Great Gatsby";
    const newPrice = 13.99;
    const updateResult = await collection.updateOne(
      { title: titleToUpdate },
      { $set: { price: newPrice } }
    );
    console.log(
      `\nUpdated "${titleToUpdate}" price:`,
      updateResult.modifiedCount
    );

    // 5. Delete a book by its title
    const titleToDelete = "Animal Farm";
    const deleteResult = await collection.deleteOne({ title: titleToDelete });
    console.log(`\nDeleted "${titleToDelete}":`, deleteResult.deletedCount);

    // Advanced queries
    // 1. To find books that are in stock and published after 2010
    const booksInStockCurrent = await collection
      .find({ in_stock: true, published_year: { $gt: 2010 } })
      .toArray();

    console.log("\nBooks in stock published after 2010:");
    console.table(booksInStockCurrent);

    // 2. Use projection -> return title, author, price
    const booksWithSpecificFields = await collection
      .find({})
      .project({
        title: 1,
        author: 1,
        price: 1,
        _id: 1,
      })
      .toArray();
      console.log("\nBooks with title, author, and price:");
    console.table(booksWithSpecificFields);

    //   3. Implement sorting _. Display books by price in ascending and descending order
    // Ascending order
    const booksSortedByAscendingPriceOrder = await collection.find({}).sort({ price: 1 }).toArray();

    console.log("\nDisplay books by price in ascending and descending order");
    console.table(booksSortedByAscendingPriceOrder)

    // Descending order
    const booksSortedInDescendingOrder = await collection.find({}).sort({ price: -1 }).toArray();

    console.log("\nBooks arranged in descending price order.")
    console.table(booksSortedInDescendingOrder);

    // 4. Limit and skip methods to implement pagination (5 books per page)
    const booksFivePerPage = await collection
      .find({})
      .project({ _id: 0 })
      .skip(5)
      .limit(5)
      .toArray();

    console.log("\n5 books per page from book 6 henceforth.");
    console.table(booksFivePerPage);
  } catch (error) {
    console.error("Error running queries:", error);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

runQueries().catch(console.error);
