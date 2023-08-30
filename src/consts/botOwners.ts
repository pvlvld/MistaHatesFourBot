if (!process.env.BOT_OWNERS) throw new Error('Bot owners required');

const BOT_OWNERS = process.env.BOT_OWNERS.split(' ').map((admin_id) =>
  Number(admin_id)
);

export default BOT_OWNERS;
