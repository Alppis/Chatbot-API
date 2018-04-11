'''
Tests for database implementation
Slightly modified from exercise1 api_tests_message tests
'''

import sqlite3, unittest, collections
from src import database

#Database path
DB_PATH = 'db/users_test.db'
ENGINE = database.Engine(DB_PATH)

USERNAME1 = 'LinuxPenguin'
USER1 = {'username': USERNAME1,
        'lastlogin': '2018-02-12 19:11:12',
        'replies': 12, 'latestreply': 'Tux Tux'}

USERNAME2 = 'PHP Programmer'
USER2 = {'username': USERNAME2,
        'lastlogin': '2017-09-11 20:09:14',
        'replies': 3, 'latestreply': 'Spock or Picard?'}

WRONG_USERNAME = 'Troll'

class UserTestCase(unittest.TestCase):
    '''
    Tests created tables
    '''
    #INITATION AND TEARDOWN METHODS
    @classmethod
    def setUpClass(cls):
        '''
        Removes previous database file if exists and creates new database structure
        '''
        #print("Testing", cls._name_)
        ENGINE.remove_database()
        ENGINE.create_tables()

    @classmethod
    def tearDownClass(cls):
        '''
        Remove testing database
        '''
        #print ("Testing ended for ", cls._name_)
        ENGINE.remove_database()

    def  setUp(self):
        '''
        Populate database
        '''
        try:
            #load initial values
            ENGINE.populate_tables()
            #create connection instance
            self.connection = ENGINE.connect()
        except Exception as e:
            ENGINE.clear()

    def tearDown(self):
        '''
        Close connection and remove entries from database
        '''
        self.connection.close()
        ENGINE.clear()

    def test_create_user_object(self):
        '''
        Checks that method _create_user_object works returning adequate user
        '''
        print('('+self.test_create_user_object.__name__+')', \
              self.test_create_user_object.__doc__)
        #Create the SQL Statement
        keys_on = 'PRAGMA foreign_keys = ON'
        query = 'SELECT * FROM users WHERE username = ?'
        #Get the sqlite3 con from the Connection instance
        con = self.connection.con
        with con:
            #Cursor and row initialization
            con.row_factory = sqlite3.Row
            cur = con.cursor()
            #Provide support for foreign keys
            cur.execute(keys_on)
            #Execute main SQL Statement
            pvalue = (USERNAME1, )
            cur.execute(query, pvalue)
            #Extrac the row
            row = cur.fetchone()
        #Test the method
        user = self.connection._create_user_object(row)
        self.assertDictContainsSubset(user, USERNAME)

    def test_get_user(self):
        '''
        Test get_user with usernames
        '''
        print('('+self.test_get_user.__name__+')', \
              self.test_get_user.__doc__)
        #Test with an existing username
        user = self.connection.get_user(USERNAME1)
        self.assertDictContainsSubset(user, USERNAME1)
        user = self.connection.get_user(USERNAME2)
        self.assertDictContainsSubset(user, USERNAME2)


    def test_get_user_noexistinguser(self):
        '''
        Test get_user with Troll (no-existing)
        '''
        print('('+self.test_get_user_noexistingid.__name__+')',\
              self.test_get_user_noexistingid.__doc__)
        #Test with an no-existing username
        user = self.connection.get_user(WRONG_USERNAME)
        self.assertIsNone(user)

    def test_contains_user(self):
        '''
        Test contains_user
        '''
        print('('+self.test_contains_user.__name__+')',\
              self.test_contains_user.__doc__)
        #Test with an existing user
        user = self.connection.get_user(USERNAME1)
        self.assertIsNotNone(USERNAME1)

    def test_contains_user_notexisting(self):
        '''
        Test contains_user with no-existing
        '''
        print('('+self.test_contains_user_notexisting.__name__+')',\
              self.test_contains_user_notexisting.__doc__)
        #Test with an existing username
        #self.assertFalse(self.connection.contains_user(USER_WRONG_NICKNAME))
        user = self.connection.get_user(WRONG_USERNAME)
        self.assertFalse(user)

if __name__ == '__main__':
    print('Start running user tests')
    unittest.main()