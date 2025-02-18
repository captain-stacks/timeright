"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useGlobalState } from '../app/GlobalStateContext';

const Login = () => {
  const { data: session, status } = useSession();
  const { publicKey } = useGlobalState();

  const signOutHandler = () => {
    localStorage.removeItem("privateKey");
    signOut();
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (publicKey.current) {
    return (
      <div>
        <br />
        <button onClick={signOutHandler}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>You are not signed in.</p>
      <button onClick={signIn}>Sign in</button>
    </div>
  );
};

export default Login;
