import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { IoFilterOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./employees.css"

const EmployeeList = () => {
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://135.181.42.192/accounts/users/');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching the employees data:', error);
      }
    };

    fetchEmployees();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(employees.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const openSmallModal = (event) => {
    const buttonRect = event.target.getBoundingClientRect();
    setModalPosition({ top: buttonRect.top + window.scrollY, left: buttonRect.left + buttonRect.width });
    setIsSmallModalOpen(true);
  };

  const closeSmallModal = () => {
    setIsSmallModalOpen(false);
  };

  return (
    <div className='employee-page'>
      <h1>İşçilər</h1>
      <div className='employee-search-filter'>
        <div>
          <CiSearch />
          <input type="search" name="" id="" placeholder='İşçiləri axtar' /> <IoFilterOutline />
        </div>
        <div>
          <div>
            <button>
              <span>Vəzifə:</span>
              <span>Texniklər</span>
              <FaChevronDown />
            </button>
          </div>
          <div>
            <button>
              <span>Qrup:</span>
              <span>Hamısı</span>
              <FaChevronDown />
            </button>
          </div>
        </div>
      </div>
      <div className="employee-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Qrup</th>
              <th>Adres</th>
              <th>Nōmrǝ</th>
              <th>Vəzifə</th>
              <th>Status</th>
              <th>Məkan</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((employee) => (
              <tr key={employee.id}>
                <td>{`#${employee.id.toString().padStart(4, '0')}`}</td>
                <td>{employee.first_name} {employee.last_name}</td>
                <td>{employee.group ? employee.group.group : 'Yoxdur'}</td>
                <td>{employee.group ? employee.group.region : 'Yoxdur'}</td>
                <td>{employee.phone}</td>
                <td>{employee.user_type}</td>
                <td></td>
                <td></td>
                <td>
                  <button onClick={(e) => openSmallModal(e)}><BsThreeDotsVertical /></button>
                  {isSmallModalOpen && (
                    <div
                      ref={modalRef}
                      className={`small-modal ${isSmallModalOpen ? 'active' : ''}`}
                      style={{ top: modalPosition.top, left: modalPosition.left }}
                    >
                      <div className="small-modal-content">
                        <button>
                          <RiDeleteBin6Line />
                        </button>
                        <button>
                          <MdOutlineEdit />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          <FaArrowLeft />
        </button>
        {Array(Math.ceil(employees.length / itemsPerPage))
          .fill(0)
          .map((_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} disabled={i + 1 === currentPage}>
              {i + 1}
            </button>
          ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
