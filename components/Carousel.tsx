"use client"

import Image from "next/image"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function CarouselDemo() {
  const images = [
    "https://raw.githubusercontent.com/creativetimofficial/public-assets/refs/heads/master/creative-ai/bg-3.jpg",
    "https://raw.githubusercontent.com/creativetimofficial/public-assets/refs/heads/master/creative-ai/bg-2.jpg",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&w=2000&q=85",
  ]

  return (
    <>
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          width: 24px !important;
          height: 24px !important;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 24px !important;
        }
        .swiper-pagination-bullet {
          background: white !important;
        }
      `}</style>
      <div className="w-full max-w-4xl">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={1}
          className="rounded-lg"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}
