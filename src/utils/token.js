import jwt from 'jsonwebtoken';
import { getEnvVar } from './getEnvVar.js';

const ACCESS_SECRET = getEnvVar('JWT_ACCESS_SECRET');
const REFRESH_SECRET = getEnvVar('JWT_REFRESH_SECRET');

export function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
