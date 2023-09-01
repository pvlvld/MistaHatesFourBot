if (!process.env.SHOOT_IMAGE) throw new Error('Shoot image required');
export const SHOOT_IMAGE = process.env.SHOOT_IMAGE;

if (!process.env.WELCOME_IMAGE) throw new Error('Welcome image required');
export const WELCOME_IMAGE = process.env.WELCOME_IMAGE;
