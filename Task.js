import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import "tabulator-tables/dist/css/tabulator.min.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        status: "To Do",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    

    //fecthing api for dummy tdetails
    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/todos") //dummy api link
            .then((response) => response.json())
            .then((data) => {
                const formattedTasks = data
                    .slice(0, 20)
                    .map((task) => ({
                        id: task.id,
                        title: task.title,
                        description: task.description || "",
                        status: task.completed ? "Done" : task.completed === null ? "In Progress" : "To Do",
                    }));
                setTasks(formattedTasks);
            })
            .catch((error) => console.error("Error in task:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleAddTask = () => {
        if (!newTask.title || !newTask.description) {
            toast.warn("Please provide Title and Description.");
            return;
        }

        const newTaskWithId = {
            id: tasks.length + 1,
            ...newTask,
            status: newTask.status === "Done" ? true : false, // boolean values true for Done and false for to do and in process
        };

        setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
        setNewTask({ title: "", description: "", status: "To Do" });

        toast.success("Task added Successfully!");
    };

    const handleDelete = (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        toast.success("Task deleted Successfully!");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filterStatus !== "All") {
            matchesFilter = task.status === filterStatus;
        }

        return matchesSearch && matchesFilter;
    });

    const columns = [
        { title: "Task ID", field: "id", editor: false, width: 80 },
        { title: "Title", field: "title", editor: "input" },
        { title: "Description", field: "description", editor: "textarea" },
        {
            title: "Status",
            field: "status",
            editor: "select",
            editorParams: { values: ["To Do", "In Progress", "Done"] },
        },
        {
            title: "Actions",
            formatter: () => '<button class="delete-btn">Delete</button>',
            width: 100,
            cellClick: (_, cell) => handleDelete(cell.getData().id),
        },//delete button {action in table}
    ];

    // Calculate task counts
    const taskCount = {
        "To Do": tasks.filter((task) => task.status === "To Do").length,
        "In Progress": tasks.filter((task) => task.status === "In Progress").length,
        "Done": tasks.filter((task) => task.status === "Done").length,
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Task List Manager</h1>


            {/* Search Box */}
            <div className="search-container">
                <h4>Search Task Here</h4>
                <input
                    type="text"
                    placeholder="Search by Title or Description"//no not allowed 
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>







            {/* Add Task Form */}
            <div className="add-task-container mb-4 flex justify-center items-center space-x-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="p-2 border rounded"
                    value={newTask.title}
                    onChange={handleInputChange}
                    style={{ width: '200px' }}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    className="p-2 border rounded"
                    value={newTask.description}
                    onChange={handleInputChange}
                    style={{ width: '200px' }}
                />
                <select
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                <button onClick={handleAddTask} className="px-4 py-2 bg-blue-500 text-white rounded">Add Task</button>
            </div>



            {/* Task Filter */}
            <div className="task-filter-container">
                <h4>Filter Tasks</h4>
                <select
                    value={filterStatus}
                    onChange={handleFilterChange}
                    className="task-filter-select"
                >
                    <option value="All">All</option>
                    <option value="To Do">To Do ({taskCount["To Do"]})</option>
                    <option value="In Progress">In Progress ({taskCount["In Progress"]})</option>
                    <option value="Done">Done ({taskCount["Done"]})</option>
                </select>
            </div>

            {/* tabulator js table  */}
            {/* Task Table */}
            
            <div className="bg-white p-4 rounded-lg shadow-md">
                <ReactTabulator
                    data={filteredTasks}
                    columns={columns}
                    layout="fitColumns"
                    options={{
                        placeholder: "No tasks available",
                    }}
                />
            </div>
        </div>
    );
};

export default Task;
