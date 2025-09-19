// File: ACM-Backend/utils/tokenBlocklist.js

const blockedTokens = new Set();

export const addTokenToBlocklist = (token) => {
  blockedTokens.add(token);
};

export const isTokenBlocklisted = (token) => {
  const isBlocked = blockedTokens.has(token);
  return isBlocked;
};
