import React,{ useEffect,useState } from "react";
import ZIM from "zego-zim-web";
import { getZegoToken } from "../api/zego";

const APP_ID = 795723764;

export default function SupportChat({ userId }) {
    const [zim,setZim] = useState(null);
    const [message,setMessage] = useState("");
    const [chatLog,setChatLog] = useState([]);

    useEffect(() => {
        async function init() {
            const token = await getZegoToken(userId);
            const zimInstance = ZIM.create({ appID: APP_ID,userInfo: { userID: userId } });
            await zimInstance.login({ userID: userId },token);

            zimInstance.on("messageReceived",(msgs) => {
                msgs.forEach((msg) => {
                    setChatLog((log) => [...log,`[${msg.fromUserID}]: ${msg.message.message}`]);
                });
            });

            setZim(zimInstance);

            const zp = window.ZegoUIKitPrebuilt.create(
                window.ZegoUIKitPrebuilt.generateKitTokenForProduction(
                    APP_ID,
                    token,
                    "support-room",
                    userId,
                    userId
                )
            );
            zp.joinRoom({
                container: document.getElementById("video-call"),
                scenario: { mode: window.ZegoUIKitPrebuilt.OneONoneCall },
            });
        }

        init();
    },[userId]);

    const sendMessage = async () => {
        await zim.sendPeerMessage({ type: 1,message },"admin1");
        setChatLog((log) => [...log,`[Me]: ${message}`]);
        setMessage("");
    };

    return (
        <div>
            <h3>User Chat</h3>
            <div style={{ height: "200px",overflowY: "auto",border: "1px solid gray" }}>
                {chatLog.map((msg,i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
            <div id="video-call" style={{ width: 500,height: 400 }}></div>
        </div>
    );
}
