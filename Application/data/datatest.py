import unittest
import psutil
import platform
import cpuinfo
import Application.data.dbconnection as dbc
import Application.data.datacollection as data
from unittest.mock import patch, MagicMock

computer_data_test = {}

class TestDataCollection(unittest.TestCase):

    def setUp(self):
        self.result = None
        self.expected = None

    def test_info(self):
        # gather PC info
        computer_data_test['info'] = {}
        user = psutil.users()
        computer_data_test['info']['user_name'] = user[0].name
        computer_data_test['info']['processor'] = platform.processor()
        computer_data_test['info']['cpu_type'] = cpuinfo.get_cpu_info()['brand_raw']

        # launch PC info test
        data.info_test()

        self.result = data.computer_data['info']
        self.expected = computer_data_test['info']

    def test_cpu(self):
        pass

    def test_battery(self):
        pass

    def test_ram(self):
        pass

    def test_storage(self):
        pass

    def test_size(self):
        pass

    def test_count_eq(self):
        """Will succeed"""
        self.assertCountEqual(self.result, self.expected)

    def test_list_eq(self):
        """Will fail"""
        self.assertListEqual(self.result, self.expected)
