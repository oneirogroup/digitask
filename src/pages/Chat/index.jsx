import "./chat.css";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { CgSortAz } from "react-icons/cg";

function index() {
    return (
        <div className="chat-page">
            <div>
                <div>
                    <h2>
                        Chat <FaCirclePlus />
                    </h2>
                    <label className="chat-search">
                        <IoSearchOutline />
                        <input type="text" />
                        <CgSortAz />
                    </label>
                    <div>
                        <div>
                            <div>
                                <div>E</div>
                                <div>
                                    <h3>
                                        Elmar Hasanov
                                    </h3>
                                    <p>
                                        Sualım var
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p>12m</p>
                                <p>2</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
            <div></div>
        </div>
    );
}

export default index;
