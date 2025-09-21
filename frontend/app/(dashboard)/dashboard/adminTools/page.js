'use client'
import DashNav from '@/components/Dashboard/DashNav/DashNav'
import { useSetTab } from '@/hooks/useUsersTab';
import React, { useEffect, useState } from 'react'

export default function page() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
      const setUserTab = useSetTab();


    const tab = [

        {
            name:"Notification management",
            slug:"notification"
        },
        {
            name:"Article management",
            slug:"article"
        }
    ]


    useEffect(()=>{
        setUserTab('notification')




    }, [])
  return (
    <div>
         <DashNav

         
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              tab={tab}
            />


    </div>
  )
}
