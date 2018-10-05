const contains = (mainString) => (subString) => {
    return mainString.indexOf(subString) >= 0 ? true
                                              : false;
};

console.log(contains("MyString")("M"));
console.log(contains("MyString")("Q"));
