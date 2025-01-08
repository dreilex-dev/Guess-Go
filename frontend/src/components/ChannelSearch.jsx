import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";
import { search } from "../assets";

const ChannelSearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const getChannels = async () => {
    try {
      //for later
    } catch (err) {
      setQuery("");
    }
  };

  const toSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setQuery(e.target.value);
    getChannels(e.target.value);
  };
  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <img src={search} alt="search_icon" height={30} width={30} />
        </div>
        <input
          className="channel-search__input__text"
          placeholder="Search"
          type="text"
          value={query}
          onChange={toSearch}
        />
      </div>
    </div>
  );
};

export default ChannelSearch;
