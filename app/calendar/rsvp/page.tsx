"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../../GlobalStateContext';
import {
  UnsignedEvent,
  finalizeEvent,
  getPublicKey,
} from 'nostr-tools';

export default function RSVPPage() {
  const {
    publicKey,
    pool,
  } = useGlobalState();
  const [volunteer, setVolunteer] = useState(false);
  const [signalGroupUrl, setSignalGroupUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const relays = ['http://localhost:4848'];
    const privateKey = localStorage.getItem('privateKey')! as unknown as Uint8Array;

    const event: UnsignedEvent = {
      "pubkey": publicKey.current,
      "created_at": Math.floor(Date.now() / 1000),
      "kind": 31_925,
      "content": '',
      "tags": [
        ["a", "31923:pubkey:timeright-dinner-MMDD"],
        ["d", "timeright-dinner-MMDD"],
        ["status", "accepted"],
        ["volunteer", volunteer ? "yes" : "no"],
        ["signalGroupUrl", signalGroupUrl] // todo encrypt
      ]
    };
    const signedEvent = finalizeEvent(event, privateKey);
    await Promise.all(pool.publish(relays, signedEvent));

    router.push('/calendar');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <Link href="/calendar">
        <button
          style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#ccc',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Calendar
        </button>
      </Link>
      <h1>RSVP for 7pm Dinner</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Will you volunteer to be an organizer?
          <select
            value={volunteer ? "yes" : "no"}
            onChange={(e) => setVolunteer(e.target.value === "yes")}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        {volunteer && (
          <div>
            <label>Signal Group URL:</label>
            <input
              type="text"
              value={signalGroupUrl}
              onChange={(e) => setSignalGroupUrl(e.target.value)}
              placeholder="Enter Signal Group URL"
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>
        )}
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}