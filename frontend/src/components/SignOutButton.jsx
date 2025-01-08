import React from "react";
import { useClerk } from "@clerk/clerk-react";

const SignOutButton = () => {
  const { signOut } = useClerk();

  return <button onClick={() => signOut()}>Sign Out</button>;
};

export default SignOutButton;
