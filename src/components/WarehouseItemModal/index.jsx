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
                        <div className="modal-value">{itemData.item_warehouse.name}</div>
                    </div>
                    <hr />
                    <div className='warehouse-item-detail-grid'>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Məhsul təminatçısı</div>
                                <div className="modal-value">{itemData.product_provider || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Məhsulun adı</div>
                                <div className="modal-value">{itemData.item_equipment_name || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Marka</div>
                                <div className="modal-value">{itemData.item_brand}</div>
                            </div>
                            <hr />
                        </div>

                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Model</div>
                                <div className="modal-value">{itemData.item_model}</div>
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
                                <div className="modal-label">Seriya nömrəsi</div>
                                <div className="modal-value">{itemData.item_serial_number}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Mac</div>
                                <div className="modal-value">{itemData.item_mac || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Port sayı</div>
                                <div className="modal-value">{itemData.item_port_number || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Sayı</div>
                                <div className="modal-value">{itemData.number}</div>
                            </div>
                            <hr />

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default WarehouseItemModal;
