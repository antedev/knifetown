let config = {
    size:8,
    icon: 'icons/magic/fire/projectile-fireball-smoke-strong-orange.webp',
    label: 'Fireball',
    tag: 'fire',
    t: 'circle',
    drawIcon: true,
    drawOutline: true,
    interval: -1,
    rememberControlled: true,
}

let position = await warpgate.crosshairs.show(config);

new Sequence()
.effect()
    .file("jb2a.fireball.beam.orange")
    .atLocation(token)
    .stretchTo(position)
.effect()
    .file("jb2a.fireball.explosion.orange")
    .atLocation(position)
    .delay(2100)
.play()
