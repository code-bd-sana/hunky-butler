import HomeMarque from '@/components/homepage/HomeMarque';
import AboutHunky from '@/components/Location/AboutHunky';
import ButlerLocation from '@/components/Location/ButlerLocation';
import LocationBanner from '@/components/Location/LocationBanner';
import Operate from '@/components/Location/Operate';
import React from 'react';

const page = () => {
    return (
        <div>
            <LocationBanner></LocationBanner>
            <AboutHunky></AboutHunky>
            <HomeMarque></HomeMarque>
            <Operate></Operate>
            <ButlerLocation></ButlerLocation>
        </div>
    );
};

export default page;