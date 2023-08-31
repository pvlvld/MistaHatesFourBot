import isFromAdmin from './isFromAdmin';
import { MyGroupTextContext } from '../types/grammy.types';

// in seconds
if (!process.env.MUTE_TIME) throw new Error('Restricted four required');

const MUTE_TIME = parseInt(process.env.MUTE_TIME);

if (MUTE_TIME < 30) throw new Error("Mute time can't be lower than 30");

const mute_permissions = {
  can_send_messages: false,
  can_send_audios: false,
  can_send_documents: false,
  can_send_other_messages: false,
  can_send_photos: false,
  can_send_polls: false,
  can_send_video_notes: false,
  can_send_videos: false,
  can_send_voice_notes: false,
  can_invite_users: false,
  can_pin_messages: false,
};

async function muteMember(ctx: MyGroupTextContext) {
  if (await isFromAdmin(ctx)) return false;

  return ctx
    .restrictAuthor(mute_permissions, { until_date: getUntilDate() })
    .catch((e) => {
      console.error(e);
      return false;
    });
}

function getUntilDate() {
  return Date.now() / 1000 + MUTE_TIME;
}

export default muteMember;
