const _DEBUG = true;
let _MAXRM = 0;
let _COMPLEXITY = 0;
let counter = 0;

document.getElementById("btn1").addEventListener("click", checkMap);

function checkMap() {
  if (counter == 0) {
    mapGen();
    counter++;
  } else {
    let appendedRoomsInp = document.querySelector(".appendedRooms");
    let pathsInfo = document.querySelector(".paths");
    while (appendedRoomsInp.hasChildNodes()) {
      appendedRoomsInp.removeChild(appendedRoomsInp.firstChild);
    }
    while (pathsInfo.hasChildNodes()) {
      pathsInfo.removeChild(pathsInfo.firstChild);
    }
    mapGen();
  }
}

function pathFind(map) {
  _STARTRM = parseInt(document.getElementById("start").value);
  _ENDRM = parseInt(document.getElementById("destination").value);
  showPaths(map.AllPaths(_STARTRM, _ENDRM));
}
function mapGen() {
  _MAXRM = parseInt(document.getElementById("rooms").value);
  _COMPLEXITY = parseInt(document.getElementById("complexity").value);

  if (Number.isNaN(_MAXRM) || Number.isNaN(_COMPLEXITY)) {
    alert("Can't leave an empty input");
    return false;
  } else if (_MAXRM <= 0 || _COMPLEXITY < 0) {
    alert("Can't put 0 rooms or negative values");
    return false;
  } else {
    let map = new Map();
    map.showRooms();
    pathFind(map);
  }
}

function showPaths(array) {
  for (let i = 0; i < array.length; i++) {
    var div = document.createElement("div");
    div.setAttribute("class", "flex");
    div.setAttribute("id", `path${i + 1}`);
    var p = document.createElement("p");
    p.setAttribute("class", "path");
    p.innerHTML = `Path ${i + 1}: Start->${array[i]}<-Destination`;
    document.querySelector(".paths").appendChild(div);
    document.querySelector(`#path${i + 1}`).appendChild(p);
  }
}
//Klass för mappen
class Map {
  constructor() {
    this.map = [];
    this.index = 0;
    _DEBUG
      ? console.log(`Created a new array with length: ${this.map.length}`)
      : null;
    let i = 0;
    while (this.createRoom(i++)) {}
    this.randomExits();
    _DEBUG
      ? console.log(`Array is filled with: ${this.map.length} values`)
      : null;
  }

  //Skapar rummet
  createRoom(room_id) {
    let current_id = room_id;
    if (this.index >= _MAXRM) {
      _DEBUG ? console.log(`Array is full`) : null;
      return false;
    } else {
      let room = new Room();
      this.map[this.index++] = room.insert(room_id);
      _DEBUG
        ? console.log(
            `Pushed ${current_id} with name: ${
              this.map[this.index - 1].roomname
            } at position ${this.index - 1}`
          )
        : null;
      return true;
    }
  }

  //Visar alla rummen och dess infon
  showRooms() {
    this.map;
    if (this.index == 0) {
      console.log("No data in array");
      return false;
    } else {
      _DEBUG ? console.log(`Shows every data in the array`) : null;
      for (let i = 0; i < this.index; i++) {
        console.log(
          `Room id: ${this.map[i].id}\nName: ${this.map[i].roomname}\nExits: ${this.map[i].exits}\nEnvironment: ${this.map[i].env}\n`
        );
        var div = document.createElement("div");
        div.setAttribute("class", "flex");
        div.setAttribute("id", `room${i + 1}`);
        var p = document.createElement("p");
        p.setAttribute("class", "roominfo");
        p.innerHTML = `Room ${this.map[i].id}: ${this.map[i].roomname}`;
        var p1 = document.createElement("p");
        p1.setAttribute("class", "roominfo");
        p1.innerHTML = `Exits ${this.map[i].id}: ${this.map[i].exits}`;
        document.querySelector(".appendedRooms").appendChild(div);
        document.querySelector(`#room${i + 1}`).appendChild(p);
        document.querySelector(`#room${i + 1}`).appendChild(p1);
      }
      return true;
    }
  }
  //Visar alla möjliga vägar
  AllPaths(source, destination) {
    if (
      source < 0 ||
      destination < 0 ||
      destination > this.map.length ||
      source > this.map.length
    ) {
      return [[]];
    }

    // current list of all paths that are unexplored
    let paths = [[source]];
    // is built each iteration and copied to path afterwards
    let npath = [];
    // one of the paths in paths
    let subpath = [];
    // the array containing paths leading to destination
    let cpath = [];
    // array holding the exits from a specific location
    let newexits = [];
    // the new path based on subpath + exits
    let tp = [];
    if (source < 0 || source > this.map.length) return [];
    while (true) {
      // explore each path in paths
      for (subpath of paths) {
        // find exits for last location in subpath
        newexits = this.exits(subpath[subpath.length - 1]);
        for (let nexit of newexits) {
          // is this location not in the path
          //console.log(subpath);
          //console.log(nexit);
          if (!subpath.includes(nexit)) {
            // copy subpath to tp
            tp = subpath.slice();
            // push location to it
            tp.push(nexit);
            // are we there yeti?
            if (nexit == destination)
              // push it to cpath instead of npath
              cpath.push(tp);
            else npath.push(tp);
          }
        }
      }
      // new paths found during iteration?
      if (npath.length < 1)
        // nope, then we are done
        return cpath;
      // otherwise we copy npath to paths and do it all again
      paths = npath.slice();
      npath = [];
    }
  }

  exits(id) {
    _DEBUG
      ? console.log(
          `Returned exits in room ${this.map[id - 1].roomname}: ${
            this.map[id - 1].exits
          }`
        )
      : null;
    return this.map[id - 1].exits;
  }

  //Skapar gångar mellan slumpmässiga rum
  randomExits() {
    for (let i = 0; i < _COMPLEXITY; i++) {
      let room1 = getRandomNumber(1, _MAXRM);
      let room2 = getRandomNumber(1, _MAXRM);
      while (
        room1 == room2 ||
        room2 - room1 == 1 ||
        room1 - room2 == 1 ||
        this.map[room1 - 1].exits.indexOf(room2) != -1 ||
        this.map[room2 - 1].exits.indexOf(room1) != -1
      ) {
        room1 = getRandomNumber(1, _MAXRM);
        room2 = getRandomNumber(1, _MAXRM);
      }
      this.map[room1 - 1].exits.push(room2);
      this.map[room2 - 1].exits.push(room1);
      _DEBUG
        ? console.log(
            `New path between ${room1} and ${room2}\n ${room1} exits: ${this.map[room1].exits}\n ${room2} exits: ${this.map[room2].exits}`
          )
        : null;
    }
  }
}

//Klass för rummen
class Room {
  constructor() {
    this.id = 0;
    this.roomname = "";
    this.env = "";
    this.exits = [];
  }
  //Ger rummet värden
  insert(id) {
    this.id = id + 1;
    this.roomname = NameGen();
    this.createExits(this.id);
    this.env = envGen();

    _DEBUG
      ? console.log(
          `Gave this room id: ${this.id} and name: ${this.roomname} with exits ${this.exits} and environment: ${this.env}`
        )
      : null;
    return this;
  }

  //Ger gångar mellan närliggande rum
  createExits(id) {
    switch (id) {
      case 1:
        this.exits[0] = id + 1;
        this.exits[1] = _MAXRM;
        break;

      case _MAXRM:
        this.exits[0] = id - 1;
        this.exits[1] = 1;
        break;

      default:
        this.exits[0] = id - 1;
        this.exits[1] = id + 1;
        break;
    }
    return true;
  }
}

//Funktion för namngenerator
function NameGen() {
  let adjectives = [
    "abandoned",
    "lacking",
    "elite",
    "cynical",
    "small",
    "large",
    "fragile",
    "bumby",
    "scary",
    "harsh",
    "courageous",
    "tense",
    "hypnotic",
    "delicious",
    "trashy",
    "honorable",
    "dynamic",
    "royal",
    "giant",
    "spicy",
    "hard",
    "angry",
    "mad",
    "furious",
    "strong",
    "naked",
    "drunk",
    "hallucinated",
    "desperate",
    "bloody",
    "hungry",
    "old",
    "blind",
    "ugly",
    "innocent",
  ];
  let nouns = [
    "classroom",
    "office",
    "laboratory",
    "storage",
    "alcove",
    "apartment",
    "house",
    "hospital",
    "department",
    "reception",
    "school",
    "airport",
    "trainstation",
    "stadium",
    "arena",
    "bank",
    "zoo",
    "nation",
    "village",
  ];
  let nouns2 = [
    "ninjas",
    "virgins",
    "families",
    "clowns",
    "americans",
    "dogs",
    "cats",
    "sharks",
    "aligators",
    "people",
    "humans",
    "women",
    "men",
    "feet",
    "sheep",
    "teeth",
    "boys",
    "degenerates",
    "fingers",
    "furries",
    "karens",
    "apes",
    "potatoes",
    "idiots",
    "gamers",
    "egirls",
    "thots",
    "jedis",
    "obese",
    "feminists",
    "nudists",
  ];

  //Skapar en variabel med random adjektiv + random substantiv + of + random adjektiv + random substantiv
  let roomname =
    capFirst(adjectives[getRandomNumber(0, adjectives.length)]) +
    " " +
    capFirst(nouns[getRandomNumber(0, nouns.length)]) +
    " of " +
    capFirst(adjectives[getRandomNumber(0, adjectives.length)]) +
    " " +
    capFirst(nouns2[getRandomNumber(0, nouns2.length)]);

  return roomname;
}

//Gör första bokstaven till en stor bokstav
function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Skapar ett random nummer mellan två valda värden
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Generar en random miljö
function envGen() {
  let environment = [
    "Gravel",
    "Dirt",
    "Asphalt",
    "Creek",
    "Fen",
    "Sand",
    "Grass",
    "Field",
  ];
  return environment[getRandomNumber(0, environment.length)];
}
