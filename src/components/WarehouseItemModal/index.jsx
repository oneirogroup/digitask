import React from 'react';
import { CiExport } from "react-icons/ci";
import { formatDate } from '../History/utils';

const WarehouseItemModal = ({ itemData, onClose }) => {

    return (
        <div className="item-detail-modal-overlay">
            <div className="item-detail-modal-content">
                <div className="item-detail-modal-header">
                    <h2>Məhsul məlumatı</h2>
                    <span className="item-detail-close-button" onClick={onClose}>&times;</span>
                </div>
                <hr />
                <div className="item-detail-modal-body">
                    <div className="modal-row">
                        <div className="modal-label">Anbar</div>
                        <div className="modal-value">{itemData.warehouse.name}</div>
                    </div>
                    <hr />
                    <div className='warehouse-item-detail-grid'>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Məhsulun adı</div>
                                <div className="modal-value">{itemData.equipment_name || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Marka</div>
                                <div className="modal-value">{itemData.brand}</div>
                            </div>
                            <hr />
                        </div>

                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Model</div>
                                <div className="modal-value">{itemData.model}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Tarix</div>
                                <div className="modal-value">{itemData.date ? formatDate(itemData.date) : 'N/A'}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">S/N</div>
                                <div className="modal-value">{itemData.serial_number}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Mac</div>
                                <div className="modal-value">{itemData.mac || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Port sayı</div>
                                <div className="modal-value">{itemData.port_number || "Qeyd yoxdur"}</div>
                            </div>
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Sayı</div>
                                <div className="modal-value">{itemData.number}</div>
                            </div>
                        </div>
                    </div>
                    <hr />

                </div>

            </div>
        </div>
    );
};

export default WarehouseItemModal;
