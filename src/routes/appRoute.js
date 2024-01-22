import ForgotPassword from "Components/Auth/ForgotPassword";
import LinkExpired from "Components/Auth/LinkExpired";
import Login from "Components/Auth/Login";
import PasswordReset from "Components/Auth/PasswordReset";
import ResetPassword from "Components/Auth/ResetPassword";
import SendCode from "Components/Auth/SendCode";
import SetPassword from "Components/Auth/SetPassword";
import UserSelectLocation from "Components/Auth/UserSelectLocation";
import CycleOutCome from "Components/Pages/CycleOutCome";
import FinalOutCome from "Components/Pages/FinalOutCome";
import UserRoleManagement from "Components/Pages/UserRollManagement/Index";
import DischargeCard from "Components/Pages/DischargeCard";
import EmbryoWarmingDataSheet from "Components/Pages/EmbryoWarmingDataSheet";
import EmbryologyDataSheet from "Components/Pages/EmbryologyDataSheet";
import FemaleInfertilityInvestigation from "Components/Pages/FemaleInfertilityInvestigation";
import HomePage from "Components/Pages/HomePage";
import IVFFlowSheet from "Components/Pages/IVFFlowSheet";
import LutealPhase from "Components/Pages/LutealPhase";
import MaleInfertilityInvestigation from "Components/Pages/MaleInfertilityInvestigation";
import PGSDischargeCard from "Components/Pages/PGSDischargeCard";
import PageNotFound from "Components/Pages/PageNotFound";
import PatientBasicHistory from "Components/Pages/PatientBasicHistory";
import PatientExtendedHistory from "Components/Pages/PatientExtendedHistory";
import TESAPESADischargeCard from "Components/Pages/TESAPESADischargeCard";
import VitrificationDataSheet from "Components/Pages/VitrificationDataSheet";
import Dashboard from "Components/Pages/Dashboard";

export const appRoute = [
  {
    path: "/login",
    element: <Login />,
    isPublic: true,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    isPublic: true,
  },
  {
    path: "/password-reset",
    element: <PasswordReset />,
    isPublic: true,
  },
  {
    path: "/link-expired",
    element: <LinkExpired />,
    isPublic: true,
  },
  {
    path: "/reset-password",
    element: <SetPassword />,
    isPublic: true,
  },
  {
    path: "/set-password/:token",
    element: <ResetPassword />,
    isPublic: true,
  },
  {
    path: "/send-code",
    element: <SendCode />,
    isPublic: true,
  },
  {
    path: "/",
    element: <Dashboard />,
    isPublic: false,
  },
  {
    path: "/patient-registration",
    element: <HomePage />,
    isPublic: false,
  },
  {
    path: "/user-select-location",
    element: <UserSelectLocation />,
    isPublic: false,
  },
  {
    path: "/user-role-management",
    element: <UserRoleManagement />,
    isPublic: false,
  },
  {
    path: "/patient-basic-history",
    element: <PatientBasicHistory />,
    isPublic: false,
  },
  {
    path: "/patient-extended-history",
    element: <PatientExtendedHistory />,
    isPublic: false,
  },
  {
    path: "/male-infertility-investigation",
    element: <MaleInfertilityInvestigation />,
    isPublic: false,
  },
  {
    path: "/female-infertility-investigation",
    element: <FemaleInfertilityInvestigation />,
    isPublic: false,
  },
  {
    path: "/ivf-flow-sheet",
    element: <IVFFlowSheet />,
    isPublic: false,
  },
  {
    path: "/embryology-data-sheet",
    element: <EmbryologyDataSheet />,
    isPublic: false,
  },
  {
    path: "/luteal-phase",
    element: <LutealPhase />,
    isPublic: false,
  },
  {
    path: "/discharge-card",
    element: <DischargeCard />,
    isPublic: false,
  },
  {
    path: "/cycle-out-come",
    element: <CycleOutCome />,
    isPublic: false,
  },
  {
    path: "/final-out-come",
    element: <FinalOutCome />,
    isPublic: false,
  },
  {
    path: "/tesa-pesa-discharge-card",
    element: <TESAPESADischargeCard />,
    isPublic: false,
  },
  {
    path: "/pgs-discharge-card",
    element: <PGSDischargeCard />,
    isPublic: false,
  },
  {
    path: "*",
    element: <PageNotFound />,
    isPublic: true,
  },
];
