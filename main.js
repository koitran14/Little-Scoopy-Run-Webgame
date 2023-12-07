import { player } from "./entity/player/player.js";
import { InputHandler } from "./controller/input.js"
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./entity/enemy.js";
import { Background } from "./ui/background.js";
import { UI } from "./ui/ui.js";
//load event: waits for all dependent resources such as stylesheets and images to be fully loaded and available before it runs
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const context = canvas.getContext('2d'); //provide a 2D object for tools to draw on canvas

    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.speed = 0;
            this.maxSpeed = 1.5;
            this.groundMargin = 80;
            this.background = new Background(this);
            this.player = new player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = []; 
            this.floatingMessages = [];
            this.maxParticles = 50; // have the full length of fire
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = true;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 30000; //in second
            this.score = 0;
            this.winningScore = 5;
            this.gameOver = false;
            this.winning = false;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime){
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            //handleEnemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else this.enemyTimer += deltaTime;

            this.enemies.forEach((enemy) => enemy.update(deltaTime))

            //handle floating messages
            this.floatingMessages.forEach(message => message.update())

            //handleParticles
            this.particles.forEach((particle) => particle.update());

            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            //handle collisions sprites
            this.collisions.forEach((collision) => collision.update(deltaTime));

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion)
        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context); //player is draw in canvas ==> automatically limit the space as web's properties
            this.enemies.forEach((enemy) => {
                enemy.draw(context);
            })
            this.particles.forEach((particle) => {
                particle.draw(context);
            })
            this.collisions.forEach((collision) => {
                collision.draw(context);
            })
            this.floatingMessages.forEach(message => {
                message.draw(context);
            })
            this.UI.draw(context);
        }

        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this)); 
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this)); 
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime; //how long each frame stays
        lastTime = timeStamp;
        context.clearRect(0,0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(context);
        if ((!game.gameOver) && (!game.winning)) requestAnimationFrame(animate);
    }
    animate(0);
});