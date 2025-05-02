import { message, Popconfirm } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import language from "../../../language.json";
import AddRegionModal from "./createModal.jsx";
import EditRegionModal from "./editModal.jsx";

const API_URL = "https://app.desgah.az/accounts/regions/";

const Regions = () => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalData, setModalData] = useState(null);
    const [regionModals, setRegionModals] = useState({});
    const [isAddRegionModal, setIsAddRegionModal] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const modalRef = useRef(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openAddRegionModal = () => {
        setIsAddRegionModal(true);
    };
    const closeAddRegionModal = () => {
        setIsAddRegionModal(false);
    };

    const fetchRegions = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response);
            setRegions(response.data.sort((a, b) => a.name.localeCompare(b.name)));
            initializeRegionModals(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response.status == 403) {
                await fetchRegions();
                message.error("Region göstərilərkən xəta baş verdi");
            }
        }
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    const deleteRegion = async id => {
        try {
            await axios.delete(`${API_URL}${id}/`);
            fetchRegions();
        } catch (error) {
            if (error.response.status == 403) {
                await fetchRegions();
                message.error("Region göstərilərkən xəta baş verdi");
            }
        }
    };

    const confirm = async (regionId) => {
        try {
            console.log("Deleting task with ID:", regionId);
            await deleteRegion(regionId);
            setRegionModals({});
            message.success('Tapşırıq uğurla silindi');
        } catch (error) {
            if (error.status == 403) {
                deleteRegion(regionId);
                setRegionModals({});
            }
        }
    };

    const cancel = () => {
        message.info('Silinmə ləğv edildi');
    };

    const openSmallModal = id => {
        setRegionModals(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        const handleClickOutside = event => {
            const isInModal = modalRef.current && modalRef.current.contains(event.target);
            const isInPopconfirm = event.target.closest('.custom-popconfirm') !== null;

            if (!isInModal && !isInPopconfirm) {
                setRegionModals({});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleRegionAdded = newRegion => {
        fetchRegions();
        setIsAddRegionModal(false);
    };
    const handleEditClick = region => {
        setModalData(region);
        setIsEditModalOpen(true);
    };

    return (
        <div>
            <div className="region-add-button">
                <button onClick={openAddRegionModal}>
                    <IoAdd />
                    Region əlavə et
                </button>
            </div>

            <div className="region-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ad</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {regions.map((region, index) => (
                            <tr key={region.id}>
                                <td>{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                                <td>{region.name}</td>
                                <td>
                                    <button onClick={() => openSmallModal(region.id)}>
                                        <BsThreeDotsVertical />
                                    </button>

                                    {regionModals[region.id] && (
                                        <div className="small-modal-region active" ref={modalRef}>
                                            <div className="small-modal-region-content">
                                                <button onClick={() => handleEditClick(region)}>
                                                    <MdOutlineEdit />
                                                </button>
                                                <Popconfirm
                                                    title="Bu tapşırığı silmək istədiyinizə əminsiniz?"
                                                    onConfirm={() => confirm(region.id)}
                                                    onCancel={cancel}
                                                    okText="Bəli"
                                                    cancelText="Xeyr"
                                                    overlayClassName="custom-popconfirm"
                                                >
                                                    <button><RiDeleteBin6Line /></button>
                                                </Popconfirm>
                                            </div>
                                        </div>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isAddRegionModal && <AddRegionModal onClose={closeAddRegionModal} onRegionAdded={handleRegionAdded} />}
            {isEditModalOpen && (
                <EditRegionModal
                    region={modalData}
                    onClose={() => setIsEditModalOpen(false)}
                    onRegionUpdated={fetchRegions}
                />
            )}
        </div>
    );
};

export default Regions;
