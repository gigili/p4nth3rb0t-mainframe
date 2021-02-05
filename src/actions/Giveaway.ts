export default class Giveaway {
  static isOpen: boolean = false;
  static entrants: Set<string> = new Set();

  static open = () => {
    Giveaway.isOpen = true;

    //send websocket event
  };

  static close = () => {
    Giveaway.isOpen = false;
  };

  static inProgress = () => {
    return Giveaway.isOpen === true;
  };

  static enter = (username: string) => {
    Giveaway.entrants.add(username);

    //send websocket event
  };

  static draw = () => {
    const usernamesArray: string[] = Array.from(Giveaway.entrants);
    const winner =
      usernamesArray[Math.floor(Math.random() * usernamesArray.length)];

    Giveaway.close();

    //send websocket event

    return winner;
  };
}
