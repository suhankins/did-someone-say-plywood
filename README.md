# Did someone say plywood?

Telegram bot made for my parents that notifies you if in any of
the chats you are in, someone sent a message that contains some keywords.

> [!NOTE]
> All messages are in Russian. 

## Setup

This isn't actually a bot, but rather a very Telegram client and a bot.

1.  First you need to get an API_ID and API_HASH. Here are instructions on how to do it.

    https://core.telegram.org/api/obtaining_api_id#obtaining-api-id

    Save api_id and api_hash in your `.env`.

2.  Next, you need to create a bot via @BotFather in Telegram and copy bot token it gives you.
    Save it in `.env` too.

3.  Last thing, come up with some password for your bot. To sign up to updates from your bot,
    you'll need some password. Write it in `.env` and you should be good to go.

In the end, your `.env` should have 4 variables, just like in `.env.sample`.

## Usage

```bash
npm start
```

## License

MIT
