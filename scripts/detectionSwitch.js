let detectionActive = game.scenes
  .filter((x) => x.active == true)[0]
  .getFlag("core", "detectionActive");
console.log(detectionActive);
if (detectionActive === undefined || !detectionActive) {
  // If Undefined or false, we need to get started detecting
  console.log("Lets go!");
  game.scenes
    .filter((x) => x.active == true)[0]
    .setFlag("core", "detectionActive", true);
  hookId = Hooks.on("updateToken", (token, changes) => {
    // Check if the token has the isDetecting flag set to true
    if (token.getFlag("world", "isDetecting")) {
      if (changes.x > 0 || changes.y > 0) {
        console.log(`${token.name} is detecting and moved`);
        detectMagic(token);
      } else {
        console.log(`${token.name} is detecting but not moving.`);
      }
    } else {
      console.log(`${token.name} is not detecting.`);
    }
  });
  //Save the HookId
  game.scenes
    .filter((x) => x.active == true)[0]
    .setFlag("core", "detectionHook", hookId);
} else {
  // Else we are detecting, and should just stop
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

async function detectMagic(token) {
  let spellRange = 30;

  console.log("Any magic around?");
  for (const target of canvas.tokens.placeables) {
    // Find all loot tokens, go through the Inventory in them and find all items with the magical trait. If found, calculate the distance
    if (target.actor.type == "loot" || target.actor.type == "npc") {
      const distance = await canvas.grid.measureDistance(token, target);
      if (distance <= spellRange) {
        for (const inv of target.actor.inventory) {
          for (const loot of inv.traits) {
            if (loot == "magical") {
              console.log("We got magic loot!");
              let x = token.x + canvas.grid.grid.w / 2;
              let y = token.y + canvas.grid.grid.h / 2;
              await new Sequence()
                .effect()
                    .file("jb2a.detect_magic.circle.blue")
                    .atLocation(token.center)
                    .playbackRate(2)
                .sound()
                    .file("worlds/playground/data/playlists/radar-beep-fx_140bpm.wav")
                    .fadeInAudio(500)
                    .fadeOutAudio(500)
                .play();
              return true;
            }
          }
        }
      }
    }
  }
  console.log("Nah,no loot");
}
