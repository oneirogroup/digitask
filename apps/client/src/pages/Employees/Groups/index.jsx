import { message } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import language from "../../../language.json";
import AddGroupModal from "./createModal.jsx";
import EditGroupModal from "./editModal.jsx";

const API_URL = "https://app.desgah.az/services/user_groups/";

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
                message.error("Vəzifə göstərilərkən xəta baş verdi");
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
                message.error("Vəzifə göstərilərkən xəta baş verdi");
            }
        }
    };

    const openSmallModal = id => {
        setGroupModals(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        const handleClickOutside = event => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setGroupModals({});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getPermissionLabel = permission => {
        return language[permission] || "-";
    };

    const handleGroupAdded = newGroup => {
        fetchGroups();
        setIsAddGroupModal(false);
    };
    const handleEditClick = group => {
        setModalData(group);
        setIsEditModalOpen(true);
    };

    const groupPermission = JSON.parse(localStorage.getItem("group"));

    return (
        <div>
            {groupPermission && groupPermission.users_permission !== "read_only" && (
                <div className="group-add-button">
                    <button onClick={openAddGroupModal}>
                        <IoAdd />
                        Vəzifə əlavə et
                    </button>
                </div>
            )}
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
                                                <button onClick={() => deleteGroup(group.id)}>
                                                    <RiDeleteBin6Line />
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
