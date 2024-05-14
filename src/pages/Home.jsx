import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/tasks/taskSlice';

function Home() {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.taskList.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <div>
            <h1>Tasks</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <div>{task.description}</div>
                        <div>{task.services}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
