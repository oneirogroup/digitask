import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTasks = createAsyncThunk("taskList/fetchTasks", async () => {
  const response = await axios.get("http://135.181.42.192/services/tasks/");
  console.log(response.data);
  return response.data;
});

const taskSlice = createSlice({
  name: "taskList",
  initialState: {
    tasks: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export default taskSlice.reducer;
