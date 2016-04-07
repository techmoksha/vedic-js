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
Vedic.prototype.add = function (numbers) {
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
Vedic.prototype.subtract = function (operand1, operand2) {
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

exports.Vedic = Vedic;