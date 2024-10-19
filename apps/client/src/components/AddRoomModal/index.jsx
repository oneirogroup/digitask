import { useState, useEffect, useRef } from 'react';
import './addRoomModal.css';
import axios from 'axios';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const AddRoomModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [members, setMembers] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://135.181.42.192/accounts/users/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setMemberOptions(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current && !modalRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        onClose();
      } if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMembersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleMemberDropdownToggle = () => {
    setShowMembersDropdown(!showMembersDropdown);
  };

  const handleSelectMember = (memberId) => {
    if (members.includes(memberId)) {
      setMembers(members.filter(id => id !== memberId));
    } else {
      setMembers([...members, memberId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://135.181.42.192/accounts/add_group/',
        {
          name: name,
          members: members,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Room added:', response.data);
      onClose();
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const token = localStorage.getItem('access_token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).user_id : null;

  const filteredMemberOptions = memberOptions.filter(member => member.id !== currentUserId);

  const selectedMemberNames = members
    .map(memberId => {
      const member = filteredMemberOptions.find(option => option.id === memberId);
      return member ? member.username : '';
    })
    .filter(name => name)
    .join(', ') || 'Üzvləri seçin';

  return (
    <div className="room-modal-overlay">
      <div className="add-room-modal-content" ref={modalRef}>
        <div className="add-room-modal-title">
          <h5>Yeni qrup</h5>
          <span onClick={onClose}>&times;</span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor="roomName">Ad</label>
            <input
              type="text"
              id="roomName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="multi-select-container form-group">
            <label htmlFor="">Üzvlər</label>
            <button type="button" className="room-multi-select-button" onClick={handleMemberDropdownToggle}>
              {selectedMemberNames}
              <span>{showMembersDropdown ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            {showMembersDropdown && (
              <div className="add-room-multi-select-dropdown" ref={dropdownRef}>
                <label htmlFor="closeMembersDropdown">
                  Üzvlər
                  <span className="close-dropdown" id="closeMembersDropdown" onClick={() => setShowMembersDropdown(false)}>&times;</span>
                </label>
                {filteredMemberOptions.map(member => (
                  <div
                    key={member.id}
                    onClick={() => handleSelectMember(member.id)}
                    className={members.includes(member.id) ? 'selected' : ''}
                  >
                    {member.username}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit">Qrup əlavə et</button>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
