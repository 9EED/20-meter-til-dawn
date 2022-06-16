//basic
function rdm (max){
    return Math.floor(Math.random()*(max +1));
};
function random ( min, max, floor){
    if (floor) return Math.floor((Math.random()*(max - min + 1)) + min);
    return (Math.random()*(max - min)) + min;
};
function rdmAround (x, floor){
    if (floor) return Math.floor( Math.random()* x * 2 - x )
    return Math.random()* x * 2 - x
}
function write (input){
    console.log('%c' +  JSON.stringify(input), 'color: #8BF');
    return void 0;
};
function writeC (input){
    c.font = "20px monospace";
    c.fillStyle = 'white'
    c.fillText(JSON.stringify(input), 20, 40);
    return void 0;
};
function error (input){
    console.log('%c' + JSON.stringify(input), 'color: #F54;');
    return void 0;
};
function $ (id){
    return document.getElementById(id);
};
function randomColor (){
    return `hsl( ${rdm(360)}, ${random( 20, 70, true)}%, 50%)`
};
function intersect( a, b, c, d) {
    let x1 = a.x
    let y1 = a.y
    let x2 = b.x
    let y2 = b.y
    let x3 = c.x
    let y3 = c.y
    let x4 = d.x
    let y4 = d.y
    

    // Check if none of the lines are of length 0
      if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
          return false
      }
  
      denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  
    // Lines are parallel
      if (denominator === 0) {
          return false
      }
  
      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
      let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
  
    // is the intersection along the segments
      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
          return false
      }
  
    // Return a object with the x and y coordinates of the intersection
      let x = x1 + ua * (x2 - x1)
      let y = y1 + ua * (y2 - y1)

      return {x, y}
}
// map generating functions
function flat( xshift, yshift){
    return [
        new Quad( xshift+0, yshift+590, 800, 10, 'white', 'white'),
    ]
}
function stairs( xshift, yshift){
    return [
        new Quad( xshift+0, yshift+590, 800, 10, 'white', 'white'),
        new Quad( xshift+80, yshift+480, 120, 20, 'white', 'white'),
        new Quad( xshift+320, yshift+360, 120, 20, 'white', 'white'),
        new Quad( xshift+580, yshift+240, 100, 20, 'white', 'white'),
    ]
}
function parkour( xshift, yshift){
    return [
        new Quad( xshift+0, yshift+590, 800, 10, 'white', 'white'),
        new Quad( xshift+0, yshift+450, 30, 80, 'white', 'white'),
        new Quad( xshift+160, yshift+350, 30, 100, 'white', 'white'),
        new Quad( xshift+320, yshift+250, 30, 100, 'white', 'white'),
        new Quad( xshift+500, yshift+150, 30, 100, 'white', 'white'),
        new Quad( xshift+690, yshift+80, 80, 20, 'white', 'white'),
    ]
}
function straigt( xshift, yshift){
    return [
        new Quad( xshift+0, yshift+590, 800, 10, 'white', 'white'),
        new Quad( xshift+320, yshift+480, 120, 20, 'white', 'white'),
        new Quad( xshift+80, yshift+360, 100, 20, 'white', 'white'),
        new Quad( xshift+580, yshift+360, 100, 20, 'white', 'white'),
    ]
}
function start( xshift, yshift){
    return [
        new Quad( xshift+0, yshift+590, 800, 10, 'white', 'white'),
        new Quad( xshift+365, yshift+360, 100, 20, 'white', 'white'),
    ]
}
function generateMap(length){
    let map = []
    for( let i = 0 ; i < length ; i++ ){
        segmentType = [ stairs, straigt, parkour, flat][rdm(3)]
        if(i==0) segmentType = flat
        let segment = segmentType( i*800, 0)

        segment.forEach( quad =>{
            map.push(quad)
        })
    }
    return map
}
function enemyAi(enemy){
    if ( player.x > enemy.x ){
        if ( enemy.vx < enemy.speed ){
            enemy.vx += aiUpdateSpeed
        }
    }
    else if ( enemy.vx > -enemy.speed ){
        enemy.vx -= aiUpdateSpeed
    }
    if ( player.y > enemy.y ){
        if ( enemy.vy < enemy.speed ){
            enemy.vy += aiUpdateSpeed
        }
    }
    else if ( enemy.vy > -enemy.speed ){
        enemy.vy -= aiUpdateSpeed
    }
}
function spawnEnemies(){
    let x = rdm(width)-cameraX
    let y = rdm(height)-cameraY
    while( Math.abs(player.x-x) < distanceToSpawn & Math.abs(player.y-y) < distanceToSpawn ){
        x = rdm(width)-cameraX
        y = rdm(height)-cameraY
    }
    enemies.push(
        new entity( x, y, 35, 35, 2.5, 100, 1, 20, 'enemy', 'transparent', randomColor()),
    )
}
// canvas setup
let canvas = $('canvas')
let c = canvas.getContext('2d')
let width = 800
let height = 600
let maxfps = 60
let cameraX = 0
let cameraY = 0
canvas.width = width
canvas.height = height
c.fillStyle = '#CCC'
c.strokeStyle = '#CCC'

// game variables
let maxVelocity = 10
let aiUpdateSpeed = 0.5
let distanceToSpawn = 300
let mouse = {
    x: width/2,
    y: height/2,
    z: false
}
// object classes
class Circle {
    constructor( x, y, r, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.r = r;

        this.vx = 0;
        this.vy = 0;
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.beginPath();
            c.arc(this.x+cameraX, this.y+cameraY, this.r, 0, 8, false);
            c.stroke();
            c.fill();
        }

        this.update = ()=>{
            this.x += this.vx
            this.y += this.vy
        }

    }
}
class Quad {
    constructor( x, y, width, height, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = width;
        this.h = height;

        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x+cameraX, this.y+cameraY, this.w, this.h)
        }
    }
}
class Text {
    constructor( x, y, width, height, text, size, srokeStyle, fillStyle, textFillStyle, textStrokeStyle) {
        
        this.x = x;
        this.y = y;

        this.w = width;
        this.h = height;

        this.text = text
        this.size = size

        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;
        this.textFillStyle = textFillStyle;
        this.textStrokeStyle = textStrokeStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x+cameraX, this.y+cameraY, this.w, this.h)
            c.font = `${this.size}px monospace`;
            write(this.size)
            c.strokeStyle = this.textStrokeStyle;
            c.fillStyle = this.textFillStyle;
            c.fillText( this.text, this.x+cameraX, this.y+cameraY)
        }
    }
}
class entity {
    constructor( x, y, w, h, speed, hp, maxJumps, jumpForce, team, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.vx = 0;
        this.vy = 0;
        
        this.speed = speed
        this.hp = hp
        this.maxJumps = maxJumps
        this.jumps = this.maxJumps
        this.jumpForce = jumpForce
        this.team = team

        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x+cameraX, this.y+cameraY, this.w, this.h)
        }

        this.flash = ()=>{
            if( this.fillStyle != 'white' ){
                this.previouseStyle = this.fillStyle
            }
            this.fillStyle = 'white'
            setTimeout( ()=>{
                this.fillStyle = this.previouseStyle
            }, 100)
        }

        this.update = ()=>{
            this.y += this.vy
            this.x += this.vx
            for( let a in collidable ){
                for( let i in collidable[a] ){
                    if((this.x >= collidable[a][i].x & this.x <= collidable[a][i].x + collidable[a][i].w)|
                    (this.x + this.w >= collidable[a][i].x & this.x + this.w <= collidable[a][i].x + collidable[a][i].w)|
                    (collidable[a][i].x >= this.x & collidable[a][i].x <= this.x + this.w)|
                    (collidable[a][i].x + collidable[a][i].w >= this.x & collidable[a][i].x + collidable[a][i].w <= this.x + this.w)){
                        if((this.y >= collidable[a][i].y & this.y <= collidable[a][i].y + collidable[a][i].h)|
                        (this.y + this.h >= collidable[a][i].y & this.y + this.h <= collidable[a][i].y + collidable[a][i].h)|
                        (collidable[a][i].y >= this.y & collidable[a][i].y <= this.y + this.h)|
                        (collidable[a][i].y + collidable[a][i].h >= this.y & collidable[a][i].y + collidable[a][i].h <= this.y + this.h)){
                            let dx = Math.abs( collidable[a][i].x - this.x - this.w )
                            let ix = Math.abs( collidable[a][i].x + collidable[a][i].w - this.x )
                            let dy = Math.abs( collidable[a][i].y - this.y - this.h )
                            let iy = Math.abs( collidable[a][i].y + collidable[a][i].h - this.y )
                            if( dx < ix & dx < dy & dx < iy){
                                this.x -= dx
                            }
                            else if( ix < dx & ix < dy & ix < iy){
                                this.x += ix
                            }
                            else if( dy < dx & dy < ix & dy < iy){
                                this.y -= dy
                                this.jumps = this.maxJumps
                            }
                            else if( iy < dx & iy < ix & iy < dy){
                                this.y += iy
                            }
                        }
                    }
                }
            }
            for( let i in entities ){
                if((this.x >= entities[i].x & this.x <= entities[i].x + entities[i].w)|
                (this.x + this.w >= entities[i].x & this.x + this.w <= entities[i].x + entities[i].w)|
                (entities[i].x >= this.x & entities[i].x <= this.x + this.w)|
                (entities[i].x + entities[i].w >= this.x & entities[i].x + entities[i].w <= this.x + this.w)){
                    if((this.y >= entities[i].y & this.y <= entities[i].y + entities[i].h)|
                    (this.y + this.h >= entities[i].y & this.y + this.h <= entities[i].y + entities[i].h)|
                    (entities[i].y >= this.y & entities[i].y <= this.y + this.h)|
                    (entities[i].y + entities[i].h >= this.y & entities[i].y + entities[i].h <= this.y + this.h)){
                        
                        if( entities[i].team == 'playerBullet' & this.team == 'enemy' ){
                            enemies[enemies.indexOf(this)].flash()
                            this.hp -= entities[i].damage
                            bullets.splice(bullets.indexOf(entities[i]), 1)
                            entities.splice(entities.indexOf(entities[i]), 1)
                            return null
                        }
                        if( this.team == 'player' & entities[i].team == 'enemy'){
                            entities[i].hp = 0
                            player.hp -= 1
                            player.flash()
                            return null
                        }
                    }
                }
            }
            if( this.hp <= 0 ){
                if( this.team == 'enemy' ){
                    enemies.splice(enemies.indexOf(this), 1)
                    entities.splice(entities.indexOf(this), 1)
                    
                }
            }
        }
    }
}
class bullet {
    constructor( x, y, width, height, vx, vy, team, damage, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = width;
        this.h = height;

        this.vx = vx;
        this.vy = vy;

        this.team = team
        this.damage = damage
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x+cameraX, this.y+cameraY, this.w, this.h)
        }
        
        this.update = ()=>{
            this.x += this.vx
            this.y += this.vy
            for( let a in collidable ){
                for( let i in collidable[a] ){
                    if((this.x >= collidable[a][i].x & this.x <= collidable[a][i].x + collidable[a][i].w)|
                    (this.x + this.w >= collidable[a][i].x & this.x + this.w <= collidable[a][i].x + collidable[a][i].w)|
                    (collidable[a][i].x >= this.x & collidable[a][i].x <= this.x + this.w)|
                    (collidable[a][i].x + collidable[a][i].w >= this.x & collidable[a][i].x + collidable[a][i].w <= this.x + this.w)){
                        if((this.y >= collidable[a][i].y & this.y <= collidable[a][i].y + collidable[a][i].h)|
                        (this.y + this.h >= collidable[a][i].y & this.y + this.h <= collidable[a][i].y + collidable[a][i].h)|
                        (collidable[a][i].y >= this.y & collidable[a][i].y <= this.y + this.h)|
                        (collidable[a][i].y + collidable[a][i].h >= this.y & collidable[a][i].y + collidable[a][i].h <= this.y + this.h)){
                            bullets.splice( bullets.indexOf( this), 1)
                        }
                    }
                }
            }
        }
    }
}
class exp {
    constructor( x, y, vx, vy, size, ammount, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = size;
        this.h = size;

        this.vx = vx;
        this.vy = vy;

        this.team = 'exp'
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x+cameraX, this.y+cameraY, this.w, this.h)
        }
        
        this.update = ()=>{
            this.x += this.vx
            this.y += this.vy
            for( let a in collidable ){
                for( let i in collidable[a] ){
                    if((this.x >= collidable[a][i].x & this.x <= collidable[a][i].x + collidable[a][i].w)|
                    (this.x + this.w >= collidable[a][i].x & this.x + this.w <= collidable[a][i].x + collidable[a][i].w)|
                    (collidable[a][i].x >= this.x & collidable[a][i].x <= this.x + this.w)|
                    (collidable[a][i].x + collidable[a][i].w >= this.x & collidable[a][i].x + collidable[a][i].w <= this.x + this.w)){
                        if((this.y >= collidable[a][i].y & this.y <= collidable[a][i].y + collidable[a][i].h)|
                        (this.y + this.h >= collidable[a][i].y & this.y + this.h <= collidable[a][i].y + collidable[a][i].h)|
                        (collidable[a][i].y >= this.y & collidable[a][i].y <= this.y + this.h)|
                        (collidable[a][i].y + collidable[a][i].h >= this.y & collidable[a][i].y + collidable[a][i].h <= this.y + this.h)){
                            let dx = Math.abs( collidable[a][i].x - this.x - this.w )
                            let ix = Math.abs( collidable[a][i].x + collidable[a][i].w - this.x )
                            let dy = Math.abs( collidable[a][i].y - this.y - this.h )
                            let iy = Math.abs( collidable[a][i].y + collidable[a][i].h - this.y )
                            if( dx < ix & dx < dy & dx < iy){
                                this.x -= dx
                            }
                            else if( ix < dx & ix < dy & ix < iy){
                                this.x += ix
                            }
                            else if( dy < dx & dy < ix & dy < iy){
                                this.y -= dy
                                this.jumps = this.maxJumps
                            }
                            else if( iy < dx & iy < ix & iy < dy){
                                this.y += iy
                            }
                        }
                    }
                }
            }
        }
    }
}
class PlayerGun {
    constructor( x, y, width, height, bulletSpeed, accuracy, firerate, damage, srokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.w = width;
        this.h = height;

        this.vx = 0;
        this.vy = 0;
        
        this.srokeStyle = srokeStyle;
        this.fillStyle = fillStyle;

        this.damage = damage
        this.bulletSpeed = bulletSpeed
        this.accuracy = accuracy
        this.firerate = firerate //        ms to shoot
        this.timeleft = 0

        this.render = ()=>{
            c.strokeStyle = this.srokeStyle;
            c.fillStyle = this.fillStyle;
            c.fillRect( this.x+cameraX, this.y+cameraY, this.w, this.h)
        }
        this.shoot = ()=>{
            let timer = setInterval(() => {
                this.timeleft -= 1
                if(this.timeleft <= 0){
                    this.timeleft = 0
                    clearInterval(timer)
                }
            }, 100);
            if( this.timeleft == 0 ){
             
                let vx = cursor.x - this.x
                let vy = cursor.y - this.y
                vx *= random( 1 - this.accuracy, 1 + this.accuracy)
                vy *= random( 1 - this.accuracy, 1 + this.accuracy )
                let tanAlpha = vx / vy
                let alpha = Math.atan(tanAlpha)
                let vx2 = this.bulletSpeed * Math.sin(alpha)
                let vy2 = this.bulletSpeed * Math.cos(alpha)
                
                if ( vx > 0 ) vx2 = Math.abs(vx2)
                if ( vx < 0 ) vx2 = -Math.abs(vx2)
                if ( vy > 0 ) vy2 = Math.abs(vy2)
                if ( vy < 0 ) vy2 = -Math.abs(vy2)   // dont judge me it works
             
                bullets.push( new bullet( this.x, this.y, 6, 6, vx2, vy2, 'playerBullet', this.damage, 'white', 'white'))
                this.timeleft = this.firerate
            }
        }
    }
}
// game loop
let frame = 0
function loop(){

//     --loop--
    setTimeout(() => {
        requestAnimationFrame(loop)
    }, 1000 / maxfps);
    c.clearRect( 0, 0, width, height)
    frame++
    cameraX -= 3
    //player.x += 3
    //cameraY = - player.y + height / 2 + 100

//   --updates--
    //cursor
    cursor.x = mouse.x - cameraX - canvas.offsetLeft
    cursor.y = mouse.y - cameraY - canvas.offsetTop
    //player
    player.vx = inputx * player.speed
    if (player.vy < maxVelocity ) player.vy += 1
    player.update()
    //playergun
    playerGun.x = player.x + ( player.w - playerGun.w ) /2
    playerGun.y = player.y + ( player.h - playerGun.h ) /2 - 5
    if(mouse.z) playerGun.shoot()
    //bullets    
    bullets.forEach( element => element.update() );
    if(bullets.length > 100) bullets.shift()
    if(enemies.length > 150) enemies.shift()
    //enemies
    enemies.forEach( element => enemyAi(element))
    enemies.forEach( element => element.update())
    //map
    borders = [
        //new Quad( -cameraX, -cameraY-100, width, 101, 'transparent', 'transparent'),  // top
        new Quad( -cameraX-100, -cameraY, 101, height, 'transparent', 'transparent'), // left
        new Quad( -cameraX, -cameraY+height-1, width, 100, 'transparent', 'transparent'),  // bottom
        new Quad( -cameraX+width-1, -cameraY, 100, height, 'transparent', 'transparent'), // right
    ]
    collidable = [ currentMap, borders]
    entities = [ player, ...enemies, ...bullets, exps]
    if(frame%80==0)spawnEnemies()

//   --rendering--
    currentMap.forEach( element => element.render() );
    player.render()
    playerGun.render()
    bullets.forEach( element => element.render() );
    enemies.forEach( element => element.render())
    cursor.render()
    writeC(player.hp)
}

let cursor = new Circle( width/2, height/2, 6, 'white', '#fff3')

let testMap = [
    new Quad( 450, 500, 400, 20, 'white', 'white'),
    new Quad( 950, 450, 200, 20, 'white', 'white'),
    new Quad( 1200, 480, 100, 15, 'white', randomColor()),
    new Quad( 1400, 400, 100, 15, 'white', randomColor()),
]

let currentMap = generateMap(30)
let collidable = [currentMap]
let exps = [ new exp( 20, 20, 2, -2, 5, 10, 'white', 'white')]

let player = new entity( 400, 500, 30, 50, 5, 3, 1, 19, 'player', 'transparent', randomColor())
let playerGun = new PlayerGun( 0, 0, 16, 16, 20, 0.1, 100, 100, 'transparent', 'black')
let bullets = []

let enemies = []
let entities = [ player, ...enemies, ...exps]
// --input--
let inputx = 0
let inputy = 0
window.addEventListener( 'mousemove', ( event)=>{
    mouse.x = event.x
    mouse.y = event.y
})
window.addEventListener( 'mousedown', ()=>{
    mouse.z = true
})
window.addEventListener( 'mouseup', ()=>{
    mouse.z = false
})
window.addEventListener( 'mouseleave', ()=>{
    mouse.z = false
}) 
window.addEventListener( 'keypress', (key)=>{
    if( key.key == 'r'){
        location.reload()
    }
    if( key.key == 'w'){
        if ( player.jumps != 0 ){
            player.vy = -player.jumpForce
            player.jumps -= 1
        }
    }
})
window.addEventListener( 'keydown', (key)=>{
    if( key.key == 'd'){
        inputx = 1
    }
    if( key.key == 'a'){
        inputx = -1
    }
})
window.addEventListener( 'keyup', (key)=>{
    if( key.key == 'd'){
        if(inputx == 1) inputx = 0
    }
    if( key.key == 'a'){
        if(inputx == -1) inputx = 0
    }
})

loop()