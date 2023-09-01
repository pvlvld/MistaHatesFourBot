if (!process.env.BOT_OWNER_IDS) throw new Error('Bot owners required');

const BOT_OWNER_IDS = process.env.BOT_OWNER_IDS.split(' ').map((admin_id) =>
  Number(admin_id)
);

export default BOT_OWNER_IDS;
