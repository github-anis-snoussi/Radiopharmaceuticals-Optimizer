import datetime
from math import exp
from math import log

def diff_time (time1,time2) :
    diff = time1 - time2
    diff_in_seconds = diff.total_seconds()
    diff_in_minutes = diff_in_seconds / 60
    return (diff_in_minutes)

def decay (a0,half_life,t):
    a=a0*exp(-log(2)*t/half_life)
    return(a)

def activity_at_first_inj (patient_inj_time_list,rp_settings):
    ta = decay(rp_settings["rp_activity"],rp_settings["rp_half_life"],diff_time(patient_inj_time_list[0],rp_settings["mesure_time"]))
    ra = ta*( rp_settings["rp_vol"] - rp_settings["wasted_vol"])/rp_settings["rp_vol"]
    return(ra)

def usable_activity (total_rp_activity,total_rp_vol,unextractable_rp_vol):
    a=total_rp_activity*(total_rp_vol-unextractable_rp_vol)/total_rp_vol
    return (a)

def generate_patient_inj_time_list(patient_list,patient_scan_time_list,rp_settings):
    patient_scan_time_list.append(0)
    patient_inj_time_list=[0 for i in range(len(patient_scan_time_list))]
    patient_list.append({"injected":False})
    for i in range(len(patient_list)):
        if patient_list[i]["injected"]:
            patient_inj_time_list[i]=patient_list[i]["inj_time"]
        elif i ==0:
            patient_inj_time_list[i]=rp_settings["first_inj_time"]
        else:
            patient_inj_time_list[i] = patient_inj_time_list[i-1] + datetime.timedelta(minutes=patient_scan_time_list[i-1])
    patient_scan_time_list.pop()
    patient_list.pop()
    return (patient_inj_time_list)

def calcul_final_expected_activity (patient_list,rp_settings):
    patient_dose_list=[patient_list[i]["dose"] for i in range(len(patient_list))]
    patient_scan_time_list=[patient_list[i]["scan_time"] for i in range(len(patient_list))]
    patient_inj_time_list=generate_patient_inj_time_list(patient_list,patient_scan_time_list,rp_settings)
    patient_dose_list.append(0)
    inj_time_activity_list=[0 for i in range(len(patient_dose_list))]
    remaining_activity_list=[0 for i in range(len(patient_dose_list))]
    patient_inj_vol_list=[0 for i in range(len(patient_dose_list))]
    remaining_vol_list=[0 for i in range(len(patient_dose_list))]
    for i in range(len(patient_dose_list)):
        if i==0:
            inj_time_activity_list[i]= activity_at_first_inj(patient_inj_time_list,rp_settings)
            remaining_activity_list[i]=inj_time_activity_list[i]-patient_dose_list[i]
            patient_inj_vol_list[i]=patient_dose_list[i]*(rp_settings["rp_vol"]-rp_settings["wasted_vol"])/inj_time_activity_list[i]
            remaining_vol_list[i]=rp_settings["rp_vol"]-rp_settings["wasted_vol"]-patient_inj_vol_list[i]
        else :
            inj_time_activity_list[i]=decay(remaining_activity_list[i-1],rp_settings["rp_half_life"],diff_time(patient_inj_time_list[i],patient_inj_time_list[i-1]))
            remaining_activity_list[i]=inj_time_activity_list[i]-patient_dose_list[i]
            patient_inj_vol_list[i]=patient_dose_list[i]*remaining_vol_list[i-1]/inj_time_activity_list[i]
            remaining_vol_list[i]=remaining_vol_list[i-1]-patient_inj_vol_list[i]
    usable_remaining_activity=usable_activity(remaining_activity_list[-1],remaining_vol_list[-1],rp_settings["unextractable_vol"])
    patient_dose_list.pop()
    expected={}
    expected["total_remaining_activity"]=remaining_activity_list[-1]
    expected["total_remaining_vol"]=remaining_vol_list[-1]
    expected["usable_remaining_activity"]=usable_remaining_activity
    expected["usable_remaining_vol"]=remaining_vol_list[-1]-rp_settings["unextractable_vol"]
    expected["patient_inj_time_list"]=patient_inj_time_list
    return(expected)

def first_sorting (patient_list):
    for i in range(len(patient_list)):
        if patient_list[i]["injected"]:
            patient_list[i]["ratio"]=0
        else:
            patient_list[i]["ratio"]=patient_list[i]["scan_time"]/patient_list[i]["dose"]
    def ratio(m):
        return m["ratio"]
    patient_list.sort(key=ratio)
    for i in range(len(patient_list)):
        patient_list[i].pop("ratio")

def second_sorting (patient_list,rp_settings):
    sorting_condition=True
    while sorting_condition:
        sorting_condition=False
        for i in range(len(patient_list)-1):
            if patient_list[i]["injected"]==False:
                before = calcul_final_expected_activity(patient_list,rp_settings)["usable_remaining_activity"]
                patient_list[i],patient_list[i+1]=patient_list[i+1],patient_list[i]
                after = calcul_final_expected_activity(patient_list,rp_settings)["usable_remaining_activity"]
                if before >= after:
                    patient_list[i],patient_list[i+1]=patient_list[i+1],patient_list[i]
                else:
                    sorting_condition=True

def sorting_after_every_injection (patient_list):
    patient_injected_list=[patient_list[i]["injected"] for i in range(len(patient_list))]
    if any(patient_injected_list):
        def injtime(m):
            return m["inj_time"]
        patient_list.sort(key=injtime)

def activity_now (patient_list,rp_settings):
    k=0
    for i in range(len(patient_list)):
        if patient_list[i]["injected"]:
            k += 1
    if k > 0 :
        patient_dose_list=[patient_list[i]["dose"] for i in range(k)]
        patient_scan_time_list=[patient_list[i]["scan_time"] for i in range(k)]
        patient_inj_time_list=[patient_list[i]["inj_time"] for i in range(k)]
        inj_time_activity_list=[0 for i in range(k)]
        remaining_activity_list=[0 for i in range(k)]
        patient_inj_vol_list=[0 for i in range(k)]
        remaining_vol_list=[0 for i in range(k)]
        for i in range(k):
            if i ==0:
                inj_time_activity_list[i]= activity_at_first_inj(patient_inj_time_list,rp_settings)
                remaining_activity_list[i]=inj_time_activity_list[i]-patient_dose_list[i]
                patient_inj_vol_list[i]=patient_dose_list[i]*(rp_settings["rp_vol"]-rp_settings["wasted_vol"])/inj_time_activity_list[i]
                remaining_vol_list[i]=rp_settings["rp_vol"]-rp_settings["wasted_vol"]-patient_inj_vol_list[i]
            else :
                inj_time_activity_list[i]=decay(remaining_activity_list[i-1],rp_settings["rp_half_life"],diff_time(patient_inj_time_list[i],patient_inj_time_list[i-1]))
                remaining_activity_list[i]=inj_time_activity_list[i]-patient_dose_list[i]
                patient_inj_vol_list[i]=patient_dose_list[i]*remaining_vol_list[i-1]/inj_time_activity_list[i]
                remaining_vol_list[i]=remaining_vol_list[i-1]-patient_inj_vol_list[i]
        now_dict={}
        now_dict["total_vol_now"] = remaining_vol_list[-1]
        now_dict["usable_vol_now"] = remaining_vol_list[-1] - rp_settings["unextractable_vol"]
        now_dict["total_activity_now"] = decay(remaining_activity_list[-1],rp_settings["rp_half_life"],diff_time(datetime.datetime.now(),patient_inj_time_list[-1]))
        now_dict["usable_activity_now"] = usable_activity(now_dict["total_activity_now"],remaining_vol_list[-1],rp_settings["unextractable_vol"])
        return(now_dict)


rp_settings={"rp_activity":3825,"rp_half_life":109.8,"mesure_time":datetime.datetime(2021,5,10,8,0),"first_inj_time":datetime.datetime(2021,5,10,7,45),"rp_vol":8.5,"wasted_vol":0.5,"unextractable_vol":0.64}

patient_list = [{"name":"rami","dose":183,"scan_time":45,"injected":False,"inj_time":datetime.datetime.max},
                {"name":"wael","dose":120,"scan_time":30,"injected":False,"inj_time":datetime.datetime.max},
                {"name":"hama","dose":200,"scan_time":30,"injected":False,"inj_time":datetime.datetime.max},
                {"name":"hihi","dose":300,"scan_time":30,"injected":True,"inj_time":datetime.datetime(2021,5,10,9,20)},
                {"name":"hous","dose":150,"scan_time":30,"injected":True,"inj_time":datetime.datetime(2021,5,10,9,0)},
                {"name":"kiki","dose":300,"scan_time":30,"injected":False,"inj_time":datetime.datetime.max},
                {"name":"saki","dose":300,"scan_time":40,"injected":False,"inj_time":datetime.datetime.max}]


sorting_after_every_injection(patient_list)
for i in range(len(patient_list)):
    print(patient_list[i])
print(calcul_final_expected_activity(patient_list,rp_settings)["usable_remaining_activity"])


first_sorting(patient_list)
for i in range(len(patient_list)):
    print(patient_list[i])
print(calcul_final_expected_activity(patient_list,rp_settings)["usable_remaining_activity"])


second_sorting(patient_list,rp_settings)
for i in range(len(patient_list)):
    print(patient_list[i])
print(calcul_final_expected_activity(patient_list,rp_settings)["usable_remaining_activity"])


print(activity_now(patient_list,rp_settings)["total_activity_now"])