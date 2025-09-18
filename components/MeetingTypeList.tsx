"use client"
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Textarea } from './ui/textarea'
import ReactDatePicker from "react-datepicker";
import { toast } from "sonner"
import { Input } from './ui/input'


const MeetingTypeList = () => {
const router  = useRouter()



    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' 
    |'isJoiningMeeting'|'isInstantMeeting'| undefined>()
  
    const [values, setValues] = useState({
      dateTime: new Date(),
      description:'',
      link:''
    })

    const [callDetails, setCallDetails] = useState<Call | undefined>(undefined);

    const {user} = useUser();

    const client = useStreamVideoClient();

  const createMeeting= async() => {
        if(!client || !user) return null;

        try {
          const id = crypto.randomUUID();
          const call = client.call('default',id);

          if(!call) throw new Error("Fail to create call");

          const startAt = values.dateTime.toISOString() || new Date().toISOString();
          const description = values.description || 'Instant Meeting';

          await call.getOrCreate({
            data:{
              starts_at:startAt,
              custom:{
                description,
               
              }
            }
          })
          setCallDetails(call);
          if(!values.description) { 
          router.push(`/meeting/${call.id}`);
          }
          toast('Meeting created')

        } catch (error) {
          console.log(error)
          toast('Failed to create meeting')

        }
}

const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
    return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <HomeCard img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
        className="bg-[#FF742E]"/>

        <HomeCard img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        className="bg-blue-500"/>

        <HomeCard img="/icons/recordings.svg"
        title="Record Meeting"
        description="Check out your recorded meeting"
        handleClick={() =>router.push('/recordings')}
        className="bg-purple-500"/>

        <HomeCard img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Join a meeting"
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className="bg-yellow-500"/>

{!callDetails ? (
  <MeetingModal 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={()=> setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
        >
        <div className="flex flex-col gap-2.5">
          <label className="text-base text-normal leading-[22px]">Add a Description</label>
          <Textarea className="border-none bg-blend-darken focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => {
            setValues({...values,description:e.target.value})
          }}
          />
        </div>
        <div className="flex flex-col w-fullgap-2.5">
          <label className='text-base text-normal laeading-[22px] text-sky-2'>Select Date and Time</label>
          <ReactDatePicker 
          selected={values.dateTime}
          onChange={(date) => setValues({...values,dateTime:date!})}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='time'
          dateFormat="MMMM d, yyyy h:mm aa"
          className='w-full rounded bg-[#252A41] p-2 focus-outline:none'
          />
        </div>
        </MeetingModal>
):(
  <MeetingModal 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={()=> setMeetingState(undefined)}
        title="Meeting created"
        handleClick={()=> {navigator?.clipboard?.writeText(meetingLink);
          toast("Link copied")
        }}
        className='text-center'
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        buttonText='Copy Meeting Link'
      />

        
)}
        <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={()=> setMeetingState(undefined)}
        title="Start an Instant Meeting"
        handleClick={createMeeting}
        buttonText='Start an instant meeting'
        className='text-center'
        />

         <MeetingModal 
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={()=> setMeetingState(undefined)}
        title="Type link here"
        handleClick={()=>router.push(values.link)}
        buttonText='Join meeting'
        className='text-center'
        >
          <Input placeholder="Meeting link" 
          className="border-none bg-dark-3 focus:visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e)=>setValues({...values, link:e.target.value})}
          />
        </MeetingModal>
        
    </section>
)
}

export default MeetingTypeList