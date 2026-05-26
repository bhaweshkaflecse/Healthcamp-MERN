export type Payload = {
  endpoint: string;
  params?: {} | null; // Make optional
  headers?: {} | null; // Make optional
  keyword?: string | null; // Make optional and change type to string | null
  body?: {} | null; // Make optional
};

export enum notificationStatus {
  DANGER = "red",
  SUCCESS = "green"
}