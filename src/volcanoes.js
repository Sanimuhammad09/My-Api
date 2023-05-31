const Redis = require('ioredis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});


app.get('/volcanoes', async (req, res) => {
    const { skip = 0, limit = 20 } = req.query;
    const volcanoes = await getVolcanoesFromCache({ skip, limit });
    res.json(volcanoes);
});
  
app.post('/volcanoes', async (req, res) => {
    const volcano = req.body;
    const createdVolcano = await createVolcanoInCache(volcano);
    res.json(createdVolcano);
});
  
app.put('/volcanoes/:id', async (req, res) => {
    const id = req.params.id;
    const volcanoUpdates = req.body;
    const updatedVolcano = await updateVolcanoInCache(id, volcanoUpdates);
    res.json(updatedVolcano);
});
  
app.delete('/volcanoes/:id', async (req, res) => {
    const id = req.params.id;
    const deletedVolcano = await deleteVolcanoFromCache(id);
    res.json(deletedVolcano);
});

// Implement caching using Redis. We will use Redis to store the volcanoes data 
// so that we can serve it quickly without having to read it from the file every time.

async function getVolcanoesFromCache({ skip = 0, limit = 20 } = {}) {
    const cachedVolcanoes = await redisClient.get('volcanoes');
    if (cachedVolcanoes) {
      const parsedVolcanoes = JSON.parse(cachedVolcanoes);
      return parsedVolcanoes.slice(skip, skip + limit);
    }
  
    // If the data is not in the cache, read it from the file and store it in the cache.
    
}

// implementation of the Redis caching functionality using node-redis:

const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

function getVolcanoesFromCache(pageNumber) {
  return new Promise((resolve, reject) => {
    const startIndex = (pageNumber - 1) * 20;
    const endIndex = startIndex + 19;
    client.lrange('volcanoes', startIndex, endIndex, (err, volcanoes) => {
      if (err) {
        reject(err);
      } else {
        resolve(volcanoes.map(JSON.parse));
      }
    });
  });
}

function cacheVolcanoes() {
  return new Promise((resolve, reject) => {
    fs.readFile('volcanoes.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const volcanoes = JSON.parse(data);
        const multi = client.multi();
        volcanoes.forEach(volcano => {
          multi.rpush('volcanoes', JSON.stringify(volcano));
        });
        multi.exec(err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

async function createVolcanoInCache(volcano) {
  return new Promise((resolve, reject) => {
    client.rpush('volcanoes', JSON.stringify(volcano), (err, length) => {
      if (err) {
        reject(err);
      } else {
        resolve(length);
      }
    });
  });
}

async function updateVolcanoInCache(id, updates) {
  return new Promise((resolve, reject) => {
    client.lset('volcanoes', id, JSON.stringify(updates), (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

async function deleteVolcanoFromCache(id) {
  return new Promise((resolve, reject) => {
    client.lrem('volcanoes', 1, id, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
