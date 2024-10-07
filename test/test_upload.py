import unittest
import requests
import os

class TestUploadEndpoint(unittest.TestCase):
    base_url = 'http://127.0.0.1:5000/upload'  # Cambiado a 5000
  # Asegúrate de que tu servidor esté en ejecución

    @classmethod
    def setUpClass(cls):
        """Configura cualquier recurso que se necesita una vez por toda la clase."""
        cls.valid_zip_file = 'test_files/valid_test.zip'  # Cambia esto a la ruta correcta
        cls.invalid_file = 'test_files/invalid_test.txt'  # Cambia esto a la ruta correcta

    
    def test_upload_valid_file(self):
        """Prueba la subida de un archivo .zip válido."""
        with open(self.valid_zip_file, 'rb') as f:
            files = {'file': (self.valid_zip_file, f)}
            response = requests.post(self.base_url, files=files)
            self.assertEqual(response.status_code, 200)  # Cambia el código según lo que tu API retorne
            self.assertEqual(response.json()['message'], 'File uploaded successfully')


    def test_upload_invalid_file(self):
        """Prueba la subida de un archivo no válido."""
        with open(self.invalid_file, 'rb') as f:
            files = {'file': (self.invalid_file, f)}
            response = requests.post(self.base_url, files=files)
            self.assertEqual(response.status_code, 400)  # Cambia el código según lo que tu API retorne
            self.assertIn('error', response.json())  # Asegúrate de que tu API retorne este campo

if __name__ == '__main__':
    unittest.main()
