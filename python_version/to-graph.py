#convert data to graph

#data input is a dictionary with the class crn number as the key and a
#list of the camel numbers of all students in that class as the value

data = {"crn1": ["student1"],
        "crn2": ["student1"],
        "crn3": ["student1"],
        "crn4": ["student2"],
        "crn5": ["student3", "student4"],
        "crn6": ["student2", "student4"],}


def createGraph(data):
    #create graph with empty lists as values and classes as keys
    graph = {}
    for course in data:
        graph[course]=[]

    #for each key(class) check every other key to find out if any students
    #belong to two or more keys
    for c1 in data:
        
        for c2 in data:
            
            for s1 in data[c1]:

                for s2 in data[c2]:

                    #check if the students being considered are the same student
                    #make sure that it isn't the exact same dictionary entry
                    #(same student and class)
                
                    if s1==s2 and c1!=c2:
                        graph[c1]+=[c2]

    return graph

def main():
    result = createGraph(data)
    print(result)

main ()
