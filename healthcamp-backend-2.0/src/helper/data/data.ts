import { AdminType, deptType } from "../types/index.type";

export const services = [
    {
      title: "Blood Test",
      description: "This is a blood test service",
      attributes: [
        "Hb",
        "RBC",
        "WBC",
        "Platelet Count",
        "Hematocrit (HCT)",
        "MCV",
        "MCH",
        "MCHC",
        "ESR",
        "PCV"
      ]
    },
    {
      title: "Liver Function Test",
      description: "Checks the health of your liver",
      attributes: [
        "ALT (SGPT)",
        "AST (SGOT)",
        "ALP",
        "Bilirubin Total",
        "Bilirubin Direct",
        "Albumin",
        "Globulin"
      ]
    },
    {
      title: "Kidney Function Test",
      description: "Evaluates kidney performance",
      attributes: [
        "Creatinine",
        "Urea",
        "Uric Acid",
        "BUN (Blood Urea Nitrogen)",
        "Electrolytes (Na, K, Cl)"
      ]
    },
    {
      title: "Lipid Profile",
      description: "Measures cholesterol and triglyceride levels",
      attributes: [
        "Total Cholesterol",
        "HDL Cholesterol",
        "LDL Cholesterol",
        "VLDL",
        "Triglycerides"
      ]
    },
    {
      title: "Thyroid Profile",
      description: "Evaluates thyroid gland function",
      attributes: [
        "TSH",
        "T3",
        "T4"
      ]
    }
  ];

  export const admins:AdminType[] = [
    {
      name: "Business Head",
      email: "businesshead@gmail.com",
      contact: 9800898007,
      address: "Kathmandu",
      department: deptType.businessHead,
      password: "password@123"
    },
    {
      name: "Team Lead 1",
      email: "teamlead1@gmail.com",
      contact: 9800000001,
      address: "Kathmandu",
      department: deptType.teamLead,
      password: "password@123"
    },
    {
      name: "Team Lead 2",
      email: "teamlead2@gmail.com",
      contact: 9800000002,
      address: "Pokhara",
      department: deptType.teamLead,
      password: "password@123"
    },
    {
      name: "Team Lead 3",
      email: "teamlead3@gmail.com",
      contact: 9800000003,
      address: "Lalitpur",
      department: deptType.teamLead,
      password: "password@123"
    },
    {
      name: "Unit Coordinator 1",
      email: "unitcoordinator1@gmail.com",
      contact: 9800000004,
      address: "Biratnagar",
      department: deptType.unitCoordinator,
      password: "password@123"
    },
    {
      name: "Unit Coordinator 2",
      email: "unitcoordinator2@gmail.com",
      contact: 9800000005,
      address: "Butwal",
      department: deptType.unitCoordinator,
      password: "password@123"
    },
    {
      name: "Unit Coordinator 3",
      email: "unitcoordinator3@gmail.com",
      contact: 9800000006,
      address: "Dharan",
      department: deptType.unitCoordinator,
      password: "password@123"
    },
    {
      name: "Data Entry 1",
      email: "dataentry1@gmail.com",
      contact: 9800000007,
      address: "Janakpur",
      department: deptType.dataEntry,
      password: "password@123"
    },
    {
      name: "Data Entry 2",
      email: "dataentry2@gmail.com",
      contact: 9800000008,
      address: "Birgunj",
      department: deptType.dataEntry,
      password: "password@123"
    },
    {
      name: "Data Entry 3",
      email: "dataentry3@gmail.com",
      contact: 9800000009,
      address: "Nepalgunj",
      department: deptType.dataEntry,
      password: "password@123"
    },
    {
      name: "Finance 1",
      email: "finance1@gmail.com",
      contact: 9800000010,
      address: "Kathmandu",
      department: deptType.finance,
      password: "password@123"
    },
    {
      name: "Finance 2",
      email: "finance2@gmail.com",
      contact: 9800000011,
      address: "Pokhara",
      department: deptType.finance,
      password: "password@123"
    },
    {
      name: "Finance 3",
      email: "finance3@gmail.com",
      contact: 9800000012,
      address: "Lalitpur",
      department: deptType.finance,
      password: "password@123"
    },
    {
      name: "Sales 1",
      email: "sales1@gmail.com",
      contact: 9800000013,
      address: "Kathmandu",
      department: deptType.sales,
      password: "password@123"
    },
    {
      name: "Sales 2",
      email: "sales2@gmail.com",
      contact: 9800000014,
      address: "Pokhara",
      department: deptType.sales,
      password: "password@123"
    },
    {
      name: "Sales 3",
      email: "sales3@gmail.com",
      contact: 9800000015,
      address: "Lalitpur",
      department: deptType.sales,
      password: "password@123"
    },
    {
      name: "Call Centre 1",
      email: "callcenter1@gmail.com",
      contact: 9800000016,
      address: "Damak",
      department: deptType.callCentre,
      password: "password@123"
    },
    {
      name: "Call Centre 2",
      email: "callcenter2@gmail.com",
      contact: 9800000017,
      address: "Bharatpur",
      department: deptType.callCentre,
      password: "password@123"
    },
    {
      name: "Call Centre 3",
      email: "callcenter3@gmail.com",
      contact: 9800000018,
      address: "Hetauda",
      department: deptType.callCentre,
      password: "password@123"
    },
    {
      name: "IT Team 1",
      email: "itteam1@gmail.com",
      contact: 9800000019,
      address: "Kathmandu",
      department: deptType.ITteam,
      password: "password@123"
    },
    {
      name: "IT Team 2",
      email: "itteam2@gmail.com",
      contact: 9800000020,
      address: "Pokhara",
      department: deptType.ITteam,
      password: "password@123"
    },
    {
      name: "IT Team 3",
      email: "itteam3@gmail.com",
      contact: 9800000021,
      address: "Lalitpur",
      department: deptType.ITteam,
      password: "password@123"
    }
  ]
  