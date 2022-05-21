export default function Message({ msg, onNameClick }) {
    return (
        <div className='message'>
            <div className='timestamp'>{
                new Date(new Number(msg.timestamp)).toLocaleDateString('pl-pl', {
                    minute: '2-digit',
                    hour: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })
            }</div>
            <div className='content'>
                <div className='username' onClick={onNameClick}>
                    {msg.user_name}:
                </div>
                {msg.message}
            </div>
        </div>
    );
}