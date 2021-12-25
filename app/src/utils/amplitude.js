import amplitude from 'amplitude-js';

export const initAmplitude = () => {
  amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE);
};

export const setAmplitudeUserDevice = installationToken => {
  amplitude.getInstance().setDeviceId(installationToken);
};

export const setAmplitudeUserId = userId => {
  amplitude.getInstance().setUserId(userId);
};

export const setAmplitudeUserProperties = properties => {
  amplitude.getInstance().setUserProperties(properties);
};

export const sendAmplitudeData = (eventType, eventProperties) => {
  amplitude.getInstance().logEvent(eventType, eventProperties);
};


export const amplitudeLogsTypes = {
    UPDATED_RP_SETTINGS : 'UPDATED_RP_SETTINGS',
    NEW_PATIENT : 'NEW_PATIENT',
    SORT_PATIENTS : 'SORT_PATIENTS',
    INJECT_PATIENT: 'INJECT_PATIENT',
    MODIFY_PATIENT: 'MODIFY_PATIENT',
    DELETE_PATIENT: 'DELETE_PATIENT',
    DELETE_ALL_PATIENTS: 'DELETE_ALL_PATIENTS',
}