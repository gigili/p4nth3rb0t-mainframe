const sillyWords = {
  what: [
    "what",
    "wut",
    "wot",
    "wat",
    "wht",
    "whaat",
    "whatcha",
    "vat",
    "why",
    "whut",
    "vvhat",
    "waat",
    "w4t",
    "twaat",
  ],
  are: ["are", "r", "ar", "ae", "re", "array", "4re"],
  you: ["you", "yu", "yo", "u", "yoo", "yuu", "yew", "ewe", "uu", "uyo"],
  doingWords: [
    "doing",
    "doin",
    "dooing",
    "doign",
    "ding",
    "dong",
    "dwoing",
    "working",
    "woring",
    "coding",
  ],
  excludedWords: ["ok"],
};

const isSillyQuestion = (message: string): boolean => {
  const messageArray = message.replace("?", "").replace("how", "").split(" ");
  const uniqueWords = [...new Set(messageArray)];

  if (uniqueWords.length >= 6) {
    return false;
  }

  if (
    sillyWords.excludedWords
      .filter((word) => uniqueWords.includes(word))
      .map((array) => array.length > 0)
      .pop()
  ) {
    return false;
  }

  const maybeAMatch = sillyWords.doingWords
    .filter((word) => uniqueWords.includes(word))
    .map((array) => array.length > 0)
    .pop();

  if (maybeAMatch) {
    return (
      uniqueWords
        .map(
          (word) =>
            sillyWords.what.includes(word) ||
            sillyWords.are.includes(word) ||
            sillyWords.you.includes(word)
        )
        .filter(Boolean).length >= 2
    );
  }

  return false;
};

export { isSillyQuestion };
