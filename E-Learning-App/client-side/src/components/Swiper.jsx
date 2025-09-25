import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/CourseStyles/QuestionStyle.css'


// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import Question from "./Question.jsx";

export default function SwiperComponent({testQuestions}) {

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };

    return (
        <>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={false}
                pagination={pagination}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {testQuestions.map((question, index) => {

                    return <SwiperSlide><Question question = {question} key = {index}/></SwiperSlide>

                })}
            </Swiper>
        </>
    );
}
