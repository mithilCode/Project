import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  embryologyData: {},
  embryologyDataLoading: false,
  embryologyDataUpdate: false,
};

export const createEmbryologyData = createAsyncThunk(
  "add-embryology-data",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, payload } = props;
      axios
        .post(
          `embryology/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
          payload
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data);
          } else {
            toast.success(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const getEmbryologyData = createAsyncThunk(
  "get-embryology-data",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, ivf_flow_id } = props;
      axios
        .get(
          `embryology/view/${location_id}/${patient_reg_id}/${module_id}/${ivf_flow_id}`
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            if (Object.keys(res?.data?.data).length > 0) {
              resolve(res.data?.data);
            } else {
              resolve({});
            }
          } else {
            reject({});
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const editEmbryologyData = createAsyncThunk(
  "luteal-embryology-data",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, _id, module_id, payload } = props;
      axios
        .patch(`embryology/update/${location_id}/${_id}/${module_id}`, payload)
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data);
          } else {
            toast.success(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const embryologyDataSlice = createSlice({
  name: "embryology-Data",
  initialState,
  reducers: {
    setEmbryologyDataUpdate: (state, action) => {
      state.embryologyDataUpdate = action.payload;
    },
    setEmbryologyData: (state, action) => {
      state.embryologyData = action.payload;
    },
  },
  extraReducers: {
    [createEmbryologyData.pending]: (state) => {
      state.embryologyDataUpdate = false;
      state.embryologyDataLoading = true;
    },
    [createEmbryologyData.rejected]: (state) => {
      state.embryologyDataUpdate = false;
      state.embryologyDataLoading = false;
    },
    [createEmbryologyData.fulfilled]: (state) => {
      state.embryologyDataUpdate = true;
      state.embryologyDataLoading = false;
    },
    [getEmbryologyData.pending]: (state) => {
      state.embryologyData = {};
      state.embryologyDataLoading = true;
    },
    [getEmbryologyData.rejected]: (state) => {
      state.embryologyData = {};
      state.embryologyDataLoading = false;
    },
    [getEmbryologyData.fulfilled]: (state, action) => {
      state.embryologyData = action.payload;
      state.embryologyDataLoading = false;
    },
    [editEmbryologyData.pending]: (state) => {
      state.embryologyDataLoading = true;
    },
    [editEmbryologyData.rejected]: (state) => {
      state.embryologyDataLoading = false;
    },
    [editEmbryologyData.fulfilled]: (state) => {
      state.embryologyDataLoading = false;
    },
  },
});
export const { setEmbryologyDataUpdate, setEmbryologyData } =
  embryologyDataSlice.actions;
export default embryologyDataSlice.reducer;
