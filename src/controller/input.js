export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        
        // keydown: Keydown happens when the key is pressed down, and auto repeats if the key is pressed down for long.
        window.addEventListener('keydown', e => {            
            // just add once, if already have, not add
            if ((e.key === 'ArrowDown'|| 
            e.key === 'ArrowUp' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight'||
            e.key === 'Enter'
            ) && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            } else if (e.key === 'd') this.game.debug =!this.game.debug;
        });

        // keyup: Keyup happens when the key is released.
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown'|| 
            e.key === 'ArrowUp' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight'||
            e.key === 'Enter'
            ) {
                this.keys.splice(this.keys.indexOf(e.key), 1); //delete
            }
        })
    }
}