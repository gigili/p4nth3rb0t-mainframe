import { isSillyQuestion } from "./sillyQuestions";

test("what are you doing?", () => {
  const result = isSillyQuestion("what are you doing?");
  expect(result).toBe(true);
});
test("what are you working on?", () => {
  const result = isSillyQuestion("what are you working on?");
  expect(result).toBe(true);
});

test("wut r dong", () => {
  const result = isSillyQuestion("wut r dong");
  expect(result).toBe(true);
});

test("wut u doin", () => {
  const result = isSillyQuestion("wut u doin");
  expect(result).toBe(true);
});

test("how are you?", () => {
  const result = isSillyQuestion("how are you?");
  expect(result).toBe(false);
});

test("what time are you finishing up?", () => {
  const result = isSillyQuestion("what time are you finishing up?");
  expect(result).toBe(false);
});

test("what do you do when the pizza gets burnt?", () => {
  const result = isSillyQuestion("what do you do when the pizza gets burnt?");
  expect(result).toBe(false);
});

test("are you doing ok?", () => {
  const result = isSillyQuestion("are you doing ok?");
  expect(result).toBe(false);
});

test("so today I was working on what I thought was awesome and doing it huge", () => {
  const result = isSillyQuestion(
    "so today I was working on what I thought was awesome and doing it huge"
  );
  expect(result).toBe(false);
});
