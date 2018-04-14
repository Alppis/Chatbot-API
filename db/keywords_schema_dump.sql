PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS keywords(
  keyword TEXT PRIMARY KEY,
  cases INTEGER);
CREATE TABLE IF NOT EXISTS users(
  username TEXT PRIMARY KEY,
  lastlogin TEXT,
  replies INTEGER,
  latestreply TEXT);  
CREATE TABLE IF NOT EXISTS responses(
  responseid INTEGER PRIMARY KEY, 
  response TEXT, 
  keyword TEXT,
  header TEXT,
  username TEXT,
  FOREIGN KEY(keyword) REFERENCES keywords(keyword) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE);
  
CREATE TABLE IF NOT EXISTS statistics(
  statisticid INTEGER PRIMARY KEY,
  keyword TEXT,
  keywordused INTEGER,
  lastuse TEXT,
  latestuser TEXT,
  FOREIGN KEY(keyword) REFERENCES keywords(keyword) ON DELETE CASCADE,
  FOREIGN KEY(latestuser) REFERENCES users(username) ON DELETE CASCADE);
  
    
COMMIT;
PRAGMA foreign_keys=ON;  
   