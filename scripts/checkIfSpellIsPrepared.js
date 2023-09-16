// Work in progress

let selected = canvas.tokens.controlled[0];

// let spells = selected.actor.spellcasting.contents.find(x => x.spells.contents.find(y => y.name == "Guidance"));

// console.log("spells: ", spells)

console.log("", selected.actor.items.filter((item) => item.type === "spell" && item.spellcasting.isPrepared))

// canvas.tokens.controlled[0].actor.items.filter((item) => item.type === "spell" && item.spellcasting.isPrepared  )