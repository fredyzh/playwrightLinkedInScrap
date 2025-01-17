export const delay_ms = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const randomDelay = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randomDelayMs = (
  min1: number,
  max1: number,
  min2: number,
  max2: number
) => {
  return randomDelay(min1, max1) * 100 + randomDelay(min2, max2) * 10;
};

export const waitMiliSeconds = () => {
  const seed = getSeed();
  return randomDelayMs(seed, seed + getSeed(), 0, 9);
};

export const waitSeconds = () => {
  return waitMiliSeconds() * 10;
};

export const waitMini = () => {
  return waitSeconds() * 10;
};

const getSeed = () => {
  const res = Math.floor(Math.random() * 10);
  return res == 0 ? 1 : res;
};

export const randomTrue = () => {
  const res = Math.floor(Math.random() * 10);
  return res < 5 ? true : false;
};
