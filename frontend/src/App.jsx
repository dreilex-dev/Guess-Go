import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import "./app.css";
import { ChannelContainer, ChannelListContainer } from "./components";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const apiKey = import.meta.env.API_KEY;
const client = StreamChat.getInstance(apiKey);

const App = () => {
  const { user } = useUser();
  const [streamToken, setStreamToken] = useState(null);

  useEffect(() => {
    const connectStream = async () => {
      if (user) {
        const response = await fetch("/stream/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();
        setStreamToken(data.token);

        client.connectUser(
          {
            id: user.id,
            name: user.fullName || user.username,
            image: user.imageUrl,
          },
          data.token
        );
      }
    };
    if (user) connectStream();
    return () => {
      if (client) client.disconnectUser();
    };
  }, [user]);
  return (
    <>
      <header className="">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      {streamToken && (
        <div className="app__wrapper">
          <Chat client={client} theme="team light">
            <ChannelListContainer />
            <ChannelContainer />
          </Chat>
        </div>
      )}
    </>
  );
};

export default App;
