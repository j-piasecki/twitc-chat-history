import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
          onChange={({ target: { value } }) => { setChannelName(value); }}
          onKeyUp={({ key }) => { if (key === 'Enter') { navigate(`/channel/${channelName.toLowerCase()}`); } }} />
        <Button
          text="OK"
          onClick={() => { navigate(`/channel/${channelName.toLowerCase()}`); }} />
      </div>
      <div className="container">
        <h2>Sprawdź użytkownika</h2>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={userName}
          onChange={({ target: { value } }) => { setUserName(value); }}
          onKeyUp={({ key }) => { if (key === 'Enter') { navigate(`/user/${userName.toLowerCase()}`); } }} />
        <Button
          text="OK"
          onClick={() => { navigate(`/user/${userName.toLowerCase()}`); }} />
      </div>
    </div>
  );
}

function Button({ text, onClick }) {
  return (
    <div className="button" onClick={onClick}>
      {text}
    </div>
  )
}