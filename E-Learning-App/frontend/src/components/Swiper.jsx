import React, {useRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Pagination} from 'swiper/modules';
import Question from "./Question.jsx";

export default function SwiperComponent({questions, setQuestions = ()=>{}}) {
    const pagination = {
        el: ".questions-pagination",
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };

    const refSwiper = useRef(null);
    const [swiperNavigationVisible, setSwiperNavigationVisible] = React.useState(window.innerWidth > 640);
    addEventListener("resize", (event) => { })

    // if screen is a mobile-sized, hide navigation arrows in the Swiper component
    onresize = (event) => {
        if(window.innerWidth < 640) setSwiperNavigationVisible(false)
        else setSwiperNavigationVisible(true)
    }

    return (
        <div className="w-full">
            <Swiper
                onSwiper={(swiper) => { refSwiper.current = swiper;}}
                slidesPerView={1}
                spaceBetween={24}
                loop={false}
                autoHeight={true}
                pagination={pagination}
                navigation={swiperNavigationVisible}
                modules={[Pagination, Navigation]}
                className="swiper"
            >
                {questions.map((question, index) => {
                    return <SwiperSlide key={question.id ?? index}>
                        <Question questionIndex = {index}
                                  question = {question}
                                  setQuestions = {setQuestions}
                        />
                    </SwiperSlide>

                })}

            </Swiper>

            <div className="questions-pagination mt-4 flex justify-center" />
        </div>
    );
}
