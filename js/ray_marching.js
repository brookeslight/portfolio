class Shape {
    constructor(x, y) {
        if (new.target === Shape) {
        throw new TypeError("Cannot instantiate abstract class Bound directly");
        }
        this.x = x;
        this.y = y;
        this.color = color(random(255), random(255), random(255));
    }
  
    distanceTo(x1, y1) {
        throw new Error("distanceTo() must be implemented by subclass");
    }
  
    render() {
        throw new Error("render() must be implemented by subclass");
    }
  
    getX() {
        return this.x;
    }
  
    getY() {
        return this.y;
    }
}

class Circle extends Shape {
    constructor(x, y, r) {
        super(x, y);
        this.r = r;
    }

    distanceTo(x1, y1) {
        const dx = this.x - x1;
        const dy = this.y - y1;
        return Math.sqrt(dx * dx + dy * dy) - this.r;
    }

    render() {
        noFill();
        stroke(this.color);
        ellipse(this.x, this.y, this.r * 2);
    }
}

class Rectangle extends Shape {
    constructor(x, y, w, h) {
        super(x, y);
        this.w = w;
        this.h = h;
    }

    distanceTo(x1, y1) {
        return Math.hypot(
            x1 - Math.max(this.x, Math.min(this.x + this.w, x1)), 
            y1 - Math.max(this.y, Math.min(this.y + this.h, y1))
        );
    }

    render() {
        noFill();
        stroke(this.color);
        rect(this.x, this.y, this.w, this.h);
    }
}

class Triangle extends Shape {
    constructor(x, y, x1, y1, x2, y2) {
        super(x, y);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
    }

    isPointInside(px, py) {
        const area = Math.abs((this.x * (this.y1 - this.y2) + this.x1 * (this.y2 - this.y) + this.x2 * (this.y - this.y1)) / 2);
        const area1 = Math.abs((px * (this.y1 - this.y2) + this.x1 * (this.y2 - py) + this.x2 * (py - this.y1)) / 2);
        const area2 = Math.abs((this.x * (py - this.y2) + px * (this.y2 - this.y) + this.x2 * (this.y - py)) / 2);
        const area3 = Math.abs((this.x * (this.y1 - py) + this.x1 * (py - this.y) + px * (this.y - this.y1)) / 2);
    
        // Check if the sum of the sub-triangle areas equals the total area
        return Math.abs(area - (area1 + area2 + area3)) < 0.01; // Allow for floating-point precision
    }

    distanceTo(x3, y3) {
        if (this.isPointInside(x3, y3)) {
            return 0;
        }
        const d1 = this.shortestDistanceToLineSegment(this.x, this.y, this.x1, this.y1, x3, y3);
        const d2 = this.shortestDistanceToLineSegment(this.x1, this.y1, this.x2, this.y2, x3, y3);
        const d3 = this.shortestDistanceToLineSegment(this.x2, this.y2, this.x, this.y, x3, y3);
        return Math.min(d1, Math.min(d2, d3));
    }

    shortestDistanceToLineSegment(x1, y1, x2, y2, x3, y3) {
        const abx = x2 - x1;
        const aby = y2 - y1;
        const apx = x3 - x1;
        const apy = y3 - y1;
        const bpx = x3 - x2;
        const bpy = y3 - y2;

        // Check if point is closest to point A
        if (abx * apx + aby * apy <= 0) {
            return Math.hypot(apx, apy);
        }

        // Check if point is closest to point B
        if (-abx * bpx - aby * bpy <= 0) {
            return Math.hypot(bpx, bpy);
        }

        // Point is between A and B
        return Math.abs(aby * x3 - abx * y3 + x2 * y1 - y2 * x1) / Math.hypot(abx, aby);
    }

    render() {
        noFill();
        stroke(this.color);
        triangle(this.x, this.y, this.x1, this.y1, this.x2, this.y2);
    }
}

let playerX, playerY; // Variables to store the circle's position
const playerRadius = 4; // Radius of the circle
const playerSpeed = 4; // Speed of movement
const shapes = []; // Array to store shapes

function setup() {
    const canvas = createCanvas(windowWidth * 0.75, windowHeight * 0.75);
    canvas.parent('canvas-container');

    // Initialize the circle's position at the center of the canvas
    playerX = width / 2;
    playerY = height / 2;

    // Initialize shapes with random properties
    let num;
    for (let i = 0; i < 15; i++) {
        num = Math.floor(random(1, 4));
        if (num == 1) {
            shapes.push(new Circle(
                random(width), random(height), // x, y
                random(10, 50) // r
            ));
        } else if (num == 2) {
            const centerX = random(width);
            const centerY = random(height);
            const size = random(20, 50); // Triangle size range
            shapes.push(new Triangle(
                centerX, centerY, // x, y
                centerX + random(-size, size), centerY + random(-size, size), // x1, y1
                centerX + random(-size, size), centerY + random(-size, size)  // x2, y2
            ));
        } else if (num == 3) {
            shapes.push(new Rectangle(
                random(width), random(height), // x, y
                random(10, 50), random(10, 50) // w, h
            ));
        }
    }
}

function draw() {
    // Set the background color
    background(120, 120, 120);

    // Draw all shapes and get player's distance to the scene
    for (let shape of shapes) {
        shape.render();
    }

    let distanceToScene = Infinity;
    let distanceTraveled = 0;
    let marchX = playerX
    let marchY = playerY;
    for (let i = 0; i < 25; i++) {

        // get distance to scene
        distanceToScene = Infinity
        for (let shape of shapes) {
            distanceToScene = Math.min(distanceToScene, shape.distanceTo(marchX, marchY));
        }
        
        // get direction to mouse
        let dirX = mouseX - playerX;
        let dirY = mouseY - playerY;
        const l = Math.hypot(dirX, dirY);
        dirX /= l;
        dirY /= l;

        // collision detection
        if (distanceToScene < 1) {
            noStroke()
            fill(255, 0, 0);
            ellipse(marchX, marchY, playerRadius * 2);
            break;
        }
        if (distanceTraveled > l) {
            break;
        }
        
        // draw circle
        stroke(255);
        ellipse(marchX, marchY, distanceToScene * 2);

        //march in direction of mouse
        marchX += dirX*distanceToScene;
        marchY += dirY*distanceToScene;
        distanceTraveled += distanceToScene;
    }
    stroke(255);
    // strokeWeight(1);
    line(playerX, playerY, marchX, marchY);
    
    noStroke();
    fill(255);
    // Draw the circle at mouse position
    ellipse(mouseX, mouseY, playerRadius * 2);    
    // Draw the circle at player position
    ellipse(playerX, playerY, playerRadius * 2);

    // Handle movement with WASD keys
    if (keyIsDown(87) || keyIsDown(38)) { // up
        playerY -= playerSpeed;
    }
    if (keyIsDown(83) || keyIsDown(40)) { // down
        playerY += playerSpeed;
    }
    if (keyIsDown(65) || keyIsDown(37)) { // left
        playerX -= playerSpeed;
    }
    if (keyIsDown(68) || keyIsDown(39)) { // right
        playerX += playerSpeed;
    }

    // Constrain the circle within the canvas boundaries
    playerX = constrain(playerX, playerRadius, width - playerRadius);
    playerY = constrain(playerY, playerRadius, height - playerRadius);

    // Check for collisions with shapes
    // for (let shape of shapes) {
    //     const distance = shape.distanceTo(playerX, playerY);
    //     if (distance <= 0) {
    //         const dx = playerX - shape.getX();
    //         const dy = playerY - shape.getY();
    //         const angle = Math.atan2(dy, dx);
    //         playerX = shape.getX() + Math.cos(angle) * (shape.radius + playerRadius);
    //         playerY = shape.getY() + Math.sin(angle) * (shape.radius + playerRadius);
    //     }
    // }
}
