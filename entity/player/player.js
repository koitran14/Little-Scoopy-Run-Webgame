import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerState.js';
import { CollisionAnimation } from '../../ui/collisionAnimation.js';
import { FloatingMessage } from '../../ui/floatingMessage.js';

export class player {
    //just pointing to object 'game', not COPY
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.53;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0; //velocity for jump
        this.weight = 1;
        this.image = document.getElementById('player');   
        this.frameX = 0;   
        this.frameY = 0;     
        this.maxFrame;
        this.fps = 30; //miliseconds
        this.frameInterval = 1000/this.fps;   
        this.frameTimer = 0;   
        this.speed = 0;
        this.maxSpeed = 5;
        this.gravity = 2;
        this.states = [
            new Sitting(this.game), 
            new Running(this.game), 
            new Jumping(this.game), 
            new Falling(this.game), 
            new Rolling(this.game), 
            new Diving(this.game), 
            new Hit(this.game)
        ]
        this.currentState = null;
        // cut states setting to game because of these Class(this.game) -> it will recall and skip the states set
    }

    update(input, deltaTime) {
        this.checkCollision();                   //check collision
        this.currentState.handleInput(input);   //for player
        this.x += this.speed;

        if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0; //stop 

        //horizontal boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        //vertical movement
        this.y += this.vy;
        if (!this.onGround()) {
            this.y += this.gravity;
            this.vy += this.weight; // Apply gravity
        } else this.vy = 0; // Reset velocity when on the ground
        
        //vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) 
            this.y = this.game.height - this.height - this.game.groundMargin;

        //sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    } 

    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height); //hitbox
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (    
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                enemy.markedForDeletion = true;                
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5]){
                    this.game.score++;
                    if ((this.game.score >= this.game.winningScore) && (this.game.lives > 0)) this.game.winning = true;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));
                } else {
                    this.setState(6, 0);
                    this.game.score--;
                    this.game.lives --;
                    if (this.game.lives <=0) this.game.gameOver = true;
                }
            } 
        });
    }
}