import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";
export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user?.email as string} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn()}>Login with Google</button>
    </>
  );
}
