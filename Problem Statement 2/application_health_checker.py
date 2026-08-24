import sys
import requests
import time


DEFAULT_URL = "https://example.com"
TIMEOUT = 10


def check_application(url):

    print("========================================")
    print("       APPLICATION HEALTH CHECK")
    print("========================================")
    print("Checking:", url)

    start_time = time.time()

    try:
        response = requests.get(url, timeout=TIMEOUT)

        response_time = time.time() - start_time

        print("HTTP Status Code:", response.status_code)
        print("Response Time:", round(response_time, 2), "seconds")

        if 200 <= response.status_code < 400:
            print("Application Status: UP")
        else:
            print("Application Status: DOWN")

    except requests.exceptions.Timeout:
        print("Application Status: DOWN")
        print("Reason: Request timed out.")

    except requests.exceptions.ConnectionError:
        print("Application Status: DOWN")
        print("Reason: Could not connect to the application.")

    except requests.exceptions.RequestException as error:
        print("Application Status: DOWN")
        print("Reason:", error)

    print("========================================")


if __name__ == "__main__":

    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = DEFAULT_URL

    check_application(url)