import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import NostrAdapter from "../../../lib/NostrAdapter";
import { SimplePool } from 'nostr-tools';

export default NextAuth(process.env.NODE_ENV === 'development' ? {
  // debug: true,
  session: {
    strategy: "jwt",
  },
  adapter: NostrAdapter(new SimplePool()),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: "Timeright <timeright.login@gmail.com>",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
} : {
  // debug: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
