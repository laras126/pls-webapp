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

#filter out the values with less than 100 rankings
men = merged_filtered[merged_filtered['gender'] == 'male']
women = merged_filtered[merged_filtered['gender'] == 'female']
#they = merged[merged['gender'] != 'female' and  merged['gender'] != 'male'] klopy niet ietsmet any scheck ik morgenw el

#I am not fond of all the weird rank_x names, needs to be made prettier but I forgot how to rename columns :)
averages_men = pd.pivot_table(men, index= 'name', values= 'rank_x').reset_index() #average is default aggrfunc
averages_women = pd.pivot_table(women, index= 'name', values= 'rank_x').reset_index() #average is default aggrfunc

names_men = men['name'] #retrieve just the names 
values_men = [int(x) for x in men['rank_x']] #get the rankings and make them into ints

names_women = women['name'] #retrieve just the names 
values_women = [int(x) for x in women['rank_x']] #get the rankings and make them into ints

#plot definitions
plt.title('Ranks sorted by average')
plt.xlabel('programming language')
plt.ylabel('rank')
plt.xlim((0,100))

#plot the men
plt.scatter(values_men, names_men, s=10, alpha=0.1, c='b')

#plot the women
plt.scatter(values_women, names_women, s=10, alpha=0.1, c='r')

#add extra plots for the averages
plt.scatter(averages_men['rank_x'], averages_men['name'], alpha=0.8, s=20, marker="o", c='b')
plt.scatter(averages_women['rank_x'], averages_men['name'], alpha=0.8, s=20, marker="o", c='r')

plt.savefig("scatter_gender.png")
plt.show()





