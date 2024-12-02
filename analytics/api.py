import os
import requests

API_URL = os.getenv('API_URL', 'http://localhost:8000')

# TODO: Improve error handling
def get_test(jwt, test_id):
    return requests.get(
        f'{API_URL}/tests/{test_id}',
        headers={'Authorization': f'Bearer {jwt}'}
    ).json()