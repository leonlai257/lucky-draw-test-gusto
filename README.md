## Node version
v16.13.2

## Installation

```bash
$ npm install
```

## Setup

1. Create .env file according to .env.bak

2. Run prisma setup procedure
```bash
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
npx prisma db seed
```

3. (Optional) Use prisma built-in database manager
```bash
npx prisma studio
```

4. Running the app
```bash
# development
$ npm run start:debug
```

## Example request body
```JSON
{
    "phone_no": "22222222"
}
```

## Example response
```JSON
{
    "status": "success",
    "result": {
        "status": "success",
        "message": "Congratulation! You got a Buy One Get One Free Coupon!"
    }
}
```