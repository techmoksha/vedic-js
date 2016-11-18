/**
 * Created by aditya on 4/1/16.
 */
'use strict';

function Vedic () {
	
}

function leftpadZeroes(string, num) {
	var output = "";
	for (var i = 0; i < num; i++) {
		output = output + '0';
	}
	return output + string
}

/**
 * Addition of numbers
 * @param {Array} numbers - Array of numbers to be added. Numbers can be numeric or string
 * @returns {string} which is addition
 */
Vedic.add = function (numbers) {
	// Get length of biggest number
	numbers = numbers.map(num => {
		return (typeof num == 'string') ? num : num.toString();
	});
	var maxLength = 0;
	for (let i = 0; i < numbers.length; i++) {
		maxLength = Math.max(maxLength, numbers[i].length);
	}
	// Left pad numbers where required
	numbers = numbers.map(num => {
		return leftpadZeroes(num, maxLength - num.length);
	});
	// Add highest place of all numbers
	var part1 = 0;
	numbers.forEach(number => {
		part1 += parseInt(number[0]);
	});
	part1 = part1.toString();
	var mainStack = [];
	// Append every character separately
	for (let i = 0; i < part1.length; i++) {
		mainStack.push(part1[i]);
	}

	for (let idx = 1; idx < maxLength; idx++) {
		// Add x[0] with y[0], x[1] with y[1] and so on while combining
		var part2 = 0;
		for (let i = 0; i < numbers.length; i++) {
			part2 += parseInt(numbers[i][idx]);
		}
		// Convert back to string
		part2 = part2.toString();
		if (part2.length == 1) {
			mainStack.push(part2);
		} else {
			var res = part2;
			var residualStack = [];
			if (res.length == 1) {
				residualStack.push(part2[part2.length - 1]);
			}
			// Till residue is a single digit recurse
			while (res.length > 1) {
				part1 = mainStack.pop();
				res = parseInt(part1) + parseInt(part2[0]);
				res = res.toString();
				residualStack.push(part2[part2.length - 1]);
				if (res.length > 1) {
					part2 = res;
				}
			}
			mainStack.push(res);
//			mainStack.push(mainStack, residualStack);
			residualStack.forEach(entry => {
				mainStack.push(entry);
			});
		}
	}
	return mainStack.join("");
};

/**
 * Subtraction of smaller or equal number from larger or equal number.
 * @param operand1 {string} Larger or equal number
 * @param operand2 {string} Smaller or equal number
 * @returns {string} which is a subtraction
 */
Vedic.subtract = function (operand1, operand2) {
	// Convert operands to string
	operand1 = (typeof operand1 == 'string') ? operand1 : operand1.toString();
	operand2 = (typeof operand2 == 'string') ? operand2 : operand2.toString();

	var maxLength = Math.max(operand1.length, operand2.length);
	operand1 = leftpadZeroes(operand1, maxLength - operand1.length);
	operand2 = leftpadZeroes(operand2, maxLength - operand2.length);

	var mainStack = [];
	var foundConseqDigit = false;
	var inconseqZeroes = 0;
	mainStack.push((operand1[0] - operand2[0]).toString());

	for (let idx = 1; idx < maxLength; idx++) {
		var num1 = parseInt(operand1[idx]);
		var num2 = parseInt(operand2[idx]);

		if (num1 < num2) {
			// Pop off the earlier number
			var top = mainStack.pop();
			// Reduce the previous number
			top = parseInt(top) - 1;
			mainStack.push(top.toString());

			var correctionStack = [];
			while (top < 0) {
				// Need to apply correction by adding negative number to 10
				// Pop off the top element and reduce by 1
				top = mainStack.pop();
				var correction = 10 + parseInt(top);
				// Since correction is applied, 1 has to be deducted from new top
				top = mainStack.pop();
				top = parseInt(top) - 1;
				mainStack.push(top.toString());
				correctionStack.push(correction.toString());
			}
			correctionStack.forEach(entry => {
				mainStack.push(entry);
			});
			correctionStack.length = 0;
			// Add 10 to num1
			num1 += 10
		}
		if (!foundConseqDigit) {
			// Check top element
			var topMost = mainStack[mainStack.length - 1];
			if (topMost === '0') {
				inconseqZeroes += 1;
			} else {
				foundConseqDigit = true;
			}
		}
		mainStack.push((num1 - num2).toString());
	}
	return mainStack.slice(inconseqZeroes).join("");
};

/**
 *
 * Multiplication of 2 numbers based on vertical-crosswise vedic sutra.
 * @param operand1 {string}
 * @param operand2 {string}
 * @returns {string} Result which is a multiplication of the 2 numbers
 */
Vedic.multiply = function (operand1, operand2) {
	// Convert operands to string
	operand1 = (typeof operand1 == 'string') ? operand1 : operand1.toString();
	operand2 = (typeof operand2 == 'string') ? operand2 : operand2.toString();

	var maxLength = Math.max(operand1.length, operand2.length);
	operand1 = leftpadZeroes(operand1, maxLength - operand1.length);
	operand2 = leftpadZeroes(operand2, maxLength - operand2.length);

	// Results of individual cross multiples
	var executionDict = performMultiplication(operand1, operand2, maxLength);
	// Reduce to get final result
	var reducedStack = reduce(executionDict);
	var foundConseqDigit = false;
	var inconseqZeroes = 0;
	var counter = 1;

	while (!foundConseqDigit) {
		// Check top element
		var topMost = reducedStack[reducedStack.length - counter];
		if (topMost === '0') {
			inconseqZeroes += 1;
		} else {
			foundConseqDigit = true;
		}
		counter++;
	}
	// Slice inconsequential zeroes
	reducedStack = reducedStack.reverse().slice(inconseqZeroes);
	return reducedStack.join("");
};

function performMultiplication(operand1, operand2, maxLength) {
	// Number of steps will be 2 * num_digits - 1
	var numSteps = (2 * maxLength) - 1;
	var executionDict = {};

	for (var idx = 0; idx <= numSteps >> 1; idx++) {
		var execResultLHS = 0;
		var execResultRHS = 0;

		for (var i = 0; i <= idx; i++) {
			execResultLHS += parseInt(operand1[maxLength - 1 - i]) * parseInt(operand2[maxLength - 1 - idx + i]);
			execResultRHS += parseInt(operand1[i]) * parseInt(operand2[idx - i]);
		}
		executionDict[idx + 1]  = execResultLHS;
		executionDict[numSteps - idx] = execResultRHS;
	}
	return executionDict;
}

function reduce(executionDict) {
	var resultStack = [];
	var carry = 0;

	for (var i = 1; i <= Object.keys(executionDict).length; i++) {
		// Result of each step
		var top = executionDict[i];
		// If carry is present add it
		top = (parseInt(top) + parseInt(carry)).toString();
		// Reset carry
		carry = 0;
		if (top.length > 1) {
			resultStack.push(top[top.length - 1]);
			// Push remaining to carry
			carry = top.substring(0, top.length - 1);
		} else {
			resultStack.push(top);
		}
	}
	// If any carry remains we need to push that as well
	if (carry != 0) {
		resultStack.push(carry);
	}
	return resultStack;
}

/**
 * Get duplex of a number
 * @param number
 * @returns {number} which is duplex.
 */
Vedic.duplex = function (number) {
	number = (typeof number == 'string') ? number : number.toString();
	// Convert to constituent digits
	var digits = number.split("");
	var length = digits.length;
	var duplex = 0;
	if (length % 2 != 0) {
		duplex = Math.pow(parseInt(digits[Math.floor(length / 2)]), 2);
	}
	for (var i = 0; i < Math.floor(length / 2); i++) {
		duplex += 2 * parseInt(digits[i]) * parseInt(digits[length - 1 - i]);
	}
	return duplex;
};

/**
 * Power function.
 * @param number
 * @param power
 */
Vedic.pow = function (number, power) {
	if (power === 2) {
		return this.sq(number);
	}
};

/**
 * Finds square of a given number. Number can be an integer or a string.
 * If the number is very large, it should be quoted and passed.
 * @param number
 * @returns {string} the square of the number.
 */
Vedic.sq = function (number) {
	number = (typeof number == 'string') ? number : number.toString();
	var length = number.length;

	var duplexes = {};
	for (var i = 1; i < length + 1; i++) {
		duplexes[(2 * length) - i] = this.duplex(number.substring(0, i));
		duplexes[i] = this.duplex(number.substring(length - i, length));
	}
	var sqr = reduce(duplexes).reverse();
	return sqr.join("");
};

exports.Vedic = Vedic;