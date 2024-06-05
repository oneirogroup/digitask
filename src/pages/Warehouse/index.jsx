import "./warehouse.css"
import Warehouse from '../../components/WarehouseComponent';
import History from '../../components/History';
import { useState } from 'react'


function index() {
  const [selectedTab, setSelectedTab] = useState('anbar');


  return (
    <div className='warehouse-page'>
      <div className='warehousePage-title'>
        <p
          className={selectedTab === 'anbar' ? 'selected' : ''}
          onClick={() => setSelectedTab('anbar')}
        >
          Anbar
        </p>
        <p
          className={selectedTab === 'anbarHistory' ? 'selected' : ''}
          onClick={() => setSelectedTab('anbarHistory')}
        >
          Anbar tarixçəsi
        </p>
      </div>
      {selectedTab === 'anbar' ? <Warehouse /> : null}
      {selectedTab === 'anbarHistory' ? <History /> : null}
    </div>
  )
}

export default index