import Home from "../Home";
import Login from "../authentication/Login";
import Register from "../authentication/Register";
import FieldMode from "../fieldMode/FieldMode";
import ApiariesManagement from "./base/ApiariesManagement";
import AddBeehive from "./base/apiariesList/createApiary/AddBeehive";
import ApiariesList from "./base/apiariesList/ApiariesList";
import InspectionsDraft from "./drawer/inspections/InspectionsDraft";
import CreateApiary from "./base/apiariesList/createApiary/CreateApiary";
import InspectionsHistory from "./drawer/inspections/InspectionsHistory";
import InspectionReport from "./drawer/inspections/InspectionReport";
import HiveInspectionReport from "./drawer/inspections/HiveInspectionReport";
import { AnnualDeclaration } from "../../navigation";
import AnnualDeclarationHistory from "./drawer/annualDeclaration/AnnualDeclarationHistory";
import AnnualDeclarationDetails from "./drawer/annualDeclaration/AnnualDeclarationDetails";
import TranshumancesDraft from "./drawer/transhumances/TranshumancesDraft";
import TranshumanceReport from "./drawer/transhumances/TranshumanceReport";
import RegisterForm1 from "./drawer/transhumances/RegisterForm1";
import RegisterForm2 from "./drawer/transhumances/RegisterForm2";
import Members from "./base/members/Members";
import AnnualDeclarationApiariesList from "./drawer/annualDeclaration/AnnualDeclarationApiariesList";

export {
  Home,
  FieldMode,
  ApiariesManagement,
  Login,
  Register,
  ApiariesList,
  CreateApiary,
  AddBeehive,
  InspectionsDraft,
  InspectionsHistory,
  InspectionReport,
  HiveInspectionReport,
  AnnualDeclaration,
  AnnualDeclarationHistory,
  AnnualDeclarationDetails,
  AnnualDeclarationApiariesList,
  TranshumancesDraft,
  TranshumanceReport,
  RegisterForm1,
  RegisterForm2,
  Members
};
