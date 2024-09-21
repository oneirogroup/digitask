export const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1e3));
