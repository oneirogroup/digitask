import { formatDate } from '../History/utils';
import "./historyModal.css"

const HistoryModal = ({ warehouses, itemData, onClose }) => {
    console.log(itemData,'-')
    const warehouse = warehouses.find(w => w.id === itemData.item.warehouse);

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
                        <div className="modal-value">{warehouse.name}</div> 
                    </div>
                    <hr />
                    <div className='warehouse-item-detail-grid'>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Marka</div>
                                <div className="modal-value">{itemData.item.model}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Məhsulun adı</div>
                                <div className="modal-value">{itemData.item.equipment_name || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Model</div>
                                <div className="modal-value">{itemData.item.brand}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Tarix</div>
                                <div className="modal-value">{itemData.timestamp ? formatDate(itemData.timestamp) : '-'}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Seriya nömrəsi</div>
                                <div className="modal-value">{itemData.item.serial_number}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Mac</div>
                                <div className="modal-value">{itemData.item.mac || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Port sayı</div>
                                <div className="modal-value">{itemData.port_number || "Qeyd yoxdur"}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Əvvəlki say</div>
                                <div className="modal-value">{itemData.old_count}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Sonrakı say</div>
                                <div className="modal-value">{itemData.new_count}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Aktual say</div>
                                <div className="modal-value">{itemData.item.count}</div>
                            </div>
                            <hr />
                        </div>
                        <div>
                            <div className="modal-row">
                                <div className="modal-label">Qeyd</div>
                                <div className="modal-value">{itemData.delivery_note}</div>
                            </div>
                            <hr />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
