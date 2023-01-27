import amplitude from "amplitude-js";

export const initAmplitude = () => {
  amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE ?? '');
};

export const setAmplitudeUserDevice = (installationToken: any) => {
  amplitude.getInstance().setDeviceId(installationToken);
};

export const setAmplitudeUserId = (userId: any) => {
  amplitude.getInstance().setUserId(userId);
};

export const setAmplitudeUserProperties = (properties: any) => {
  amplitude.getInstance().setUserProperties(properties);
};

export const sendAmplitudeData = (eventType: any, eventProperties?: any) => {
  // only in prod
  if (process.env.REACT_APP_VERCEL_ENV === "production") {
    // due to limitations of the free plan, I'm only logging : NEW_PATIENT | INJECT_PATIENT
    if (
      [
        amplitudeLogsTypes.NEW_PATIENT,
        amplitudeLogsTypes.INJECT_PATIENT,
      ].includes(eventType)
    ) {
      amplitude.getInstance().logEvent(eventType, eventProperties);
    }
  }
};

export const amplitudeLogsTypes = {
  UPDATED_RP_SETTINGS: "UPDATED_RP_SETTINGS",
  NEW_PATIENT: "NEW_PATIENT",
  SORT_PATIENTS: "SORT_PATIENTS",
  INJECT_PATIENT: "INJECT_PATIENT",
  MODIFY_PATIENT: "MODIFY_PATIENT",
  DELETE_PATIENT: "DELETE_PATIENT",
  DELETE_ALL_PATIENTS: "DELETE_ALL_PATIENTS",
};
