'''
Tests for database implementation
Slightly modified from exercise1 api_test_tables tests
'''

import sqlite3, unittest, collections
from src import database

#Database path
DB_PATH = 'db/keywords.db'
ENGINE = database.Engine(DB_PATH)

KEYWORDS_SIZE = 5
RESPONSES_SIZE = 7

class CreateTablesTestCase(unittest.TestCase):
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
            print("!!!CONNCETION FAILED!!!")
            print(e)
            ENGINE.clear()

    def tearDown(self):
        '''
        Close connection and remove entries from database
        '''
        self.connection.close()
        ENGINE.clear()

    def test_keywords_table_schema(self):
        '''
        Test that keywords table has right schema
        '''
        print('('+self.test_keywords_table_created.__name__+')', \
                  self.test_keywords_table_created.__doc__)

        con = self.connection.con
        with con:
            c = con.cursor()

            #get column informaton
            c.execute('PRAGMA TABLE_INFO({})'.format('keywords'))

            #collect list about keywords
            result = c.fetchall()
            names = [tup[1] for tup in result]
            types = [tup[2] for tup in result]
            real_names=['keyword', 'cases']
            real_types=['TEXT','INTEGER']
            self.assertEqual(names, real_names)
            self.assertEqual(types, real_types)
    
    def test_keywords_table_created(self):
        '''
        Checks that the keywords table has 5 keywords
        '''
        print('('+self.test_keywords_table_created.__name__+')', \
                  self.test_keywords_table_created.__doc__)
        #Create the SQL Statement
        keys_on = 'PRAGMA foreign_keys = ON'
        query = 'SELECT * FROM keywords'
        #Get the sqlite3 con from the Connection instance
        con = self.connection.con
        with con:
            #cursor and row initialization
            con.row_factory = sqlite3.Row
            cur = con.cursor()
            #support for foreign keys
            cur.execute(keys_on)
            #execute main SQL Statement
            cur.execute(query)
            users = cur.fetchall()
            #assert
            self.assertEqual(len(users), KEYWORDS_SIZE)

    def test_responses_table_schema(self):
        '''
        Test that responses table has right schema
        '''
        print('('+self.test_responses_table_created.__name__+')', \
                  self.test_responses_table_created.__doc__)

        con = self.connection.con
        with con:
            c = con.cursor()

            #get column informaton
            c.execute('PRAGMA TABLE_INFO({})'.format('responses'))

            #collect list about keywords
            result = c.fetchall()
            names = [tup[1] for tup in result]
            types = [tup[2] for tup in result]
            real_names=['responseid', 'response', 'keyword', 'header', 'username']
            real_types=['INTEGER','TEXT', 'TEXT', 'TEXT', 'TEXT']
            self.assertEqual(names, real_names)
            self.assertEqual(types, real_types)

    def test_responses_table_created(self):
        '''
        Checks that responses table has 7 keywords
        '''
        print('('+self.test_responses_table_created.__name__+')', \
                  self.test_responses_table_created.__doc__)
        #Create the SQL Statement
        keys_on = 'PRAGMA foreign_keys = ON'
        query = 'SELECT * FROM responses'
        #Get the sqlite3 con from the Connection instance
        con = self.connection.con
        with con:
            #cursor and row initialization
            con.row_factory = sqlite3.Row
            cur = con.cursor()
            #support for foreign keys
            cur.execute(keys_on)
            #execute main SQL Statement
            cur.execute(query)
            users = cur.fetchall()
            #assert
            self.assertEqual(len(users), RESPONSES_SIZE)
    

if __name__ == '__main__':
    print('Start running database tests')
    unittest.main()