import React, {useRef, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Pagination} from 'swiper/modules';
import Question from "./Question.jsx";

export default function SwiperComponent({questions, setQuestions = null, readOnly = false}) {

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
                spaceBetween={24}
                loop={false}
                pagination={pagination}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="swiper"
                onSlideChange = {() => {
                    setActiveIndex(refSwiper.current.activeIndex);
                }}
            >
                {questions.map((question, index) => {
                    //console.log(question);

                    return <SwiperSlide className="swiper">
                        <Question activeIndex = {activeIndex}
                                  question = {question}
                                  setQuestions = {setQuestions}
                                  readOnly={readOnly}
                        />
                    </SwiperSlide>

                })}

            </Swiper>
        </>
    );
}
