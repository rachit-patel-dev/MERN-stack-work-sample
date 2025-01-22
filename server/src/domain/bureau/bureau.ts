interface SerializerField {
  name: string;
  maxLength?: number;
  minLength?: number;
  regex?: RegExp;
  required?: boolean;
  type: string | Record<string, string>;
}

const BureauCreateSerializer: SerializerField[] = [
  {
    name: "Email",
    maxLength: 80,
    minLength: 10,
    type: "string",
    regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    required: true,
  },
  {
    name: "LegalName",
    minLength: 1,
    type: "string",
    required: true,
  },
  {
    name: "PrimaryContact",
    minLength: 1,
    type: "string"
  },
  {
    name: "PrimaryContactPhoneNumber",
    minLength: 10,
    regex: /^[0-9]+$/,
    type: "string" // Assuming phoneNumberRegex is already of RegExp type
  },
  {
    name: "PrimaryContactMobile",
    regex: /^[0-9]+$/,
    minLength: 10,
    type: "string" // Assuming phoneNumberRegex is already of RegExp type
  },
  {
    name: "Address",
    minLength: 1,
    type: "string",
  },
  {
    name: "City",
    minLength: 1,
    type: "string"
  },
  {
    name: "State",
    minLength: 1,
    type: "string"
  },
  {
    name: "Country",
    minLength: 1,
    type: "string"
  },
  {
    name: "Zip",
    maxLength: 5,
    minLength: 5,
    regex: /^[0-9]+$/,
    type: "string"
  },
  {
    name: "PayrollSoftware",
    maxLength: 50,
    minLength: 1,
    type: {
      ASC: "ACS",
      ACCOUNTS_WORLD: "Accountants World",
      APEX: "Apex",
      ASSURE: "Assure",
      EXCUPAY: "Excupay",
      ISOLVED: "iSolved",
      UKG: "UKG"
    },
  }
];

const BureauUpdateSerializer: SerializerField[] = [
  {
    name: "LegalName",
    minLength: 1,
    type: "string"
  },
  {
    name: "PrimaryContact",
    minLength: 1,
    type: "string"
  },
  {
    name: "PrimaryContactPhoneNumber",
    minLength: 10,
    regex: /^[0-9]+$/,
    type: "string" // Assuming phoneNumberRegex is already of RegExp type
  },
  {
    name: "PrimaryContactMobile",
    minLength: 10,
    regex: /^[0-9]+$/,
    type: "string" // Assuming phoneNumberRegex is already of RegExp type
  },
  {
    name: "Address",
    minLength: 1,
    type: "string",
  },
  {
    name: "City",
    minLength: 1,
    type: "string"
  },
  {
    name: "State",
    minLength: 1,
    type: "string"
  },
  {
    name: "Country",
    minLength: 1,
    type: "string"
  },
  {
    name: "Zip",
    maxLength: 5,
    minLength: 5,
    regex: /^[0-9]+$/,
    type: "string"
  },
  {
    name: "Status",
    maxLength: 10,
    minLength: 6,
    type: {
      PENDING: "Pending",
      ACTIVE: "Active",
      BLOCKED: "Blocked"
    },
  },
  {
    name: "PayrollSoftware",
    maxLength: 50,
    minLength: 1,
    type: {
      ASC: "ACS",
      ACCOUNTS_WORLD: "Accountants World",
      APEX: "Apex",
      ASSURE: "Assure",
      EXCUPAY: "Excupay",
      ISOLVED: "iSolved",
      UKG: "UKG"
    },
  }
];

const BureauStatusChangeSerializer: SerializerField[] = [
  {
    name: "Status",
    maxLength: 10,
    minLength: 6,
    type: {
      PENDING: "Pending",
      ACTIVE: "Active",
      BLOCKED: "Blocked"
    },
    required: true,
  }
];

export {
  BureauCreateSerializer,
  BureauStatusChangeSerializer,
  BureauUpdateSerializer
};
