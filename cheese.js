app.command('/cheese', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();

    await respond(`:cheese:`);
  });