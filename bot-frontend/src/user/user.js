
import { useParams } from 'react-router-dom';
import './style.css';

export default function Channel() {
  const params = useParams();

  return (
    <div>
      User {params.userName}
    </div>
  )
}