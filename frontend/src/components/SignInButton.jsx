import React from "react";
import { SignIn } from "@clerk/clerk-react";

const signInPage = () => {
  return (
    <div className="">
      <h1>Sign In</h1>
      <SignIn />
    </div>
  );
};

export default signInPage;
