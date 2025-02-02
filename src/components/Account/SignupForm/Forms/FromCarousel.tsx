import React from "react";
import { Carousel } from "react-bootstrap";
import { DetailsForm } from "./DetailsForm";
import { PasswordForm } from "./PasswordForm";
import { useSignUpContext } from "@/hooks/signupHook";

export const FromCarousel: React.FC = () => {
  const { activeFormIndex, setActiveFormIndex } = useSignUpContext();

  return (
    <Carousel
      activeIndex={activeFormIndex}
      onSelect={(index) => setActiveFormIndex(index)}
      interval={null}
      controls={false}
      indicators={false}
    >
      <Carousel.Item>
        <Carousel.Caption className="position-static">
          <DetailsForm />
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Carousel.Caption className="position-static text-start">
          <PasswordForm />
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};
