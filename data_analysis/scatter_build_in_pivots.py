import csv
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# reading the data
data = pd.read_csv('rankings.txt')

#calculate the average score per language
average_per_language = pd.pivot_table(data, index= 'name', values= 'rank') #average is default aggrfunc
average_per_language = average_per_language.reset_index() #flatten to be able to work with it further along

#count the number of occurrences per lang
counts_per_language = pd.pivot_table(data, index= 'name', values= 'rank', aggfunc='count')

#now we want to merge the averages back into the original data, to sort all data points on those.
merged = data.merge(average_per_language, on='name')

#sort the values by their average rank
merged = merged.sort_values('rank_y', ascending = True)

# #now we want to merge the counts back into the original data, to *filter* all data points on those.
merged = merged.merge(counts_per_language, on='name')

#filter out the values with less than 100 rankings
merged_filtered = merged[merged['rank']> 100]

names = merged_filtered['name'] #retrieve just the names 
values = [int(x) for x in merged_filtered['rank_x']] #get the rankings and make them into ints

#plot definitions
plt.title('Ranks sorted by average')
plt.xlabel('programming language')
plt.ylabel('rank')
plt.xlim((0,100))

# Create the first plot
plt.scatter(values, names, s=10, alpha=0.5, c='b')

#from the filtered dataframe, we now flatten again using the max of the ranking
# (they're all the same average, because this is the result of a merge)
names_with_averages = pd.pivot_table(merged_filtered, index= 'name', values= 'rank_y', aggfunc='max')
names_with_averages = names_with_averages.reset_index() #flatten pivot table we we can grab separate columns

#add an extra plot for the averages
plt.scatter(names_with_averages['rank_y'], names_with_averages['name'], alpha=0.5, s=30, marker="x", c='r')

plt.savefig("scatter_sorted_by_average.png")
plt.show()





