import React,{ useEffect,useRef,useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";

function randomID(len = 5) {
    const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
    return Array.from({ length: len },() => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function UserCall() {
    const containerRef = useRef(null);
    const [roomID,setRoomID] = useState("");
    const [startCall,setStartCall] = useState(false);
    const [userId,setUserId] = useState("");
    const [trainerId,setTrainerId] = useState("");

    // ✅ Lấy params từ URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const autoJoin = params.get("autoJoin") === "true";
        const roomFromURL = params.get("roomID");
        const userIDFromURL = params.get("userID") || `user_${randomID()}`;
        const userNameFromURL = params.get("userName") || `User_${randomID()}`;

        if (autoJoin && roomFromURL) {
            setRoomID(roomFromURL);
            setUserId(userIDFromURL);
            setStartCall(true);

            const appID = 1612291838;
            const serverSecret = "c6fb2e9fa77b45019cd0050c00f491f3";

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomFromURL,
                userIDFromURL,
                userNameFromURL
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);

            zp.joinRoom({
                container: containerRef.current,
                sharedLinks: [
                    {
                        name: "Copy Link",
                        url: `${window.location.origin}${window.location.pathname}?roomID=${roomFromURL}&userID=${userIDFromURL}&userName=${userNameFromURL}&autoJoin=true`,
                    },
                ],
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
                onLeaveRoom: () => {
                    window.location.href = "/";
                }
            });
        }
    },[]);

    // ✅ Khi user nhấn join/create thủ công
    useEffect(() => {
        if (!startCall || !roomID) return;

        const userName = "User_" + randomID();
        const userZegoID = "user_" + randomID();

        const appID = 1612291838;
        const serverSecret = "c6fb2e9fa77b45019cd0050c00f491f3";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            userZegoID,
            userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: containerRef.current,
            sharedLinks: [
                {
                    name: "Copy Link",
                    url: `${window.location.origin}${window.location.pathname}?roomID=${roomID}&userID=${userZegoID}&userName=${userName}&autoJoin=true`,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            onLeaveRoom: () => {
                window.location.href = "/";
            }
        });
    },[startCall,roomID]);

    const handleCreateRoom = async () => {
        if (!userId || !trainerId) {
            alert("Please enter both User ID and Trainer ID.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:7066/api/v1/callsupport/create-room",{
                userId: parseInt(userId),
                trainerId: parseInt(trainerId)
            });

            const data = response.data?.data;
            if (data?.roomId) {
                setRoomID(data.roomId);
                setStartCall(true);
            } else {
                alert("Failed to create room.");
            }
        } catch (error) {
            console.error("Error creating room:",error);
            alert("Failed to create room.");
        }
    };

    if (startCall) {
        return <div ref={containerRef} style={{ width: "100vw",height: "100vh" }} />;
    }

    return (
        <div style={{ padding: 20,textAlign: "center" }}>
            <h2>Join or Create a Video Call Room</h2>

            <div style={{ marginBottom: 10 }}>
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{ padding: 10,width: 250,marginRight: 10 }}
                />
                <input
                    type="text"
                    placeholder="Enter Trainer ID"
                    value={trainerId}
                    onChange={(e) => setTrainerId(e.target.value)}
                    style={{ padding: 10,width: 250 }}
                />
            </div>

            <div style={{ marginBottom: 10 }}>
                <input
                    type="text"
                    placeholder="Enter Room ID to Join"
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                    style={{ padding: 10,width: 520 }}
                />
            </div>

            <div>
                <button onClick={() => setStartCall(true)} style={{ padding: 10,marginRight: 10 }}>
                    Join Room
                </button>
                <button onClick={handleCreateRoom} style={{ padding: 10 }}>
                    Create New Room
                </button>
            </div>
        </div>
    );
}
