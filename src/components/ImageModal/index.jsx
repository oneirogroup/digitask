import React, { useEffect, useRef } from 'react';
import './imageModal.css';

const Modal = ({ isOpen, image, onClose }) => {
    if (!isOpen) return null;

    const modalRef = useRef(null);

    const handleOverlayClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOverlayClick);
        return () => {
            document.removeEventListener("mousedown", handleOverlayClick);
        };
    }, []);

    return (
        <div className="image-modal-overlay" onClick={handleOverlayClick}>
            <div className="image-modal-content" ref={modalRef}>
                <img src={image} alt="Passport" />
            </div>
        </div>
    );
};

export default Modal;
