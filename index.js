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

app.command('/aredl-level', async ({ command, ack, say }) => {
  await ack();

  const levelid = command.text.trim();

  try {
    const response = await fetch(`https://api.aredl.net/v2/api/aredl/levels/${levelid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await say(`No level in the AREDL with the ID "${levelid}" :sad:`);
      return;
    }
    const data = await response.json()
    if (!data.length) {
      await say(`No level in the AREDL with the ID "${levelid}" :sad:`);
      return;
    }
    const name = data.name;
    const requirement = data.requirement;
    const video = data.verifications.video_url;
    const position = data.position;
    const verifier = data.verifications.submitted_by.global_name;
    const creator = data.publisher.global_name;
    const created = data.verifications.created_at;
    const mobile = data.verifications.mobile;
    const points = data.points;
    const twoplayer = data.two_player;
    const description = data.description;
    const song = data.song;
    const enjoyment = data.edel_enjoyment;
    await say({
      text: `Level: ${name} (Position:* ${position})`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Name:* ${name}\n*Description:* ${description}\n*Position:* ${position}\n*Song:* ${song}\n*Requirement:* ${requirement}\n*Enjoyment Rating:* ${enjoyment}\n*Video:* ${video}\n*Verifier:* ${verifier}\n*Creator:* ${creator}\n*Level ID:* ${levelid}\n*Created In:* ${created}\n*Verified in Mobile:* ${mobile}\n*Points:* ${points}\n*Is 2 player:* ${twoplayer}`
          }
        }
      ]
  });
}
catch (error) {
  console.error(error);
  await say("So that just happen :ferris-explode:.\nContact Lucas11 about this.");
}
});

app.command('/aredl-player', async ({ command, ack, say }) => {
  await ack();

  const player = command.text.trim();

  try {
    const leaderboardresponse = await fetch(`https://api.aredl.net/v2/api/aredl/leaderboard/${player}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const userresponse = await fetch(`https://api.aredl.net/v2/api/users/${player}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });


    if (!leaderboardresponse.ok) {
      await say(`No Player in the AREDL with the name "${player}" :sad:`);
      return;
    }
    const leaderboarddata = await leaderboardresponse.json()
    if (!leaderboarddata.length) {
      await say(`No Player in the AREDL with the name "${player}" :sad:`);
      return;
    }

    if (!userresponse.ok) {
      await say(`No Player in the AREDL with the name "${player}" :sad:`);
      return;
    }
    const userdata = await userresponse.json()
    if (!userdata.length) {
      await say(`No Player in the AREDL with the name "${player}" :sad:`);
      return;
    }
    const name = leaderboarddata.data[0].user.global_name;
    const rank = leaderboarddata.data[0].rank;
    const discord_id = leaderboarddata.data[0].user.discord_id;
    const hardest = leaderboarddata.data[0].hardest.name;
    const extremes = leaderboarddata.data[0].extremes;
    const total_points = leaderboarddata.data[0].total_points;
    const created_at = userdata.data[0].created_at;
    const description = userdata.data[0].description;
    const banned = userdata.data[0].ban_level === 1 ? "Yes" : "No";

    await say({
      text: `Level: ${name})`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Name:* ${name}\n*Rank:* ${rank}\n*Discord ID:* ${discord_id}\n*Hardest:* ${hardest}\n*Extremes:* ${extremes}\n*Total points:* ${total_points}\n*Created at:* ${created_at}\n*Description:* ${description}\n*Is banned?:* ${banned}`
          }
        }
      ]
  });
}
catch (error) {
  console.error(error);
  await say("So that just happen :ferris-explode:.\nContact Lucas11 about this.");
}
});

app.command('/demonlist-player', async ({ command, ack, say }) => {
  await ack();

  const player = command.text.trim();

  try {
    const response = await fetch(`https://pointercrate.com/api/v1/players?name_contains=${player}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await say(`No player in the demon list called "${player}" :sad:`);
      return;
    }
    const data = await response.json()
    if (!data.length) {
      await say(`No player in the demon list called "${player}" :sad:`);
      return;
    }
    const rank = data[0].rank;
    const blocks = data.slice(0, 5).map((p) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${p.name}* (Rank: ${p.rank})`
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "See details"
        },
        value: String(p.id),
        action_id: "select_demon_player"
      }
    }));
    await say({
      text: `Select the player called "${player}"`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `Players founded: "${player}"`
          }
        },
        ...blocks
      ]
    });
}



catch (error) {
  console.error(error);
  await say("So that just happen :ferris-explode:.\nContact Lucas11 about this.");
}
});



app.action("select_demon_player", async ({ body, ack, client }) => {
  await ack();

  const playerId = body.actions[0].value;
  console.log(playerId)
  try {
    const response = await fetch(`https://pointercrate.com/api/v1/players/${playerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch player with ID ${playerId}`);
    }

    const data = await response.json();


    const id = data.data.id;
    const name = data.data.name;
    const nationality = data.data.nationality?.nation ?? "Unknown";
    const rank = data.data.rank;
    const displayrank = rank !== null && rank !== undefined;
    const banned = data.data.banned ? "Yes" : "No" ;

    await client.chat.postMessage({
      channel: body.channel.id,
      text: `Player Info: ${name}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Name:* ${name}\n*Demon List ID:* ${id}\n*Nationality:* ${nationality}\n*Rank:* ${displayrank}\n*Banned:* ${banned}`
          }
        }
      ]
    });

  } catch (error) {
    console.error("Cuando sienta el boom", error);
    await client.chat.postMessage({
      channel: body.channel.id,
      text: "So that just happen :ferris-explode:.\nContact Lucas11 about this."
    });
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