
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../config.json';

export default function Channel() {
  const params = useParams();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetch(`//${config.apiUrl}/userChannels/${params.userName}`)
      .then((r) => {
        if (r.status === 404) {
          throw 404;
        }

        return r.json();
      })
      .catch((e) => {
        if (e === 404) {
          navigate(`/error`, { replace: true });
        }
      })
      .then((r) => {
        setChannels(r.channels);
      })
  }, []);

  return (
    <div className='wrapper'>
      <div className='header'>
        {params.userName}
      </div>
      <div className='chat'>
        {channels.map((c) => <Entry entry={c} user={params.userName} />)}
      </div>
    </div>
  )
}

function Entry({ entry, user }) {
  const navigate = useNavigate();

  const channel = entry.name.substring(1);

  return (
    <div className='channel-entry' onClick={() => { navigate(`/channel/${channel}/${user}`) }}>
      {entry.messages} wiadomości na czacie
      <div className='channel'>
        {channel}
      </div>
    </div>
  )
}