import { processPhotoPath } from "@/Utilities/utilities";
import React from "react";
import { Carousel } from "react-bootstrap";
import { ImageCarousel } from "./styles";

type Props = {
  images: string[];
  className?: string;
};
export const PostCarousel: React.FC<Props> = React.memo(
  ({ className, images }) => {
    return images.length ? (
      <ImageCarousel className="w-100">
        <Carousel interval={null} className={`${className}`} fade slide={false}>
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img src={processPhotoPath(image)} alt={`blogimage-${index}`} />
            </Carousel.Item>
          ))}
        </Carousel>
      </ImageCarousel>
    ) : (
      <></>
    );
  }
);
