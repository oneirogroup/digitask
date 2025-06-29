import { message, Popconfirm } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import language from "../../../language.json";
import AddGroupModal from "./createModal.jsx";
import EditGroupModal from "./editModal.jsx";

const API_URL = "https://app.digitask.store/services/user_groups/";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalData, setModalData] = useState(null);
    const [groupModals, setGroupModals] = useState({});
    const [isAddGroupModal, setIsAddGroupModal] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const modalRef = useRef(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openAddGroupModal = () => {
        setIsAddGroupModal(true);
    };
    const closeAddGroupModal = () => {
        setIsAddGroupModal(false);
    };

    const fetchGroups = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response);
            setGroups(response.data.sort((a, b) => a.group.localeCompare(b.group)));
            initializeGroupModals(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response.status == 403) {
                await fetchGroups();
                message.error("Qrup göstərilərkən xəta baş verdi");
            }
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const deleteGroup = async id => {
        try {
            await axios.delete(`${API_URL}${id}/`);
            fetchGroups();
        } catch (error) {
            if (error.response.status == 403) {
                await fetchGroups();
                message.error("Qrup göstərilərkən xəta baş verdi");
            }
        }
    };

    const confirm = async (groupId) => {
        try {
            await deleteGroup(groupId);
            setGroupModals({});
            message.success('Tapşırıq uğurla silindi');
        } catch (error) {
            if (error.status == 403) {
                deleteGroup(groupId);
                setGroupModals({});
            }
        }
    };

    const cancel = () => {
        message.info('Silinmə ləğv edildi');
    };


    const openSmallModal = id => {
        setGroupModals(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        const handleClickOutside = event => {
            const isInModal = modalRef.current && modalRef.current.contains(event.target);
            const isInPopconfirm = event.target.closest('.custom-popconfirm') !== null;

            if (!isInModal && !isInPopconfirm) {
                setGroupModals({});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleGroupAdded = newGroup => {
        fetchGroups();
        setIsAddGroupModal(false);
    };
    const handleEditClick = group => {
        setModalData(group);
        setIsEditModalOpen(true);
    };

    return (
        <div>
            <div className="group-add-button">
                <button onClick={openAddGroupModal}>
                    <IoAdd />
                    Qrup əlavə et
                </button>
            </div>

            <div className="group-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ad</th>
                            <th>Region</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group, index) => (
                            <tr key={group.id}>
                                <td>{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                                <td>{group.group}</td>
                                <td>{group.region_name}</td>

                                <td>
                                    <button onClick={() => openSmallModal(group.id)}>
                                        <BsThreeDotsVertical />
                                    </button>

                                    {groupModals[group.id] && (
                                        <div className="small-modal-group active" ref={modalRef}>
                                            <div className="small-modal-group-content">
                                                <button onClick={() => handleEditClick(group)}>
                                                    <MdOutlineEdit />
                                                </button>
                                                <Popconfirm
                                                    title="Bu tapşırığı silmək istədiyinizə əminsiniz?"
                                                    onConfirm={() => confirm(group.id)}
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
            {isAddGroupModal && <AddGroupModal onClose={closeAddGroupModal} onGroupAdded={handleGroupAdded} />}
            {isEditModalOpen && (
                <EditGroupModal
                    group={modalData}
                    onClose={() => setIsEditModalOpen(false)}
                    onGroupUpdated={fetchGroups}
                />
            )}
        </div>
    );
};

export default Groups;
