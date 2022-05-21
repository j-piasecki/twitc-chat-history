
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

export default function Home() {
  const [userName, setUserName] = useState("");
  const [channelName, setChannelName] = useState("");
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="container">
        <h2>Sprawdź kanał</h2>
        <input
          type="text"
          placeholder="Nazwa kanału"
          value={channelName}
          onChange={({ target: { value } }) => { setChannelName(value); }} />
        <input
          type="button"
          value="OK"
          onClick={() => { navigate(`/channel/${channelName}`); }} />
      </div>
      <div className="container">
        <h2>Sprawdź użytkownika</h2>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={userName}
          onChange={({ target: { value } }) => { setUserName(value); }} />
        <input
          type="button"
          value="OK"
          onClick={() => { navigate(`/user/${userName}`); }} />
      </div>
    </div>
  );
}