import { formatDate } from '../History/utils';
import "./historyModal.css"

const HistoryModal = ({ itemData, onClose }) => {
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
                                <div className="modal-label">Marka</div>
                                <div className="modal-value">{itemData.item_marka}</div>
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
                                <div className="modal-label">Model</div>
                                <div className="modal-value">{itemData.item_model}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Tarix</div>
                                <div className="modal-value">{itemData.date ? formatDate(itemData.date) : '-'}</div>
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
                    <h2 className='history-modal-title'>Təhkimat</h2>
                    <div className="warehouse-item-detail-grid">
                        {itemData.texnik_user ?
                            <div>
                                <div className="modal-row">
                                    <div className="modal-label">Texnik</div>
                                    <div className="modal-value">{itemData.texnik_user.first_name} {itemData.texnik_user.last_name}</div>
                                </div>
                                <hr />
                            </div>
                            : ''}
                        {itemData.company ?
                            <div>
                                <div className="modal-row">
                                    <div className="modal-label">Şirkət</div>
                                    <div className="modal-value"> {itemData.company} </div>
                                </div>
                                <hr />
                            </div>
                            : ''}
                        {itemData.authorized_person ?
                            <div>
                                <div className="modal-row">
                                    <div className="modal-label">Səlahiyyətli şəxs</div>
                                    <div className="modal-value">{itemData.authorized_person}</div>
                                </div>
                                <hr />
                            </div>
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
