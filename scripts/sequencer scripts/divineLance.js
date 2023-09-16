let target = Array.from(game.user.targets)[0];

new Sequence()
.effect()
    .file("jb2a.divine_smite.caster")
    .atLocation(token)
.effect()
    .file("jb2a.divine_smite.target")
    .atLocation(target)
    .delay(1200)
.play()



// let target = Array.from(game.user.targets)[0];

// new Sequence()
// .effect()
// .file("jb2a.energy_beam.normal.bluepink.02")
// .atLocation(token)
// .stretchTo(target)
// .play()