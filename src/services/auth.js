import jwt from "jsonwebtoken";
import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/time.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const createSession = async (userId) => {

  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1d",
  });


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

  res.cookie("accessToken", session.accessToken, cookieOptionsAccess);
  res.cookie("refreshToken", session.refreshToken, cookieOptionsRefresh);
  res.cookie("sessionId", session._id.toString(), cookieOptionsRefresh);
};
