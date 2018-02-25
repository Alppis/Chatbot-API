'''
Tests for database implementation
Slightly modified from exercise1 api_tests_message tests
'''

import sqlite3, unittest, collections
from src import database

#Database path
DB_PATH = 'db/keywords_test.db'
ENGINE = database.Engine(DB_PATH)

class KeywordTestCase(unittest.TestCase):
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

    def test_create_keyword_object(self):
        '''
        Checks that method _create_keyword_object works returning adequate values for the first database row
        '''
        print('('+self.test_create_keyword_object.__name__+')', \
              self.test_create_keyword_object.__doc__)
        #Create the SQL Statement
        keys_on = 'PRAGMA foreign_keys = ON'
        query = 'SELECT * FROM keywords WHERE keyword_id = 1'
        #Get the sqlite3 con from the Connection instance
        con = self.connection.con
        with con:
            #Cursor and row initialization
            con.row_factory = sqlite3.Row
            cur = con.cursor()
            #Provide support for foreign keys
            cur.execute(keys_on)
            #Execute main SQL Statement
            cur.execute(query)
            #Extrac the row
            row = cur.fetchone()
        #Test the method
        keyword = self.connection._create_keyword_object(row)
        self.assertDictContainsSubset(keyword, keyword1)

    def test_get_keyword(self):
        '''
        Test get_keyword with id msg-1 and msg-10
        '''
        print('('+self.test_get_keyword.__name__+')', \
              self.test_get_keyword.__doc__)
        #Test with an existing keyword
        keyword = self.connection.get_keyword(KEYWORD1_ID)
        self.assertDictContainsSubset(keyword, KEYWORD1)
        keyword = self.connection.get_keyword(KEYWORD2_ID)
        self.assertDictContainsSubset(keyword, KEYWORD2)
    
    def test_get_keyword_malformedid(self):
        '''
        Test get_keyword with id 1 (malformed)
        '''
        print('('+self.test_get_keyword_malformedid.__name__+')', \
              self.test_get_keyword_malformedid.__doc__)
        #Test with an existing keyword
        with self.assertRaises(ValueError):
            self.connection.get_keyword('1')

    def test_get_keyword_noexistingid(self):
        '''
        Test get_keyword with msg-200 (no-existing)
        '''
        print('('+self.test_get_keyword_noexistingid.__name__+')',\
              self.test_get_keyword_noexistingid.__doc__)
        #Test with an existing keyword
        keyword = self.connection.get_keyword(WRONG_keyword_ID)
        self.assertIsNone(keyword)

    def test_contains_keyword(self):
        '''
        Test contains_keyword
        '''
        print('('+self.test_contains_keyword.__name__+')',\
              self.test_contains_keyword.__doc__)
        #Test with an existing keyword
        keyword = self.connection.get_keyword(KEYWORD_ID)
        self.assertIsNotNone(keyword_id)

    def test_contains_keyword_notexisting(self):
        '''
        Test contains_keyword with no-existing
        '''
        print('('+self.test_contains_keyword.__name__+')',\
              self.test_contains_keyword.__doc__)
        #Test with an existing keyword
        keyword = self.connection.get_keyword(WRONG_keyword_ID)
        self.assertIsNone(keyword_id)

if __name__ == '__main__':
    print('Start running keyword tests')
    unittest.main()