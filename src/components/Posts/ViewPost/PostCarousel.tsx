import React from "react";
import { Carousel } from "react-bootstrap";

type Props = {
  images: string[];
  imageWidth: number;
  imageHeight: number;
  className?: string;
};
export const PostCarousel: React.FC<Props> = React.memo(
  ({ className, images, imageHeight, imageWidth }) => {
    return images.length ? (
      <Carousel interval={null} className={`${className}`}>
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              src={image}
              alt={`blogimage-${index}`}
              width={imageWidth}
              height={imageHeight}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    ) : (
      <></>
    );
  }
);
