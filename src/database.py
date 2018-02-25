from datetime import datetime
import time, sqlite3, re, os

# Default paths for .db and .sql files to create and populate the database.
DEFAULT_DB_PATH = 'db/keywords.db'
DEFAULT_SCHEMA = "db/keywords_schema_dump.sql"
DEFAULT_DATA_DUMP = "db/keywords_data_dump.sql"

'''
Slightly modified from exercise1 database.py
'''

class Engine(object):
    '''
    Abstraction of the database.

    It includes tools to create, configure,
    populate and connect to the sqlite file. You can access the Connection
    instance, and hence, to the database interface itself using the method
    :py:meth:`connection`.

    :Example:

    >>> engine = Engine()
    >>> con = engine.connect()

    :param db_path: The path of the database file (always with respect to the
        calling script. If not specified, the Engine will use the file located
        at *db/forum.db*

    '''

    def __init__(self, db_path=None):
        '''
        '''

        super(Engine, self).__init__()
        if db_path is not None:
            self.db_path = db_path
        else:
            self.db_path = DEFAULT_DB_PATH

    def connect(self):
        '''
        Creates a connection to the database.

        :return: A Connection instance
        :rtype: Connection

        '''
        return Connection(self.db_path)

    def remove_database(self):
        '''
        Removes the database file from the filesystem.

        '''
        if os.path.exists(self.db_path):
            # THIS REMOVES THE DATABASE STRUCTURE
            os.remove(self.db_path)

    def clear(self):
        '''
        Purge the database removing all records from the tables. However,
        it keeps the database schema (meaning the table structure)

        '''
        keys_on = 'PRAGMA foreign_keys = ON'
        # THIS KEEPS THE SCHEMA AND REMOVE VALUES
        con = sqlite3.connect(self.db_path)
        # Activate foreing keys support
        cur = con.cursor()
        cur.execute(keys_on)
        with con:
            cur = con.cursor()
            cur.execute("DELETE FROM keywords")
            # NOTE since we have ON DELETE CASCADE BOTH IN users_profile AND
            # friends, WE DO NOT HAVE TO WORRY TO CLEAR THOSE TABLES.

    # METHODS TO CREATE AND POPULATE A DATABASE USING DIFFERENT SCRIPTS
    def create_tables(self, schema=None):
        '''
        Create programmatically the tables from a schema file.

        :param schema: path to the .sql schema file. If this parmeter is
            None, then *db/forum_schema_dump.sql* is utilized.

        '''
        con = sqlite3.connect(self.db_path)
        if schema is None:
            schema = DEFAULT_SCHEMA
        try:
            with open(schema, encoding="utf-8") as f:
                sql = f.read()
                cur = con.cursor()
                cur.executescript(sql)
        finally:
            con.close()

    def populate_tables(self, dump=None):
        '''
        Populate programmatically the tables from a dump file.

        :param dump:  path to the .sql dump file. If this parmeter is
            None, then *db/keywords_data_dump.sql* is utilized.

        '''
        keys_on = 'PRAGMA foreign_keys = ON'
        con = sqlite3.connect(self.db_path)
        # Activate foreing keys support
        cur = con.cursor()
        cur.execute(keys_on)
        # Populate database from dump
        if dump is None:
            dump = DEFAULT_DATA_DUMP
        with open(dump, encoding="utf-8") as f:
            sql = f.read()
            cur = con.cursor()
            cur.executescript(sql)

    # METHODS TO CREATE THE TABLES PROGRAMMATICALLY WITHOUT USING SQL SCRIPT
    def create_keywords_table(self):
        '''
        Create the table ``keywords`` programmatically, without using .sql file.

        Print an error message in the console if it could not be created.

        :return: ``True`` if the table was successfully created or ``False``
            otherwise.

        '''
        keys_on = 'PRAGMA foreign_keys = ON'
        stmnt = 'CREATE TABLE keywords(keyword TEXT PRIMARY KEY, \
                 response1 TEXT, response2 TEXT, header TEXT, \
                 username TEXT, cases INTEGER)'
        con = sqlite3.connect(self.db_path)
        with con:
            # Get the cursor object.
            # It allows to execute SQL code and traverse the result set
            cur = con.cursor()
            try:
                cur.execute(keys_on)
                # execute the statement
                cur.execute(stmnt)
            except sqlite3.Error as excp:
                print("Error %s:" % excp.args[0])
                return False
        return True


class Connection(object):
    '''
    API to access the Keywords database.

    The sqlite3 connection instance is accessible to all the methods of this
    class through the :py:attr:`self.con` attribute.

    An instance of this class should not be instantiated directly using the
    constructor. Instead use the :py:meth:`Engine.connect`.

    Use the method :py:meth:`close` in order to close a connection.
    A :py:class:`Connection` **MUST** always be closed once when it is not going to be
    utilized anymore in order to release internal locks.

    :param db_path: Location of the database file.
    :type dbpath: str

    '''

    def __init__(self, db_path):
        super(Connection, self).__init__()
        self.con = sqlite3.connect(db_path)

    def close(self):
        '''
        Closes the database connection, commiting all changes.

        '''
        if self.con:
            self.con.commit()
            self.con.close()

    # FOREIGN KEY STATUS
    def check_foreign_keys_status(self):
        '''
        Check if the foreign keys has been activated.

        :return: ``True`` if  foreign_keys is activated and ``False`` otherwise.
        :raises sqlite3.Error: when a sqlite3 error happen. In this case the
            connection is closed.

        '''
        try:
            # Create a cursor to receive the database values
            cur = self.con.cursor()
            # Execute the pragma command
            cur.execute('PRAGMA foreign_keys')
            # We know we retrieve just one record: use fetchone()
            data = cur.fetchone()
            is_activated = data == (1,)
            print("Foreign Keys status: %s" % 'ON' if is_activated else 'OFF')
        except sqlite3.Error as excp:
            print("Error %s:" % excp.args[0])
            self.close()
            raise excp
        return is_activated

    def set_foreign_keys_support(self):
        '''
        Activate the support for foreign keys.

        :return: ``True`` if operation succeed and ``False`` otherwise.

        '''
        keys_on = 'PRAGMA foreign_keys = ON'
        try:
            # Get the cursor object.
            # It allows to execute SQL code and traverse the result set
            cur = self.con.cursor()
            # execute the pragma command, ON
            cur.execute(keys_on)
            return True
        except sqlite3.Error as excp:
            print("Error %s:" % excp.args[0])
            return False

    def unset_foreign_keys_support(self):
        '''
        Deactivate the support for foreign keys.

        :return: ``True`` if operation succeed and ``False`` otherwise.

        '''
        keys_on = 'PRAGMA foreign_keys = OFF'
        try:
            # Get the cursor object.
            # It allows to execute SQL code and traverse the result set
            cur = self.con.cursor()
            # execute the pragma command, OFF
            cur.execute(keys_on)
            return True
        except sqlite3.Error as excp:
            print("Error %s:" % excp.args[0])
            return False

    def _create_keyword_object(self, row):
        '''
        It takes a :py:class:`sqlite3.Row` and transform it into a dictionary.

        :param row: The row obtained from the database.
        :type row: sqlite3.Row
        :return: a dictionary containing the following keys:

        * ``keyword``: keywords of the message (primary)
        * ``response1``: the first response
        * ``response2``: the second response (optional)
        * ``header``: header used for filtering (optional)
        * ``username``: username used for filtering (optional)
        * ``cases``: See if the keyword is case sensitive,
        * 1 means positive, 0 negative (int)

        Note that all values in the returned dictionary are string unless
        otherwise stated.

        '''

        keyword_id = row['keyword']
        keyword_response1 = row['response1']
        if row['response2'] is not None:
            keyword_response2 = row['response2']
        else:
            keyword_response2 = None
        if row['header'] is not None:
            keyword_header = row['header']
        else:
            keyword_header = None
        if row['username'] is not None:
            keyword_username = row['username']
        else:
            keyword_username = None
        keyword_cases = row['cases']
        keyword = {'keyword': keyword_id, 'response1': keyword_response1,
                   'response2': keyword_response2, 'header': keyword_header,
                   'username': keyword_username, 'cases': keyword_cases}
        return keyword

    def get_keyword(self, keyword_id):
        '''
        Extracts a message from the database.

        :param keyword_id: The keyword.
        :return: A dictionary with the format provided in
            :py:meth:`_create_keyword_object` or None if the message with target
            id does not exist.
        :raises ValueError: when ``keyword_id`` is not well formed

        '''
        # Extracts the int which is the id for a message in the database

        '''
        match = re.match(r'keyword', keyword_id)
        if match is None:
            raise ValueError("The keyword is malformed")
        '''
        # messageid = int(match.group(1))
        # Activate foreign key support
        self.set_foreign_keys_support()
        # Create the SQL Query
        query = 'SELECT * FROM keywords WHERE keyword = ?'
        # Cursor and row initialization
        self.con.row_factory = sqlite3.Row
        cur = self.con.cursor()
        # Execute main SQL Statement
        pvalue = (keyword_id,)
        cur.execute(query, pvalue)
        # Process the response.
        # Just one row is expected
        row = cur.fetchone()
        if row is None:
            return None
        # Build the return object
        return self._create_keyword_object(row)

    def get_header(self, header):
        '''
        Extracts a message from the database.

        :param messageid: The header
        :return: A dictionary with the format provided in
            :py:meth:`_create_keyword_object` or None if the message with target
            id does not exist.
        :raises ValueError: when ``header`` is not well formed

        '''
        # Extracts the int which is the id for a message in the database
        """
        match = re.match(r'keyword', keyword_id)
        if match is None:
            raise ValueError("The keyword is malformed")
        """

        # messageid = int(match.group(1))
        # Activate foreign key support
        self.set_foreign_keys_support()
        # Create the SQL Query
        query = 'SELECT * FROM keywords WHERE header = ?'
        # Cursor and row initialization
        self.con.row_factory = sqlite3.Row
        cur = self.con.cursor()
        # Execute main SQL Statement
        pvalue = (header,)
        cur.execute(query, pvalue)
        # Process the response.
        # Just one row is expected
        row = cur.fetchone()
        if row is None:
            return None
        # Build the return object
        return self._create_keyword_object(row)

    def get_header(self, header):
        '''
        Extracts a message from the database.

        :param username: The header
        :return: List of keywords with the wanted header
        '''

        # Activate foreign key support
        self.set_foreign_keys_support()
        # Create the SQL Query
        query = 'SELECT keyword FROM keywords WHERE header = ?'
        # Cursor and row initialization
        self.con.row_factory = sqlite3.Row
        cur = self.con.cursor()
        # Execute main SQL Statement
        pvalue = (header,)
        cur.execute(query, pvalue)
        # Process the response.
        rows = cur.fetchall()
        if rows is None:
            return None
        responses = []
        for row in rows:
            responses.append(self._create_keyword_object_object(row))
        # Build the return object
        return self._create_keyword_object(row)

    def get_username(self, username):
        '''
        Extracts a message from the database.

        :param username: The username we are looking for
        :return: List of keywords with the wanted username
        '''

        # Activate foreign key support
        self.set_foreign_keys_support()
        # Create the SQL Query
        query = 'SELECT keyword FROM keywords WHERE username = ?'
        # Cursor and row initialization
        self.con.row_factory = sqlite3.Row
        cur = self.con.cursor()
        # Execute main SQL Statement
        pvalue = (username,)
        cur.execute(query, pvalue)
        # Process the response.
        rows = cur.fetchall()
        if rows is None:
            return None
        responses = []
        for row in rows:
            responses.append(self._create_keyword_object_object(row))
        # Build the return object
        return self._create_keyword_object(row)

    def is_case_sensitive(self, keyword):
        '''
        :param case: 1 means case sensitivity on keyword, 0 no case sensitivity
        :return: True if keyword is case sensitive
        :raises: ValueError if case is something else than 0 or 1
        '''

        query = 'SELECT cases FROM keywords WHERE keyword = ?'
        self.con.row_factory = sqlite3.Row
        cur = self.con.cursor()
        # Execute main SQL Statement
        pvalue = (keyword,)
        cur.execute(query, pvalue)
        row = cur.fetchone()
        if row != 1 or row != 0:
            raise ValueError("The cases has wrong value!")
        return row == 1

    def contains_keyword(self, keyword_id):
        '''
        :param keyword_id: the keyword we are looking for
        :return: True if the keyword is in the database. False otherwise.
        '''
        return self.get_keyword(keyword_id) is not None

    def contains_header(self, header):
        '''
        :param header: the header we are looking for
        :return: True if the header is in the database. False otherwise.
        '''
        return self.get_header(header) is not None

    def contains_username(self, username):
        '''
        :param username: the username we are looking for
        :return: True if the username is in the database. False otherwise.
        '''
        return self.get_username(username) is not None
