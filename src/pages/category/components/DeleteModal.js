import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ show, onClose, onConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onConfirm}>
          삭제
        </Button>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
