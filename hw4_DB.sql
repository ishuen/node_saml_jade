CREATE SCHEMA webalu;
CREATE TABLE webalu.users (userID varchar(30) NOT NULL, userName varchar(30) NOT NULL, PRIMARY KEY(userID));
-- ALTER TABLE users CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE TABLE webalu.posts (postID int NOT NULL, userID varchar(30) NOT NULL, post varchar(1000) NOT NULL, poDay date, poTime time,
	PRIMARY KEY(postID), FOREIGN KEY(userID) REFERENCES webalu.users(userID));
-- ALTER TABLE posts CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE TABLE webalu.comments (postID int NOT NULL, userID varchar(30) NOT NULL, commentID int NOT NULL, comment varchar(150) NOT NULL, comDay date, comTime time,
	PRIMARY KEY(commentID), FOREIGN KEY(postID) REFERENCES webalu.posts(postID), FOREIGN KEY(userID) REFERENCES webalu.users(userID));
-- ALTER TABLE comments CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO webalu.users VALUES('b00000001', '測試一');
INSERT INTO webalu.users VALUES('b00000002', '測試二');
INSERT INTO webalu.users VALUES('b00000003', '測試三');
INSERT INTO webalu.users VALUES('b00000004', '測試四');
INSERT INTO webalu.posts VALUES('1', 'b00000001', 'ajdklfndvnjkehfnejfkldshf.','2015-10-23', '14:14:14');
INSERT INTO webalu.posts VALUES('2', 'b00000003', 'ajdsajklhfsljkldjldkl;owdd.','2015-10-24', '10:14:14');
INSERT INTO webalu.comments VALUES('1', 'b00000003', '10', 'what?', '2015-10-23','14:16:20');
INSERT INTO webalu.comments VALUES('1', 'b00000004', '11', 'what???', '2015-10-23','14:18:50');
