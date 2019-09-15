import urllib3, json

http = urllib3.PoolManager(num_pools=50)

#this is to retrieve all id's from JSON bin
request_bin_ids = http.request('GET', 'https://api.jsonbin.io/e/collection/5d73f0ff2d1fb96463c9faa8/all-bins', headers={'secret-key': '$2a$10$i4oSJqC3L35lA04tt774s.VK4ZLs43L9NvsLzmblXoeHu7lUPG6ES'})
bins = json.loads(request_bin_ids.data)

all_ids = bins['records']

#file = open("responses.txt","w+")

counter = 0

rankings = []

file = open("rankings.txt","w+")
#write the header
file.write('name,rank,gender')
file.write('\n')

#now for each id, get the data from the bin
for id in all_ids:
    submission_id = id['id']
    request_one_submission = http.request('GET', 'https://api.jsonbin.io/b/' + submission_id, headers={'secret-key': '$2a$10$i4oSJqC3L35lA04tt774s.VK4ZLs43L9NvsLzmblXoeHu7lUPG6ES', 'Content-type': 'application/json'})
    submission = json.loads(request_one_submission.data)
    # print(submission)
    # print('----')
    # file.write(str(submission))

    #submission has 2 fields: user info (gender age etc.) and data which are the PL rankings
    pl_ranking = submission['data']
    user = submission['user']
    for r in pl_ranking:
        file.write(r['name'] + ',' + r['value'] +',' + user['gender'])
        file.write('\n')
    counter += 1


file.close()

print(counter)

