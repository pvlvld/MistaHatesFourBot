if (!process.env.POOL_TIME) throw new Error('Pool time required!');
const POOL_TIME = parseInt(process.env.POOL_TIME);

export default POOL_TIME;
