# Khanh Nghiem
#Sam Barnes
# Welsh-Powell Algorithm

# graph is a dict with nodes as keys and their neighbors as values
graph = {'A': ['B', 'C', 'D', 'E'],
         'B': ['A'],
         'C': ['A', 'E'],
         'D': ['A'],
         'E': ['A', 'C', 'F'],
         'F': ['E', 'G'],
         'G': ['F']}

# return the degree of each vertex
def getDegree(pair):
    return len(pair[1])

def Welsh_Powell(graph):
    # sorting vertices by descending degree
    graph_list = list(graph.items())
    graph_list.sort(key = getDegree, reverse = True)

    # get the set of vertices in order
    V = []
    for el in graph_list:
        V.append(el[0])

    # initiate result coloring dict, with vertices as keys and colors as values
    coloring = {}
    
    # initiate the number (as also the index) of colors
    count = 0

    # traverse the the list and color the graph
    for i in range(len(V)):
        v = V[i]
        #print(v)
        # if the vertex has not been colored
        if v not in coloring:         
            # assign the first available color
            coloring[v] = count

            # increment the count of colors
            count += 1
            
            # traverse list V and assign the same color to non-neigbors of v
            for k in range(i+1, len(V)):
                v_prime = V[k]
                if (v_prime not in coloring) and (v_prime not in graph[v]):

                    # check if any neighbor of v_prime is of the same color as v
                    # assume there is none (which means we could still color v_prime the same as v)
                    flag = False

                    # get all neighbors of v_prime
                    neighbors = graph[v_prime]
                    
                    for n in neighbors:
                        # if a neighbor of v_prime has the same color as v, flag = True
                        if (n in coloring) and (coloring[n] == coloring[v]):
                            flag = True
                    # if v_prime doesn't have any neighbor of the same color as v
                    # color v_prime as v
                    if flag == False:
                        coloring[v_prime] = coloring[v]
    return coloring

def main():
    result = Welsh_Powell(graph)
    print(result)

if __name__ == "__main__":
    main()
                                        
                                    
    
    
    
    
    
    

