type DB_Settings =
  | {
      id: number;
      chatId: bigint;
      vote_enable: boolean;
      vote_percent: number;
    }
  | null
  | undefined;

const SettingsTransformer = {
  DBtoUsable: (db_settings: DB_Settings) =>
    db_settings ? (({ id, chatId, ...o }) => o)(db_settings) : null,
};

export default SettingsTransformer;
