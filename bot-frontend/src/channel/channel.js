
import { useParams } from 'react-router-dom';
import './style.css';

export default function Channel() {
  const params = useParams();

  return (
    <div>
      Channel {params.channelName}
      { params.userName === undefined ? "" : ` User ${params.userName}` }
    </div>
  )
}