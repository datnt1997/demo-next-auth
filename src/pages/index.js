// pages/index.js
import { useSession, signOut } from "next-auth/react";
import React from "react";

export default function Home() {
  const { data: session } = useSession({
    required: true
  });

  React.useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem('token', session.accessToken);
    }
  }, [session]);

  return (
    <div>
      {!session ? (
        <div>Not Authentication</div>
      ) : (
        <div>
          <p>Welcome, {session.user.username}!</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
}
