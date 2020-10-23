import axios from 'axios';
import AccessToken from "../classes/AccessToken";
import type { GameByIdResponse } from "../data/types";

const accessTokenUtil = new AccessToken();

export const fetchGameById = async (id: string): Promise<GameByIdResponse | null> => {

    const accessTokenData = await accessTokenUtil.get();   
    if (!accessTokenData) return null;
    
    const response = await axios.get(
        `https://api.twitch.tv/helix/games?id=${id}`,
        {
            headers: {
                accept: "application/vnd.twitchtv.v5+json",
                "client-id": process.env.CLIENT_ID,
                authorization: `Bearer ${accessTokenData.accessToken}`,
            },
        }
    );
      
    return response.data.data[0];
}
