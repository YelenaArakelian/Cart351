
#
# CART 351 EXERCISE ONE
#
# This exercise is also a Python program. Your task is to read the 
# task descriptions below and then write one or more Python statements to
# carry out the tasks. There's a Python "print" statement before each
# task that will display the expected output for that task; you can use
# this to ensure that your statements are correct.
#

print("------")
print("Task 1: Arithmetic expressions")
print("Expected output: 7")

# Task 1: Add parentheses to the Python statement below so that it prints
# out the number 7.

print((10 + 4) / 2)


#------------------------------------------------------------------------

print("\n------")
print("Task 2: Expressions of inequality")
print("Expected output: True")

# Task 2: Change the operator in the statement below so that it displays
# "True" instead of "False."

print(14 < 15)

#------------------------------------------------------------------------

print("\n------")
print("Task 3: Variable assignment")
print("Expected output: 54")

# Task 3: Change the variable assignment below so that the print statement
# displays "54." (Don't change the print statement!)

a_num_variable = 54
print(a_num_variable)


#------------------------------------------------------------------------

print("\n------")
print("Task 4: Types")
print("Expected output: <class 'str'>")

# Task 4: Three variables are assigned below, all with different types.
# Replace the word "None" inside the parentheses of type() in the print
# statement below so that it prints "<class 'str'>".

x = 14
y = 17.4
z = "today is a fine day for sailing!"
print(type(z))

#------------------------------------------------------------------------


print("\n------")
print("Task 5: Questions about strings")
print("Expected output: 51")

# Task 5: Inside the call to "print" below, write an expression that evaluates
# to the sum of the lengths of the two string variables defined below
# (first_line and second_line). Use the len() function.

first_line = "It was the best of times."
second_line = "It was the worst of times."
print(len(first_line) + len(second_line)) # your code here!

#------------------------------------------------------------------------

print("\n------")
print("Task 6: Questions about strings, part 2")
print("Expected output: 25")

# Task 6: Inside the call to "print" below, write an expression that evaluates
# to the position of the word "window" in the string defined in the variable
# called "aStringSentence." Use the .find() method.

aStringSentence = "Did the cat jump out the window yesterday?"
print(aStringSentence.find("window")) # your code here!

#------------------------------------------------------------------------

print("\n------")
print("Task 7: String transformations")
print("Expected output: someone who has spent too much time")

# Task 7: Modify the print statement below so that it prints out the contents
# of the variable "partLy", but with all white space removed from
# the beginning and end of the string. Use the .strip() method.

partLy = "     someone who has spent too much time    \n"
print(partLy.strip())


#------------------------------------------------------------------------

print("\n------")
print("Task 8: String transformations, part 2")
print("Expected output: SOMEONE WHO HAS SPENT TOO MUCH TIME")

# Task 8: Using the previously defined "partLy" variable, write an
# expression inside the "print" function below that evaluates to the content of
# the string, with all whitespace removed, and with all letters converted to
# uppercase. Use the .upper() method.

print(partLy.strip().upper()) # your code here!

#------------------------------------------------------------------------

print("\n------")
print("Task 9: String indexing")
print("Expected output: p")

# Task 9: Modify the value assigned to variable "offset" below so that
# the following "print" statement displays the letter "p".

offset = 2
print("apple"[offset])

#------------------------------------------------------------------------

print("\n------")
print("Task 10: String slices")
print("Expected output: jump")

# Task 10: Modify the values assigned to variables "start" and "end"
# below so that the following "print" statement displays the word "jump".

start = 12
end = 16
aStringSentenceAgain = "Did the cat jump out the window yesterday?"
print(aStringSentenceAgain[start:end])

#------------------------------------------------------------------------

print("\n------")
print("Task 11: Integers and strings")
print("Expected output: 100")

# Task 11: Modify the statement below so that it displays the number 100.
# Do this using the int() function (hint: you need to use it twice).

print(int("19") + int("81"))
#------------------------------------------------------------------------

print("\n------")
print("Task 12: Conditions")
print("Expected output: test_var is less than 200")

# Task 12: Modify the code below to include a condition to print the statement  
# 'test_var is less than 200' for the current value of test_var. 
# Do not change the intial code, rather add to it
test_var = 90
if test_var < 200:	
	print("test_var is less than 200")
#------------------------------------------------------------------------

print("\n------")
print("Task 13: Conditions II")
print("Expected output: the condition test passed")

# Task 13: Modify the if statement below to print the statement
# 'the condition test passed'. Do not change the values of the varaibles.
test_var_three = 400
test_var_two = 800
if test_var_three > 200 and test_var_two > 400:	
	print("the condition test passed")
else:
	print("the condition test not passed")
#------------------------------------------------------------------------
