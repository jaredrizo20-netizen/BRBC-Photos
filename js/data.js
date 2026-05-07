var TEAM_DATA = [
  { name: "Team Rizo",        players: "Brad Carlson, Billy Gardner, Jeff Demers, Jared Rizo",           teeTime: "10:00 AM" },
  { name: "Team B Devin",     players: "Bobby Devin, Joe Bina, Brian Skelly, Kevin Lawton",              teeTime: "10:10 AM" },
  { name: "Team K Devin",     players: "Kyle Devin, Sean Williamson, Nick Ciuffo, Tim Flynn",            teeTime: "10:20 AM" },
  { name: "Team Hock",        players: "Joe Hock, Jake Harris, Anthony Licciardello, Dan Kustka",        teeTime: "10:30 AM" },
  { name: "Team Naz",         players: "Andrew Nazarro, Kevin Hock, Pat Ellis, Mark Preziosi",           teeTime: "10:40 AM" },
  { name: "Team Hooper",      players: "Cam Hooper, Alex Ray, Bobby Lawton, Paul Preziosi",              teeTime: "10:50 AM" },
  { name: "Team Brooks",      players: "Sean Brooks, Bob Lawton, Brian Lawton, Marc Stokes",             teeTime: "11:00 AM" },
  { name: "Team O'Halloran",  players: "Kevin O'Halloran, Cade Buckley, Mike Preziosi, Chris Flaherty", teeTime: "11:10 AM" }
];

var TEAMS = TEAM_DATA.map(function(t) { return t.name; });

var HOLES = [
  { hole: 1,  par: 4, yards: 335 },
  { hole: 2,  par: 4, yards: 335, special: "Any player in water — Team Shotgun" },
  { hole: 3,  par: 3, yards: 171, special: "No GIR — Team Shotgun" },
  { hole: 4,  par: 4, yards: 302 },
  { hole: 5,  par: 3, yards: 165, special: "Closest to the Pin" },
  { hole: 6,  par: 5, yards: 494 },
  { hole: 7,  par: 4, yards: 383 },
  { hole: 8,  par: 5, yards: 500, special: "Finish Your Drink" },
  { hole: 9,  par: 4, yards: 364 },
  { hole: 10, par: 5, yards: 481 },
  { hole: 11, par: 4, yards: 408, special: "Bogey or Worse — Team Shotgun" },
  { hole: 12, par: 3, yards: 172, special: "Closest to the Pin" },
  { hole: 13, par: 5, yards: 465, special: "Long Drive" },
  { hole: 14, par: 4, yards: 411 },
  { hole: 15, par: 4, yards: 391 },
  { hole: 16, par: 3, yards: 174, special: "No GIR — Team Shotgun" },
  { hole: 17, par: 4, yards: 362 },
  { hole: 18, par: 4, yards: 314 }
];

var PLAYERS = [
  { rank:1,  name:"Cade Buckley",    hcp:"0.6",    app:"Rookie", titles:"--", ryder:"--" },
  { rank:2,  name:"Brad C",          hcp:"6.3",    app:"3",      titles:"--", ryder:"--" },
  { rank:3,  name:"Kevin Hock",      hcp:"6.3",    app:"6",      titles:"--", ryder:"1"  },
  { rank:4,  name:"Sean Williamson", hcp:"~7-9",   app:"6",      titles:"--", ryder:"1"  },
  { rank:5,  name:"Marc Stokes",     hcp:"8.4",    app:"Rookie", titles:"--", ryder:"--" },
  { rank:6,  name:"Chris Flats",     hcp:"10.3",   app:"4",      titles:"--", ryder:"1"  },
  { rank:7,  name:"Joe Bina",        hcp:"10.5",   app:"5",      titles:"--", ryder:"--" },
  { rank:8,  name:"Mark Prez",       hcp:"~11-12", app:"9",      titles:"3",  ryder:"1"  },
  { rank:9,  name:"Lic",             hcp:"11.8",   app:"9",      titles:"--", ryder:"2"  },
  { rank:10, name:"Demers",          hcp:"~11-12", app:"2",      titles:"--", ryder:"1"  },
  { rank:11, name:"Kevin Lawton",    hcp:"12.9",   app:"8",      titles:"--", ryder:"--" },
  { rank:12, name:"Bobby Lawton",    hcp:"~13",    app:"8",      titles:"1",  ryder:"--" },
  { rank:13, name:"Alex Ray",        hcp:"13.7",   app:"1",      titles:"--", ryder:"1"  },
  { rank:14, name:"Pat Ellis",       hcp:"NH",     app:"6",      titles:"--", ryder:"--" },
  { rank:15, name:"Brian Skelly",    hcp:"~14.5",  app:"Rookie", titles:"--", ryder:"--" },
  { rank:16, name:"Jake Harris",     hcp:"~18-20", app:"9",      titles:"1",  ryder:"1"  },
  { rank:17, name:"Brian Lawton",    hcp:"17.8",   app:"5",      titles:"--", ryder:"--" },
  { rank:18, name:"Tim Flynn",       hcp:"~18-20", app:"4",      titles:"--", ryder:"2"  },
  { rank:19, name:"Mike Prez",       hcp:"NH",     app:"12",     titles:"3",  ryder:"1"  },
  { rank:20, name:"Paul Prez",       hcp:"NH",     app:"2",      titles:"--", ryder:"--" },
  { rank:21, name:"Nick Ciuffo",     hcp:"NH",     app:"1",      titles:"--", ryder:"--" },
  { rank:22, name:"Big Bob",         hcp:"20.6",   app:"5",      titles:"--", ryder:"--" },
  { rank:23, name:"Billy Gardner",   hcp:"24.1",   app:"6",      titles:"2",  ryder:"1"  },
  { rank:24, name:"Dan Kustka",      hcp:"25.9",   app:"2",      titles:"--", ryder:"--" }
];

var CAPTAINS = [
  { odds:"+125", name:"Kyle Devin",  app:"2",  titles:"--", ryder:"1"  },
  { odds:"+135", name:"Brooks",      app:"12", titles:"9",  ryder:"1"  },
  { odds:"+275", name:"Bobby Devin", app:"3",  titles:"--", ryder:"--" },
  { odds:"+300", name:"Rizo",        app:"12", titles:"--", ryder:"1"  },
  { odds:"+300", name:"Cam Hoop",    app:"8",  titles:"5",  ryder:"2"  },
  { odds:"+350", name:"Joe Hock",    app:"9",  titles:"--", ryder:"--" },
  { odds:"+400", name:"Kevin O",     app:"10", titles:"--", ryder:"1"  },
  { odds:"+650", name:"Naz",         app:"9",  titles:"--", ryder:"1"  }
];

var CHAMPIONS = [
  { year:"2026", event:"Spring Classic", players:["Kevin O'Halloran","Mike Preziosi","Chris Flaherty","Cade Buckley"],        photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2026_Champs.JPEG" },
  { year:"2025", event:"Spring Classic", players:["Jack Wilson","Jose Garcia","Mike Preziosi","Mark Preziosi"],               photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2025_Spring_Champs.jpeg" },
  { year:"2024", event:"Spring Classic", players:["Billy Gardner","Sean Brooks","Reed Pike","Cam Hooper"],                    photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2024_Spring_Champs.jpeg" },
  { year:"2023", event:"Spring Classic", players:["Billy Gardner","Sean Brooks","Reed Pike","Cam Hooper"],                    photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2023_Spring_Champs.jpeg" },
  { year:"2023", event:"Fall Classic",   players:["Mike Preziosi","Keane Costa","Mike Hurley","Mark Preziosi"],               photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2023_Fall_Champs.jpeg" },
  { year:"2022", event:"Fall Classic",   players:["Bobby Lawton","Tim O'Halloran","Mike Preziosi","Mark Preziosi"],           photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2022_Fall_Champs.jpeg" },
  { year:"2022", event:"Spring Classic", players:["Matt Lebbo","John \"JT\" Tomlin","Kevin Flannery","Steve Flannery"] },
  { year:"2021", event:"Fall Classic",   players:["Matt Lebbo","John \"JT\" Tomlin","Kevin Flannery","Steve Flannery"] },
  { year:"2021", event:"Spring Classic", players:["Jake Harris","Sean Brooks"],                                               photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2021_Spring_Champs.jpeg" },
  { year:"2020", event:"Fall Classic",   players:["Cam Hooper","Sean Brooks"],                                                photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2020_Fall_Champs.jpeg" },
  { year:"2020", event:"Spring Classic", players:["Cam Hooper","Sean Brooks"],                                                photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2020_Spring_Champs.jpeg" },
  { year:"2019", event:"Fall Classic",   players:["Cam Hooper","Sean Brooks"],                                                photo:"https://jaredrizo20-netizen.github.io/BRBC-Photos/BRBC_2019_Fall_Champs.jpeg" }
];
