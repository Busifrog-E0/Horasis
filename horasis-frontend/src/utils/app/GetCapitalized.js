
export const getCapitalizedSentence = (inputString) => {
    // Split the input string into an array of words
    let words = inputString.split(' ');

    // Capitalize the first letter of each word and convert the rest to lowercase
    let capitalizedWords = words.map(word => {
        // Capitalize the first letter
        let firstLetter = word.charAt(0).toUpperCase();

        // Convert the rest of the letters to lowercase
        let restOfWord = word.slice(1).toLowerCase();

        // Combine the first letter and the rest of the word
        return firstLetter + restOfWord;
    });

    // Join the capitalized words back into a single string
    let resultString = capitalizedWords.join(' ');

    return resultString;
}

export function convertPascalToNormalCase(input) {
    // Check if the input is a valid string
    if (typeof input !== 'string' || input === '') {
        return 'Invalid input';
    }

    // Add space before each capital letter (except the first one)
    const result = input.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Capitalize the first letter and convert the rest to lowercase
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}
