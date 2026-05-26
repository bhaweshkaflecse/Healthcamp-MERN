export enum deptType {
  businessHead = 'business_head',
  participant = 'participant',
  teamLead = 'team_lead',
  unitCoordinator = 'unit_coordinator',
  dataEntry = 'data_entry',
  finance = 'finance',
  sales = 'sales',
  callCentre = 'call_centre',
  ITteam = 'IT_team',
}

export enum roleType {
  businessHead = 'business_head',
  participant = 'participant',
  teamLead = 'team_lead',
  unitCoordinator = 'unit_coordinator',
  dataEntry = 'data_entry',
  finance = 'finance',
  sales = 'sales',
  callCentre = 'call_centre',
  ITteam = 'IT_team',
  client = 'client',
}

export enum kycStatus {
  approved = 'approved',
  pending = 'pending',
  reject = 'reject',
}

export enum eventStatus {
  approved = 'approved',
  pending = 'pending',
  reject = 'reject',
  started = 'started',
  completed = 'completed',
}

export enum enrollStatus {
  approved = 'approved',
  pending = 'pending',
  reject = 'reject',
}

export enum bookingStatus {
  hold = 'hold',
  booked = 'booked',
  completed = 'completed',
  cancel = 'cancel',
}

export enum callType {
  incoming = 'incoming',
  outgoing = 'outgoing',
}

export enum callReasonType {
  QUERY = 'query',
  LEAD = 'lead',
  SERVICE = 'service',
}
export enum documentType {
  citizenship = 'citizenship',
  pan = 'pan',
  drivingLicense = 'drivingLicense',
  passport = 'passport',
}

export enum paymentMode {
  online = 'online',
  cash = 'cash',
  esewa = 'esewa',
  khalti = 'khalti',
  bankTransfer = 'bankTransfer',
}

export enum priorityType {
  low = 'low',
  medium = 'medium',
  high = 'high',
  critical = 'critical',
}

export enum requestType {
  technicalGlitches = 'technicalGlitches',
  participantManagement = 'participantManagement',
}

export enum billingStatus {
  paid = 'paid',
  unpaid = 'unpaid',
}

export enum paymentStatus {
  approved = 'approved',
  pending = 'pending',
  reject = 'reject',
}

export enum genderType {
  male = 'male',
  female = 'female',
  others = 'others',
}

export type JwtPayload = {
  sub: string;
  role: string;
};

export interface clientEventId {
  clientId: string;
  eventId: string;
}

export enum otpRequestType {
  register = 'register',
  forgotPassword = 'forgotPassword',
}

export enum reportPublishType {
  created = 'created',
  published = 'published',
  forwarded = 'forwarded',
}

export enum subteamAssignServiceType {
  true = 'true',
  false = 'false',
}

export enum reportForwardStatus {
  true = 'true',
  false = 'false',
}

export enum reportForwardBy {
  unitCoordinator = 'unitCoordinator',
  teamLead = 'teamLead',
  client = 'client',
}

export enum packagePurchaseStatType {
  week = 'week',
  month = 'month',
  year = 'year',
}

export type PaymentData = {
  id: string;
  price: number;
  createdAt: string;
};

export interface AdminType {
  name: string;
  email: string;
  contact: number;
  address: string;
  department:deptType
  password: string;
}