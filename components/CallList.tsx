// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client"
import { useGetCalls } from '@/hooks/useGetCalls'
import { CallRecording } from '@stream-io/node-sdk';
import { Call } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';

const CallList = ({type} : {type: 'ended' | 'upcoming' | 'recordings'}) => {
  const {endedCalls, upcomingCalls, callRecordings, isLoading} = useGetCalls();

  const router = useRouter()

  const [recordings, setRecordings] = useState<CallRecording[]>([])

  const getCalls = () => {
            switch (type) {
                case 'ended':
                    return endedCalls;
                case 'recordings':
                    return callRecordings;
                case 'upcoming':
                    return upcomingCalls;
                default:
                    return [];

            }
        }

     const getNoCallsMessage = () => {
            switch (type) {
                case 'ended':
                    return 'No previous call';
                case 'recordings':
                    return 'No call recordings';
                case 'upcoming':
                    return 'No Upcoming calls';
                default:
                    return '';

            }
        }

        useEffect(()=>{
            const fetchRecordings = async () => {
                const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings))

                const recordings = callData.filter(call => call.recordings.length > 0).flatMap(call=>call.recordings)
//flatMap goes through all array and make them a single array
                setRecordings(recordings)
            }
            if(type === 'recordings') fetchRecordings()
        },[type,callRecordings])

        const calls = getCalls();

        const noCallsMessage = getNoCallsMessage()
        if(isLoading) return <Loader />
    return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {calls && calls.length > 0 ? calls.map((call:Call | CallRecording) => (
            <MeetingCard 
            key={(call as Call).id}
             icon={
                type === 'ended'? '/icons/previous.svg':
                type === 'upcoming'?'/icons/upcoming.svg':
                '/icons/recordings.svg'
             }
            title={(call as Call).state?.custom?.description?.substring(0,26) ||call?.filename?.substring(0,20)|| 'No description'}
            date={call.state?.startsAt?.toLocaleString() || call.start_time.toLocaleString()}
            isPreviousMeeting={type==='ended'}
            buttonIcon1={type==='recordings'?'/icons/play.svg':undefined}
            handleClick={type==='recordings'? ()=>router.push(`${call.url}`) : ()=>router.push(`/meeting/${call.id}`) }
            link={type==='recordings'? call.url:`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`}
            buttonText={type==='recordings'?'Play':'Start'}
            />
        )): (
            <h1>{noCallsMessage}</h1>
        )
    }
        
    </div>
  )
}

export default CallList