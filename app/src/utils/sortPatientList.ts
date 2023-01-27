const diffTime = (date1: any, date2: any) => {
  const diffMs = Math.abs(date1 - date2);
  const diffMinutes = Math.round(diffMs / 60000);
  return diffMinutes;
};

const decay = (a0: any, halfLife: any, t: any) => {
  const a = a0 * Math.exp((-Math.log(2) * t) / halfLife);
  return a;
};

const activityAtFirstInj = (patientInjTimeList: any, rpSettings: any) => {
  const ta = decay(
    rpSettings.rpActivity,
    rpSettings.rpHalfLife,
    diffTime(patientInjTimeList[0], rpSettings.mesureTime)
  );
  const ra =
    (ta * (rpSettings.rpVol - rpSettings.wastedVol)) / rpSettings.rpVol;
  return ra;
};

const usableActivity = (totalRpActivity: any, totalRpVol: any, unextractableRpVol: any) => {
  return (totalRpActivity * (totalRpVol - unextractableRpVol)) / totalRpVol;
};

const generatePatientInjTimeList = (
  patientList: any,
  patientScanTimeList: any,
  rpSettings: any
) => {
  patientScanTimeList.push(0);
  let patientInjTimeList = Array(patientScanTimeList.length).fill(0);
  patientList.push({
    isInjected: false,
  });

  patientList.forEach((x: any, i: any) => {
    if (x.isInjected) {
      patientInjTimeList[i] = x.realInjectionTime;
    } else if (i === 0) {
      patientInjTimeList[i] = rpSettings.firstInjTime;
    } else {
      // patientInjTimeList[i] = patientInjTimeList[i-1] + datetime.timedelta(minutes = patientScanTimeList[i-1])
      patientInjTimeList[i] = new Date(patientInjTimeList[i - 1]).setMinutes(
        new Date(patientInjTimeList[i - 1]).getMinutes() +
        patientScanTimeList[i - 1]
      );
    }
  });

  patientScanTimeList.pop();
  patientList.pop();

  return patientInjTimeList;
};

const firstSorting = (patientListOg: any) => {
  let patientList = [...patientListOg];

  patientList = patientList.map((x) => {
    return {
      ...x,
      ratio: x.isInjected ? 0 : x.duration / x.dose,
    };
  });

  patientList.sort((a, b) => {
    return a.ratio - b.ratio;
  });

  patientList = patientList.map((x) => {
    delete x.ratio;
    return x;
  });

  return patientList;
};

const secondSorting = (patientList: any, rpSettings: any) => {
  let sortingCondition = true;
  while (sortingCondition) {
    sortingCondition = false;
    for (var i = 0; i < patientList.length - 1; i++) {
      if (patientList[i].isInjected === false) {
        // some logging
        // console.log("=============================")
        // console.log(`+++ Swapping [${i}] & [${i+1}] +++`)
        // console.log("=============================")

        let before = calculFinalExpectedActivity(
          patientList,
          rpSettings
        ).usableRemainingActivity;

        // final activity before swapping
        // console.log(`==> BEFORE : ${before}`)

        // looks like fancy shit didnt work, back to the old ways
        let aux1 = patientList[i];
        patientList[i] = patientList[i + 1];
        patientList[i + 1] = aux1;

        let after = calculFinalExpectedActivity(
          patientList,
          rpSettings
        ).usableRemainingActivity;

        // final activity after swapping
        // console.log(`==> AFTER : ${after}`)

        if (parseInt(before, 10) >= parseInt(after, 10)) {
          // console.log("<|-|-|-| FINISHED |-|-|-|>")

          let aux2 = patientList[i];
          patientList[i] = patientList[i + 1];
          patientList[i + 1] = aux2;
        } else {
          // console.log("<|-|-|-| CONTINUE |-|-|-|>")

          sortingCondition = true;
        }
      }
    }
  }
};

const sortPatientList = (patientListOg: any, rpSettings: any) => {
  let patientList = [...patientListOg];
  sortingAfterEveryInjection(patientList);
  let sortedList = firstSorting(patientList);
  secondSorting(sortedList, rpSettings);
  return sortedList;
};

const activityNow = (patientList: any, rpSettings: any) => {
  let nowDict: any = {};

  let injectedPatientsList = patientList.filter((x: any) => x.isInjected);
  let k = injectedPatientsList.length;

  injectedPatientsList = injectedPatientsList.map((x: any) => ({
    ...x,
    realInjectionTime: x.realInjectionTime
      ? new Date(x.realInjectionTime)
      : null,
  }));
  rpSettings = {
    ...rpSettings,
    mesureTime: new Date(rpSettings.mesureTime),
    firstInjTime: new Date(rpSettings.firstInjTime),
  };

  if (k === 0) {
    nowDict.totalVolNow = rpSettings.rpVol - rpSettings.wastedVol;
    nowDict.usableVolNow = nowDict.totalVolNow - rpSettings.unextractableVol;
    nowDict.totalActivityNowBeforePrime = decay(
      rpSettings.rpActivity,
      rpSettings.rpHalfLife,
      diffTime(new Date(), rpSettings.mesureTime)
    );
    nowDict.totalActivityNow =
      (nowDict.totalActivityNowBeforePrime * nowDict.totalVolNow) /
      rpSettings.rpVol;
    nowDict.usableActivityNow = usableActivity(
      nowDict.totalActivityNow,
      nowDict.totalVolNow,
      rpSettings.unextractableVol
    );
  } else {
    let patientDoseList = injectedPatientsList.map((x: any) => x.dose);
    let patientInjTimeList = injectedPatientsList.map(
      (x: any) => x.realInjectionTime
    );
    let injTimeActivityList = Array(k).fill(0);
    let remainingActivityList = Array(k).fill(0);
    let patientInjVolList = Array(k).fill(0);
    let remainingVolList = Array(k).fill(0);

    for (var i = 0; i < k; i++) {
      if (i === 0) {
        injTimeActivityList[i] = activityAtFirstInj(
          patientInjTimeList,
          rpSettings
        );
        remainingActivityList[i] = injTimeActivityList[i] - patientDoseList[i];
        patientInjVolList[i] =
          (patientDoseList[i] * (rpSettings.rpVol - rpSettings.wastedVol)) /
          injTimeActivityList[i];
        remainingVolList[i] =
          rpSettings.rpVol - rpSettings.wastedVol - patientInjVolList[i];
      } else {
        injTimeActivityList[i] = decay(
          remainingActivityList[i - 1],
          rpSettings.rpHalfLife,
          diffTime(patientInjTimeList[i], patientInjTimeList[i - 1])
        );
        remainingActivityList[i] = injTimeActivityList[i] - patientDoseList[i];
        patientInjVolList[i] =
          (patientDoseList[i] * remainingVolList[i - 1]) /
          injTimeActivityList[i];
        remainingVolList[i] = remainingVolList[i - 1] - patientInjVolList[i];
      }
    }

    nowDict.totalVolNow = remainingVolList[k - 1];
    nowDict.usableVolNow =
      remainingVolList[k - 1] - rpSettings.unextractableVol;
    nowDict.totalActivityNow = decay(
      remainingActivityList[k - 1],
      rpSettings.rpHalfLife,
      diffTime(new Date(), patientInjTimeList[k - 1])
    );
    nowDict.usableActivityNow = usableActivity(
      nowDict.totalActivityNow,
      remainingVolList[k - 1],
      rpSettings.unextractableVol
    );
  }

  return nowDict;
};

const sortingAfterEveryInjection = (patientList: any) => {
  patientList.sort((a: any, b: any) => {
    return (
      (a.realInjectionTime === null) as any - ((b.realInjectionTime === null) as any) ||
      +(a.realInjectionTime > b.realInjectionTime) ||
      -(a.realInjectionTime < b.realInjectionTime)
    );
  });
};

const calculFinalExpectedActivity = (patientList: any, rpSettings: any) => {
  patientList = patientList.map((x: any) => ({
    ...x,
    realInjectionTime: x.realInjectionTime
      ? new Date(x.realInjectionTime)
      : null,
  }));
  rpSettings = {
    ...rpSettings,
    mesureTime: new Date(rpSettings.mesureTime),
    firstInjTime: new Date(rpSettings.firstInjTime),
  };

  let patientDoseList = patientList.map((x: any) => x.dose);
  let patientScanTimeList = patientList.map((x: any) => x.duration);
  let patientInjTimeList = generatePatientInjTimeList(
    patientList,
    patientScanTimeList,
    rpSettings
  );

  patientDoseList.push(0);

  let injTimeActivityList = Array(patientDoseList.length).fill(0);
  let remainingActivityList = [...injTimeActivityList];
  let patientInjVolList = [...injTimeActivityList];
  let remainingVolList = [...injTimeActivityList];

  patientDoseList.forEach((x: any, i: any) => {
    if (i === 0) {
      injTimeActivityList[i] = activityAtFirstInj(
        patientInjTimeList,
        rpSettings
      );
      remainingActivityList[i] = injTimeActivityList[i] - patientDoseList[i];
      patientInjVolList[i] =
        (patientDoseList[i] * (rpSettings.rpVol - rpSettings.wastedVol)) /
        injTimeActivityList[i];
      remainingVolList[i] =
        rpSettings.rpVol - rpSettings.wastedVol - patientInjVolList[i];
    } else {
      injTimeActivityList[i] = decay(
        remainingActivityList[i - 1],
        rpSettings.rpHalfLife,
        diffTime(patientInjTimeList[i], patientInjTimeList[i - 1])
      );
      remainingActivityList[i] = injTimeActivityList[i] - patientDoseList[i];
      patientInjVolList[i] =
        (patientDoseList[i] * remainingVolList[i - 1]) / injTimeActivityList[i];
      remainingVolList[i] = remainingVolList[i - 1] - patientInjVolList[i];
    }
  });

  const usableRemainingActivity = usableActivity(
    remainingActivityList.slice(-1)[0],
    remainingVolList.slice(-1)[0],
    rpSettings.unextractableVol
  );
  patientInjVolList.pop();
  const expected = {
    totalRemainingActivity: remainingActivityList.slice(-1)[0].toFixed(0),
    usableRemainingActivity: usableRemainingActivity.toFixed(0),

    totalRemainingVol: remainingVolList.slice(-1)[0].toFixed(2),
    usableRemainingVol: (
      remainingVolList.slice(-1)[0] - rpSettings.unextractableVol
    ).toFixed(2),

    remainingActivityTime: new Date(patientInjTimeList.slice(-1)[0]),

    patientInjTimeList: patientInjTimeList.slice(0, -1).map((x) => new Date(x)), // a new column
    patientInjVolList: patientInjVolList, // a new column
  };

  return expected;
};

// ++++++++++++++++++++++++++++++++++++++++
// +++++++++ HELPER FUNCTIONS  ++++++++++++
// ++++++++++++++++++++++++++++++++++++++++

const formatFront2Back = (formatedPatientInfos: any) => {
  return formatedPatientInfos;
};

const formatBack2Front = (PatientInfos: any) => {
  return PatientInfos;
};

// ++++++++++++++++++++++++++++++++++++++++
// +++++++++ EXPOSED INTERFACE ++++++++++++
// ++++++++++++++++++++++++++++++++++++++++

export const sort = (patientListOg: any, rpSettings: any) => {
  let patientList = formatFront2Back(patientListOg);
  const sortedPatientList = sortPatientList(patientList, rpSettings);
  return formatBack2Front(sortedPatientList);
};

export const clean = (patientListOg: any) => {
  let patientList = formatFront2Back(patientListOg);
  sortingAfterEveryInjection(patientList);
  return formatBack2Front(patientList);
};

export const expect = (patientListOg: any, rpSettings: any) => {
  let patientList = formatFront2Back(patientListOg);
  const nowDict = calculFinalExpectedActivity(patientList, rpSettings);
  return nowDict;
};

export const now = (patientListOg: any, rpSettings: any) => {
  let patientList = formatFront2Back(patientListOg);
  const predictDict = activityNow(patientList, rpSettings);
  return predictDict;
};

// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// //                   SOME TEST DATA
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// // 1. testcase settings
// const rpSettings = {
//     rpHalfLife : 109.8,
//     rpActivity : 3825,
//     mesureTime : new Date(2021,5,10,8,0),
//     firstInjTime : new Date(2021,5,10,7,45),
//     rpVol : 8.5,
//     wastedVol : 0.5,
//     unextractableVol : 0.64
// }

// // 2. testcase patients
// const patientList = [
//     {name:"Rami", dose:183, duration:45, isInjected:false, realInjectionTime:null},
//     {name:"Wael", dose:120, duration:30, isInjected:false, realInjectionTime:null},
//     {name:"Hama", dose:200, duration:30, isInjected:false, realInjectionTime:null},
//     {name:"Hihi", dose:300, duration:30, isInjected:true,  realInjectionTime: new Date(2021,5,10,9,20)},
//     {name:"Hous", dose:150, duration:30, isInjected:true,  realInjectionTime: new Date(2021,5,10,9,0)},
//     {name:"Kiki", dose:300, duration:30, isInjected:false, realInjectionTime:null},
//     {name:"Saki", dose:300, duration:40, isInjected:false, realInjectionTime:null}
// ]

// // 3. testcase execution
// console.log( "before sorting : ", patientList.map(x => x.name))
// sortPatientList(patientList, rpSettings)
// console.log( "after sorting : ", patientList.map(x => x.name))
