// please describe the evening's plan in detail, kindest regards
// to whom this concerns would you kindly explain what is the purpose of your live streaming event this fine evening
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
  doing: ["doing", "doin", "dooing", "doign", "ding", "dong", "dwoing"],
  working: ["working", "woring", "coding"],
};

const isSillyQuestion = (message: string): boolean => {
  const messageArray = message.replace("?", "").replace("how", "").split(" ");
  const uniqueWords = [...new Set(messageArray)];

  return (
    uniqueWords
      .map(
        (word) =>
          sillyWords.what.includes(word) ||
          sillyWords.are.includes(word) ||
          sillyWords.you.includes(word) ||
          sillyWords.doing.includes(word) ||
          sillyWords.working.includes(word)
      )
      .filter(Boolean).length >= 3
  );
};

export { isSillyQuestion };
