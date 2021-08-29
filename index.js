const Discord = require("discord.js");
const fetch = require("node-fetch")
const Database = require("@replit/database")


//Keep the server alive
const keepAlive = require("./server")

//npm for Movie Quotes
const movieQuotes = require('popular-movie-quotes');
 
const db = new Database()
const bot = new Discord.Client()

//Blahaj Calling
const blahajCalled = ["Blahaj", "BLAHAJ","Shark", "shark", "SHARK", "blahaj", "ikea shark", "IKEA SHARK", "Blahaj Gang", "BLAHAJ GANG"];

//Blahaj Reply
const blahajReply = ["All Hail your Overlord", "Did you call me ?", "Hey What's Up !!!", "I'm getting bored", "Don't disturb I'm Sleeping.", "Did you buy a Blahaj from Ikea? ", " Sleep"]

//Blahaj Facts
const blahajFacts = ["Sharks do not have bones.",
"Most sharks have good eyesight.",
"Sharks have special electroreceptor organs.",
"Shark skin feels similar to sandpaper.",
"Sharks can go into a trance.", 
"Sharks have been around a very long time.", "Scientists age sharks by counting the rings on their vertebrae","Sharks have a sixth sense", "BLAHAJ continues to amass more and more followers everyday, while Ryan Swift lives in denial of it's power", "'Blahaj Gang'- cult-slash-club has become widely known, making appearances at different events across the globe.", "BLAHAJ is not just a shark plushie. It is a way of living.", "BLAHAJGang joined forces with MELONsquad, led by Adam Drummond, a champion Hacker from the Isle of Man and party fanatic.", " Blahaj used to help the Egyptians navigate the Nile, and even had a special day to commemorate his contributions to the community, according to hieroglyphics in a tomb." , "The Greeks believed Blahaj was a lieutenant of Poseidon and worshipped him as such.", "Battle of IKEA, circa 1250 AB (After Blahaj). Pictured: King BLAHAJ leading their army of warriors", "The UN has discovered the landing site of the first Blahaj and has declared it a UNESCO World/Universe Heritage Site", "Sharks possess some of the power of their Blahaj ancestors such as being able to sense electromagnetic waves"]

db.get("facts").then(facts =>{
  if (!facts || facts.length<1){
    db.set("facts", blahajFacts)
  }
})

//Function to update facts
function updateFacts(factMsg){
  db.get("facts").then(facts =>{
    facts.push([factMsg])
    db.set("facts", facts)
  })
}

//Fetch Joke from API
function getJoke(){
  return fetch("https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single")
  .then(res=> {
    return res.json()
  })
  .then (data => {
    return data["joke"]
  })
}

//Fetch Activity from API 
function getActivity(){
  return fetch("https://www.boredapi.com/api/activity")
  .then(res=> {
    return res.json()
  })
  .then (data => {
    return data["activity"]
  })
}

//Fetch Quote from API
function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " - " + data[0]["a"]
    })
}


//Starting Message
bot.on("ready", ()=>{
  console.log(`${bot.user.tag} is up and swimming !!!`);
});

//Send Joke
bot.on("message", msg=> {
  if (msg.author.bot) return

  //Quote when input is $inspire
  if(msg.content === "$inspire") {
    getQuote().then(quote=>msg.channel.send(quote))
  }

  //Joke when input is $laugh
  if(msg.content === "$laugh"){
    getJoke().then(joke => msg.channel.send(joke))
  }

  //blahajReply when a word from blahajCaleed is entered
  if(blahajCalled.some(word => msg.content.includes(word))) {
      const blahajReplies = blahajReply[Math.floor(Math.random()*blahajReply.length)]
      msg.reply(blahajReplies)
  }

  //return a movie dialogue on $dialogue
  if(msg.content === "$dialogue"){
    msg.reply(movieQuotes.getRandomQuote())
  }

  //return an activity to do $borede
  if(msg.content === "$bored"){
    getActivity().then(activity => msg.channel.send(activity))
  }

  //return Blahaj fact on $facts
   if(msg.content === "$facts") {
     db.get("facts").then(facts => {
        const blahajFact = blahajFacts[Math.floor(Math.random()*blahajFacts.length)]
        msg.reply(blahajFact)
     })
    }
    //add a fact if $add is found
    if (msg.content.startsWith("$add")){
      factMsg = msg.content.split("$add ")[1]
      updateFacts(factMsg)
      msg.channel.send("New Fact Added")
    }
})

keepAlive()

//Discord BOT Token
bot.login(process.env['TOKEN'])