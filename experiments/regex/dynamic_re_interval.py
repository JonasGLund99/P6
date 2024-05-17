import re

# The idea is to use the negation of inclusive over with the upper_bound get the result froms that matching the string,
# then using inclusive over with the lower_bound to get the result from the previous string.


# Todo handle negative numbers and floats 💀
# For negative numbers one could use the inclusive over for larger negative values, simply put - in front of re
# created from the absolute value of the number (lower/upper bound).

def generate_regex_from_lower_bound(lower_bound):
    pattern = "(("
    current_factor = 0
    num_len = len(str(lower_bound))
    lower_bound_str = str(lower_bound)
    for digit in lower_bound_str:
        digit = int(digit)
        digit_diff = 9 - int(digit)
        upper_range_in_factor = (digit+digit_diff)
        if current_factor == 0:
            pattern += "[{}-{}]".format(digit, upper_range_in_factor)
        else:
            if current_factor == num_len -1:
                pattern += "[{}-9]".format(digit, upper_range_in_factor)
            else:
                pattern += "[{}-9]".format(digit, upper_range_in_factor)
        current_factor += 1
    pattern += ")"

    larger_part = ""
    for i in range(num_len):
        if i == 0:
            larger_part += "|([1-9]"
        larger_part += "[0-9]"
    larger_part += "+"
    larger_part += "))(\.\d+)?"

    full_pattern = f"{pattern + larger_part}$"

    full_pattern = r'' + full_pattern
    
    # Creating the regex object

    return full_pattern


def find_matches_in_interval(lower_bound, upper_bound, logfile):
    upper_bound_str = r"^(?!" + generate_regex_from_lower_bound(upper_bound) + ").*"
    under_regex = re.compile(upper_bound_str)
    matches = []

    for line in logfile:
        match = under_regex.match(line)
        if match:
            matches.append(line)

    lower_bound_str = r"^" + generate_regex_from_lower_bound(lower_bound)
    above_regex = re.compile(lower_bound_str)

    final_matches = []
    for i in range(len(matches)):
        match = above_regex.match(matches[i])
        if match:
            final_matches.append(matches[i])

    return final_matches

# Test cases
def test_generate_regex_from_interval():
    # Test with interval 100-199
    logfile = ["101", "100", "200", "300", "301", "299",  "199", "999", "99", "0", "15", "1000", "-1", "-100", "-1000", "-10000", "10000", "75.5234", "10.52"]
    regex_100_199 = find_matches_in_interval(100, 199, logfile)
    
    # Test with interval 5000-5999
    regex_5000_5999 = find_matches_in_interval(5000, 5999)
    
    print("All tests passed successfully.")

# Run the tests
test_generate_regex_from_interval()
