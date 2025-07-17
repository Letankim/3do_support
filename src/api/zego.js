import axios from "axios";

export async function getZegoToken(userID) {
    const res = await axios.get(`https://localhost:7280/api/zego/access_token?userID=${userID}`);
    return res.data.token;
}