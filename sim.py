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



# λ = ln(2) / t (half)
# A = A0 * e ^ (-λt)


# received activity
ac0 = 3341
# received volume
v0 = 8.5
# half life of the radioactive substance
half_life = 109.8
# we received this at t = 0s
t0 = 0

decay_const = math.log(2) / half_life

# function to calculate the remaining activity at the end of the test
def final_activity(patients_list):
    total = ac0
    print(total)
    # I will test it first with intial patients list
    for i in range(len(patients)):
        # we remove the injected quqntity

        # total = total - patients[i][0]

        # we calculate the radioactive decay during the test time

        elapsed_time = 0

        for j in range(0, i):
            elapsed_time = elapsed_time + patients[j][1] * 60
        

        # A = A0 * e ^ (-λt)
        lost_ac = int( ac0 * math.exp( - ( decay_const * elapsed_time ) ) )

        print(total - lost_ac)

final_activity([])

