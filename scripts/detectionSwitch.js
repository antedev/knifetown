let detectionActive = game.scenes
  .filter((x) => x.active == true)[0]
  .getFlag("core", "detectionActive");
console.log(detectionActive);
if (detectionActive === undefined || !detectionActive) {
  // If Undefined or false, we need to get started detecting
  console.log("Let's find some loot");
  game.scenes
    .filter((x) => x.active == true)[0]
    .setFlag("core", "detectionActive", true);

  hookId = Hooks.on("updateToken", (token, changes) => {
    // Check if the token has the isDetecting flag set to true, and hit has moved
    if (token.getFlag("world", "isDetecting")) {
      if (changes.x > 0 || changes.y > 0) {
        detectMagic(token);
      }
    }
  });

  //Save the HookId
  game.scenes
    .filter((x) => x.active == true)[0]
    .setFlag("core", "detectionHook", hookId);
} else {
  // Else we are detecting, and should just stop
  console.log("Stop searching");

  game.scenes
    .filter((x) => x.active == true)[0]
    .setFlag("core", "detectionActive", false);
  // Unregister the hook.
  hookId = game.scenes
    .filter((x) => x.active == true)[0]
    .getFlag("core", "detectionHook");

  if (hookId) {
    Hooks.off("updateToken", hookId);
  } else {
    console.log("Hook didn't exist, couldn't kill it");
  }
}

// Find all Loot och NPC tokens, if they are within range, check their inventory to see if they got som juicy magic loot
async function detectMagic(token) {
  let spellRange = 30;

  console.log("Any magic around?");
  for (const target of canvas.tokens.placeables) {
    if (target.actor.type == "loot" || target.actor.type == "npc") {
      const distance = await canvas.grid.measureDistance(token, target);
      if (distance <= spellRange) {
        for (const inv of target.actor.inventory) {
          for (const lootTrait of inv.traits) {
            if (lootTrait == "magical") {
              if (token.actor.level == 5) {
                detectionRadarLvl3(token, inv,target)
              } else if (token.actor.level > 7) {
                detectionRadarLvl4(token, inv, target)
              } else {
                detectionRadar(token)
              }
              return true;
            }
          }
        }
      }
    }
  }
  console.log("Nah,no loot");
}

async function detectionRadar(token, color = "jb2a.detect_magic.circle.grey") {

    await new Sequence()
    .effect()
      .file(color)
      .atLocation(token.center)
      .playbackRate(2)
    .sound()
      .file("worlds/playground/data/playlists/radar-beep-fx_140bpm.wav")
      .fadeInAudio(500)
      .fadeOutAudio(500)
    .play();
}

async function detectionRadarLvl3(token, item) {

    console.log(item.traits)
    magicTraits = ["abjuration","conjuration","divination","enchantment","evocation","illusion","necromancy","transmutation","arcane","primal","divine","occult"]
    let intersection = item.traits.filter(x => magicTraits.includes(x))
    
    if(intersection.size == 0) {
        //No special trait, just bling
        console.log("Normal")
        detectionRadar(token)
        await canvas.hud.bubbles.say(token, `I can smell some magic around here!`); 

    } else if (intersection.size == 1) {
        let trait = Array.from(intersection)[0]
        console.log(trait)
        if(trait == "abjuration" || trait == "divine") {
            detectionRadar(token, "jb2a.detect_magic.circle.yellow")
        } else if(trait == "conjuration" || trait == "primal") {
            detectionRadar(token, "jb2a.detect_magic.circle.green")
        } else if(trait == "divination") {
            detectionRadar(token, "jb2a.detect_magic.circle.grey")
        } else if(trait == "enchantment") {
            detectionRadar(token, "jb2a.detect_magic.circle.purple")
        } else if(trait == "evocation" || trait == "arcane") {
            detectionRadar(token, "jb2a.detect_magic.circle.dark_red")
        } else if(trait == "illusion") {
            detectionRadar(token, "jb2a.detect_magic.circle.blue")
        } else if(trait == "necromancy" || trait == "occult") {
            detectionRadar(token, "jb2a.detect_magic.circle.greenorange")
        } else if(trait == "transmutation") {
            detectionRadar(token, "jb2a.detect_magic.circle.purple")
        } 
        await canvas.hud.bubbles.say(token, `I can smell some ${trait} magic around here!`); 
    } else {
        detectionRadar(token)
        await canvas.hud.bubbles.say(token, `I can smell different type of magic around here!`); 
        
    }
}

async function detectionRadarLvl4(token, item, target) {
    detectionRadarLvl3(token, item)
    await new Sequence()
    .effect()
      .file("jb2a.ui.indicator.bluegreen.02.03")
      .atLocation(target.center)
      .playbackRate(2)
    .play()

}
