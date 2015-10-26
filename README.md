PassportJS SAML 
================

Relational Database Design
---------------

the table named users stores the user data

primary key: userID

|         |         |
|---------|---------|
| user ID |user name|

the table named posts stores all the posts on the site

the column userID here represent for the user publish the post

primary key: postID

foreign key: userID


|---------|---------|--------------|-----------|-----------|
| post ID | user ID | post content | post date | post time |

the table named comments stores all the comments on the site

the column userID here represent for the user write the comment

primary key: commentID

foreign key: poatID, userID

|---------|---------|------------|-----------------|--------------|--------------|
| post ID | user ID | comment ID | comment content | comment date | comment time |

Usage
-----

```bash
$ npm install
$ npm start
```
* Remember to start postgreSQL server before starting the web server.
```bash
$pg_ctl start -D /usr/local/var/postgres
```

