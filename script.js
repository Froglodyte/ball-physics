//gets all important info from DOM
const canvas = document.getElementById("room")
const ctx = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 576

//info about room
let gravity = 0.75
let bounce = 0.60
let jumpHeight = 15
let isOnGround = false
let xAcc = 0.4
let radius = 30
let terminalVel = 20

let friction = 1.02
let groundFriction = 1.02

let mouse = {
    x: 0, 
    y: 0, 
    isDown: false
}

let currentEvent = 0
let prevEvent = 0;

let isBallPressed = false
let isInBounds = true

const isKeyPressed = {
  a: false,
  d: false,
  w: false,
  s: false
}

//ball class and creation
class Ball {
    constructor(position){
        this.position = position
        this.velocity = {
            x: 0,
            y: 1
        }
    }

    draw(){
        ctx.fillStyle = "#ED6A5A"
        ctx.beginPath()
        ctx.ellipse(this.position.x, this.position.y, radius, radius, Math.PI / 4, 0, 2 * Math.PI);
        if(ctx.isPointInPath(mouse.x, mouse.y) && mouse.isDown){
            isBallPressed = true
        }
        else isBallPressed = false

        ctx.fill()
    }

    update(){
        this.draw()

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        this.velocity.y /= friction
        this.velocity.x /= friction

        //ground collision detection
        if(this.position.y + radius + this.velocity.y < canvas.height){
            this.velocity.y += gravity
            isOnGround = false
            friction = 1
        }
        else{
            this.velocity.y = -this.velocity.y * bounce
            isOnGround = true
            friction = groundFriction
        }

        //ceiling collision detection
        if (this.position.y - radius + this.velocity.y <= 0) this.velocity.y = -this.velocity.y * bounce

        //left wall collision detection
        if (this.position.x - radius + this.velocity.x <= 0) {
            this.velocity.x *= -bounce/2
            this.position.x = radius;
        }

        //right wall colission detection
        if (this.position.x + radius + this.velocity.x >= canvas.width) {
            this.velocity.x *= -bounce/2
            this.position.x = canvas.width - radius;
        }

        if(isKeyPressed.a && this.velocity.x > -radius && Math.abs(this.velocity.x) < terminalVel) this.velocity.x -= xAcc
        if(isKeyPressed.d && this.velocity.x < radius && Math.abs(this.velocity.x) < terminalVel) this.velocity.x += xAcc
        if(isKeyPressed.w && isOnGround) this.velocity.y = -jumpHeight
        if(isKeyPressed.s && !isOnGround) this.velocity.y += gravity*2

        if(this.position.y <= radius){
            this.position.y = radius
            isInBounds =  false
        }
        else if(this.position.y > canvas.height - radius) {
            this.position.y = canvas.height - radius
            isInBounds =  false
        } else isInBounds = true

        if(this.position.x <= radius){
            this.position.x = radius
            isInBounds =  false
        }
        else if(this.position.x >= canvas.width - radius){
            this.position.x = canvas.width - radius
            isInBounds =  false
        } else isInBounds = true
    }
    drag(){
        if(!isInBounds){
            this.draw()
            return
        }
        this.position.x = mouse.x
        this.position.y = mouse.y
        this.velocity.x = 0
        this.velocity.y = 0
        this.update()
    }
}

const ball = new Ball({
    x: Math.round(canvas.width/2),
    y: Math.round(canvas.height/2.4)
})

//animation
function animate(){
    window.requestAnimationFrame(animate)

    ctx.fillStyle = "#FDFFF7"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if(isBallPressed) ball.drag()
    else ball.update()

    document.getElementById("xCoord").innerText = "X: " + Math.round(ball.position.x)
    document.getElementById("yCoord").innerText = "Y: " + Math.round(ball.position.y)

    document.getElementById("xVel").innerText = "X: " + Math.round(ball.velocity.x)
    document.getElementById("yVel").innerText = "Y: " + Math.round(ball.velocity.y)

}
animate()

window.addEventListener("keydown", (event) => {
    switch (event.key) {
    case 'd':
        isKeyPressed.d = true
    break
    case 'a':
        isKeyPressed.a = true
    break
    case 'w':
        isKeyPressed.w = true
    break
    case 's':
        isKeyPressed.s = true
    break
    case ' ':
        isKeyPressed.w = true
    break
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
    case 'd':
        isKeyPressed.d = false
    break
    case 'a':
        isKeyPressed.a= false
    break
    case 'w':
        isKeyPressed.w = false
    break
    case 's':
        isKeyPressed.s = false
    break
    case ' ':
        isKeyPressed.w = false
    break
  }
})

canvas.addEventListener('mousemove', function getMousePosition(e){
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
})

canvas.addEventListener('mouseout', function(){ isBallPressed = false })

canvas.onmousedown = function(){ mouse.isDown = true }
document.onmouseup = function(){ mouse.isDown = false }

//input validation
function valueEnforcer(min, max, id){
    let targetElem = document.getElementById(id)

    if(targetElem.value < min || targetElem.value > max || targetElem.value.length > 4){
        targetElem.value = targetElem.value.slice(0, targetElem.value.length - 1)
    }
}

let inputFields = document.getElementsByClassName("statValues")
for(let i = 0; i < inputFields.length; i++){
    let field = inputFields[i]
    inputFields[i].onchange = function(){
        if(isNaN(field.value) || !field.value) field.value = window[field.getAttribute("id")]
        window[field.getAttribute("id")] = field.value
    }
    field.value = eval(field.getAttribute("id")).toFixed(2).substr(0, 4)
}

function isValid(evt){
    let charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}