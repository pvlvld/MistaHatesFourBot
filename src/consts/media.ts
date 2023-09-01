if (!process.env.SHOOT_IMAGE) throw new Error('Shoot image required');
export const SHOOT_IMAGE = process.env.SHOOT_IMAGE;
