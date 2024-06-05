import "./import.css"

function index({ onClose }) {
    return (
        <div className="import-modal">
            <div className="import-modal-content">
                <div className='import-modal-title'>
                    <h5>Idxal</h5>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <hr />
                <form action="">
                    <div className="importModal-warehouseName">
                        <button>
                            Anbar 1
                        </button>
                        <button>
                            Anbar 2
                        </button>
                        <button>
                            Anbar 3
                        </button>
                        <button>
                            Anbar 4
                        </button>
                    </div>
                    <div className="import-form">
                        <div>
                            <label htmlFor=""></label>
                            <input type="text" />

                        </div>
                        <div>
                            <label htmlFor=""> </label>
                            <input type="text" />
                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <input type="text" />

                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <input type="text" />
                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <input type="text" />
                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <input type="text" />
                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <input type="text" />
                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <input type="text" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default index