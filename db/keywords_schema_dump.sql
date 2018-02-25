PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS keywords(
  keyword TEXT PRIMARY KEY,
  response1 TEXT,
  response2 TEXT,
  header TEXT,
  username TEXT,
  cases INTEGER);
COMMIT;
PRAGMA foreign_keys=ON;