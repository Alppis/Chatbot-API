PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS keywords(
  keyword TEXT PRIMARY KEY,
  cases INTEGER,
  UNIQUE(keyword));
CREATE TABLE IF NOT EXISTS responses(
  responseid INTEGER PRIMARY KEY, 
  response TEXT, 
  keyword TEXT,
  header TEXT,
  username TEXT,
  FOREIGN KEY(keyword) REFERENCES keywords(keyword) ON DELETE CASCADE);

COMMIT;
PRAGMA foreign_keys=ON;  
   