# AuthAPI
Node API that handles authentication for any app. Features authentication via Social Apps (Facebook, Google, Github) as well as email verification via node mailer.

*Created because I wanted to create a generic authentication solution that I could easily use for any app I create.

## AuthAPI uses the following technologies:

- Engine: Nodejs
- Server:  Express
- ORM: Mongoose
- Database: MongoDb
- REST
- Test Frameworks: Mocha + Chai
- Cache: Redis

## Code Test Coverage:

![Screen Shot 2019-11-04 at 3 13 22 PM](https://user-images.githubusercontent.com/20826907/68165949-b0f8c400-ff15-11e9-99e2-1cadd3f000ad.png)

## Notable Feature (API Response Caching via Redis):

In order to make this applicaiton more scalable, I implemented Redis to maximize API response times:



#### Caching Logic

```javascript
const checkCache = async (req, res, next) => {
  if (config.ENV === 'test') return next();

  const key = buildKey(req);

  try {
    const cachedData = await getAsync(key);

    if (!cachedData) {
      if (config.env === 'development') console.log('NO CACHED DATA');
      return next();
    }

    if (config.env === 'development') console.log('WE GOT CACHED DATA FROM REDIS');

    return res.status(httpStatus.OK).json(JSON.parse(cachedData));
  } catch (err) {
    if (config.env === 'development') console.log(`REDIS ERROR ${err}`);
    return next();
  }
};

const addToCache = (req, expirationTime = 300, value) => {
  if (config.ENV === 'test') return;

  const key = buildKey(req);

  if (config.ENV === 'development') {
    redis.setex(key, 15, JSON.stringify(value));
  } else {
    redis.setex(key, expirationTime, JSON.stringify(value));
  }
};
```

#### Implementation (addToCache):

```javascript
  search: async (req, res, next) => {
    const { val } = req.query;

    try {
      const users = await User.find({
        $or: [
          { email: { $regex: val, $options: 'i' } },
          { firstName: { $regex: val, $options: 'i' } },
          { lastName: { $regex: val, $options: 'i' } },
          { username: { $regex: val, $options: 'i' } },
        ],
      })
        .select('-password')
        .limit(10);

      addToCache(req, 300, users);

      return res.status(httpStatus.OK).json(users);
    } catch (err) {
      return next(err);
    }
  },
```

#### Implementation (checkCache):

```javascript
router.route('/search')
  .get(expressJwt({ secret: config.JWT_SECRET }), checkCache, userController.search);
```

## Benchmark:

Database has 42 users. When calling the endpoint '/api/users/search?val=d':

Without Cache: 37 milliseconds

With Cache: 1 millisecond

* This is a small scale example but as you can see, when applied in a much larger system, caching can dramtically increase the perforamce of the entire system.

