const { App, client } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');
const fs = require("fs");
const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const itemcache = new Map();
const pokemoncache = new Map();
require('dotenv').config()
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});
app.command('/cheese', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  await say(`:-cheese:`);
});
app.command('/hello', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  await say(`hello! :aga:`);
});
// Listens to incoming messages that contain "hello"
// Listens to incoming messages that contain "hello"
app.message("xo", async ({ message, say }) => {
  await say({
    blocks: [
      {
        type: "image",
        image_url: "https://lucas11.dev/cdn/xo.jpg", // URL pública y accesible
        alt_text: "XO jumpscare"
      }
    ],
    text: "xo jumpscare"
  });
});
app.message("the golden", async ({ message, client }) => {
    await client.files.uploadV2({
      file: fs.createReadStream('./golden.mp4'), // Asegúrate de que exista
      filename: 'golden.mp4',
      title: '',
      channel_id: message.channel
    });
});


app.command('/pokemon-items', async ({ command, ack, say }) => {
  await ack();

  const pokemonitemname = command.text.trim().toLowerCase();

  if (itemcache.has(pokemonitemname)) {
    const cachedData = itemCache.get(pokemonitemname);
    await say(cachedData);
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/item/${pokemonitemname}`);
    if (!response.ok) {
      await say(`No Pokémon item called "${pokemonitemname}" :sad:`);
      return;
    }

    const data = await response.json();

    const id = data.id;
    const name = data.name;
    const sprite = data.sprites.default;
    const cost = data.cost;
    const fling_power = data.fling_power;
    const fling_effect = data.fling_effect ? data.fling_effect.name : 'None';
    const category = data.category.name;

    const effectEntry = data.effect_entries.find(e => e.language.name === 'en');
    const description = effectEntry ? effectEntry.effect : 'No description available :sad:';

    const message = {
      text: `Item: ${name} (ID: ${id})`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Name:* ${name}\n*ID:* ${id}\n*Cost:* ${cost}\n*Fling power:* ${fling_power ?? 'None :sad:'}\n*Fling effect:* ${fling_power ?? 'None :sad:'}\n*Category:* ${category}\n*Description:* ${description}`
          }
        },
        {
          type: "image",
          image_url: sprite,
          alt_text: name
        }
      ]
    };

    itemcache.set(pokemonitemname, message);

    await say(message);
  } catch (error) {
    console.error(error);
    await say("Something went wrong. :ferris-explode:.\nContact Lucas11 about this error.");
  }
});

app.command('/pokemon', async ({ command, ack, say }) => {
  await ack();

  const pokemonname = command.text.trim().toLowerCase();

  if (itemcache.has(pokemonname)) {
    const cachedData = itemCache.get(pokemonname);
    await say(cachedData);
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonname}`);
    if (!response.ok) {
      await say(`No Pokémon called "${pokemonname}" :sad:`);
      return;
    }

    const data = await response.json();

    const id = data.id;
    const name = data.name;
    const sprite = data.sprites.front_default;
    const base_experience = data.base_experience;
    const height = data.height;
    const order = data.order;
    const species = data.species.name;

    const message = {
      text: `Item: ${name} (ID: ${id})`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Name:* ${name}\n*ID:* ${id}\n*Base experience:* ${base_experience}\n*Height:* ${height}\n*Order:* ${order}\n*Species:* ${species}`
          }
        },
        {
          type: "image",
          image_url: sprite,
          alt_text: name
        }
      ]
    };

    itemcache.set(pokemonname, message);

    await say(message);
  } catch (error) {
    console.error(error);
    await say("Something went wrong. :ferris-explode:.\nContact Lucas11 about this error.");
  }
});

app.command('/demonlist-level', async ({ command, ack, say }) => {
  await ack();

  const levelname = command.text.trim();

  try {
    const response = await fetch(`https://pointercrate.com/api/v2/demons?name=${levelname}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await say(`No level in the demon list called "${levelname}" :sad:`);
      return;
    }
    const data = await response.json()
    if (!data.length) {
      await say(`No level in the demon list called "${levelname}" :sad:`);
      return;
    }
    const id = data[0].id;
    const name = data[0].name;
    const requirement = data[0].requirement;
    const video = data[0].video;
    const thumbnail = data[0].thumbnail;
    const verifier = data[0].verifier.name;
    const creator = data[0].publisher.name;
    const levelid = data[0].level_id;


    await say({
      text: `Level: ${name} (ID: ${id})`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Name:* ${name}\n*Demon list ID:* ${id}\n*Requirement:* ${requirement}\n*Video:* ${video}\n*Verifier:* ${verifier}\n*Creator:* ${creator}\n*Level ID:* ${levelid}`
          }
        },
        {
          type: "image",
          image_url: thumbnail,
          alt_text: name
        }
      ]
  });
}
catch (error) {
  console.error(error);
  await say("So that just happen :ferris-explode:.\nContact Lucas11 about this.");
}
});
app.command('/pokemon-berries', async ({   command, ack, say }) => {
  await ack();

  const pokemonberriesname = command.text.trim().toLowerCase();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/berry/${pokemonberriesname}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await say(`No pokemon berry called "${pokemonberriesname}" :sad:`);
      return;
    }

    const data = await response.json();

    const id = data.id;
    const name = data.name;
    const growth_time = data.growth_time;
    const size = data.size;
    const smoothness = data.smoothness;
    const max_harvest = data.max_harvest;

    await say({
      text: `Pokemon: ${name} (ID: ${id})`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Name:* ${name}\n*ID:* ${id}\n*Smoothness:* ${smoothness}\n*Max harvest:* ${max_harvest}\n*Growth time:* ${growth_time}\n*size:* ${size}`
          }
        }
      ]
    });

  } catch (error) {
    console.error(error);
    await say("So that just happen :ferris-explode:.\nContact Lucas11 about this.");
  }
});

app.message("congreration", async ({ message, client }) => {
  await client.files.uploadV2({
    file: fs.createReadStream('./congreration.mp4'), // Asegúrate de que exista
    filename: 'congreration.mp4',
    title: '',
    channel_id: message.channel
  });
});



app.action('button_click', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`Bye <@${body.user.id}>!`);
});
(async () => {
  // Start your app
  await app.start();

  app.logger.info('⚡️ Bolt app is running!');
})();