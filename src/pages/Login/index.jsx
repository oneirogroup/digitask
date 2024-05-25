// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTasks } from '../../features/tasks/taskSlice';
import "./login.css";
import ovaltop from "../../assets/images/Oval top.svg";
import ovalbottom from "../../assets/images/Oval bottom.svg";
import { CiMail } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";


function Login() {
    // const dispatch = useDispatch();
    // const tasks = useSelector(state => state.taskList.tasks);

    // useEffect(() => {
    //     dispatch(fetchTasks());
    // }, [dispatch]);

    return (
        <div className='bg-color'>
            <img src={ovaltop} alt="" />
            <div className='container'>
                <div className="login-page">
                    <div className="login-text">
                        <hr />
                        <h5>
                            Daxil ol
                        </h5>
                        <hr />
                    </div>
                    <div className="login-mail-password">
                        <div>
                            <p>Mail adresiniz</p>
                            <label htmlFor="">
                                <CiMail />
                                <input type="text" placeholder="Mail adresiniz" />
                            </label>
                        </div>
                        <div>
                            <p>Şifrəniz</p>
                            <label htmlFor="">
                                <IoKeyOutline />
                                <input type="password" name="" id="" placeholder="*****" />
                            </label>
                        </div>
                        <div>
                            {/* <IoMdCheckboxOutline /> */}
                            <p>
                                <MdOutlineCheckBoxOutlineBlank />
                                Məni xatırla
                            </p>
                            <a href="">
                                Şifrəni unutmusunuz?
                            </a>
                        </div>
                        <button>Daxil ol</button>
                    </div>
                </div>
            </div>
            <img src={ovalbottom} alt="" />

        </div>
    );
}

export default Login;
