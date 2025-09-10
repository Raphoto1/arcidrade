import React from "react";

import VictorHeroHeader from "./VictorHeroHeader";
import VictorManageGrid from "./VictorManageGrid";
import AdminButtons from "./AdminButtons";
import AskedProcess from "./AskedProcess";
import ActiveProcess from "./ActiveProcess";
import ArchivedProcess from "./ArchivedProcess";
import FinishedProcess from "./FinishedProcess";
import Offers from "../profesional/Offers";

export default function Victor() {
  return (
    <div>
      <VictorHeroHeader />
      <VictorManageGrid />
      <AdminButtons />
      <AskedProcess />
      <ActiveProcess />
      <ArchivedProcess />
      <FinishedProcess />
      <Offers />
    </div>
  );
}
