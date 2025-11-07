import ButlerPaymentCard from '@/components/butlerDashboard/ButlerPaymentCard';
import ButlerPaymentUpcomingBooking from '@/components/butlerDashboard/ButlerPaymentUpcomingBooking';
import NextPayout from '@/components/butlerDashboard/NextPayout';
import React from 'react';

const ButlerPaymentpage = () => {
    return (
        <>
            <ButlerPaymentCard></ButlerPaymentCard>
            <NextPayout></NextPayout>
            <div className='mt-10'>
                <ButlerPaymentUpcomingBooking></ButlerPaymentUpcomingBooking>
            </div>
        </>
    );
};

export default ButlerPaymentpage;