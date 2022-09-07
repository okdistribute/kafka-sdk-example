
This example runs a Kafka consumer with Node.js and inserts data into the Ditto
Big Peer using Online Playground. This is only secure on trusted devices,
because the Online Playground identity uses a static api key that needs to be kept secret.

### Installation

```
git clone https://github.com/getditto-shared/kafka-sdk-example.git
npm i
```

###  Setup

You need to set the following environment variables:

* `TOPIC`: The Kafka Topic
* `ENDPOINT`: The endpoint (e.g., `localhost:9092`),
* `APP_ID`: The Ditto app ID. `APP_ID` is found at https://portal.ditto.live in the section titled "Big Peer Connection Information.
* `TOKEN`: The Ditto Playground Token is similar to an API key. It is found in the section titled "Authentication Mode & Webhook Settings", with the heading "Playground Mode Details"
* `CLIENT_ID`: The Kafka client id, could be anything (e.g., `"my-app"`)

![assets/portal-playground.png](assets/portal-playground.png)

### Usage

Once the environment variables are set, run the script:

```
npm run build
node index.js
```

### Using Ditto

For your data model, you'll want to parse the JSON on line 60 and insert the data into Ditto. You can do this using `JSON.parse`, for example:

```js
try { 
  let row = JSON.parse(message.value?.toString())
  row._id = row.id // Ditto requires a special `_id` value to uniquely identify the document.
  people.upsert(row)
} catch (err) {
  console.error("Failed to parse the row and write it to Ditto")
  console.error(err)
  console.log(message)
  console.log(message.value?.toString())
}
```


