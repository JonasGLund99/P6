const fs = require('fs');
const FILEEVENTALIAS = "../logfiles/logAB.txt";
const FILEEVENT = "../logfiles/logfileLoginLogout.txt";
const SIMULATEUSERINTERVAL = 10000;
const LOGOUTMIN = 5000;
const LOGOUTMAX = 60000;
class Event {
  constructor(event, alias) {
    this.event = event;
    this.alias = alias;
  }
}
const EVENTS = {login: new Event("login", "A"), logout: new Event("logout", "B")};

let unusedEventNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


// Function to generate a random user ID
function generateUserID() {
  return Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
}

// Function to generate a random time in milliseconds within a range
function randomTimeInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate log entries without user id
function generateLogEntryWithoutUserID(action) {
  const timestamp = new Date().getTime();
  return `${action} ${timestamp}\n`;
}

// Function to generate log entries
function generateLogEntry(userID, action) {
  const timestamp = new Date().getTime();
  return `User ${userID} ${action} ${timestamp}\n`;
}

// Function to simulate user logins and logouts
function simulateUserActivity() {
  const userID = generateUserID();
  const randIndex = Math.floor(Math.random() * unusedEventNames.length);
  const logEntryLoginAlias = generateLogEntryWithoutUserID(unusedEventNames[randIndex]);
  unusedEventNames.splice(randIndex, 1);
  const logEntryLogin = generateLogEntry(userID, EVENTS['login'].event);
  fs.appendFileSync(FILEEVENT, logEntryLogin);
  fs.appendFileSync(FILEEVENTALIAS, logEntryLoginAlias);
  
  // Simulate logout within 30 seconds - 10 minutes
  setTimeout(() => {
    const randIndex = Math.floor(Math.random() * unusedEventNames.length);
    const logEntryLogoutAlias = generateLogEntryWithoutUserID(unusedEventNames[randIndex]);
    unusedEventNames.splice(randIndex, 1);
    const logEntryLogout = generateLogEntry(userID, EVENTS['logout'].event);
    fs.appendFileSync(FILEEVENT, logEntryLogout);
    fs.appendFileSync(FILEEVENTALIAS, logEntryLogoutAlias);
  }, randomTimeInRange(LOGOUTMIN, LOGOUTMAX)); 
}

// Simulate user activity
setInterval(simulateUserActivity, SIMULATEUSERINTERVAL); // Simulate user activity every SIMULATEUSERINTERVAL milliseconds
fs.writeFileSync(FILEEVENT, "");
fs.writeFileSync(FILEEVENTALIAS, "");

console.log('Log file created. Monitoring user activity...');

