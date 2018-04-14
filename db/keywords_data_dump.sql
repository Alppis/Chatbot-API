INSERT INTO "keywords" VALUES('MyWords',0);
INSERT INTO "keywords" VALUES('Tux',1);
INSERT INTO "keywords" VALUES('robot',1);
INSERT INTO "keywords" VALUES('Ni!',0);
INSERT INTO "keywords" VALUES('Berserk',0);

INSERT OR REPLACE INTO "users" VALUES('Anonymous', '2018-02-16 18:48:22', 1068, 'Test String');
INSERT OR REPLACE INTO "users" VALUES('LinuxPenguin', '2018-02-12 19:11:12', 12, 'Tux Tux');
INSERT OR REPLACE INTO "users" VALUES('PHP Programmer', '2017-09-11 20:09:14', 3, 'Spock or Picard?');
INSERT OR REPLACE INTO "users" VALUES('GUTS', '2018-01-01 13:13:03', 123, 'I love ships.');
INSERT OR REPLACE INTO "users" VALUES('ILoveCheese', '2017-12-24 21:13:46', 14, 'Hey robot! Tell me something new!');
INSERT OR REPLACE INTO "users" VALUES('Killian', '2018-02-12 09:54:33', 333, '!Monty Ni!');


INSERT INTO "responses" VALUES(1,'Jolly Good!','MyWords',NULL,'Anonymous');
INSERT INTO "responses" VALUES(2,'Linux is best!','Tux','Shebang','LinuxPenguin');
INSERT INTO "responses" VALUES(3,'Debian or Red Hat?','Tux','Shebang','LinuxPenguin');
INSERT INTO "responses" VALUES(4,'It is Mr. Robot with upper case!','robot',NULL,'Anonymous');
INSERT INTO "responses" VALUES(5,'We are the knights who say Ni!','Ni!','Monty','Anonymous');
INSERT INTO "responses" VALUES(6,'Ni!','Ni!','Monty','Anonymous');
INSERT INTO "responses" VALUES(7,'Griffith did nothing wrong!','Berserk',NULL,'GUTS');


INSERT INTO "statistics" VALUES(1, 'MyWords', 120, '2018-01-01 01:03:26', 'Anonymous');
INSERT INTO "statistics" VALUES(2, 'Tux', 234, '2018-02-12 19:11:12', 'LinuxPenguin');
INSERT INTO "statistics" VALUES(3, 'robot', 11, '2017-12-24 21:13:46', 'ILoveCheese');
INSERT INTO "statistics" VALUES(4, 'Ni!', 115, '2018-02-12 09:54:33', 'Killian');
INSERT INTO "statistics" VALUES(5, 'Berserk', 0, NULL, 'Anonymous');


