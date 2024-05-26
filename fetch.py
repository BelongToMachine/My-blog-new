import requests
import json

# URL of the API endpoint
url = "http://localhost:8000/mysite/projects/"

try:
    # Make a GET request to the API
    response = requests.get(url)
    
    response.raise_for_status()  # Raise an exception for HTTP errors

    # Parse the JSON response
    projects = response.json()

    # Specify the file path where you want to save the data
    file_path = 'public/db/projects.json'

    # Write the JSON data to a file
    with open(file_path, 'w') as file:
        json.dump(projects, file, indent=4)

    print(f"Data successfully written to {file_path}")

except requests.exceptions.RequestException as e:
    print(f"HTTP request failed: {e}")
except json.JSONDecodeError as e:
    print(f"Failed to parse JSON response: {e}")
except IOError as e:
    print(f"Failed to write to file: {e}")
