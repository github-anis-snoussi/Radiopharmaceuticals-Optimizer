#!/usr/local/bin/python3

import math
import itertools

patients = [
    [300, 30],
    [225, 30],
    [210, 30],
    [183, 30],
    [252, 45],
    [210, 40],
    [156, 30],
    [201, 45]
]

all_permutations = list(itertools.permutations(patients, len(patients)))

# number of all possible permuations
print( "total possible permutations: ",  len(all_permutations))


# received activity
ac0 = 3825
# received volume
v0 = 8.5
# half life of the radioactive substance
half_life = 109.8
# we received this at t = 0s
t0 = 0

# function to calculate the remaining activity at the end of the test
def final_activity(patients_list):
    total = ac0
    print(total)
    # I will test it first with intial patients list
    for i in range(len(patients)):
        total = total - patients[i][0]
        l = math.log(2/half_life)
        t = patients[i][1]
        lost_ac = math.exp(-(l*t))
        total = total - math.floor(lost_ac)
        print(total)

final_activity([])