let target = Array.from(game.user.targets)[0];

new Sequence()
.effect()
    .file("jb2a.divine_smite.caster.blueyellow")
    .atLocation(token)
.effect()
    .file("jb2a.energy_beam.normal.yellow.03")
    .atLocation(token)
    .stretchTo(target)
    .duration(1000)
    .delay(1500)
.effect()
    .file("jb2a.divine_smite.target.blueyellow")
    .atLocation(target)
    .delay(1800)
.play()