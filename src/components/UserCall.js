import React,{ useEffect,useRef,useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function randomID(len = 5) {
    const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
    let result = '';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getUrlParams() {
    return new URLSearchParams(window.location.search);
}

export default function UserCall() {
    const containerRef = useRef(null);
    const [roomID,setRoomID] = useState(getUrlParams().get("roomID") || "");
    const [startCall,setStartCall] = useState(false);

    useEffect(() => {
        if (!startCall) return;

        const userID = randomID();
        const userName = "User_" + randomID();

        const appID = 795723764; // <-- Replace with real App ID
        const serverSecret = "8781bdc781148d78d309bd38e80ff3da"; // <-- Replace with real Secret

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            userID,
            userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: containerRef.current,
            sharedLinks: [
                {
                    name: "Copy Link",
                    url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
        });
    },[startCall]);

    if (startCall) {
        return <div ref={containerRef} style={{ width: "100vw",height: "100vh" }} />;
    }

    return (
        <div style={{ padding: 20,textAlign: "center" }}>
            <h2>Join or Create a Video Call Room</h2>
            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
                style={{ padding: 10,width: 250 }}
            />
            <div style={{ marginTop: 10 }}>
                <button onClick={() => setStartCall(true)} style={{ padding: 10,marginRight: 10 }}>
                    Join Room
                </button>
                <button
                    onClick={() => {
                        const newRoom = randomID(8);
                        setRoomID(newRoom);
                        setStartCall(true);
                    }}
                    style={{ padding: 10 }}
                >
                    Create New Room
                </button>
            </div>
        </div>
    );
}
