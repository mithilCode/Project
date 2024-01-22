import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  selectedPatient: {},
  attendingDrList: [],
  isDrListLoading: false,
  ivfIdList: [],
  isIvfListLoading: false,
};
export const getAttendingDrList = createAsyncThunk(
  "get-attending-dr-list",
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get("attending-doctor/list")
        .then((res) => {
          if (res?.data?.err === 0) {
            if (res.data?.data?.length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);
export const getIvfId = createAsyncThunk(
  "ivf-flow/list",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { locationId, patientRegId, moduleId, paramsModule } = props;
      axios
        .get(`ivf-flow/list/${locationId}/${patientRegId}/${moduleId}`, paramsModule && {
          params: {
            module: paramsModule,
          },
        })
        .then((res) => {
          if (res?.data?.err === 0) {
            if (res.data?.data?.length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    setIvfIdList: (state, action) => {
      state.ivfIdList = action.payload;
    },
  },
  extraReducers: {
    [getAttendingDrList.pending]: (state) => {
      state.attendingDrList = [];
      state.isDrListLoading = true;
    },
    [getAttendingDrList.rejected]: (state) => {
      state.attendingDrList = [];
      state.isDrListLoading = false;
    },
    [getAttendingDrList.fulfilled]: (state, action) => {
      state.attendingDrList = action.payload;
      state.isDrListLoading = false;
    },
    [getIvfId.pending]: (state) => {
      state.isIvfListLoading = true;
      state.ivfIdList = [];
    },
    [getIvfId.rejected]: (state) => {
      state.isIvfListLoading = false;
      state.ivfIdList = [];
    },
    [getIvfId.fulfilled]: (state, action) => {
      state.isIvfListLoading = false;
      state.ivfIdList = action.payload;
    },
  },
});

export const {
  setSelectedPatient,
  attendingDrList,
  isDrListLoading,
  ivfIdList,
  setIvfIdList,
} = commonSlice.actions;

export default commonSlice.reducer;
