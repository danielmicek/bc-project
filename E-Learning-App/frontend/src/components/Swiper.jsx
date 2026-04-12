import React, {useEffect, useRef} from 'react';
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

    useEffect(() => {
        function handleResize() {
            setSwiperNavigationVisible(window.innerWidth > 640);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

            <div className="questions-pagination mt-4 flex flex-wrap justify-center" />
        </div>
    );
}
