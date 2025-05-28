import React, { useEffect, useState } from 'react';
import './CustomPopup.css';

export interface CustomPopupProps {
    message: string;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ message, onClose, onConfirm, onCancel }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
            else if (onCancel) onCancel();
        }, 500);
    };

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(() => onCancel && onCancel(), 500);
    };

    const handleConfirm = () => {
        setIsVisible(false);
        setTimeout(() => onConfirm && onConfirm(), 500);
    };

    return (
        <div className={`custom-popup ${isVisible ? 'visible' : ''}`}>
            <div className="custom-popup-content">
                <h5>{message}</h5>
                <div className="custom-popup-buttons">
                    {onConfirm && onCancel ? (
                        <>
                        <button className="popup-btn" onClick={handleCancel}>Cancelar</button>
                        <button className="popup-btn" onClick={handleConfirm}>Aceptar</button>
                        </>
                    ) : (
                        <button className="popup-btn closeBtn" onClick={handleClose}>Cerrar</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomPopup;
