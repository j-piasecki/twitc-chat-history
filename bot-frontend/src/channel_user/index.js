
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Message from '../common/message';
import config from '../config.json';

export default function Channel() {
  const params = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [moreAvailable, setMoreavailable] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetch(`//${config.apiUrl}/channel/${params.channelName}/user/${params.userName}?amount=75`)
      .then((r) => {
        if (r.status === 404) {
          throw 404;
        }

        return r.json();
      })
      .catch((e) => {
        if (e === 404) {
          navigate(`/error}`, { replace: true });
        }
      })
      .then((r) => {
        setMessages(r.messages);
        setMoreavailable(!r.end);
      })
  }, []);

  function update() {
    setIsUpdating(true);
    
    fetch(`//${config.apiUrl}/channel/${params.channelName}/user/${params.userName}?amount=75&last=${messages[messages.length - 1].id}`)
      .then((r) => { return r.json(); })
      .then((r) => {
        setMessages(messages.concat(r.messages));
        setMoreavailable(!r.end);
        setIsUpdating(false);
      })
  }

  return (
    <div className='wrapper'>
      <div className='header'>
        <div className='link' onClick={() => { navigate(`/user/${params.userName}`, { replace: true }) }}>
          {params.userName}
        </div>
        na czacie
        <div className='link' onClick={() => { navigate('./../', { replace: true }) }}>
          {params.channelName}
        </div>
      </div>
      <div className='chat' onScroll={(e) => {
        if (e.target.scrollTop + e.target.offsetHeight + 500 > e.target.scrollHeight) {
          if (!isUpdating && moreAvailable) {
            update();
          }
        }
      }}>
        {messages.map((message) => <Message key={message.id} msg={message} />)}
      </div>
    </div>
  )
}