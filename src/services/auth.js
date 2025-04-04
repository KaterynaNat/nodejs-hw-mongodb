import createError from 'http-errors';
import Session from '../models/session.js';
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/token.js';

export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(401, 'Refresh token missing');
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw createError(
      401,
      `Invalid or expired refresh token: ${error.message}`,
    );
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createError(401, 'Session not found');

  await Session.deleteOne({ _id: session._id });

  const newPayload = { id: payload.id };
  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  const now = new Date();
  const newSession = await Session.create({
    userId: payload.id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(now.getTime() + 15 * 60000),
    refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60000),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionId: newSession._id,
  };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(401, 'Refresh token missing');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createError(401, 'Session not found');
  }

  await Session.deleteOne({ _id: session._id });
};
