import React from "react";

import VictorHeroHeader from "./VictorHeroHeader";
import VictorManageGrid from "./VictorManageGrid";
import AdminButtons from "./AdminButtons";
import AskedProcess from "./AskedProcess";
import ActiveProcess from "./ActiveProcess";
import ArchivedProcess from "./ArchivedProcess";
import FinishedProcess from "./FinishedProcess";
import Offers from "../profesional/Offers";
import InstitutionGridSearch from "../institution/InstitutionGridSearch";
import ProcessListVictor from "./pieces/ProcessListVictor";
import ProfesionalsListVictor from "./pieces/ProfesionalsListVictor";
import InstitutionsListVictor from "./pieces/InstitutionsListVictor";
import PausedProcess from "./PausedProcess";
import ModalForForms from "@/components/modals/ModalForForms";
import CreateProcessForm from "@/components/forms/platform/process/CreateProcessForm";

export default function Victor() {
  return (
    <div>
      <VictorHeroHeader />
      <VictorManageGrid />
      <AdminButtons />
      <ModalForForms title='Crear Proceso'>
        <CreateProcessForm />
      </ModalForForms>
      <AskedProcess />
      <ActiveProcess />
      <PausedProcess />
      <ArchivedProcess />
      <FinishedProcess />
      <ProcessListVictor />
      <ProfesionalsListVictor />
      <InstitutionsListVictor />
    </div>
  );
}
