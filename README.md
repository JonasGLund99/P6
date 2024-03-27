# P6

Better Timed Pattern Searching in Log Files

Run Project
`cd TimeTrace`

### Hot reload

`npm start`

### Recommended extensions for VSCode:

Headwind


### Guide til at SSH ind på vores Ubuntu serer
Blogpost: https://www.combell.com/en/help/kb/create-an-openstack-linux-instance-and-connect-to-it-via-internet/

Ubuntu server: https://strato-new.claaudia.aau.dk/project/instances/
Ubuntu server IP: http://130.225.37.239

**Step 1 - Private key**
Download filen `private-key-jonas.pem`. 
Det er en private RSA key som skal bruges for at kunne forbinde via SSH.
Jeg har lagt min fil følgende sted: `"C:\Users\jonas\.ssh\private-key-jonas.pem"` 

**Step 2 - SSH**
Åbn terminalen og kør følgende kommando:
`ssh -i "path/to/filename.pem" ubuntu@130.225.37.239 -L 5000:localhost:5000` 
(tunneling af port 5000 på serveren til localhost:5000)

Eller denne:
`ssh -i "path/to/filename.pem" ubuntu@130.225.37.239` 
(port 22 er standard for SSH)

**Step 3 - Run monaa-backend Flask server**
`cd monaa-backend` 
(`git pull`)
`python3 -m flask --app server run`

**Step 4 - Postman**
Import `P6.postman_collection.json` i din Postman App.

**Step 5 - POST Body**
Upload .txt fil til Postman (se billede)

**Step 6 - POST request**
Fyr din første POST request afsted til vores MONAA API 🥳