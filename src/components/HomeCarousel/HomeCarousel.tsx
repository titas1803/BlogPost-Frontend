import { AppState } from "@/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HomeCarouselStyle } from "./style";
import bannerImage from "@/assets/profile-banner-image.jpeg";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Navigation,
  Mousewheel,
  Keyboard,
  EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { processProfilePhotoPath } from "@/Utilities/utilities";

type TopUserType = {
  subscriberCount: number;
  _id: string;
  name: string;
  userName: string;
  photo: string;
};

export const HomeCarousel: React.FC = () => {
  const { "auth-token": authToken } = useSelector(
    (state: AppState) => state.login
  );
  const [topusers, setTopUsers] = useState<TopUserType[]>([]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchTopUser = async () => {
      const TOPUSERURL =
        import.meta.env.BLOGPOST_FRONTEND_API_URL + "/user/top-users";
      try {
        const response = await axios.get(TOPUSERURL, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          cancelToken: source.token,
        });
        if (response.data.topUsers) {
          setTopUsers(response.data.topUsers);
        }
      } catch {
        setTopUsers([]);
      }
    };
    fetchTopUser();

    return () => {
      source.cancel();
    };
  }, [authToken]);

  return topusers.length > 0 ? (
    <HomeCarouselStyle className="my-3">
      <h3>Top authors</h3>
      <Swiper
        effect={"coverflow"}
        slidesPerView={2}
        centeredSlides={true}
        spaceBetween={30}
        loop={true}
        pagination={{
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        grabCursor={true}
        navigation={true}
        mousewheel={true}
        keyboard={true}
        modules={[
          Pagination,
          Navigation,
          Mousewheel,
          Keyboard,
          EffectCoverflow,
        ]}
        className="mySwiper"
      >
        {topusers.map((user) => {
          const imgSrc = processProfilePhotoPath(user.photo);
          return (
            <SwiperSlide key={user._id} className="author-slides p-1">
              <img src={bannerImage} alt={user.userName + "cover photo"} />
              <div className="author-slide-content d-flex align-items-center">
                <div className="text-end me-2">
                  <p className="mb-0 author-name">{user.name.toUpperCase()}</p>
                  <p className="mb-0 author-username">
                    <Link
                      to={`/profile/${user._id}`}
                      className="text-decoration-none"
                    >
                      @{user.userName}
                    </Link>
                  </p>
                  <p className="mb-0 author-subscribers">
                    <strong>{user.subscriberCount}</strong> Subscibers
                  </p>
                </div>
                <div>
                  <img src={imgSrc} alt={user.userName} />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </HomeCarouselStyle>
  ) : (
    <></>
  );
};
