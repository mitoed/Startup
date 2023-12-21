### Link to [all notes](/notes.md).

# Database Notes

## Storage Services

DO NOT STORE FILES ON THE SERVER. Why?

- Servers can crash/fail. If they do, data will be lost.

- Servers have limited space. If they run out of space, they will shut down.

- You need backup copies somewhere. Servers should not store those.

Here are some examples:

| Service       | Specialty              |
|---------------|------------------------|
| MySQL         | Relational queries     |
| Redis         | Memory cached objects  |
| ElasticSearch | Ranked free text       |
| MongoDB       | JSON objects           |
| DynamoDB      | Key value pairs        |
| Neo4J         | Graph based data       |
| InfluxDB      | Time series data       |

## Using Mongo DB

### Starting Code - Accessing the DB

```
const { MongoClient } = require('mongodb');

const userName = 'holowaychuk';
const password = 'express';
const hostname = 'mongodb.com';

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
```

### Inserting an entry into a collection

```
const collection = client.db('rental').collection('house');

const house = {
  name: 'Beachfront views',
  summary: 'From your bedroom to the beach, no shoes required',
  property_type: 'Condo',
  beds: 1,
};
await collection.insertOne(house);
```

### Using Find

*Using Find() without a filter will return all results.*

```
const cursor = collection.find();
const rentals = await cursor.toArray();
rentals.forEach((i) => console.log(i));
```

*Here's an example with a filter.*

```
const query = { property_type: 'Condo', beds: { $lt: 2 } };

const options = {
  sort: { price: -1 },
  limit: 10,
};

const cursor = collection.find(query, options);
const rentals = await cursor.toArray();
rentals.forEach((i) => console.log(i));
```