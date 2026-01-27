import crypto from "crypto";
import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/time.js";

const generateToken = () => crypto.randomBytes(32).toString("hex");

export const createSession = async (userId) => {
  const accessToken = generateToken();
  const refreshToken = generateToken();

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const cookieOptionsAccess = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: FIFTEEN_MINUTES,
  };

  const cookieOptionsRefresh = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ONE_DAY,
  };

  const cookieOptionsSessionId = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ONE_DAY,
  };

  res.cookie("accessToken", session.accessToken, cookieOptionsAccess);
  res.cookie("refreshToken", session.refreshToken, cookieOptionsRefresh);
  res.cookie("sessionId", session._id.toString(), cookieOptionsSessionId);
};
