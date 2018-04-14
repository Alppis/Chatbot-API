'''
Tests for database implementation
Slightly modified from exercise1 api_tests_message tests
'''

import sqlite3, unittest, collections
from src import database

#Database path
DB_PATH = 'db/keywords_test.db'
ENGINE = database.Engine(DB_PATH)

KEYWORD1_ID = 'MyWords'
RESPONSE1_RESPONSE = 'Jolly Good!'
RESPONSE1_ID = 1
RESPONSE1 = {'responseid': RESPONSE1_ID, 'response': RESPONSE1_RESPONSE,
            'keyword': KEYWORD1_ID, 'header': None,
            'username': 'Anonymous'}
RESPONSE1_MODIFIED = {'responseid': RESPONSE1_ID, 'response': 'new response',
                     'keyword': KEYWORD1_ID, 'header': "new header",
                     'username': 'LinuxPenguin'}

KEYWORD2_ID = 'Tux'
RESPONSE2_RESPONSE = 'Linux is best!'
RESPONSE2_ID = 2
RESPONSE2 = {'responseid': RESPONSE2_ID, 'response': RESPONSE2_RESPONSE,
            'keyword': KEYWORD2_ID, 'header': 'Shebang',
            'username': 'LinuxPenguin'}

RESPONSE3_RESPONSE = 'Debian or Red Hat?'
RESPONSE3_ID = 3
RESPONSE3 = {'responseid': RESPONSE3_ID, 'response': RESPONSE3_RESPONSE,
            'keyword': KEYWORD2_ID, 'header': 'Shebang',
            'username': 'LinuxPenguin'}

WRONG_KEYWORD_ID = 'Troll'

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

    def test_create_response_object(self):
        '''
        Checks that method _create_response_object works returning adequate response
        '''
        print('('+self.test_create_response_object.__name__+')', \
              self.test_create_response_object.__doc__)
        #Create the SQL Statement
        keys_on = 'PRAGMA foreign_keys = ON'
        query = 'SELECT * FROM responses WHERE keyword = ?'
        #Get the sqlite3 con from the Connection instance
        con = self.connection.con
        with con:
            #Cursor and row initialization
            con.row_factory = sqlite3.Row
            cur = con.cursor()
            #Provide support for foreign keys
            cur.execute(keys_on)
            #Execute main SQL Statement
            pvalue = (KEYWORD1_ID, )
            cur.execute(query, pvalue)
            #Extrac the row
            row = cur.fetchone()
        #Test the method
        response = self.connection._create_response_object(row)
        self.assertDictContainsSubset(response, RESPONSE1)

    def test_get_response(self):
        '''
        Test get_response
        '''
        print('('+self.test_get_response.__name__+')', \
              self.test_get_response.__doc__)
        #Test with an existing keyword
        response = self.connection.get_response(KEYWORD1_ID)
        self.assertDictContainsSubset(response[0], RESPONSE1)
        response = self.connection.get_response(KEYWORD2_ID)
        self.assertDictContainsSubset(response[0], RESPONSE2)
        self.assertDictContainsSubset(response[1], RESPONSE3)



    def test_get_response_noexistingid(self):
        '''
        Test get_keyword with Troll (no-existing)
        '''
        print('('+self.test_get_response_noexistingid.__name__+')',\
              self.test_get_response_noexistingid.__doc__)
        #Test with an existing keyword
        response = self.connection.get_response(WRONG_KEYWORD_ID)
        self.assertEqual(response, [])

    def test_modify_response(self):
        '''
        Test that the response 1 is modifed
        '''
        print('(' + self.test_modify_response.__name__ + ')', \
              self.test_modify_response.__doc__)
        resp = self.connection.modify_response(RESPONSE1_ID, "new response",
                                              "new header", "LinuxPenguin")
        self.assertEqual(resp, RESPONSE1_ID)
        # Check that the responses has been really modified through a get
        resp2 = self.connection.get_response(KEYWORD1_ID)
        self.assertDictContainsSubset(resp2[0], RESPONSE1_MODIFIED)

    def test_contains_response(self):
        '''
        Test contains_response
        '''
        print('('+self.test_contains_response.__name__+')',\
              self.test_contains_response.__doc__)
        #Test with an existing keyword
        response = self.connection.contains_response(KEYWORD1_ID)
        self.assertIsNotNone(response)

    def test_contains_response_notexisting(self):
        '''
        Test contains_response with no-existing
        '''
        print('('+self.test_contains_response.__name__+')',\
              self.test_contains_response.__doc__)
        response = self.connection.get_response(WRONG_KEYWORD_ID)
        self.assertEqual(response, [])

if __name__ == '__main__':
    print('Start running keyword tests')
    unittest.main()