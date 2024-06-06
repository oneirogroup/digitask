import React, { useState } from 'react';
import "./import.css";

function Index({ onClose }) {
    const [activeWarehouse, setActiveWarehouse] = useState(1);

    return (
        <div className="import-modal">
            <div className="import-modal-content">
                <div className='import-modal-title'>
                    <h5>İdxal</h5>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <hr />
                <form>
                    <div className="importModal-warehouseName">
                        {["Anbar 1", "Anbar 2", "Anbar 3", "Anbar 4"].map((warehouse, index) => (
                            <button
                                type="button"
                                key={index}
                                className={activeWarehouse === index + 1 ? "active" : ""}
                                onClick={() => setActiveWarehouse(index + 1)}
                            >
                                {warehouse}
                            </button>
                        ))}
                    </div>
                    <div className="import-form">
                        {["Vendor", "Marka", "Model", "Tarix", "S/N", "Mac", "Port sayı", "Sayı"].map((label, index) => (
                            <div key={index}>
                                <label htmlFor={label.toLowerCase()}>{label}</label>
                                <input type="text" id={label.toLowerCase()} />
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="submit-btn">İdxal et</button>
                </form>
            </div>
        </div>
    );
}

export default Index;
