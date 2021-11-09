import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../Button";

interface Props {
  show: boolean;
  handleClose: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: any;
  isLoading: boolean;
}
const Confirm: React.FC<Props> = ({
  handleClose,
  handleConfirm,
  show,
  isLoading,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title className="text-capitalize">
          Hapus data pabrik sarung
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Data Yang Sudah Dihapus tidak dapat dikembalikan !
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          type="submit"
          variant="danger"
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          Hapus
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Confirm;
