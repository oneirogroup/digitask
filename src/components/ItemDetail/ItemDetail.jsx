import React from 'react';
import "./itemDetail.css";
import { CiExport } from "react-icons/ci";


const ItemDetail = ({ showModal, onClose, productData, handleExportModalOpen, itemId }) => {
    if (!showModal) return null;


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
                        <div className="modal-value">{productData.warehouse_name}</div>
                    </div>
                    <hr />
                    <div className='warehouse-item-detail-grid'>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Marka</div>
                                <div className="modal-value">{productData.marka}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Vendor</div>
                                <div className="modal-value">{productData.vendor || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Model</div>
                                <div className="modal-value">{productData.model}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Tarix</div>
                                <div className="modal-value">{productData.date || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">S/N</div>
                                <div className="modal-value">{productData.sn}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Mac</div>
                                <div className="modal-value">{productData.mac || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Port sayı</div>
                                <div className="modal-value">{productData.port_number || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Sayı</div>
                                <div className="modal-value">{productData.count}</div>
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>
                <div className="item-detail-modal-footer">
                    <button className="submit-btn" onClick={() => handleExportModalOpen(productData.id)}><CiExport /> Ixrac</button>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;
