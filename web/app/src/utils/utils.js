import moment from "moment";

export const formatFront2Back = (formatedPatientInfos) => {
  return formatedPatientInfos.map((e) => {
    return {
      // patient infos
      dose: e.dose,
      scan_time: e.duration,
      inj_time: e.realInjectionTime ? e.realInjectionTime.valueOf() : null,
      injected: e.status === "waiting" ? false : true,

      // secondary infos
      key: e.key, // should not change (identifies patient)
      index: e.index, // should not change (identifies patient)
      status: e.status,
      name: e.name,
    };
  });
};

export const formatBack2Front = (PatientInfos) => {
  return PatientInfos.map((e) => {
    return {
      // patient infos
      dose: e.dose,
      duration: e.scan_time,
      realInjectionTime: e.inj_time ? moment(e.inj_time) : null,

      // secondary infos
      key: e.key, // should not change (identifies patient)
      index: e.index, // should not change (identifies patient)
      status: e.status,
      name: e.name,
    };
  });
};
