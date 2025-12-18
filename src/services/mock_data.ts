import { EventType, HealthStatus } from "../store/types/livestockActivity";

export const mockHealthStatuses: HealthStatus[] = [
  {
    code: "GOOD",
    description: "Solid overall health",
    color: null,
  },
  {
    code: "GUT",
    description: "Gut, scours, prolapse",
    color: null,
  },
  {
    code: "LAME",
    description: "Structure, lameness",
    color: null,
  },
  {
    code: "MEDS",
    description: "Heavy use of antibiotics",
    color: null,
  },
  {
    code: "PERF",
    description: "Picture perfect health",
    color: null,
  },
  {
    code: "PFIN",
    description: "PRRS @ finisher",
    color: null,
  },
  {
    code: "PNUR",
    description: "PRRS @ nursery",
    color: null,
  },
  {
    code: "PSOW",
    description: "PRRS @ wean",
    color: null,
  },
  {
    code: "RESP",
    description: "Excessive coughing, respiratory",
    color: null,
  },
  {
    code: "VICE",
    description: "Tail, ear, and fighting",
    color: null,
  },
];

export const livestockGradeOffEventTypes: EventType[] = [
  {
    Code: "FE-MKTPIG",
    Description: "Grade-off Feeder Pigs at Move",
    Reasons: [
      {
        Code: "GR-ADJUST",
        Description: "Inventory Count Adjustment",
      },
      {
        Code: "GR-BRUPT",
        Description: "Belly Rupture",
      },
      {
        Code: "GR-DOA",
        Description: "Dead On Arrival",
      },
      {
        Code: "GR-LAME",
        Description: "Lame / Swollen Joints",
      },
      {
        Code: "GR-PALE",
        Description: "Pale / Anemic",
      },
      {
        Code: "GR-RESP",
        Description: "Strep / Respiratory",
      },
      {
        Code: "GR-SCOURS",
        Description: "Scours",
      },
      {
        Code: "GR-SMALL",
        Description: "Smalls",
      },
      {
        Code: "GR-SRUPT",
        Description: "Scrotum Rupture",
      },
      {
        Code: "GR-UNTHRIF",
        Description: "Unthrifty",
      },
    ],
    Journal_Template_Name: "MOVE"
  },
  {
    Code: "FE-WEANNUR",
    Description: "Wean Pig (non-inventory) Grade-offs",
    Reasons: [
      {
        Code: "GR-BRUPT",
        Description: "Belly Rupture",
      },
      {
        Code: "GR-DOA",
        Description: "Dead On Arrival",
      },
      {
        Code: "GR-LAME",
        Description: "Lame / Swollen Joints",
      },
      {
        Code: "GR-PALE",
        Description: "Pale / Anemic",
      },
      {
        Code: "GR-RESP",
        Description: "Strep / Respiratory",
      },
      {
        Code: "GR-SCOURS",
        Description: "Scours",
      },
      {
        Code: "GR-SMALL",
        Description: "Smalls",
      },
      {
        Code: "GR-SRUPT",
        Description: "Scrotum Rupture",
      },
      {
        Code: "GR-UNTHRIF",
        Description: "Unthrifty",
      },
    ],
    Journal_Template_Name: "MOVE"
  },
];
