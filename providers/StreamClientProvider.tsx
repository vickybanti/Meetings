"use client"
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";




 const StreamVideoProvider = ({children}:{children:ReactNode}) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
     const {user, isLoaded} = useUser();
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

    useEffect(() => {
        if(!isLoaded || !user) return;
        if(!apiKey) throw new Error("STREAM_API_KEY is not defined");
        const client = new StreamVideoClient({
            apiKey,
            user:{
                id:user?.id,
                name:user?.username || user?.id,
                image:user?.imageUrl
            },
            tokenProvider: tokenProvider
        });
        setVideoClient(client);

    },[user,isLoaded, apiKey]);

    if(!videoClient) return <Loader />;


    
  return (
    <StreamVideo client={videoClient}>
        {children}
    </StreamVideo>
  );
};
export default StreamVideoProvider;