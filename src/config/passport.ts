import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import GoogleTokenStrategy from "passport-google-id-token";

import { Payload } from "../misc/types";
import userService from "../services/users";
import { generateRandomPassword } from "../utils/generateRandomPassword";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: Payload, done: any) => {
    const userEmail = payload.email;
    try {
      const user = await userService.getUserByEmail(userEmail);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

const clientId = process.env.GOOGLE_CLIENT_ID as string;
export const googleStrategy = new GoogleTokenStrategy(
  { clientID: clientId },
  async function (parsedToken: any, googleId: string, done: any) {
   
    const userPayload = {
      username: parsedToken.payload.name,
      email: parsedToken.payload.email,
      password: generateRandomPassword(8),
    };
    const user = await userService.findOrCreate(userPayload);
    done(null, user);
  }
);
