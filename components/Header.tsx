"use client";
import Link from 'next/link';
import { useState, useEffect, use, useRef } from 'react';
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import Login from './Login';
import { GetServerSideProps } from "next";
import {
  SimplePool,
  nip19,
  getPublicKey,
  UnsignedEvent,
  finalizeEvent,
} from 'nostr-tools';
import { useGlobalState } from '../app/GlobalStateContext';

export default function Header({
  privateKey,
}: {
  privateKey?: any,
}) {
  const { data: session, status } = useSession();
  const [_, triggerRerender] = useState(0);
  const {
    darkMode,
    setDarkMode,
    publicKey
  } = useGlobalState();
  
  console.log('client session', session);
  
  useEffect(() => {
    setTimeout(async () => {
      try {
        publicKey.current = await ((window as any).nostr).getPublicKey();
      } catch {
        if (privateKey) {
          localStorage.setItem('privateKey', privateKey);
        }
        privateKey = localStorage.getItem('privateKey');
        if (privateKey) {
          publicKey.current = getPublicKey(privateKey);
        }
      }
      triggerRerender(prev => prev + 1);
    }, 500);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-2xl font-bold">Shared Calendar</h1>
      <div>status: {status}, session: {JSON.stringify(session)}</div>
      <div>{publicKey.current !== '' ? nip19.npubEncode(publicKey.current) : 'no npub'}</div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link href="/calendar" className="hover:underline">Calendar</Link>
          </li>
        </ul>
      </nav>
      <button onClick={() => setDarkMode(prev => !prev)}>
        Toggle Dark Mode
      </button>
      <Login/>
    </header>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log('server session', session);
  
  if (!session) {
    return {
      redirect: {
        destination: "/", // redirect to home or login
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};