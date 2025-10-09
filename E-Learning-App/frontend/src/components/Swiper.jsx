import React, {useRef, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/CourseStyles/QuestionStyle.css'
import {Navigation, Pagination} from 'swiper/modules';
import Question from "./Question.jsx";

export default function SwiperComponent({testQuestions}) {

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };

    const refSwiper = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <>
            <Swiper
                onSwiper={(swiper) => { refSwiper.current = swiper;}}
                slidesPerView={1}
                spaceBetween={500}
                loop={false}
                pagination={pagination}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
                onSlideChange = {() => {
                    setActiveIndex(refSwiper.current.activeIndex);
                }}
            >
                {testQuestions.map((question, index) => {

                    return <SwiperSlide><Question activeIndex = {activeIndex}
                                                  question = {question}
                                                  key = {index}
                    />
                    </SwiperSlide>

                })}

            </Swiper>
        </>
    );
}
