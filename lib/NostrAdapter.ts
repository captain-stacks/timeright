import { Awaitable } from "next-auth/core/types";
import {
  AdapterUser,
  VerificationToken,
  AdapterSession
} from "next-auth/adapters";
import type { Adapter } from "next-auth/adapters";
import {
  SimplePool,
  nip19,
  getPublicKey,
  UnsignedEvent,
  finalizeEvent,
} from 'nostr-tools';
import { createHmac } from "crypto";

export default function NostrAdapter(pool: SimplePool): Adapter {
  const privateKey = process.env.ADMIN_NOSTR_PRIVATEKEY! as unknown as Uint8Array;
  const pubkey = getPublicKey(privateKey);

  let savedUser: AdapterUser;

  const relays = [
    'wss://nos.lol',
    // 'wss://nostr.thank.eu',
    // "wss://nostr.mom",
  ]

  return {
    createVerificationToken(
      verificationToken: VerificationToken
    ): Awaitable<VerificationToken | null | undefined> {
      console.log('createVerificationToken', verificationToken);

      const emailHash = createHmac("sha256", process.env.SECRET_SALT!)
        .update(verificationToken.identifier).digest("hex");

      const content = createHmac("sha256", process.env.SECRET_SALT!)
        .update(verificationToken.token).digest("hex");

      const event: UnsignedEvent = {
        kind: 30078,
        tags: [
          ['d', emailHash],
        ],
        content: content,
        created_at: Math.floor(Date.now() / 1000),
        pubkey: pubkey,
      };
      const signedEvent = finalizeEvent(event, privateKey);
      pool.publish(relays, signedEvent);

      return Promise.resolve({
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      });
    },

    async useVerificationToken(params: {
      identifier: string
      token: string
    }): Promise<VerificationToken | null> {
      console.log('useVerificationToken', params);

      const s = createHmac("sha256", process.env.SECRET_SALT!)
        .update(params.identifier)
        .digest("hex");

      const expectedContent = createHmac("sha256", process.env.SECRET_SALT!)
        .update(params.token)
        .digest("hex");

      const event = await pool.get(relays, {
        authors: [pubkey],
        kinds: [30078],
        '#d': [s]
      })
      console.log('event', JSON.stringify(event))
      if (event?.content !== expectedContent) return null;

      event.created_at = Math.floor(Date.now() / 1000);
      event.content = '';
      const updatedEvent = finalizeEvent(event, privateKey);
      pool.publish(relays, updatedEvent);

      savedUser = {
        id: "1",
        email: params.identifier,
        emailVerified: null,
      };

      return {
        identifier: params.identifier,
        token: params.token,
        expires: new Date(Date.now() + 60 * 1000),
      };
    },

    getUserByEmail(email: string): Awaitable<AdapterUser | null> {
      console.log('getUserByEmail', email);
      return Promise.resolve({
        id: "1",
        name: "John Doe",
        email: email,
        emailVerified: null,
        image: null,
      });
    },

    deleteSession(
      sessionToken: string
    ): Promise<void> | Awaitable<AdapterSession | null | undefined> {
      console.log('deleteSession', sessionToken);
      return Promise.resolve({
        id: sessionToken,
        userId: "1",
        expires: new Date(Date.now() + 60 * 1000),
        sessionToken: sessionToken,
      });
    },

    updateUser(
      user: Partial<AdapterUser> & Pick<AdapterUser, "id">
    ): Awaitable<AdapterUser> {
      console.log('updateUser', user, savedUser);
      return Promise.resolve({
        id: user.id,
        name: user.name,
        email: savedUser.email,
        emailVerified: null,
        image: null,
      });
    },

    createSession(session: {
      sessionToken: string
      userId: string
      expires: Date
    }): Awaitable<AdapterSession> {
      console.log('createSession', session);
      return Promise.resolve({
        id: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
        sessionToken: session.sessionToken,
      });
    },

    getSessionAndUser(
      sessionToken: string
    ): Awaitable<{ session: AdapterSession; user: AdapterUser } | null> {
      console.log('getSessionAndUser', sessionToken);
      return Promise.resolve({
        session: {
          id: sessionToken,
          userId: "1",
          expires: new Date(Date.now() + 60 * 1000),
          sessionToken: sessionToken,
        },
        user: savedUser,
      });
    },

    updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Awaitable<AdapterSession | null | undefined> {
      console.log('updateSession', session);
      return Promise.resolve({
        id: session.sessionToken,
        userId: "1",
        expires: new Date(Date.now() + 60 * 1000),
        sessionToken: session.sessionToken,
      });
    }
  }
}