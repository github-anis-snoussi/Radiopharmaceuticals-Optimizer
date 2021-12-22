const diff_time = (date1, date2) => {
    const diffMs = Math.abs(date1 - date2);
    const diff_in_minutes = Math.round(diffMs / 60000);
    return diff_in_minutes
}


const decay = (a0, half_life, t) => {
    const a = a0 * Math.exp(-Math.log(2) * t / half_life)
    return a
}


const activity_at_first_inj = (patient_inj_time_list, rp_settings) => {
    const ta = decay(rp_settings.rp_activity, rp_settings.rp_half_life, diff_time(patient_inj_time_list[0], rp_settings.mesure_time))
    const ra = ta * (rp_settings.rp_vol - rp_settings.wasted_vol) / rp_settings.rp_vol
    return ra
}


const usable_activity = (total_rp_activity, total_rp_vol, unextractable_rp_vol) => {
    const a = total_rp_activity * (total_rp_vol - unextractable_rp_vol) / total_rp_vol
    return a
}


const generate_patient_inj_time_list = (patient_list, patient_scan_time_list, rp_settings) => {

    patient_scan_time_list.push(0)
    let patient_inj_time_list = Array(patient_scan_time_list.length).fill(0)
    patient_list.push({
        injected: false
    })

    patient_list.forEach((x, i) => {
        if (x.injected) {
            patient_inj_time_list[i] = x.inj_time
        } else if (i === 0) {
            patient_inj_time_list[i] = rp_settings.first_inj_time
        } else {
            // patient_inj_time_list[i] = patient_inj_time_list[i-1] + datetime.timedelta(minutes = patient_scan_time_list[i-1])
            patient_inj_time_list[i] = new Date(patient_inj_time_list[i - 1]).setMinutes(new Date(patient_inj_time_list[i - 1]).getMinutes() + patient_scan_time_list[i - 1])
        }
    })

    patient_scan_time_list.pop()
    patient_list.pop()

    return patient_inj_time_list
}


const first_sorting = (patient_list_og) => {

    let patient_list = [...patient_list_og]

    patient_list = patient_list.map(x => {
        return {
            ...x,
            ratio: x.injected ? 0 : x.scan_time / x.dose
        }
    })

    patient_list.sort((a, b) => {
        return a.ratio - b.ratio;
    });

    patient_list = patient_list.map(x => {
        delete x.ratio;
        return x
    })

    return patient_list
}


const second_sorting = (patient_list, rp_settings) => {
    let sorting_condition = true
    while(sorting_condition){
        sorting_condition = false
        for (var i = 0; i < patient_list.length - 1 ; i++) {
            if(patient_list[i].injected === false){
                let before = calcul_final_expected_activity(patient_list, rp_settings).usable_remaining_activity
                patient_list[i] = [patient_list[i+1],patient_list[i+1]=patient_list[i]][0]
                let after = calcul_final_expected_activity(patient_list, rp_settings).usable_remaining_activity
                if(before >= after) {
                    patient_list[i] = [patient_list[i+1],patient_list[i+1]=patient_list[i]][0]
                }else {
                    sorting_condition = true
                }
            }
        }
    }
}


const sort_patient_list = (patient_list_og, rp_settings) => {
    let patient_list = [...patient_list_og]
    sorting_after_every_injection(patient_list)
    let sorted_list = first_sorting(patient_list)
    second_sorting(sorted_list, rp_settings)
    return sorted_list;
}



// WE EXPORT THE MAIN FUNCTION HERE : sort_patient_list
export default sort_patient_list;

// WE EXPORT SOME HELPER FUNCTIONS
export const activity_now = (patient_list, rp_settings) => {
    let now_dict = {}

    let injected_patients_list = patient_list.filter(x => x.injected)
    let k = injected_patients_list.length

    if(k === 0) {
        now_dict.total_vol_now = rp_settings.rp_vol - rp_settings.wasted_vol
        now_dict.usable_vol_now = now_dict.total_vol_now - rp_settings.unextractable_vol
        now_dict.total_activity_now_before_prime = decay(rp_settings.rp_activity, rp_settings.rp_half_life, diff_time(new Date(), rp_settings.mesure_time))
        now_dict.total_activity_now = now_dict.total_activity_now_before_prime * now_dict.total_vol_now / rp_settings.rp_vol
        now_dict.usable_activity_now = usable_activity (now_dict.total_activity_now, now_dict.total_vol_now, rp_settings.unextractable_vol)
    } else {
        let patient_dose_list = injected_patients_list.map(x => x.dose)
        let patient_inj_time_list = injected_patients_list.map(x => x.inj_time)
        let inj_time_activity_list = Array(k).fill(0)
        let remaining_activity_list = Array(k).fill(0)
        let patient_inj_vol_list = Array(k).fill(0)
        let remaining_vol_list = Array(k).fill(0)

        for (var i = 0; i < k; i++){
            if(i === 0) {
                inj_time_activity_list[i] = activity_at_first_inj(patient_inj_time_list, rp_settings)
                remaining_activity_list[i] = inj_time_activity_list[i] - patient_dose_list[i]
                patient_inj_vol_list[i] = patient_dose_list[i] * (rp_settings.rp_vol - rp_settings.wasted_vol) / inj_time_activity_list[i]
                remaining_vol_list[i] = rp_settings.rp_vol - rp_settings.wasted_vol - patient_inj_vol_list[i]
            } else {
                inj_time_activity_list[i] = decay(remaining_activity_list[i-1], rp_settings.rp_half_life, diff_time(patient_inj_time_list[i], patient_inj_time_list[i-1]))
                remaining_activity_list[i] = inj_time_activity_list[i] - patient_dose_list[i]
                patient_inj_vol_list[i] = patient_dose_list[i] * remaining_vol_list[i-1] / inj_time_activity_list[i]
                remaining_vol_list[i] = remaining_vol_list[i-1] - patient_inj_vol_list[i]
            }
        }

        now_dict.total_vol_now = remaining_vol_list[k-1]
        now_dict.usable_vol_now = remaining_vol_list[k-1] - rp_settings.unextractable_vol
        now_dict.total_activity_now = decay (remaining_activity_list[k-1], rp_settings.rp_half_life, diff_time( new Date() , patient_inj_time_list[k-1]))
        now_dict.usable_activity_now = usable_activity(now_dict.total_activity_now, remaining_vol_list[k-1], rp_settings.unextractable_vol)
    }


    return now_dict
}

export const sorting_after_every_injection = (patient_list) => {
    patient_list.sort((a, b) => {
        return (a.inj_time===null)-(b.inj_time===null) || +(a.inj_time>b.inj_time)||-(a.inj_time<b.inj_time);
    });
}

export const calcul_final_expected_activity = (patient_list, rp_settings) => {
    let patient_dose_list = patient_list.map(x => x.dose)
    let patient_scan_time_list = patient_list.map(x => x.scan_time)
    let patient_inj_time_list = generate_patient_inj_time_list(patient_list, patient_scan_time_list, rp_settings)

    patient_dose_list.push(0)

    let inj_time_activity_list = Array(patient_dose_list.length).fill(0)
    let remaining_activity_list = [...inj_time_activity_list]
    let patient_inj_vol_list = [...inj_time_activity_list]
    let remaining_vol_list = [...inj_time_activity_list]

    patient_dose_list.forEach((x, i) => {
        if (i === 0) {
            inj_time_activity_list[i] = activity_at_first_inj(patient_inj_time_list, rp_settings)
            remaining_activity_list[i] = inj_time_activity_list[i] - patient_dose_list[i]
            patient_inj_vol_list[i] = patient_dose_list[i] * (rp_settings.rp_vol - rp_settings.wasted_vol) / inj_time_activity_list[i]
            remaining_vol_list[i] = rp_settings.rp_vol - rp_settings.wasted_vol - patient_inj_vol_list[i]
        } else {
            inj_time_activity_list[i] = decay(remaining_activity_list[i - 1], rp_settings.rp_half_life, diff_time(patient_inj_time_list[i], patient_inj_time_list[i - 1]))
            remaining_activity_list[i] = inj_time_activity_list[i] - patient_dose_list[i]
            patient_inj_vol_list[i] = patient_dose_list[i] * remaining_vol_list[i - 1] / inj_time_activity_list[i]
            remaining_vol_list[i] = remaining_vol_list[i - 1] - patient_inj_vol_list[i]
        }
    })

    const usable_remaining_activity = usable_activity(remaining_activity_list.slice(-1)[0], remaining_vol_list.slice(-1)[0], rp_settings.unextractable_vol)
    patient_inj_vol_list.pop()
    const expected = {
        
        total_remaining_activity: remaining_activity_list.slice(-1)[0].toFixed(0),
        usable_remaining_activity: usable_remaining_activity.toFixed(0),

        total_remaining_vol: remaining_vol_list.slice(-1)[0].toFixed(2),
        usable_remaining_vol: (remaining_vol_list.slice(-1)[0] - rp_settings.unextractable_vol).toFixed(2),

        remaining_activity_time: new Date(patient_inj_time_list.slice(-1)[0]).toLocaleTimeString().replace(/(.*)\D\d+/, '$1'),

        patient_inj_time_list: patient_inj_time_list.slice(0, -1).map(x => new Date(x)), // a new column
        patient_inj_vol_list: patient_inj_vol_list, // a new column
    }

    return expected

}






// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// //                   SOME TEST DATA
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// // 1. testcase settings
// const rp_settings = {
//     rp_activity : 3825,
//     rp_half_life : 109.8, 
//     mesure_time : new Date(2021,5,10,8,0), 
//     first_inj_time : new Date(2021,5,10,7,45), 
//     rp_vol : 8.5, 
//     wasted_vol : 0.5, 
//     unextractable_vol : 0.64
// }

// // 2. testcase patients
// const patient_list = [
//     {name:"rami", dose:183, scan_time:45, injected:false, inj_time:null},
//     {name:"wael", dose:120, scan_time:30, injected:false, inj_time:null},
//     {name:"hama", dose:200, scan_time:30, injected:false, inj_time:null},
//     {name:"hihi", dose:300, scan_time:30, injected:true,  inj_time: new Date(2021,5,10,9,20)},
//     {name:"hous", dose:150, scan_time:30, injected:true,  inj_time: new Date(2021,5,10,9,0)},
//     {name:"kiki", dose:300, scan_time:30, injected:false, inj_time:null},
//     {name:"saki", dose:300, scan_time:40, injected:false, inj_time:null}
// ]


// // 3. testcase execution
// console.log( "before sorting : ", patient_list.map(x => x.name))
// sort_patient_list(patient_list, rp_settings)
// console.log( "after sorting : ", patient_list.map(x => x.name))

