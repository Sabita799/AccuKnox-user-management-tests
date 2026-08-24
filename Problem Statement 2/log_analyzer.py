import re
from collections import Counter


LOG_FILE = "sample_access.log"


def analyze_log(file_path):

    total_requests = 0
    status_codes = Counter()
    requested_pages = Counter()
    ip_addresses = Counter()
    not_found_errors = 0

    log_pattern = re.compile(
        r'(\S+) \S+ \S+ \[.*?\] '
        r'"(?:GET|POST|PUT|DELETE|PATCH|HEAD) (\S+) .*?" '
        r'(\d{3})'
    )

    try:
        with open(file_path, "r", encoding="utf-8") as file:

            for line in file:

                match = log_pattern.search(line)

                if not match:
                    continue

                ip_address = match.group(1)
                page = match.group(2)
                status_code = int(match.group(3))

                total_requests += 1
                status_codes[status_code] += 1
                requested_pages[page] += 1
                ip_addresses[ip_address] += 1

                if status_code == 404:
                    not_found_errors += 1

    except FileNotFoundError:
        print("Error: Log file not found.")
        return

    print("\n========================================")
    print("       WEB SERVER LOG ANALYSIS")
    print("========================================")

    print(f"\nTotal Requests: {total_requests}")
    print(f"404 Errors: {not_found_errors}")

    print("\nHTTP Status Codes:")

    for status, count in sorted(status_codes.items()):
        print(f"  {status}: {count}")

    print("\nTop Requested Pages:")

    for page, count in requested_pages.most_common(5):
        print(f"  {page}: {count} requests")

    print("\nTop IP Addresses:")

    for ip, count in ip_addresses.most_common(5):
        print(f"  {ip}: {count} requests")

    print("\n========================================")


if __name__ == "__main__":
    analyze_log(LOG_FILE)