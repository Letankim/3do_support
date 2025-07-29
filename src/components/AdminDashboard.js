import React,{ useEffect,useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import '@zegocloud/zego-uikit-prebuilt/index.css'; // BẮT BUỘC PHẢI CÓ

export default function AdminCall() {
    const containerRef = useRef(null);

    const randomID = () => Math.random().toString(36).substring(2,10);

    const getRoomID = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("roomID") || null;
    };

    useEffect(() => {
        const roomID = getRoomID();

        if (!roomID) {
            console.error("❌ Không tìm thấy roomID trên URL.");
            return;
        }

        const appID = 1612291838;
        const serverSecret = "c6fb2e9fa77b45019cd0050c00f491f3";

        const userID = "admin_" + randomID();
        const userName = "Admin Support";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            userID,
            userName
        );

        if (!kitToken) {
            console.error("❌ kitToken generate failed. Kiểm tra appID/serverSecret/roomID.");
            return;
        }

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: containerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            showPreJoinView: false
        });
    },[]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100vw",height: "100vh" }}
        />
    );
}
