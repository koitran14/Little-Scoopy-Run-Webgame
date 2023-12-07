class Layer {
    constructor(game, image, width, height, speedModifier){
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier ;
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }

    update(){
        if (this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }
}

export class Background {
    constructor(game){
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.x = 0;
        this.y = 0;

        //layers
        this.backgroundLayers = [];
        this.speedModifier = [0, 0.2, 0.4, 0.8, 1]

        for (let i = 0; i < 5; i++) {
            let image = document.getElementById(`layer${i+1}`);
            let layer = new Layer(this.game, image, this.width, this.height, this.speedModifier[i]);
            this.backgroundLayers.push(layer);
        }
    }
    

    update(){
        this.backgroundLayers.forEach((layer) => {
            layer.update();
        })
    }

    draw(context){
        this.backgroundLayers.forEach((layer) => {
            layer.draw(context);
        })
    }
}