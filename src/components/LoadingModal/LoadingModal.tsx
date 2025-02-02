import React from "react";
import { LoadingModalStyle } from "./style";
import { Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  message: string;
  className?: string;
};
export const LoadingModal: React.FC<Props> = ({ show, message, className }) => {
  return (
    <LoadingModalStyle>
      <Modal show={show} className={className}>
        <Modal.Body>{message}</Modal.Body>
      </Modal>
    </LoadingModalStyle>
  );
};
