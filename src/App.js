import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function Chat() {
    const [connection , setConnection] = useState();
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [myId, setMyId] = useState('');

    useEffect(() => {
        const connectionTmp = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7228/chatHub', {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                // accessTokenFactory: () => loginToken,
            }).withAutomaticReconnect().build();
        setConnection(connectionTmp);
    }, [])

    // useEffect(() => {
    //   debugger;
    //     const newConnection = new signalR.HubConnectionBuilder()
    //         .withUrl('https://ef83-5-63-165-226.ngrok-free.app/chatHub')
    //         .withAutomaticReconnect()
    //         .build();

    //     setConnection(newConnection);
    // }, []);

    useEffect(() => {
      debugger;
        if (connection) {
          if (connection.state === signalR.HubConnectionState.Disconnected) {
            connection.start()
                .then(connectionHandler)
                .catch(e => console.error('Connection failed:', e));
          }
        }
    }, [connection]);

    const connectionHandler = () => {
      console.log('Connected!!!');
      connection.invoke('GetID', user).catch(err => console.error("GET ID ERROR: ", err));
      connection.on('ReceiveMessage', (user, message) => {
          setMessages([...messages, { user, message }]);
      });
      connection.on('ReciveID', (id) => {
        setMyId(id);
      })
    }

    const sendMessage = () => {
        if (connection) {
            connection.invoke('SendMessage', user, message)
                .catch(err => console.error(err));
        }
    };

    return (
        <div>
            <label>My ID: {myId}</label> <br />
            <input type="text" placeholder="Your name" onChange={(e) => setUser(e.target.value)} /><br />
            <input type="text" placeholder="Your message" onChange={(e) => setMessage(e.target.value)} /><br />
            <button onClick={sendMessage}>Send</button>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        <strong>{msg.user}</strong>: {msg.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Chat;
