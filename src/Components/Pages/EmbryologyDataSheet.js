import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Form, Input, Select, Spin, Tag } from "antd";
import { Table } from "antd";
import { idiopathicOption } from "utils/FieldValues";
import { TimePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TranshIcon from "../../Img/trash.svg";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import moment from "moment";
import {
  getAttendingDrList,
  getIvfId,
  setIvfIdList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import { clearData } from "redux/reducers/SearchPanel/globalSearch.slice";
import {
  createEmbryologyData,
  editEmbryologyData,
  getEmbryologyData,
} from "redux/reducers/EmbryologyData/embryologyData.slice";

export default function EmbryologyDataSheet() {
  const { TextArea } = Input;
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { selectedPatient, ivfIdList, isIvfListLoading, attendingDrList } =
    useSelector(({ common }) => common);
  const { embryologyData, embryologyDataUpdate, embryologyDataLoading } =
    useSelector(({ embryologyData }) => embryologyData);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const [doctorList, setDoctorList] = useState([{}]);
  const [ivfIdOption, setIvfIdOption] = useState([]);

  useEffect(() => {
    if (Object.keys(selectedPatient).length > 0) {
      dispatch(getAttendingDrList());
    }
  }, [dispatch, selectedPatient]);
  useEffect(() => {
    if (attendingDrList?.length > 0) {
      setDoctorList(
        attendingDrList.map((item, index) => ({
          value: item._id,
          label: item.user_name,
        }))
      );
    }
  }, [dispatch, attendingDrList]);
  const [patientDetails, setPatientDetails] = useState({
    patient_id: "",
    patient_dob: "",
    patient_full_name: "",
    partner_full_name: "",
  });

  const [embryologyDetails, setEmbryologyDetails] = useState({
    ivf_flow_id: "",
    _id: "",
    eggs: null,
    cycle_type: null,
    cycle_no: "",
    opu_done_by: null,
    opu_done_by_name: "",
    anesthesia_given_by: null,
    anesthesia_given_by_name: "",
    tesa_done_by: null,
    donor_partner_name: "",
    donor_partner_age: "",
    sperms: null,
    sperms_quality: null,
    sperms_prep_method: null,
    icsi_add_on: null,
    frozen_sperm_vial_id: "",
    icsi_ivf_done_by: "",
    assisted_by: "",
    opu_date: null,
    opu_time: null,
    actual_opu_time: null,
    amh: "",
    progesterone: "",
    lmp: "",
    lh: "",
    e2: "",
    preimplantation_generic_testing: null,
    denudation_time: null,
    icsi_ivf_time: null,
    culture_media: null,
    embryo_dev_batch_no: "",
    embryo_dev_expiry_date: null,
    day_0_date: null,
    day_0_time: null,
    day_1_date: null,
    day_1_hrs_post_icsi_: "",
    day_3_date: null,
    day_3_time: null,
    day_5_date: null,
    day_6_date: null,
    freezing_method: "",
    freezing_media: null,
    vitrification_devices: null,
    vitrification_batch_no: "",
    vitrification_expiry_date: null,
    pre_frozen_embryo_available: null,
    no_of_goblet: "",
    tank_no: "",
    no_of_straws: "",
    cannister_no: "",
    thawing_media: null,
    warming_batch_no: "",
    warming_expiry_date: null,
    distance_from_fundus: "",
    transfer_done_by: null,
    catheter: null,
    embryo_loading_by: null,
    transfer_media: null,
    total_m1: "",
    total_m2: "",
    notes: "",
  });
  const embryoTable = useMemo(() => {
    return {
      egg: "",
      stage_1: null,
      quality_of_egg: null,
      fert_check: null,
      grade: null,
      incubator: null,
      quality_of_embryo: null,
      stage_of_dev_1: null,
      icm_1: "",
      te_1: "",
      stage_of_dev_2: "",
      icm_2: "",
      te_2: "",
      date_of_freezing: null,
      vitrification_id: "",
      stage_2: null,
      straw_color: null,
      goblet_color: null,
      vitrified_by: "",
      date_of_thawing: null,
      thawing_done_by: null,
      status: null,
      date_of_transfer: null,
    };
  }, []);
  const [embryoTableData, setembryoTableData] = useState([embryoTable]);
  console.log("EmbryologyDataSheet   embryoTableData:", embryoTableData);

  const transformData = (data) => {
    if (!Array.isArray(data)) {
      throw new Error("Input data must be an array.");
    }
    return data.reduce((result, item, index) => {
      Object.entries(item).forEach(([field, value]) => {
        const dynamicKey = `${field}${index}`;
        // console.log("Object.entries   dynamicKey:", dynamicKey, field.startsWith("date_"));
        if (field.startsWith("date_") && value) {
          result[dynamicKey] = dayjs(value).format("YYYY-MM-DD");
        } else {
          result[dynamicKey] = value ?? null;
        }
      });
      return result;
    }, {});
  };
  const onChangeEmbryoData = useCallback(
    (index, field, val) => {
      let data = [...embryoTableData];
      if (!Object.isExtensible(data[index])) {
        data[index] = { ...data[index], [field]: val };
      } else {
        data[index][field] = val;
      }
      setembryoTableData(data);
    },
    [embryoTableData]
  );
  const onDeleteFeesPackage = useCallback(
    (index) => {
      let data = [...embryoTableData];
      const updatedEmbryoData = data?.filter((item, i) => i !== index);
      setembryoTableData(updatedEmbryoData);
      const newEmbryoData = transformData(updatedEmbryoData) || {};
      if (Object.entries(newEmbryoData)?.length > 0)
        form.setFieldsValue({ ...newEmbryoData });
    },
    [form, embryoTableData]
  );

  const handelfeesinput = useCallback(() => {
    const updatedPackData = [
      ...embryoTableData,
      JSON.parse(JSON.stringify({ ...embryoTable })),
    ];
    setembryoTableData(updatedPackData);
  }, [embryoTable, embryoTableData]);
  useEffect(() => {
    if (embryologyDetails?.ivf_flow_id && selectedPatient?._id) {
      dispatch(
        getEmbryologyData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: embryologyDetails?.ivf_flow_id,
        })
      );
    }
  }, [embryologyDetails?.ivf_flow_id]);
  const newPackageData = transformData(embryologyData?.embryo || []);
  console.log("EmbryologyDataSheet   newPackageData:",newPackageData);
  useEffect(() => {
    if (Object.keys(embryologyData).length > 0) {
      setEmbryologyDetails({
        ivf_flow_id: embryologyData?.ivf_flow_id,
        _id: embryologyData?._id,
        eggs: embryologyData?.eggs || null,
        cycle_type: embryologyData?.cycle_type || null,
        cycle_no: embryologyData?.cycle_no || "--",
        opu_done_by: embryologyData?.opu_done_by || null,
        opu_done_by_name: embryologyData?.opu_done_by_name || "--",
        anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
        anesthesia_given_by_name:
          embryologyData?.anesthesia_given_by_name || "--",
        tesa_done_by: embryologyData?.tesa_done_by || null,
        donor_partner_name: embryologyData?.donor_partner_name || "--",
        donor_partner_age: embryologyData?.donor_partner_age || "--",
        sperms: embryologyData?.sperms || null,
        sperms_quality: embryologyData?.sperms_quality || null,
        sperms_prep_method: embryologyData?.sperms_prep_method || null,
        icsi_add_on: embryologyData?.icsi_add_on || null,
        frozen_sperm_vial_id: embryologyData?.frozen_sperm_vial_id || "--",
        icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by || "--",
        assisted_by: embryologyData?.assisted_by || "--",
        opu_date: embryologyData?.opu_date
          ? moment(embryologyData?.opu_date).format("DD/MM/YYYY")
          : null,
        opu_time: embryologyData?.opu_time
          ? dayjs(embryologyData?.opu_time, "HH:mm:ss")
          : null,
        actual_opu_time: embryologyData?.actual_opu_time
          ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss")
          : null,
        amh: embryologyData?.amh || "--",
        progesterone: embryologyData?.progesterone || "--",
        lmp: embryologyData?.lmp || "--",
        lh: embryologyData?.lh || "--",
        e2: embryologyData?.e2 || "--",
        preimplantation_generic_testing:
          embryologyData?.preimplantation_generic_testing || null,
        denudation_time: embryologyData?.denudation_time
          ? dayjs(embryologyData?.denudation_time, "HH:mm:ss")
          : null,
        icsi_ivf_time: embryologyData?.icsi_ivf_time
          ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss")
          : null,
        culture_media: embryologyData?.culture_media || null,
        embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
        embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
          ? moment(embryologyData?.embryo_dev_expiry_date).format("DD/MM/YYYY")
          : null,
        day_0_date: embryologyData?.day_0_date
          ? moment(embryologyData?.day_0_date).format("DD/MM/YYYY")
          : null,
        day_0_time: embryologyData?.day_0_time
          ? dayjs(embryologyData?.day_0_time, "HH:mm:ss")
          : null,
        day_1_date: embryologyData?.day_1_date
          ? moment(embryologyData?.day_1_date).format("DD/MM/YYYY")
          : null,
        day_1_hrs_post_icsi_: embryologyData?.day_1_hrs_post_icsi_ || "--",
        day_3_date: embryologyData?.day_3_date
          ? moment(embryologyData?.day_3_date).format("DD/MM/YYYY")
          : null,
        day_3_time: embryologyData?.day_3_time
          ? dayjs(embryologyData?.day_3_time, "HH:mm:ss")
          : null,
        day_5_date: embryologyData?.day_5_date
          ? moment(embryologyData?.day_5_date).format("DD/MM/YYYY")
          : null,
        day_6_date: embryologyData?.day_6_date
          ? moment(embryologyData?.day_6_date).format("DD/MM/YYYY")
          : null,
        freezing_method: embryologyData?.freezing_method || "--",
        freezing_media: embryologyData?.freezing_media || null,
        vitrification_devices: embryologyData?.vitrification_devices || null,
        vitrification_batch_no: embryologyData?.vitrification_batch_no || "--",
        vitrification_expiry_date: embryologyData?.vitrification_expiry_date
          ? moment(embryologyData?.vitrification_expiry_date).format(
            "DD/MM/YYYY"
          )
          : null,
        pre_frozen_embryo_available:
          embryologyData?.pre_frozen_embryo_available || null,
        no_of_goblet: embryologyData?.no_of_goblet || "--",
        tank_no: embryologyData?.tank_no || "--",
        no_of_straws: embryologyData?.no_of_straws || "--",
        cannister_no: embryologyData?.cannister_no || "--",
        thawing_media: embryologyData?.thawing_media || null,
        warming_batch_no: embryologyData?.warming_batch_no || "--",
        warming_expiry_date: embryologyData?.warming_expiry_date
          ? moment(embryologyData?.warming_expiry_date).format("DD/MM/YYYY")
          : null,
        distance_from_fundus: embryologyData?.distance_from_fundus || "--",
        transfer_done_by: embryologyData?.transfer_done_by || null,
        catheter: embryologyData?.catheter || null,
        embryo_loading_by: embryologyData?.embryo_loading_by || null,
        transfer_media: embryologyData?.transfer_media || null,
        total_m1: embryologyData?.total_m1 || "--",
        total_m2: embryologyData?.total_m2 || "--",
        notes: embryologyData?.notes || "--",
      });
      setembryoTableData(embryologyData?.embryo || []);

      form.setFieldsValue({
        // ...newPackageData,
        ivf_flow_id: embryologyData?.ivf_flow_id,
        _id: embryologyData?._id,
        eggs: embryologyData?.eggs || null,
        cycle_type: embryologyData?.cycle_type || null,
        cycle_no: embryologyData?.cycle_no || "--",
        opu_done_by: embryologyData?.opu_done_by || null,
        opu_done_by_name: embryologyData?.opu_done_by_name || "--",
        anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
        anesthesia_given_by_name:
          embryologyData?.anesthesia_given_by_name || "--",
        tesa_done_by: embryologyData?.tesa_done_by || null,
        donor_partner_name: embryologyData?.donor_partner_name || "--",
        donor_partner_age: embryologyData?.donor_partner_age || "--",
        sperms: embryologyData?.sperms || null,
        sperms_quality: embryologyData?.sperms_quality || null,
        sperms_prep_method: embryologyData?.sperms_prep_method || null,
        icsi_add_on: embryologyData?.icsi_add_on || null,
        frozen_sperm_vial_id: embryologyData?.frozen_sperm_vial_id || "--",
        icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by || "--",
        assisted_by: embryologyData?.assisted_by || "--",
        opu_date: embryologyData?.opu_date
          ? dayjs(
            moment(embryologyData?.opu_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        opu_time: embryologyData?.opu_time
          ? dayjs(embryologyData?.opu_time, "HH:mm:ss")
          : null,
        actual_opu_time: embryologyData?.actual_opu_time
          ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss")
          : null,
        amh: embryologyData?.amh || "--",
        progesterone: embryologyData?.progesterone || "--",
        lmp: embryologyData?.lmp || "--",
        lh: embryologyData?.lh || "--",
        e2: embryologyData?.e2 || "--",
        preimplantation_generic_testing:
          embryologyData?.preimplantation_generic_testing || null,
        denudation_time: embryologyData?.denudation_time
          ? dayjs(embryologyData?.denudation_time, "HH:mm:ss")
          : null,
        icsi_ivf_time: embryologyData?.icsi_ivf_time
          ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss")
          : null,
        culture_media: embryologyData?.culture_media || null,
        embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
        embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
          ? dayjs(
            moment(embryologyData?.embryo_dev_expiry_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null,
        day_0_date: embryologyData?.day_0_date
          ? dayjs(
            moment(embryologyData?.day_0_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        day_0_time: embryologyData?.day_0_time
          ? dayjs(embryologyData?.day_0_time, "HH:mm:ss")
          : null,
        day_1_date: embryologyData?.day_1_date
          ? dayjs(
            moment(embryologyData?.day_1_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        day_1_hrs_post_icsi_: embryologyData?.day_1_hrs_post_icsi_ || "--",
        day_3_date: embryologyData?.day_3_date
          ? dayjs(
            moment(embryologyData?.day_3_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        day_3_time: embryologyData?.day_3_time
          ? dayjs(embryologyData?.day_3_time, "HH:mm:ss")
          : null,
        day_5_date: embryologyData?.day_5_date
          ? dayjs(
            moment(embryologyData?.day_5_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        day_6_date: embryologyData?.day_6_date
          ? dayjs(
            moment(embryologyData?.day_6_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        freezing_method: embryologyData?.freezing_method || "--",
        freezing_media: embryologyData?.freezing_media || null,
        vitrification_devices: embryologyData?.vitrification_devices || null,
        vitrification_batch_no: embryologyData?.vitrification_batch_no || "--",
        vitrification_expiry_date: embryologyData?.vitrification_expiry_date
          ? dayjs(
            moment(embryologyData?.vitrification_expiry_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null,
        pre_frozen_embryo_available:
          embryologyData?.pre_frozen_embryo_available || null,
        no_of_goblet: embryologyData?.no_of_goblet || "--",
        tank_no: embryologyData?.tank_no || "--",
        no_of_straws: embryologyData?.no_of_straws || "--",
        cannister_no: embryologyData?.cannister_no || "--",
        thawing_media: embryologyData?.thawing_media || null,
        warming_batch_no: embryologyData?.warming_batch_no || "--",
        warming_expiry_date: embryologyData?.warming_expiry_date
          ? dayjs(
            moment(embryologyData?.warming_expiry_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        distance_from_fundus: embryologyData?.distance_from_fundus || "--",
        transfer_done_by: embryologyData?.transfer_done_by || null,
        catheter: embryologyData?.catheter || null,
        embryo_loading_by: embryologyData?.embryo_loading_by || null,
        transfer_media: embryologyData?.transfer_media || null,
        total_m1: embryologyData?.total_m1 || "--",
        total_m2: embryologyData?.total_m2 || "--",
        notes: embryologyData?.notes || "--",
      });
    }
  }, [form, embryologyData]);

  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);
  useEffect(() => {
    if (selectedPatient && Object.keys(selectedPatient).length > 0) {
      setPatientDetails({
        patient_id: selectedPatient?.patient_id,
        patient_full_name: selectedPatient?.patient_full_name,
        partner_full_name: selectedPatient?.partner_full_name,
        patient_dob: selectedPatient?.patient_dob,
      });
      form.setFieldsValue({
        patient_id: selectedPatient?.patient_id,
        patient_full_name: selectedPatient?.patient_full_name,
        partner_full_name: selectedPatient?.partner_full_name,
        patient_dob: moment().diff(selectedPatient?.patient_dob, "years"),
      });
      return () => {
        clearEmbryologyData();
        dispatch(setIvfIdList([]));
      };
    }
  }, [form, selectedPatient, dispatch]);

  useEffect(() => {
    if (
      Object.keys(selectedModule)?.length > 0 &&
      Object.keys(selectedPatient)?.length > 0 &&
      selectedLocation
    ) {
      dispatch(
        getIvfId({
          locationId: selectedLocation,
          patientRegId: selectedPatient?._id,
          moduleId: selectedModule?._id,
        })
      );
    }
  }, [dispatch, selectedLocation, selectedModule, selectedPatient]);

  useEffect(() => {
    if (ivfIdList.length > 0) {
      const ivfListId = ivfIdList?.map((item) => ({
        value: item._id,
        label: item.ivf_id,
        protocol: item.protocol,
      }));
      setIvfIdOption(ivfListId);
      setEmbryologyDetails((prevDetails) => ({
        ...prevDetails,
        ivf_flow_id: ivfListId[0]?.value,
        protocol: ivfListId[0]?.protocol,
      }));
      form.setFieldsValue({
        ivf_flow_id: ivfListId[0]?.value,
        protocol: ivfListId[0]?.protocol,
      });
    }
  }, [form, ivfIdList]);

  const handleIvfId = useCallback(
    (id) => {
      const findList = ivfIdOption?.find((item) => item.value === id);
      if (findList) {
        setEmbryologyDetails({
          ivf_flow_id: findList?.value,
          protocol: findList?.protocol,
          eggs: embryologyData?.eggs || null,
          cycle_type: embryologyData?.cycle_type || null,
          cycle_no: embryologyData?.cycle_no || "--",
          opu_done_by: embryologyData?.opu_done_by || null,
          opu_done_by_name: embryologyData?.opu_done_by_name || "--",
          anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
          anesthesia_given_by_name:
            embryologyData?.anesthesia_given_by_name || "--",
          tesa_done_by: embryologyData?.tesa_done_by || null,
          donor_partner_name: embryologyData?.donor_partner_name || "--",
          donor_partner_age: embryologyData?.donor_partner_age || "--",
          sperms: embryologyData?.sperms || null,
          sperms_quality: embryologyData?.sperms_quality || null,
          sperms_prep_method: embryologyData?.sperms_prep_method || null,
          icsi_add_on: embryologyData?.icsi_add_on || null,
          frozen_sperm_vial_id: embryologyData?.frozen_sperm_vial_id || "--",
          icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by || "--",
          assisted_by: embryologyData?.assisted_by || "--",
          opu_date: embryologyData?.opu_date
            ? moment(embryologyData?.opu_date).format("DD/MM/YYYY")
            : null,
          opu_time: embryologyData?.opu_time
            ? dayjs(embryologyData?.opu_time, "HH:mm:ss")
            : null,
          actual_opu_time: embryologyData?.actual_opu_time
            ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss")
            : null,
          amh: embryologyData?.amh || "--",
          progesterone: embryologyData?.progesterone || "--",
          lmp: embryologyData?.lmp || "--",
          lh: embryologyData?.lh || "--",
          e2: embryologyData?.e2 || "--",
          preimplantation_generic_testing:
            embryologyData?.preimplantation_generic_testing || null,
          denudation_time: embryologyData?.denudation_time
            ? dayjs(embryologyData?.denudation_time, "HH:mm:ss")
            : null,
          icsi_ivf_time: embryologyData?.icsi_ivf_time
            ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss")
            : null,
          culture_media: embryologyData?.culture_media || null,
          embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
          embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
            ? moment(embryologyData?.embryo_dev_expiry_date).format(
              "DD/MM/YYYY"
            )
            : null,
          day_0_date: embryologyData?.day_0_date
            ? moment(embryologyData?.day_0_date).format("DD/MM/YYYY")
            : null,
          day_0_time: embryologyData?.day_0_time
            ? dayjs(embryologyData?.day_0_time, "HH:mm:ss")
            : null,
          day_1_date: embryologyData?.day_1_date
            ? moment(embryologyData?.day_1_date).format("DD/MM/YYYY")
            : null,
          day_1_hrs_post_icsi_: embryologyData?.day_1_hrs_post_icsi_ || "--",
          day_3_date: embryologyData?.day_3_date
            ? moment(embryologyData?.day_3_date).format("DD/MM/YYYY")
            : null,
          day_3_time: embryologyData?.day_3_time
            ? dayjs(embryologyData?.day_3_time, "HH:mm:ss")
            : null,
          day_5_date: embryologyData?.day_5_date
            ? moment(embryologyData?.day_5_date).format("DD/MM/YYYY")
            : null,
          day_6_date: embryologyData?.day_6_date
            ? moment(embryologyData?.day_6_date).format("DD/MM/YYYY")
            : null,
          freezing_method: embryologyData?.freezing_method || "--",
          freezing_media: embryologyData?.freezing_media || null,
          vitrification_devices: embryologyData?.vitrification_devices || null,
          vitrification_batch_no:
            embryologyData?.vitrification_batch_no || "--",
          vitrification_expiry_date: embryologyData?.vitrification_expiry_date
            ? moment(embryologyData?.vitrification_expiry_date).format(
              "DD/MM/YYYY"
            )
            : null,
          pre_frozen_embryo_available:
            embryologyData?.pre_frozen_embryo_available || null,
          no_of_goblet: embryologyData?.no_of_goblet || "--",
          tank_no: embryologyData?.tank_no || "--",
          no_of_straws: embryologyData?.no_of_straws || "--",
          cannister_no: embryologyData?.cannister_no || "--",
          thawing_media: embryologyData?.thawing_media || null,
          warming_batch_no: embryologyData?.warming_batch_no || "--",
          warming_expiry_date: embryologyData?.warming_expiry_date
            ? moment(embryologyData?.warming_expiry_date).format("DD/MM/YYYY")
            : null,
          distance_from_fundus: embryologyData?.distance_from_fundus || "--",
          transfer_done_by: embryologyData?.transfer_done_by || null,
          catheter: embryologyData?.catheter || null,
          embryo_loading_by: embryologyData?.embryo_loading_by || null,
          transfer_media: embryologyData?.transfer_media || null,
          total_m1: embryologyData?.total_m1 || "--",
          total_m2: embryologyData?.total_m2 || "--",
          notes: embryologyData?.notes || "--",
        });
        form.setFieldsValue({
          ivf_flow_id: findList?.value,
          protocol: findList?.protocol,
          eggs: embryologyData?.eggs || null,
          cycle_type: embryologyData?.cycle_type || null,
          cycle_no: embryologyData?.cycle_no || "--",
          opu_done_by: embryologyData?.opu_done_by || null,
          opu_done_by_name: embryologyData?.opu_done_by_name || "--",
          anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
          anesthesia_given_by_name:
            embryologyData?.anesthesia_given_by_name || "--",
          tesa_done_by: embryologyData?.tesa_done_by || null,
          donor_partner_name: embryologyData?.donor_partner_name || "--",
          donor_partner_age: embryologyData?.donor_partner_age || "--",
          sperms: embryologyData?.sperms || null,
          sperms_quality: embryologyData?.sperms_quality || null,
          sperms_prep_method: embryologyData?.sperms_prep_method || null,
          icsi_add_on: embryologyData?.icsi_add_on || null,
          frozen_sperm_vial_id: embryologyData?.frozen_sperm_vial_id || "--",
          icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by || "--",
          assisted_by: embryologyData?.assisted_by || "--",
          opu_date: embryologyData?.opu_date
            ? dayjs(
              moment(embryologyData?.opu_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          opu_time: embryologyData?.opu_time
            ? dayjs(embryologyData?.opu_time, "HH:mm:ss")
            : null,
          actual_opu_time: embryologyData?.actual_opu_time
            ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss")
            : null,
          amh: embryologyData?.amh || "--",
          progesterone: embryologyData?.progesterone || "--",
          lmp: embryologyData?.lmp || "--",
          lh: embryologyData?.lh || "--",
          e2: embryologyData?.e2 || "--",
          preimplantation_generic_testing:
            embryologyData?.preimplantation_generic_testing || null,
          denudation_time: embryologyData?.denudation_time
            ? dayjs(embryologyData?.denudation_time, "HH:mm:ss")
            : null,
          icsi_ivf_time: embryologyData?.icsi_ivf_time
            ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss")
            : null,
          culture_media: embryologyData?.culture_media || null,
          embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
          embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
            ? dayjs(
              moment(embryologyData?.embryo_dev_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          day_0_date: embryologyData?.day_0_date
            ? dayjs(
              moment(embryologyData?.day_0_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_0_time: embryologyData?.day_0_time
            ? dayjs(embryologyData?.day_0_time, "HH:mm:ss")
            : null,
          day_1_date: embryologyData?.day_1_date
            ? dayjs(
              moment(embryologyData?.day_1_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_1_hrs_post_icsi_: embryologyData?.day_1_hrs_post_icsi_ || "--",
          day_3_date: embryologyData?.day_3_date
            ? dayjs(
              moment(embryologyData?.day_3_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_3_time: embryologyData?.day_3_time
            ? dayjs(embryologyData?.day_3_time, "HH:mm:ss")
            : null,
          day_5_date: embryologyData?.day_5_date
            ? dayjs(
              moment(embryologyData?.day_5_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_6_date: embryologyData?.day_6_date
            ? dayjs(
              moment(embryologyData?.day_6_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          freezing_method: embryologyData?.freezing_method || "--",
          freezing_media: embryologyData?.freezing_media || null,
          vitrification_devices: embryologyData?.vitrification_devices || null,
          vitrification_batch_no:
            embryologyData?.vitrification_batch_no || "--",
          vitrification_expiry_date: embryologyData?.vitrification_expiry_date
            ? dayjs(
              moment(embryologyData?.vitrification_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          pre_frozen_embryo_available:
            embryologyData?.pre_frozen_embryo_available || null,
          no_of_goblet: embryologyData?.no_of_goblet || "--",
          tank_no: embryologyData?.tank_no || "--",
          no_of_straws: embryologyData?.no_of_straws || "--",
          cannister_no: embryologyData?.cannister_no || "--",
          thawing_media: embryologyData?.thawing_media || null,
          warming_batch_no: embryologyData?.warming_batch_no || "--",
          warming_expiry_date: embryologyData?.warming_expiry_date
            ? dayjs(
              moment(embryologyData?.warming_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          distance_from_fundus: embryologyData?.distance_from_fundus || "--",
          transfer_done_by: embryologyData?.transfer_done_by || null,
          catheter: embryologyData?.catheter || null,
          embryo_loading_by: embryologyData?.embryo_loading_by || null,
          transfer_media: embryologyData?.transfer_media || null,
          total_m1: embryologyData?.total_m1 || "--",
          total_m2: embryologyData?.total_m2 || "--",
          notes: embryologyData?.notes || "--",
        });
      }
    },
    [form, ivfIdOption]
  );
  const onFinish = (values) => {
    const obj = {
      ...embryologyDetails,
      embryo: embryoTableData,
    };
    console.log("obj", obj);
    if (Object.keys(embryologyData)?.length > 0) {
      dispatch(
        editEmbryologyData({
          location_id: selectedLocation,
          _id: embryologyDetails?._id,
          module_id: selectedModule?._id,
          payload: obj,
        })
      );
    } else {
      dispatch(
        createEmbryologyData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          payload: obj,
        })
      );
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const clearEmbryologyData = useCallback(() => {
    setPatientDetails({
      patient_id: "",
      patient_dob: "",
      patient_full_name: "",
      partner_full_name: "",
    });
    setIvfIdOption([]);
    setEmbryologyDetails({
      ivf_flow_id: "",
      eggs: null,
      cycle_type: null,
      cycle_no: "",
      opu_done_by: null,
      opu_done_by_name: "",
      anesthesia_given_by: null,
      anesthesia_given_by_name: "",
      tesa_done_by: null,
      donor_partner_name: "",
      donor_partner_age: "",
      sperms: null,
      sperms_quality: null,
      sperms_prep_method: null,
      icsi_add_on: null,
      frozen_sperm_vial_id: "",
      icsi_ivf_done_by: "",
      assisted_by: "",
      opu_date: null,
      opu_time: null,
      actual_opu_time: null,
      amh: "",
      progesterone: "",
      lmp: "",
      lh: "",
      e2: "",
      preimplantation_generic_testing: null,
      denudation_time: null,
      icsi_ivf_time: null,
      culture_media: null,
      embryo_dev_batch_no: "",
      embryo_dev_expiry_date: null,
      day_0_date: null,
      day_0_time: null,
      day_1_date: null,
      day_1_hrs_post_icsi_: "",
      day_3_date: null,
      day_3_time: null,
      day_5_date: null,
      day_6_date: null,
      freezing_method: "",
      freezing_media: null,
      vitrification_devices: null,
      vitrification_batch_no: "",
      vitrification_expiry_date: null,
      pre_frozen_embryo_available: null,
      no_of_goblet: "",
      tank_no: "",
      no_of_straws: "",
      cannister_no: "",
      thawing_media: null,
      warming_batch_no: "",
      warming_expiry_date: null,
      distance_from_fundus: "",
      transfer_done_by: null,
      catheter: null,
      embryo_loading_by: null,
      transfer_media: null,
      total_m1: "",
      total_m2: "",
      notes: "",
    });
    form.resetFields();
  }, [form]);

  const handleClear = () => {
    clearEmbryologyData();
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdList([]));
    dispatch(clearData());
  };

  useEffect(() => {
    const slider = document.querySelector(
      ".custom_table_Wrap .table-responsive"
    );
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
    });
  }, []);

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {(isIvfListLoading || embryologyDataLoading) && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="form_process_wrapper">
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                <li className="w_350 w_xs_100">
                  <Form.Item label="Patient name" name="patient_full_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={patientDetails?.patient_full_name}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="Age" name="patient_dob">
                    <Input
                      placeholder="Enter Age"
                      name="patient_dob"
                      value={patientDetails?.patient_dob}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item label="Eggs" name="eggs" className="custom_select">
                    <Select
                      placeholder="Select"
                      name="eggs"
                      value={embryologyDetails?.eggs}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          eggs: value,
                        });
                      }}
                      options={[
                        { value: "Own fresh", label: "Own fresh" },
                        { value: "Donor fresh", label: "Donor fresh" },
                        { value: "Own frozen", label: "Own frozen" },
                        { value: "Donor frozen", label: "Donor frozen" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Cycle type"
                    name="cycle_type"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="cycle_type"
                      value={embryologyDetails?.cycle_type}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          cycle_type: value,
                        });
                      }}
                      options={[
                        { value: "Own", label: "Own" },
                        { value: "OD", label: "OD" },
                        { value: "DS", label: "DS" },
                        { value: "ED", label: "ED" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="Cycle No" name="cycle_no">
                    <Input
                      placeholder="Enter No"
                      name="cycle_no"
                      value={embryologyDetails?.cycle_no}
                      onChange={(e) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          cycle_no: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_120">
                  <Form.Item label="Pt. ID no." name="patient_id">
                    <Input
                      placeholder="Enter No"
                      name="patient_id"
                      value={patientDetails?.patient_id}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_180 w_xs_100">
                  <Form.Item
                    label="IVF ID"
                    name="ivf_flow_id"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="ivf_flow_id"
                      options={ivfIdOption}
                      value={embryologyDetails?.ivf_flow_id}
                      onChange={(e) => {
                        handleIvfId(e);
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="OPU done by"
                    name="opu_done_by"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="opu_done_by"
                      value={embryologyDetails?.opu_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          opu_done_by: value,
                          opu_done_by_name: "",
                        });
                        form.setFieldsValue({
                          opu_done_by_name: "",
                        });
                      }}
                      options={[
                        ...doctorList,
                        { label: "Other", value: "Other" },
                      ]}
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.opu_done_by === "Other" && (
                  <li>
                    <Form.Item label="OPU done by Name" name="opu_done_by_name">
                      <Input
                        placeholder="Enter Partner Name"
                        name="opu_done_by_name"
                        value={embryologyDetails?.opu_done_by_name}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            opu_done_by_name: e.target.value,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Anesthesia given by"
                    name="anesthesia_given_by"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="anesthesia_given_by"
                      value={embryologyDetails?.anesthesia_given_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          anesthesia_given_by: value,
                          anesthesia_given_by_name: "",
                        });
                        form.setFieldsValue({
                          anesthesia_given_by_name: "",
                        });
                      }}
                      options={[
                        ...doctorList,
                        { label: "Other", value: "Other" },
                      ]}
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.anesthesia_given_by === "Other" && (
                  <li>
                    <Form.Item
                      label="Anesthesia given by Name"
                      name="anesthesia_given_by_name"
                    >
                      <Input
                        placeholder="Enter Partner Name"
                        name="anesthesia_given_by_name"
                        value={embryologyDetails?.anesthesia_given_by_name}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            anesthesia_given_by_name: e.target.value,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="TESA done by"
                    name="tesa_done_by"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="tesa_done_by"
                      value={embryologyDetails?.tesa_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          tesa_done_by: value,
                        });
                      }}
                      options={doctorList}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item label="Partner Name" name="partner_full_name">
                    <Input
                      placeholder="Enter Partner Name"
                      name="partner_full_name"
                      value={patientDetails?.partner_full_name}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Partner Details</h3>
              <ul className="grid_wrapper">
                <li className="w_350 w_xs_100">
                  <Form.Item label="Partner Name" name="donor_partner_name">
                    <Input
                      placeholder="Enter Partner Name"
                      name="donor_partner_name"
                      value={embryologyDetails?.donor_partner_name}
                      onChange={(e) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          donor_partner_name: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="Age" name="donor_partner_age">
                    <Input
                      placeholder="Enter Age"
                      name="donor_partner_age"
                      value={embryologyDetails?.donor_partner_age}
                      onChange={(e) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          donor_partner_age: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="Sperms"
                    name="sperms"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="sperms"
                      value={embryologyDetails?.sperms}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          sperms: value,
                        });
                      }}
                      options={[
                        { value: "Own fresh", label: "Own fresh" },
                        { value: "Donor fresh", label: "Donor fresh" },
                        { value: "Own frozen", label: "Own frozen" },
                        { value: "Donor frozen", label: "Donor frozen" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Sperm quality"
                    name="sperms_quality"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="sperms_quality"
                      value={embryologyDetails?.sperms_quality}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          sperms_quality: value,
                        });
                      }}
                      options={idiopathicOption}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="Sperm prep. Method"
                    name="sperms_prep_method"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="sperms_prep_method"
                      value={embryologyDetails?.sperms_prep_method}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          sperms_prep_method: value,
                        });
                      }}
                      options={[
                        { value: "SWIM-UP", label: "SWIM-UP" },
                        { value: "SWIM-DOWN", label: "SWIM-DOWN" },
                        { value: "SIMPLE WASH", label: "SIMPLE WASH" },
                        { value: "zymot", label: "zymot" },
                        { value: "CAO", label: "CAO" },
                        { value: "MACS", label: "MACS" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="ICSI Add on"
                    name="icsi_add_on"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="icsi_add_on"
                      value={embryologyDetails?.icsi_add_on}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          icsi_add_on: value,
                        });
                      }}
                      options={[
                        { value: "PICSI", label: "PICSI" },
                        {
                          value: "Oocyte activation media",
                          label: "Oocyte activation media",
                        },
                        { value: "Sperm mobil", label: "Sperm mobil" },
                        { value: "LAH", label: "LAH" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_100">
                  <Form.Item
                    label="Frozen sperm vial ID"
                    name="frozen_sperm_vial_id"
                  >
                    <Input
                      placeholder="ID"
                      name="frozen_sperm_vial_id"
                      value={embryologyDetails?.frozen_sperm_vial_id}
                      onChange={(e) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          frozen_sperm_vial_id: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="ICSI/IVF done by"
                    name="icsi_ivf_done_by"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="icsi_ivf_done_by"
                      value={embryologyDetails?.icsi_ivf_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          icsi_ivf_done_by: value,
                        });
                      }}
                      options={doctorList}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Assisted by"
                    name="assisted_by"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="assisted_by"
                      value={embryologyDetails?.assisted_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          assisted_by: value,
                        });
                      }}
                      options={doctorList}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item label="Protocol" name="protocol">
                    <Input
                      placeholder="Protocol"
                      name="protocol"
                      value={embryologyDetails?.protocol}
                      disabled
                    />
                  </Form.Item>
                </li>
              </ul>
              <div className="custom_table_Wrap pb-4">
                <div className="table-responsive">
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan="13">
                          <h4>EMBRYO DEVELOPMENT</h4>
                        </td>
                        <td colSpan="6">
                          <h4>VITRIFICATION DETAILS</h4>
                        </td>
                        <td colSpan="5">
                          <h4>WARMING DETAILS</h4>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="13">
                          <div className="embryo_development_wrap">
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_190">
                                <Form.Item label="OPU date" name="opu_date">
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="opu_date"
                                    value={
                                      embryologyDetails?.opu_date
                                        ? dayjs(
                                          embryologyDetails?.opu_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={["DD/MM/YYYY"]}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        opu_date: moment(new Date(e)).format(
                                          "YYYY/MM/DD"
                                        ),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item label="OPU time" name="opu_time">
                                  <TimePicker
                                    name="opu_time"
                                    value={embryologyDetails?.opu_time}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        opu_time: moment(new Date(e)).format(
                                          "HH:mm:ss"
                                        ),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="Actual opu time"
                                  name="actual_opu_time"
                                >
                                  <TimePicker
                                    name="actual_opu_time"
                                    value={embryologyDetails?.actual_opu_time}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        actual_opu_time: moment(
                                          new Date(e)
                                        ).format("HH:mm:ss"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item label="AMH" name="amh">
                                  <Input
                                    placeholder="Enter AMH"
                                    name="amh"
                                    value={embryologyDetails?.amh}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        amh: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Progesterone"
                                  name="progesterone"
                                >
                                  <Input
                                    placeholder="Enter Progesterone"
                                    name="progesterone"
                                    value={embryologyDetails?.progesterone}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        progesterone: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item label="LMP" name="lmp">
                                  <Input
                                    placeholder="Enter LMP"
                                    name="lmp"
                                    value={embryologyDetails?.lmp}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        lmp: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item label="LH" name="lh">
                                  <Input
                                    placeholder="Enter LH"
                                    name="lh"
                                    value={embryologyDetails?.lh}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        lh: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item label="E2" name="e2">
                                  <Input
                                    placeholder="Enter E2"
                                    name="e2"
                                    value={embryologyDetails?.e2}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        e2: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_250 w_xs_50">
                                <Form.Item
                                  label="Preimplantation Genetic Testing ?"
                                  name="preimplantation_generic_testing"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="preimplantation_generic_testing"
                                    value={
                                      embryologyDetails?.preimplantation_generic_testing
                                    }
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        preimplantation_generic_testing: value,
                                      });
                                    }}
                                    options={[
                                      { value: "PGT-A", label: "PGT-A" },
                                      { value: "PGT-M", label: "PGT-M" },
                                      { value: "PGT-SR", label: "PGT-SR" },
                                      { value: "No", label: "No" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_190">
                                <Form.Item
                                  label="Denudation time"
                                  name="denudation_time"
                                >
                                  <TimePicker
                                    name="denudation_time"
                                    value={embryologyDetails?.denudation_time}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        denudation_time: moment(
                                          new Date(e)
                                        ).format("HH:mm:ss"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="ICSI/IVF TIME"
                                  name="icsi_ivf_time"
                                >
                                  <TimePicker
                                    name="icsi_ivf_time"
                                    value={embryologyDetails?.icsi_ivf_time}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        icsi_ivf_time: moment(
                                          new Date(e)
                                        ).format("HH:mm:ss"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_200">
                                <Form.Item
                                  label="Culture media"
                                  name="culture_media"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="culture_media"
                                    value={embryologyDetails?.culture_media}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        culture_media: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Sage", label: "Sage" },
                                      { value: "Vitromed", label: "Vitromed" },
                                      {
                                        value: "Vitrolife",
                                        label: "Vitrolife",
                                      },
                                      { value: "Cook’s", label: "Cook’s" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Batch no."
                                  name="embryo_dev_batch_no"
                                >
                                  <Input
                                    placeholder="Enter Batch no."
                                    name="embryo_dev_batch_no"
                                    value={
                                      embryologyDetails?.embryo_dev_batch_no
                                    }
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_dev_batch_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Expiry Date"
                                  name="embryo_dev_expiry_date"
                                >
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="embryo_dev_expiry_date"
                                    value={
                                      embryologyDetails?.embryo_dev_expiry_date
                                        ? dayjs(
                                          embryologyDetails?.embryo_dev_expiry_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={["DD/MM/YYYY"]}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_dev_expiry_date: moment(
                                          new Date(e)
                                        ).format("YYYY/MM/DD"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td colSpan="6" rowSpan={2}>
                          <div className="verification_detail_wrap">
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_190">
                                <Form.Item
                                  label="Freezing Method"
                                  name="freezing_method"
                                >
                                  <Input
                                    placeholder="Enter Freezing Method"
                                    name="freezing_method"
                                    value={embryologyDetails?.freezing_method}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        freezing_method: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="Freezing media"
                                  name="freezing_media"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="freezing_media"
                                    value={embryologyDetails?.freezing_media}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        freezing_media: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Cryotech", label: "Cryotech" },
                                      { value: "Kitazato", label: "Kitazato" },
                                      { value: "Origio", label: "Origio" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Vitrification Device"
                                  name="vitrification_devices"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="vitrification_devices"
                                    value={
                                      embryologyDetails?.vitrification_devices
                                    }
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        vitrification_devices: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Cryotech", label: "Cryotech" },
                                      { value: "Cryoleaf", label: "Cryoleaf" },
                                      { value: "Cryotop", label: "Cryotop" },
                                      { value: "Cryolock", label: "Cryolock" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_190">
                                <Form.Item
                                  label="Batch no."
                                  name="vitrification_batch_no"
                                >
                                  <Input
                                    placeholder="Enter Batch no."
                                    name="vitrification_batch_no"
                                    value={
                                      embryologyDetails?.vitrification_batch_no
                                    }
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        vitrification_batch_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Expiry Date"
                                  name="vitrification_expiry_date"
                                >
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="vitrification_expiry_date"
                                    value={
                                      embryologyDetails?.vitrification_expiry_date
                                        ? dayjs(
                                          embryologyDetails?.vitrification_expiry_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={["DD/MM/YYYY"]}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        vitrification_expiry_date: moment(
                                          new Date(e)
                                        ).format("YYYY/MM/DD"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_50">
                                <Form.Item
                                  label="Previously frozen embryos available ? "
                                  name="pre_frozen_embryo_available"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="pre_frozen_embryo_available"
                                    value={
                                      embryologyDetails?.pre_frozen_embryo_available
                                    }
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        pre_frozen_embryo_available: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Yes", label: "Yes" },
                                      { value: "No", label: "No" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_140">
                                <Form.Item
                                  label="No. of Goblet"
                                  name="no_of_goblet"
                                >
                                  <Input
                                    placeholder="Enter No."
                                    name="no_of_goblet"
                                    value={embryologyDetails?.no_of_goblet}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        no_of_goblet: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_140">
                                <Form.Item label="Tank No." name="tank_no">
                                  <Input
                                    placeholder="Enter No."
                                    name="tank_no"
                                    value={embryologyDetails?.tank_no}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        tank_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_140">
                                <Form.Item
                                  label="No. of straws"
                                  name="no_of_straws"
                                >
                                  <Input
                                    placeholder="Enter No."
                                    name="no_of_straws"
                                    value={embryologyDetails?.no_of_straws}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        no_of_straws: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_140">
                                <Form.Item
                                  label="Cannister No."
                                  name="cannister_no"
                                >
                                  <Input
                                    placeholder="Enter No."
                                    name="cannister_no"
                                    value={embryologyDetails?.cannister_no}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        cannister_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td colSpan="5">
                          <div className="warming_detail_wrap">
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_200">
                                <Form.Item
                                  label="Thawing media"
                                  name="thawing_media"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="thawing_media"
                                    value={embryologyDetails?.thawing_media}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        thawing_media: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Cryotech", label: "Cryotech" },
                                      { value: "Kitazato", label: "Kitazato" },
                                      { value: "Origio", label: "Origio" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_200">
                                <Form.Item
                                  label="Batch no."
                                  name="warming_batch_no"
                                >
                                  <Input
                                    placeholder="Enter Batch no."
                                    name="warming_batch_no"
                                    value={embryologyDetails?.warming_batch_no}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        warming_batch_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Expiry Date"
                                  name="warming_expiry_date"
                                >
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="warming_expiry_date"
                                    value={
                                      embryologyDetails?.warming_expiry_date
                                        ? dayjs(
                                          embryologyDetails?.warming_expiry_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={["DD/MM/YYYY"]}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        warming_expiry_date: moment(
                                          new Date(e)
                                        ).format("YYYY/MM/DD"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <h4>Day 0</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_0_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_0_date"
                                value={
                                  embryologyDetails?.day_0_date
                                    ? dayjs(
                                      embryologyDetails?.day_0_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={["DD/MM/YYYY"]}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_0_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                          <li className="w_100">
                            <Form.Item label="Time" name="day_0_time">
                              <TimePicker
                                name="day_0_time"
                                value={embryologyDetails?.day_0_time}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_0_time: moment(new Date(e)).format(
                                      "HH:mm:ss"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td>
                          <h4>Day 1</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_1_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_1_date"
                                value={
                                  embryologyDetails?.day_1_date
                                    ? dayjs(
                                      embryologyDetails?.day_1_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={["DD/MM/YYYY"]}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_1_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                          <li className="w_100">
                            <Form.Item
                              label="Hrs. post ICSI"
                              name="day_1_hrs_post_icsi_"
                            >
                              <Input
                                placeholder="Enter ICSI"
                                name="day_1_hrs_post_icsi_"
                                value={embryologyDetails?.day_1_hrs_post_icsi_}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_1_hrs_post_icsi_: e.target.value,
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td colSpan={3}>
                          <h4>Day 3</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_3_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_3_date"
                                value={
                                  embryologyDetails?.day_3_date
                                    ? dayjs(
                                      embryologyDetails?.day_3_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={["DD/MM/YYYY"]}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_3_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                          <li className="w_100">
                            <Form.Item label="Time" name="day_3_time">
                              <TimePicker
                                name="day_3_time"
                                value={embryologyDetails?.day_3_time}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_3_time: moment(new Date(e)).format(
                                      "HH:mm:ss"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td colSpan={3}>
                          <h4>Day 5</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_5_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_5_date"
                                value={
                                  embryologyDetails?.day_5_date
                                    ? dayjs(
                                      embryologyDetails?.day_5_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={["DD/MM/YYYY"]}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_5_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td colSpan={3}>
                          <h4>Day 6</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_6_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_6_date"
                                value={
                                  embryologyDetails?.day_6_date
                                    ? dayjs(
                                      embryologyDetails?.day_6_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={["DD/MM/YYYY"]}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_6_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td colSpan={5}>
                          <div className="warming_detail_wrap">
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_220">
                                <Form.Item
                                  label="Distance from fundus"
                                  name="distance_from_fundus"
                                >
                                  <Input
                                    placeholder="Enter fundus"
                                    name="distance_from_fundus"
                                    value={
                                      embryologyDetails?.distance_from_fundus
                                    }
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        distance_from_fundus: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Transfer done by"
                                  name="transfer_done_by"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="transfer_done_by"
                                    value={embryologyDetails?.transfer_done_by}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        transfer_done_by: value,
                                      });
                                    }}
                                    options={doctorList}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Catheter"
                                  name="catheter"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="catheter"
                                    value={embryologyDetails?.catheter}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        catheter: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Sydney", label: "Sydney" },
                                      { value: "Cook", label: "Cook" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_220">
                                <Form.Item
                                  label="Embryo loading by"
                                  name="embryo_loading_by"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="embryo_loading_by"
                                    value={embryologyDetails?.embryo_loading_by}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_loading_by: value,
                                      });
                                    }}
                                    options={doctorList}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Transfer Media"
                                  name="transfer_media"
                                  className="custom_select"
                                >
                                  <Select
                                    placeholder="Select"
                                    name="transfer_media"
                                    value={embryologyDetails?.transfer_media}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        transfer_media: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Sage", label: "Sage" },
                                      { value: "Vitromed", label: "Vitromed" },
                                      {
                                        value: "Vitrolife",
                                        label: "Vitrolife",
                                      },
                                      { value: "Cook’s", label: "Cook’s" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="total_sticky">
                          <div className="d-flex align-items-center">
                            <h5 className="m-0">Total M1 : 2 , M2 : 2</h5>
                            <Button
                              className="btn_primary ms-2 px-2 py-1"
                              onClick={handelfeesinput}
                            >
                              Add
                            </Button>
                          </div>
                        </td>
                        <td colSpan={3}>
                          <h4>Score</h4>
                        </td>
                        <td colSpan={3}>
                          <h4>Score</h4>
                        </td>
                        <td colSpan={10}></td>
                      </tr>
                      <tr>
                        <th className="w_90">Egg</th>
                        <th className="w_170">Stage</th>
                        <th className="w_270">Quality of Egg</th>
                        <th className="w_180">Fert Check</th>
                        <th className="w_120">Grade</th>
                        <th className="w_170">Incubator</th>
                        <th className="w_180">Quality of Embryo</th>
                        <th className="w_150">Stage of dev.</th>
                        <th className="w_90">ICM</th>
                        <th className="w_90">TE</th>
                        <th className="w_150">Stage of dev.</th>
                        <th className="w_90">ICM</th>
                        <th className="w_90">TE</th>
                        <th className="w_170">Date of freezing</th>
                        <th className="w_170">Vitrification ID</th>
                        <th className="w_170">Stage</th>
                        <th className="w_170">Color of straw</th>
                        <th className="w_170">Color of Goblet</th>
                        <th className="w_120">Vitrified by</th>
                        <th className="w_170">Date of Thawing</th>
                        <th className="w_170">Thawing done by</th>
                        <th className="w_170">Status</th>
                        <th className="w_170">Date of Transfer</th>
                        <th className="w_170">Action</th>
                      </tr>
                      {[...embryoTableData].map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="w_90">
                                <Form.Item
                                  name={`egg${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="Egg"
                                    value={item?.package_amount}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "egg",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`stage_1${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.stage_1}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "stage_1",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "GV", label: "GV" },
                                      { value: "MI", label: "MI" },
                                      { value: "MIII", label: "MIII" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_270">
                                <Form.Item
                                  name={`quality_of_egg${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.quality_of_egg}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "quality_of_egg",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "Normal", label: "Normal" },
                                      { value: "SER disc", label: "SER disc" },
                                      { value: "Vacuole", label: "Vacuole" },
                                      {
                                        value: "Abnormal PVS",
                                        label: "Abnormal PVS",
                                      },
                                      {
                                        value: "Granulation in PVS",
                                        label: "Granulation in PVS",
                                      },
                                      {
                                        value: "Thick zona",
                                        label: "Thick zona",
                                      },
                                      {
                                        value: "Thin zona",
                                        label: "Thin zona",
                                      },
                                      {
                                        value: "Hyper mature",
                                        label: "Hyper mature",
                                      },
                                      {
                                        value: "Organelle cluster",
                                        label: "Organelle cluster",
                                      },
                                      {
                                        value: "Granulation in cytoplasm",
                                        label: "Granulation in cytoplasm",
                                      },
                                      {
                                        value: "Poor oocyte",
                                        label: "Poor oocyte",
                                      },
                                      {
                                        value: "Dark oocyte",
                                        label: "Dark oocyte",
                                      },
                                      { value: "Others", label: "Others" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_180">
                                <Form.Item
                                  name={`fert_check${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.fert_check}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "fert_check",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "2PN", label: "2PN" },
                                      {
                                        value: "Abnormal PN",
                                        label: "Abnormal PN",
                                      },
                                      { value: "2 Cell", label: "2 Cell" },
                                      {
                                        value: "Degenerated",
                                        label: "Degenerated",
                                      },
                                      { value: "Unfert", label: "Unfert" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_120">
                                <Form.Item
                                  name={`grade${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.grade}
                                    onChange={(value) => {
                                      onChangeEmbryoData(index, "grade", value);
                                    }}
                                    options={[
                                      { value: "I", label: "I" },
                                      { value: "II", label: "II" },
                                      { value: "III", label: "III" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`incubator${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.incubator}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "incubator",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "Tri-gas", label: "Tri-gas" },
                                      { value: "Co2", label: "Co2" },
                                      {
                                        value: "Timelapse",
                                        label: "Timelapse",
                                      },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_180">
                                <Form.Item
                                  name={`quality_of_embryo${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.quality_of_embryo}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "quality_of_embryo",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "Good", label: "Good" },
                                      { value: "Fair", label: "Fair" },
                                      { value: "Poor", label: "Poor" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_150">
                                <Form.Item
                                  name={`stage_of_dev_1${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="Stage of dev."
                                    value={item?.stage_of_dev_1}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "stage_of_dev_1",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_90">
                                <Form.Item
                                  name={`icm_1${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="ICM"
                                    value={item?.icm_1}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "icm_1",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="W_90">
                                <Form.Item
                                  name={`te_1${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="TE"
                                    value={item?.te_1}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "te_1",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_150">
                                <Form.Item
                                  name={`stage_of_dev_2${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="Stage of dev."
                                    value={item?.stage_of_dev_2}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "stage_of_dev_2",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_90">
                                <Form.Item
                                  name={`icm_2${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="ICM"
                                    value={item?.icm_2}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "icm_2",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="W_90">
                                <Form.Item
                                  name={`te_2${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="TE"
                                    value={item?.te_2}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "te_2",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`date_of_freezing${index}`}
                                  className="mb-1"
                                >
                                  <DatePicker
                                    placeholder="10/08/2023"
                                    value={dayjs(
                                      item?.date_of_freezing,
                                      "YYYY-MM-DD"
                                    )}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "date_of_freezing",
                                        value
                                          ? moment(new Date(value)).format(
                                            "YYYY-MM-DD"
                                          )
                                          : null
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`vitrification_id${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="Vitrification ID"
                                    value={item?.vitrification_id}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "vitrification_id",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`stage_2${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.stage_2}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "stage_2",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "OOCYTE", label: "OOCYTE" },
                                      { value: "D3", label: "D3" },
                                      { value: "D5", label: "D5" },
                                      { value: "D6", label: "D6" },
                                      { value: "D7", label: "D7" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`straw_color${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    className="color_select"
                                    value={item?.straw_color}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "straw_color",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "Blue", label: "Blue" },
                                      { value: "Green", label: "Green" },
                                      { value: "Pink", label: "Pink" },
                                      { value: "Yellow", label: "Yellow" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`goblet_color${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    className="color_select"
                                    value={item?.goblet_color}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "goblet_color",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "Blue", label: "Blue" },
                                      { value: "Green", label: "Green" },
                                      { value: "Pink", label: "Pink" },
                                      { value: "Yellow", label: "Yellow" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_120">
                                <Form.Item
                                  name={`vitrified_by${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="Vitrified by"
                                    value={item?.vitrified_by}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "vitrified_by",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`date_of_thawing${index}`}
                                  className="mb-1"
                                >
                                  <DatePicker
                                    placeholder="10/08/2023"
                                    value={dayjs(
                                      item?.date_of_thawing,
                                      "YYYY-MM-DD"
                                    )}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "date_of_thawing",
                                        value
                                          ? moment(new Date(value)).format(
                                            "YYYY-MM-DD"
                                          )
                                          : null
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`thawing_done_by${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.thawing_done_by}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "thawing_done_by",
                                        value
                                      );
                                    }}
                                    options={[
                                      { value: "OOCYTE", label: "OOCYTE" },
                                      { value: "D3", label: "D3" },
                                      { value: "D5", label: "D5" },
                                      { value: "D6", label: "D6" },
                                      { value: "D7", label: "D7" },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`status${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.status}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "status",
                                        value
                                      );
                                    }}
                                    options={[
                                      {
                                        value: "Transferred",
                                        label: "Transferred",
                                      },
                                      {
                                        value: "Long culture",
                                        label: "Long culture",
                                      },
                                    ]}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`date_of_transfer${index}`}
                                  className="mb-1"
                                >
                                  <DatePicker
                                    placeholder="10/08/2023"
                                    value={dayjs(
                                      item?.date_of_transfer,
                                      "YYYY-MM-DD"
                                    )}
                                    onChange={(value) => {
                                      onChangeEmbryoData(
                                        index,
                                        "date_of_transfer",
                                        value
                                          ? moment(new Date(value)).format(
                                            "YYYY-MM-DD"
                                          )
                                          : null
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="w_100 text-center">
                                <Button
                                  className="btn_transparent"
                                  onClick={() => {
                                    onDeleteFeesPackage(index);
                                  }}
                                >
                                  <img src={TranshIcon} alt="TranshIcon" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Notes</h3>
              <div>
                <Form.Item name="notes">
                  <TextArea
                    rows={4}
                    name="notes"
                    value={embryologyDetails?.notes}
                    onChange={(e) => {
                      setEmbryologyDetails({
                        ...embryologyDetails,
                        notes: e.target.value,
                      });
                    }}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sapien lectus, iaculis nec metus ac, aliquam congue arcu. Nullam ac laoreet lectus. Sed malesuada massa lacus,"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(embryologyData)?.length > 0
              ? (userType === 1 || selectedModule?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || selectedModule?.create) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Save
                </Button>
              )}
            <Button className="btn_gray" onClick={handleClear}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
