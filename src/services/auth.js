import bcrypt from 'bcrypt';
import createError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js';

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  const { password: _, ...userData } = newUser.toObject();
  return userData;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createError(401, 'Invalid email or password');

  await Session.deleteMany({ userId: user._id });

  const payload = { id: user._id };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const now = new Date();
  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + 15 * 60000),
    refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60000),
  });

  return { accessToken, refreshToken, sessionId: session._id };
};

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
