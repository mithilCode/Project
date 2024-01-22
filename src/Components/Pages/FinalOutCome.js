import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  TimePicker,
} from "antd";
import { Table } from "antd";
import { bloodGroupOptions } from "utils/FieldValues";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "../../Img/edit.svg";
import CancelIcon from "../../Img/cancel.svg";
import TranshIcon from "../../Img/trash.svg";
import dayjs from "dayjs";
import moment from "moment";
import { toast } from "react-toastify";
import {
  createFinalOutcome,
  editFinalOutcome,
  getFinalOutcome,
  setFinalOutComeData,
  setFinalOutComeUpdate,
} from "redux/reducers/FinalOutCome/finalOutCome.slice";
import { getAuthToken } from "Helper/AuthTokenHelper";
import { getAttendingDrList } from "redux/reducers/common.slice";
export default function FinalOutCome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const UserData = getAuthToken();
  const { selectedPatient, attendingDrList } = useSelector(
    ({ common }) => common
  );
  const { userType, selectedLocation, seniorConsultantUserList } = useSelector(
    ({ role }) => role
  );
  const { finalOutComeData, finalOutComeLoading, finalOutComeUpdate } =
    useSelector(({ finalOutcome }) => finalOutcome);

  const ivfIdDetails = location.state;
  const [doctorList, setDoctorList] = useState([{}]);
  const [patientDetails, setPatientDetails] = useState({
    patient_id: "",
    patient_full_name: "",
    partner_full_name: "",
  });

  const [finalOutCome, setFinalOutCome] = useState({
    ivf_flow_id: "",
    incharge_doctor: null,
    anetheist_name: null,
    anesthesia: null,
    delivery_type: null,
    ho: "",
    operating_gynec: "",
    _id: "",
  });
  const [ischildDataObj, setIsChildDataObj] = useState({});
  const [childData, setChildData] = useState([]);
  const [childDetails, setchildDetails] = useState({
    indication: "",
    status: null,
    child_birth_date: null,
    day_of_birth: null,
    time_of_birth: null,
    sex_of_child: null,
    weight: "",
    length: "",
    apgar: "",
    child_blood_group: null,
    no_of_babies_born: "",
    mother_blood_group: null,
    assi_gynec: "",
    paeditrician_attended: "",
    gestational_age_w: "",
    gestational_age_d: "",
  });
  const onChangeFinalOutCome = useCallback((name, values) => {
    const value =
      name === "child_birth_date"
        ? values
          ? moment(new Date(values)).format("DD/MM/YYYY")
          : null
        : values;
    setchildDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const clearchildData = useCallback(() => {
    setchildDetails({
      indication: "",
      status: null,
      child_birth_date: null,
      day_of_birth: null,
      time_of_birth: null,
      sex_of_child: null,
      weight: "",
      length: "",
      apgar: "",
      child_blood_group: null,
      no_of_babies_born: "",
      mother_blood_group: null,
      assi_gynec: "",
      paeditrician_attended: "",
    });
    form.setFieldsValue({
      indication: "",
      status: null,
      child_birth_date: null,
      day_of_birth: null,
      time_of_birth: null,
      sex_of_child: null,
      weight: "",
      length: "",
      apgar: "",
      child_blood_group: null,
      no_of_babies_born: "",
      mother_blood_group: null,
      assi_gynec: "",
      paeditrician_attended: "",
    });
  }, [form]);

  const handleChildData = useCallback(() => {
    const {
      indication,
      status,
      child_birth_date,
      day_of_birth,
      time_of_birth,
      sex_of_child,
      weight,
      length,
      apgar,
      child_blood_group,
      no_of_babies_born,
      mother_blood_group,
      assi_gynec,
      paeditrician_attended,
      gestational_age_w,
      gestational_age_d,
    } = childDetails;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
      (indication ||
        status ||
        child_birth_date ||
        day_of_birth ||
        time_of_birth ||
        sex_of_child ||
        weight ||
        length ||
        apgar ||
        child_blood_group ||
        no_of_babies_born ||
        mother_blood_group ||
        assi_gynec ||
        paeditrician_attended ||
        gestational_age_w ||
        gestational_age_d)
    ) {
      if (Object.keys(ischildDataObj)?.length > 0) {
        let editedData = [...childData] || [];
        editedData =
          editedData?.map((item) => {
            if (
              (item?.id && item?.id === ischildDataObj?.id) ||
              (item?._id && item?._id === ischildDataObj?._id)
            ) {
              return {
                ...item,
                child_birth_date: child_birth_date
                  ? moment(childDetails?.child_birth_date, "DD/MM/YYYY").format(
                      "YYYY-MM-DD"
                    )
                  : null,
                time_of_birth: time_of_birth
                  ? moment(childDetails?.time_of_birth, "HH:mm:ss").format(
                      "HH:mm:ss"
                    )
                  : null,
                day_of_birth: day_of_birth,
                indication: indication,
                status: status,
                sex_of_child: sex_of_child,
                weight: weight,
                length: length,
                apgar: apgar,
                child_blood_group: child_blood_group,
                no_of_babies_born: no_of_babies_born,
                mother_blood_group: mother_blood_group,
                assi_gynec: assi_gynec,
                paeditrician_attended: paeditrician_attended,
              };
            }
            return item;
          }) || editedData;
        if (
          child_birth_date !== null &&
          time_of_birth !== null &&
          no_of_babies_born.trim().length !== 0
        ) {
          setChildData(editedData);
          toast.success("Update Succesfully.");
          setIsChildDataObj({});
        } else {
          toast.error("Please fill mandatory child details ");
        }
      } else {
        if (
          child_birth_date !== null &&
          time_of_birth !== null &&
          no_of_babies_born.trim().length !== 0
        ) {
          setChildData((prev) => [
            ...prev,
            {
              ...childDetails,
              child_birth_date: child_birth_date
                ? moment(childDetails?.child_birth_date, "DD/MM/YYYY").format(
                    "YYYY-MM-DD"
                  )
                : null,
              time_of_birth: time_of_birth
                ? moment(childDetails?.time_of_birth, "HH:mm:ss").format(
                    "HH:mm:ss"
                  )
                : null,
              gestational_age_w: ivfIdDetails ? ivfIdDetails.weeks : null,
              gestational_age_d: ivfIdDetails ? ivfIdDetails.days : null,
              id: Math.random().toString().substring(2, 9),
              isDelete: true,
            },
          ]);
          toast.success("Add Succesfully.");
        } else {
          toast.error("Please fill mandatory child details ");
        }
      }
    } else {
      toast.error("Please Fill Final child details");
    }
    clearchildData();
  }, [
    childData,
    childDetails,
    clearchildData,
    ivfIdDetails?.days,
    ivfIdDetails?.weeks,
    ischildDataObj,
    selectedPatient,
  ]);

  const onDeleteTableData = useCallback(
    (record) => {
      let deleteData = [...childData] || [];
      deleteData = deleteData.filter((item) => item.id !== record.id);
      setChildData(deleteData);
      toast.success("Delete Succesfully.");
    },
    [childData]
  );

  useEffect(() => {
    if (selectedPatient && Object.keys(selectedPatient).length > 0) {
      setPatientDetails({
        patient_id: selectedPatient?.patient_id || "",
        patient_full_name: selectedPatient?.patient_full_name || "",
        partner_full_name: selectedPatient?.partner_full_name || "",
      });
      form.setFieldsValue({
        patient_id: selectedPatient?.patient_id || "",
        patient_full_name: selectedPatient?.patient_full_name || "",
        partner_full_name: selectedPatient?.partner_full_name || "",
      });
      return () => {
        clearFinalOutcome();
        dispatch(setFinalOutComeData({}));
      };
    }
  }, [form, selectedPatient]);

  useEffect(() => {
    if (ivfIdDetails?.ivf_Id) {
      dispatch(
        getFinalOutcome({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: ivfIdDetails?.selectedModuleId?._id,
          ivf_flow_id: ivfIdDetails?.ivf_Id,
        })
      );
      setChildData([]);
      setFinalOutCome((prevDetails) => ({
        ...prevDetails,
        ivf_flow_id: ivfIdDetails?.ivf_Id,
      }));
      form.setFieldsValue({
        ivf_flow_id: ivfIdDetails?.id_name,
        weeks: ivfIdDetails?.weeks,
        days: ivfIdDetails?.days,
      });
    } else {
      toast.error("Ivf Id Not Found");
      navigate("/cycle-out-come");
    }
  }, [ivfIdDetails?.ivf_Id]);

  useEffect(() => {
    if (Object.keys(finalOutComeData).length > 0) {
      const finalOutComeList =
        finalOutComeData.child_detail?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
          };
        }) || [];
      setFinalOutCome((prevDetails) => ({
        ...prevDetails,
        incharge_doctor: finalOutComeData?.incharge_doctor || null,
        anetheist_name: finalOutComeData?.anetheist_name || null,
        anesthesia: finalOutComeData?.anesthesia || null,
        delivery_type: finalOutComeData?.delivery_type || null,
        ho: finalOutComeData?.ho || "--",
        operating_gynec: finalOutComeData?.operating_gynec || "--",
        _id: finalOutComeData?._id,
        ivf_flow_id: ivfIdDetails?.ivf_Id,
      }));
      setChildData(finalOutComeList);
      form.setFieldsValue({
        incharge_doctor: finalOutComeData?.incharge_doctor || null,
        anetheist_name: finalOutComeData?.anetheist_name || null,
        anesthesia: finalOutComeData?.anesthesia || null,
        delivery_type: finalOutComeData?.delivery_type || null,
        ho: finalOutComeData?.ho || "--",
        operating_gynec: finalOutComeData?.operating_gynec || "--",
      });
    }
  }, [finalOutComeData]);
  useEffect(() => {
    if (finalOutComeUpdate) {
      dispatch(
        getFinalOutcome({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: ivfIdDetails?.selectedModuleId?._id,
          ivf_flow_id: ivfIdDetails?.ivf_Id,
        })
      );
      dispatch(setFinalOutComeUpdate(false));
    }
  }, [finalOutComeUpdate]);

  const onFinish = (values) => {
    let finalOutComeTable =
      childData?.map((item) => {
        delete item.id;
        return item;
      }) || [];
    const obj = {
      ...finalOutCome,
      child_detail: finalOutComeTable,
    };
    if (Object.keys(finalOutComeData)?.length > 0) {
      dispatch(
        editFinalOutcome({
          location_id: selectedLocation,
          _id: finalOutCome?._id,
          module_id: ivfIdDetails?.selectedModuleId?._id,
          payload: obj,
        })
      );
    } else {
      if (ivfIdDetails?.ivf_Id) {
        dispatch(
          createFinalOutcome({
            location_id: selectedLocation,
            patient_reg_id: selectedPatient?._id,
            module_id: ivfIdDetails?.selectedModuleId?._id,
            payload: obj,
          })
        );
      } else {
        toast.error("Wrong");
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const columns = [
    {
      title: "Indication",
      dataIndex: "indication",
      key: "indication",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Child’s Birth Date",
      dataIndex: "child_birth_date",
      key: "child_birth_date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : null;
      },
    },
    {
      title: "Day Of Birth",
      dataIndex: "day_of_birth",
      key: "day_of_birth",
    },
    {
      title: "Time of Birth",
      dataIndex: "time_of_birth",
      key: "time_of_birth",
    },
    {
      title: "Sex of Child",
      dataIndex: "sex_of_child",
      key: "sex_of_child",
    },
    {
      title: "Weight of Child",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Length of Child (cm)",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Apgar",
      dataIndex: "apgar",
      key: "apgar",
    },
    {
      title: "Blood Group of Child",
      dataIndex: "child_blood_group",
      key: "child_blood_group",
    },
    {
      title: "No of Babies Born",
      dataIndex: "no_of_babies_born",
      key: "no_of_babies_born",
    },
    {
      title: "Mother’s Blood Group",
      dataIndex: "mother_blood_group",
      key: "mother_blood_group",
    },
    {
      title: "Assi. Gynec",
      dataIndex: "assi_gynec",
      key: "assi_gynec",
    },
    {
      title: "Paeditrician Attended",
      dataIndex: "paeditrician_attended",
      key: "paeditrician_attended",
    },
    {
      title: "Gestational Age (W)",
      dataIndex: "gestational_age_w",
      key: "gestational_age_w",
      render: (e) => {
        return ivfIdDetails?.weeks;
      },
    },
    {
      title: "Gestational Age (D)",
      dataIndex: "gestational_age_d",
      key: "gestational_age_d",
      render: (e) => {
        return ivfIdDetails?.days;
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => {
        return (
          <ul className="action_wrap d-flex align-items-center">
            {(userType === 1 ||
              ivfIdDetails?.selectedModuleId?.edit ||
              record?.isDelete) && (
              <li>
                <Button className="btn_transparent">
                  {(record?.id && record?.id === ischildDataObj?.id) ||
                  (record?._id && record?._id === ischildDataObj?._id) ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearchildData();
                        setIsChildDataObj({});
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setchildDetails({
                          indication: record?.indication,
                          status: record?.status,
                          child_birth_date: record?.child_birth_date
                            ? moment(record?.child_birth_date).format(
                                "DD/MM/YYYY"
                              )
                            : null,
                          day_of_birth: record?.day_of_birth,
                          time_of_birth: record?.time_of_birth
                            ? dayjs(record?.time_of_birth, "HH:mm:ss")
                            : null,
                          sex_of_child: record?.sex_of_child,
                          weight: record?.weight,
                          length: record?.length,
                          apgar: record?.apgar,
                          child_blood_group: record?.child_blood_group,
                          no_of_babies_born: record?.no_of_babies_born,
                          mother_blood_group: record?.mother_blood_group,
                          assi_gynec: record?.assi_gynec,
                          paeditrician_attended: record?.paeditrician_attended,
                          gestational_age_w: record?.gestational_age_w,
                          gestational_age_d: record?.gestational_age_d,
                        });
                        form.setFieldsValue({
                          indication: record?.indication,
                          status: record?.status,
                          child_birth_date: record?.child_birth_date
                            ? dayjs(
                                moment(record.child_birth_date).format(
                                  "DD/MM/YYYY"
                                ),
                                "DD/MM/YYYY"
                              )
                            : null,
                          day_of_birth: record?.day_of_birth,
                          time_of_birth: record?.time_of_birth
                            ? dayjs(record?.time_of_birth, "HH:mm:ss")
                            : null,
                          sex_of_child: record?.sex_of_child,
                          weight: record?.weight,
                          length: record?.length,
                          apgar: record?.apgar,
                          child_blood_group: record?.child_blood_group,
                          no_of_babies_born: record?.no_of_babies_born,
                          mother_blood_group: record?.mother_blood_group,
                          assi_gynec: record?.assi_gynec,
                          paeditrician_attended: record?.paeditrician_attended,
                          gestational_age_w: record?.gestational_age_w,
                          gestational_age_d: record?.gestational_age_d,
                        });
                        setIsChildDataObj(record);
                      }}
                    />
                  )}
                </Button>
              </li>
            )}
            {record?.isDelete && (
              <li>
                <Button
                  className="btn_transparent"
                  onClick={() => onDeleteTableData(record)}
                >
                  <img src={TranshIcon} alt="TranshIcon" />
                </Button>
              </li>
            )}
          </ul>
        );
      },
    },
  ];
  const clearFinalOutcome = useCallback(() => {
    setFinalOutCome((prevDetails) => ({
      ...prevDetails,
      incharge_doctor: null,
      anetheist_name: null,
      anesthesia: null,
      delivery_type: null,
      ho: "",
      operating_gynec: "",
    }));
    form.setFieldsValue({
      incharge_doctor: null,
      anetheist_name: null,
      anesthesia: null,
      delivery_type: null,
      ho: "",
      operating_gynec: "",
    });
    setChildData([]);
    clearchildData();
  }, [form]);
  const handleClear = () => {
    clearFinalOutcome();
  };
  useEffect(() => {
    if (Object.keys(selectedPatient).length > 0) {
      dispatch(getAttendingDrList());
    }
  }, [dispatch, selectedPatient]);
  useEffect(() => {
    if (Object.entries(attendingDrList)?.length > 0) {
      setDoctorList(
        attendingDrList.map((item, index) => ({
          value: item._id,
          label: item.user_name,
        }))
      );
    }
  }, [dispatch, attendingDrList]);
  return (
    <div className="page_main_content">
      {finalOutComeLoading && (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      )}
      <div className="page_inner_content">
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
                <li className="w_170 w_xs_50">
                  <Form.Item label="Patient ID" name="patient_id">
                    <Input
                      placeholder="Enter Patient ID"
                      name="patient_id"
                      value={patientDetails?.patient_id}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item label="Patient Name" name="patient_full_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={patientDetails?.patient_full_name}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="IVF ID" name="ivf_flow_id">
                    <Input
                      placeholder="Enter IVF ID"
                      value={finalOutCome?.ivf_flow_id}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Incharge Doctor"
                    name="incharge_doctor"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="incharge_doctor"
                      value={finalOutCome?.incharge_doctor}
                      onChange={(value) => {
                        setFinalOutCome({
                          ...finalOutCome,
                          incharge_doctor: value,
                        });
                      }}
                      options={doctorList}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Anethetist Name"
                    name="anetheist_name"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="anetheist_name"
                      value={finalOutCome?.anetheist_name}
                      onChange={(value) => {
                        setFinalOutCome({
                          ...finalOutCome,
                          anetheist_name: value,
                        });
                      }}
                      options={doctorList}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Anethesia"
                    name="anesthesia"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      options={[
                        { value: "Unknown", label: "Unknown" },
                        { value: "Pregnancy", label: "Pregnancy" },
                        { value: "NoPregnancy", label: "No Pregnancy" },
                        { value: "Bichemical PG", label: "Bichemical PG" },
                        { value: "--", label: "--" },
                      ]}
                      name="anesthesia"
                      value={finalOutCome?.anesthesia}
                      onChange={(value) => {
                        setFinalOutCome({
                          ...finalOutCome,
                          anesthesia: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Delivery Type"
                    name="delivery_type"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="delivery_type"
                      options={[
                        { value: "Unknown", label: "Unknown" },
                        { value: "Pregnancy", label: "Pregnancy" },
                        { value: "NoPregnancy", label: "No Pregnancy" },
                        { value: "Bichemical PG", label: "Bichemical PG" },
                        { value: "--", label: "--" },
                      ]}
                      value={finalOutCome?.delivery_type}
                      onChange={(value) => {
                        setFinalOutCome({
                          ...finalOutCome,
                          delivery_type: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_400 w_xs_50">
                  <Form.Item label="H/O" name="ho">
                    <Input
                      placeholder="--"
                      name="ho"
                      value={finalOutCome?.ho}
                      onChange={(e) => {
                        setFinalOutCome({
                          ...finalOutCome,
                          ho: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item label="Operating Gynec" name="operating_gynec">
                    <Input
                      placeholder="Enter Operating Gynec"
                      name="operating_gynec"
                      value={finalOutCome?.operating_gynec}
                      onChange={(e) => {
                        setFinalOutCome({
                          ...finalOutCome,
                          operating_gynec: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Child Details</h3>
              <ul className="grid_wrapper align-items-end">
                <li className="w_170 w_xs_50">
                  <Form.Item label="Indication" name="indication">
                    <Input
                      placeholder="Indication"
                      name="indication"
                      value={childDetails?.indication}
                      onChange={(e) =>
                        onChangeFinalOutCome("indication", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Status"
                    name="status"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="status"
                      value={childDetails?.status}
                      onChange={(value) =>
                        onChangeFinalOutCome("status", value)
                      }
                      options={[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                        { value: "6", label: "6" },
                        { value: "7", label: "7" },
                        { value: "8", label: "8" },
                        { value: "--", label: "--" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50">
                  <Form.Item label="Child’s Birth Date" name="child_birth_date">
                    <DatePicker
                      placeholder="10/08/2023"
                      name="child_birth_date"
                      value={
                        childDetails?.child_birth_date
                          ? dayjs(childDetails?.child_birth_date, "DD/MM/YYYY")
                          : null
                      }
                      format={["DD/MM/YYYY"]}
                      onChange={(value) =>
                        onChangeFinalOutCome("child_birth_date", value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="Day Of Birth"
                    name="day_of_birth"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="day_of_birth"
                      value={childDetails?.day_of_birth}
                      onChange={(value) =>
                        onChangeFinalOutCome("day_of_birth", value)
                      }
                      options={[
                        { value: "Sunday", label: "Sunday" },
                        { value: "Monday", label: "Monday" },
                        { value: "Tuesday", label: "Tuesday" },
                        { value: "Wednesday", label: "Wednesday" },
                        { value: "Thursday", label: "Thursday" },
                        { value: "Friday", label: "Friday" },
                        { value: "Saturday", label: "Saturday" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Time Of Birth" name="time_of_birth">
                    <TimePicker
                      picker="time"
                      name="time_of_birth"
                      value={childDetails?.time_of_birth}
                      onChange={(value) =>
                        onChangeFinalOutCome(
                          "time_of_birth",
                          moment(new Date(value)).format("HH:mm:ss")
                        )
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item
                    label="Sex Of Child"
                    name="sex_of_child"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      name="sex_of_child"
                      value={childDetails?.sex_of_child}
                      onChange={(value) =>
                        onChangeFinalOutCome("sex_of_child", value)
                      }
                      options={[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                        { value: "6", label: "6" },
                        { value: "7", label: "7" },
                        { value: "8", label: "8" },
                        { value: "--", label: "--" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Weight Of Child" name="weight">
                    <Input
                      placeholder="Indication"
                      name="weight"
                      value={childDetails?.weight}
                      onChange={(e) =>
                        onChangeFinalOutCome("weight", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Lenth Of Child (cm)" name="length">
                    <Input
                      placeholder="Indication"
                      name="length"
                      value={childDetails?.length}
                      onChange={(e) =>
                        onChangeFinalOutCome("length", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Apgar" name="apgar">
                    <Input
                      placeholder="apgar"
                      name="apgar"
                      value={childDetails?.apgar}
                      onChange={(e) =>
                        onChangeFinalOutCome("apgar", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Blood Group Of Child"
                    name="child_blood_group"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      options={bloodGroupOptions}
                      name="child_blood_group"
                      value={childDetails?.child_blood_group}
                      onChange={(value) =>
                        onChangeFinalOutCome("child_blood_group", value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="No. Of Babies Born"
                    name="no_of_babies_born"
                  >
                    <Input
                      type="number"
                      placeholder="No."
                      name="no_of_babies_born"
                      value={childDetails?.no_of_babies_born}
                      onChange={(e) =>
                        onChangeFinalOutCome(
                          "no_of_babies_born",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Blood Group Of Mother"
                    name="mother_blood_group"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      options={bloodGroupOptions}
                      name="mother_blood_group"
                      value={childDetails?.mother_blood_group}
                      onChange={(value) =>
                        onChangeFinalOutCome("mother_blood_group", value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item label="Assi. Gynec" name="assi_gynec">
                    <Input
                      placeholder="Assi"
                      name="assi_gynec"
                      value={childDetails?.assi_gynec}
                      onChange={(e) =>
                        onChangeFinalOutCome("assi_gynec", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Paeditrician Attended"
                    name="paeditrician_attended"
                  >
                    <Input
                      placeholder="Enter Paeditrician Attended"
                      name="paeditrician_attended"
                      value={childDetails?.paeditrician_attended}
                      onChange={(e) =>
                        onChangeFinalOutCome(
                          "paeditrician_attended",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Gestational Age (W)" name="weeks">
                    <Input
                      placeholder="Age"
                      name="weeks"
                      value={ivfIdDetails?.weeks}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Gestational Age (D)" name="days">
                    <Input
                      placeholder="Age"
                      name="days"
                      value={ivfIdDetails?.days}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  {Object.keys(ischildDataObj)?.length > 0
                    ? (userType === 1 ||
                        ivfIdDetails?.selectedModuleId?.edit) && (
                        <Button
                          className="btn_primary mb24"
                          onClick={handleChildData}
                        >
                          Edit
                        </Button>
                      )
                    : (userType === 1 ||
                        ivfIdDetails?.selectedModuleId?.create) && (
                        <Button
                          disabled={
                            Object.keys(selectedPatient)?.length > 0
                              ? false
                              : true
                          }
                          className="btn_primary mb24"
                          onClick={handleChildData}
                        >
                          Add
                        </Button>
                      )}
                </li>
              </ul>
              <div className="cmn_table_wrap pb-4">
                <Table
                  columns={columns}
                  dataSource={childData}
                  pagination={false}
                />
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(finalOutComeData)?.length > 0
              ? (userType === 1 || ivfIdDetails?.selectedModuleId?.edit) && (
                  <Button
                    disabled={Object.keys(selectedPatient)?.length === 0}
                    className="btn_primary mx-3"
                    htmlType="submit"
                  >
                    Update
                  </Button>
                )
              : (userType === 1 || ivfIdDetails?.selectedModuleId?.create) && (
                  <Button
                    disabled={Object.keys(selectedPatient)?.length === 0}
                    className="btn_primary mx-3"
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
