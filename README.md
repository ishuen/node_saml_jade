Hw4
===
This is a warm-up for the final project. Aiming to facilitating the interactions among the alumni of a university and also the interactions between the alumni and the university, we are about to make a social network site. The task is to design and implement a web-based relational database that will become a key component of the planned Web application.

The database used here is **PostgreSQL**. It is a SQL-based database, which means that the database structure is relational and the query is almost the same as mySQL, which we are familiar with. And the web is built by node.js with jade as view engine. Since SAML2.0 authentication is not supported by node.js as default, we use the library **passport-saml**. Also, database client is not supported. So we use the library **node-postgres**. Both of database and web servers are running on the local host.

Relational Database Design
--------------------------

* The table named users stores the user data. There are 2 fields on the table.

	primary key: userID

|1        |2        |
|:-------:|:-------:|
| user ID |user name|


* The table named posts stores all the posts on the site. There are 5 fields on the table.

	the column userID here represent for the user publish the post

	primary key: postID

	foreign key: userID(references the table called users)

|   1    |    2   |     3     |     4    |   5      |
|:------:|:------:|:--------:|:---------:|:---------:|
| post ID | user ID | post content | post date | post time |


* The table named comments stores all the comments on the site. There are 6 columns in the table.

	the column userID here represent for the user write the comment

	primary key: commentID

	foreign key: poatID(references the table called posts), userID(references the table called users)

|  1    |    2   |    3  |    4   |   5   |   6    |
|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| post ID | user ID | comment ID | comment content | comment date | comment time |

Usage
-----

First, start the postgreSQL server.

```bash
$pg_ctl start -D /usr/local/var/postgres
```

After the database server successfully started, start the web server.

```bash
$ npm install
$ npm start app.js
```

Features
---------

1. The user can login via single sign-on authentication which uses SAML2.0.

2. After the user successfully logged in, the home page will shows the posts announced by all the users registered on this site. Here we call the place display all contens "post gallery". The posts are ordered descendently by the post time, that is to say, the most recent post will show on the top of the post gallery. The comments to the post are just under the post content. If the user wants to add a comment, just type on the text area and click the "submit" button.

3. When the user clicks "profile" on the side bar after he or she logged in, the data will be shown. The profile data includes the user id and user name. Since the data we got set the display name the same as user id, the name shown on the profile is also the same.

4. When the user wants to add a new post, he or she can click "new post" on the side bar. After writing down all the content on the textarea, just click the "submit" button. The page will be redirect to the home page and the new added post will on the top of it. If the user wants to edit the post after published, he or she can modify the content just click the "edit" under the post on the post gallery.
