const fs = require('fs');
const FILEEVENTALIAS = "../logfiles/logAB.txt";
const FILEEVENT = "../logfiles/logfileLoginLogout.txt";
const SIMULATEUSERINTERVAL = 20000;
const LOGOUTMIN = 5000;
const LOGOUTMAX = 60000;
const EVENTS = {login: Event("login", "A"), logout: Event("logout", "B")};


// Function to generate a random user ID
function generateUserID() {
  return Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
}

// Function to generate a random time in milliseconds within a range
function randomTimeInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate log entries
function generateLogEntry(userID, action) {
  const timestamp = new Date().toISOString();
  return `${timestamp} - User ${userID} ${action}\n`;
}

// Function to simulate user logins and logouts
function simulateUserActivity() {
  const userID = generateUserID();
  const logEntryLoginAlias = generateLogEntry(userID, EVENTS['login'].alias);
  const logEntryLogin = generateLogEntry(userID, EVENTS['login'].event);
  fs.appendFileSync(FILEEVENT, logEntryLogin);
  fs.appendFileSync(FILEEVENTALIAS, logEntryLoginAlias);
  
  // Simulate logout within 30 seconds - 10 minutes
  setTimeout(() => {
    const logEntryLogoutAlias = generateLogEntry(userID, EVENTS['logout'].alias);
    const logEntryLogout = generateLogEntry(userID, EVENTS['logout'].event);
    fs.appendFileSync(FILEEVENT, logEntryLogout);
    fs.appendFileSync(FILEEVENTALIAS, logEntryLogoutAlias);
  }, randomTimeInRange(LOGOUTMIN, LOGOUTMAX)); 
}

// Simulate user activity
setInterval(simulateUserActivity, SIMULATEUSERINTERVAL); // Simulate user activity every SIMULATEUSERINTERVAL milliseconds

// Initial log entry
fs.writeFileSync(FILEEVENT, generateLogEntry('SYSTEM', 'initialized\n'));
fs.writeFileSync(FILEEVENTALIAS, generateLogEntry('SYSTEM', 'initialized\n'));
console.log('Log file created. Monitoring user activity...');

class Event {
  constructor(event, alias) {
    this.event = event;
    this.alias = alias;
  }
}