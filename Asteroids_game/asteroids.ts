// FIT2102 2019 Assignment 1
// https://docs.google.com/document/d/1Gr-M6LTU-tfm4yabqZWJYg-zTjEVqHKKTCvePGCYsUA/edit?usp=sharing
// Author name: Choo Jun Yi
// StudentID = 30219396
//Last modified = 13/9/2019  9.47pm

// CITATION:
// The HTML button implementation and word Font styles are adopted from https://www.w3schools.com/ 
//& http://www.learningaboutelectronics.com/Articles/How-to-create-a-refresh-page-button-using-Javascript.php
//& https://wdexplorer.com/20-examples-beautiful-css-typography-design/



function asteroids() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in asteroids.html, animate them, and make them interactive.
  // Study and complete the Observable tasks in the week 4 tutorial worksheet first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.
  
  //-------------------------PART 1--------------------------------
  // The following part will be the declaration of variables

  const svg = document.getElementById("canvas")!;
  const small_ast = svg.getElementsByTagName('circle')

  //Global variables that will decide when to stop the game and record the score
  //These two variables will be updated by the functions 
  //Each player is given 3 lives before the game ends
  let score = 0
  let subscore = 0
  let life = 3
  let level = 1
  let multiplier = 1
  
  // make a group for the spaceship and a transform to move it and rotate it
  // to animate the spaceship you will update the transform property
  let g = new Elem(svg,'g')
    .attr("transform","translate(300 300)")  
    .attr("x",300)
    .attr("y",300)
    .attr("propelX",0)
    .attr("propelY",0)
    .attr("angleXY",0)

  // create a polygon shape for the space ship as a child of the transform group
  let ship = new Elem(svg, 'polygon', g.elem) 
    .attr("points","-15,20 15,20 0,-20")
    .attr("style","fill:white;stroke:green;stroke-width:1")
  

  //----------------------PART 2-----------------------------------
  //The following part is the declaration of functions

  //Functions(Both pure and impure are included)
  //getScore() function is the function that we will call in order to update our 

  const 
    // This function is for us to get the current x and y position of the spaceship(This is used to locate spaceship)
    transformMatrix = (e:Elem) => new WebKitCSSMatrix(window.getComputedStyle(e.elem).webkitTransform),
    // Convert radians to degrees. +90deg at the end because the ship sesat in wrong direction
    radToDeg = (rad:number) => rad * 180 / Math.PI + 90,
    // Convert degrees to radians for future usage in cos and sin
    degToRad = (degree:number) => degree*(Math.PI/180),
    //Define keyboard event to track when any key is pressed. This is important for us to set which key we press to move the spaceship
    keydown = Observable.fromEvent<KeyboardEvent>(document,"keydown")

  // Function that updates the score in html
  function getScore(){
    document.getElementById('score')!.innerHTML = "SCORE: "+String(score)
  }
  //Function that updates the life count in html
  function getLife(){
    document.getElementById('life')!.innerHTML = "LIFE: "+String(life)
  }
  function upLevel(){
    document.getElementById('level')!.innerHTML = "LEVEL: "+String(level)
  }

  // Higher-order pure function that checks whether collision between two objects happens
  // This function when called will not have any side effects because it does not change any value of the elements directly inside this function
  let check_collision:(x1:number,y1:number,r1:number,x2:number,y2:number,r2:number)=>boolean 
    = (x1,y1,r1,x2,y2,r2) => {return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2)) <= Math.abs(r1+r2)} 

  //-------------------------PART 3--------------------------------
  // The following parts will show how observables are used to create the asteroids game

  //This observable is assigned to keep updating the score and the lifecount. When the lifecount is 0, it is game over
  //This observable will also overwrite the html page to notify the player that the game has ended and they can refresh to restart the game
  Observable.interval(50).map(()=>{
  getLife();getScore();upLevel()}
  ).filter(()=>life<1).map(()=>{svg.remove();g.elem.remove()})
  .subscribe(()=>{
  document.write('<h1 style =  "transition: .5s; -moz-transition: .5s; -webkit-transition: .5s; -o-transition: .5s; font-family: georgia,garamond,serif;"><center>Asteroids Game(Programming Paradigm Assignment 1)</center></h1>');
  document.write('<center><p style = "color:red;font-family:georgia,garamond,serif;font-size:50px;font-weight:bold;">GAME OVER</p></center>')
  document.write('<center><p style = "color:blue;font-family:georgia,garamond,serif;font-size:30px;font-weight:bold;">Your final score is '+String(score)+'</p></center>')
  document.write('<center><p style = "color:blue;font-family:georgia,garamond,serif;font-size:30px;font-weight:bold;">Please press the button below to restart the game,mate!</p></center>')
  document.write('<center><button onclick="location.reload()" style= "background-color: grey border: none;color: black;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;">RESTART</button></center>')
  })

  Observable.interval(10)
  .filter(()=>score>30).map(()=>{level=2,multiplier = multiplier * 0.5})
  .filter(()=>score>50).map(()=>{level=3,multiplier = multiplier * 0.5})
  .filter(()=>score>100).subscribe(()=>{level=4,multiplier = multiplier * 0.5})

  //---Spaceship part----
  //Move the spaceship
  //I and K are used to move the spaceship thoughout the game
  //Multiple presses of these two keys will speed up the spaceship 
  //ONLY same amount of Up and Down at the opposite angles will truly offset the velocity of the spaceship, thus causing it to stop entirely 
  keydown.filter((e)=>e.code=="KeyI")
  .map(()=>g.attr('propelX',3*Math.sin(degToRad(Number(g.attr("angleXY"))))+Number(g.attr("propelX")))
  .attr('propelY',-3*Math.cos(degToRad(Number(g.attr("angleXY"))))+Number(g.attr("propelY")))).subscribe(()=>console.log("nais"))
  keydown.filter((e)=>e.code=="KeyK")
  .map(()=>g.attr('propelX',-3*Math.sin(degToRad(Number(g.attr("angleXY"))))+Number(g.attr("propelX")))
                    .attr('propelY',3*Math.cos(degToRad(Number(g.attr("angleXY"))))+Number(g.attr("propelY")))).subscribe(()=>console.log("nais"))
 
  //Rotate the ship
  //J and L are used to rotate the ship
  //In every press 15 degree of angle is changed(Left or Right)
  keydown.filter((e)=>e.code=="KeyL").subscribe(()=>g.attr("transform","translate("+transformMatrix(g).m41+" "+transformMatrix(g).m42+")"+"rotate("+(Number(g.attr("angleXY"))+15)+")")
  .attr("angleXY",(Number(g.attr("angleXY"))+15)))
  keydown.filter((e)=>e.code=="KeyJ").subscribe(()=> g.attr("transform","translate("+transformMatrix(g).m41+" "+transformMatrix(g).m42+")"+"rotate("+(Number(g.attr("angleXY"))-15)+")")
  .attr("angleXY",(Number(g.attr("angleXY"))-15)))
 
  //This is where the acceleration of the spaceship is determined
  //The initial value is set to 0 so that the spaceship does not move
  Observable.interval(50)
  .map(():Elem=>g.attr("transform","translate(" + (Number(g.attr("x"))) + " " +(Number(g.attr("y"))) + ")"+"rotate(" + Number(g.attr("angleXY")) + ")")
  .attr('x',(Number(g.attr("x"))+Number(g.attr("propelX"))))
  .attr('y',(Number(g.attr("y"))+Number(g.attr("propelY")))))
  .subscribe(()=>console.log("normal movement"))
  
  //4 observables that warp the spaceship around the canvas
  //track if the spaceship goes up
  Observable.interval(50).filter(()=>transformMatrix(g).m42+10<0).map(()=>g.attr('y',(svg.getBoundingClientRect().bottom)))
  .subscribe(()=>console.log("goes up"))
  //track if the spaceship goes down
  Observable.interval(50).filter(()=>transformMatrix(g).m42>svg.getBoundingClientRect().bottom).map(()=>g.attr('y',0))
  .subscribe(()=>console.log("goes down"))
  //track if the spaceship goes right
  Observable.interval(50).filter(()=>transformMatrix(g).m41>svg.getBoundingClientRect().right).map(()=>g.attr('x',svg.getBoundingClientRect().left))
  .subscribe(()=>console.log("goes right"))
  //track if the spaceship goes left
  Observable.interval(50).filter(()=>transformMatrix(g).m41+10<svg.getBoundingClientRect().left).map(()=>g.attr('x',svg.getBoundingClientRect().right))
  .subscribe(()=>console.log("goes left"))

  //-------Asteroids part---------
  // This observable is used to create asteroids
  // Inside this observables there are 4 observables that do the wrapping of the asteroids
  //, meaning when asteroids enter from one end, it will come out from the other end
  Observable.interval(3000*multiplier)
  .subscribe(()=>{
    //Creating asteroids
    let x_movement = Math.random()*5, y_movement = Math.random()*5
    let ast = new Elem(svg, 'circle').attr('id','asteroid').attr('cx', 0).attr('cy', 0)
    .attr('r', 30).attr('moveX',x_movement).attr('moveY',y_movement)
    .attr('fill', '#8B4513').attr('style','stroke:yellow');
    // Observable that makes sure the asteroids move by assigning and updating the value of X and Y of the asteroids
    Observable.interval(100)
    .map(()=>ast
      .attr('cx', Number(ast.attr('moveX'))+Number(ast.attr('cx')))
      .attr('cy',Number(ast.attr('moveY'))+Number(ast.attr('cy'))))
    .subscribe(()=>console.log("asteroids moving")) 
      
    //4 observables that wraps the asteroids around the canvas
    Observable.interval(1)
    .filter(()=>Number(ast.attr('cy'))<0)
    .subscribe(()=>ast.attr('cy',Number(svg.getBoundingClientRect().bottom)))

    Observable.interval(1)
    .filter(()=>Number(ast.attr('cy'))>(svg.getBoundingClientRect().bottom+5))
    .subscribe(()=>ast.attr('cy',0))

    Observable.interval(1)
    .filter(()=>Number(ast.attr('cx'))>(svg.getBoundingClientRect().right+5))
    .subscribe(()=>ast.attr('cx',0))

    Observable.interval(1)
    .filter(()=>Number(ast.attr('cx'))<0)
    .subscribe(()=>ast.attr('cx',svg.getBoundingClientRect().right))
  })

  //----Collision Detection part-----
  //Observables that tracks collisions for BIG asteroids
  //The spaceship is put back into its initial position and all its attributes are reset when collision happens
  Observable.interval(10)
    .map(()=>
      Observable.fromArray(Array.from(small_ast)).filter(g=>g.getAttribute('id')=="asteroid")
      .filter((small_ast)=>check_collision(Number(small_ast.getAttribute('cx')),Number(small_ast.getAttribute('cy'))
        ,Number(small_ast.getAttribute('r')),Number(g.attr("x")),Number(g.attr("y")),0))
      .map(()=>life = life - 1)
      .subscribe(()=>g.attr("transform","translate(300 300)")  
      .attr("x",300)
      .attr("y",300)
      .attr("propelX",0)
      .attr("propelY",0)
      .attr("angleXY",0)))
    .subscribe(()=>console.log("collision happens"))
    
  //Observables that tracks collisions for SMALL asteroids
  //The spaceship is put back into its initial position and all its attributes are reset when collision happens
  Observable.interval(10)
    .map(()=>
      Observable.fromArray(Array.from(small_ast)).filter(g=>g.getAttribute('id')=="smallasteroid")
      .filter((small_ast)=>check_collision(Number(small_ast.getAttribute('cx')),Number(small_ast.getAttribute('cy'))
        ,Number(small_ast.getAttribute('r')),Number(g.attr("x")),Number(g.attr("y")),0))
      .map(()=>life = life - 1)
      .subscribe(()=>g.attr("transform","translate(300 300)")  
      .attr("x",300)
      .attr("y",300)
      .attr("propelX",0)
      .attr("propelY",0)
      .attr("angleXY",0)))
    .subscribe(()=>console.log("collision happens"))
  
  
  // -----------Bullets part--------------
  //Such keydown event will track if the "Space button is pressed"
  keydown.filter((e)=>e.code == "Space")
  .subscribe(()=>{
    //Creating bullets with certain attributes
    let bullet = new Elem(svg, 'circle').attr('id','bullet').attr('cx', transformMatrix(g).m41).attr('cy', transformMatrix(g).m42)
    .attr('r', 4).attr('angle',Number(g.attr("angleXY")))
    .attr('propelX',0).attr('propelY',0)
    .attr('fill', '#95B3D7');
    
    //This observables make sure the bullet is moving at the same direction as where the spaceship is pointing
    Observable.interval(1).takeUntil(Observable.interval(3000))
    .map(()=>bullet
      .attr('propelX',10*Math.sin(degToRad(Number(bullet.attr("angle")))))
      .attr('propelY',-10*Math.cos(degToRad(Number(bullet.attr("angle"))))))
    .map(()=>bullet
      .attr('cx',(Number(bullet.attr("cx"))+Number(bullet.attr("propelX"))))
      .attr('cy',(Number(bullet.attr("cy"))+Number(bullet.attr("propelY")))))
    .subscribe(()=>console.log(bullet.attr("propelY")))

    //This observables destroy bullets immediately if they are out of canvas
    Observable.interval(1)
    .filter(()=>Number(bullet.attr('cy'))<0 || Number(bullet.attr('cy'))>svg.getBoundingClientRect().bottom||Number(bullet.attr('cx'))<0 || Number(bullet.attr('cx'))>svg.getBoundingClientRect().right)
    .subscribe(()=>bullet.elem.remove())

    //Inside this observables there are several things happening at the same time, and several observables are used to track different events
    //Firstly an array of asteroids are retrieved by using the 'getAttribute' and 'getElementByTagName' and then filter is used to find those that collide with the bullets
    //If the bullet hits the asteroids 2 small asteroids will be spawned
    Observable.interval(10).map(()=>
      Observable.fromArray(Array.from(small_ast)).filter(g=>g.getAttribute('id')=="asteroid")
      .filter((small_ast)=>check_collision(Number(small_ast.getAttribute('cx')),Number(small_ast.getAttribute('cy'))
        ,Number(small_ast.getAttribute('r')),Number(bullet.attr("cx")),Number(bullet.attr("cy")),Number(bullet.attr('r'))))
      .map((small_ast)=>{
        let childast1 = new Elem(svg, 'circle').attr('id','smallasteroid').attr('cx', Number(small_ast.getAttribute('cx'))+50).attr('cy', Number(small_ast.getAttribute('cy'))+50)
        .attr('r', 10).attr("moveX",0.1).attr("moveY",-0.1).attr('tag','g')
        .attr('fill', '#DAA520').attr('style','stroke:yellow');
        //This observable is used to make sure the FIRST small asteroid moves
        Observable.interval(1)
        .map(()=>childast1
        .attr('cx', Number(childast1.attr('moveX'))+Number(childast1.attr('cx')))
        .attr('cy',Number(childast1.attr('moveY'))+Number(childast1.attr('cy'))))
        .filter(()=>Number(childast1.attr('cy'))<0 || Number(childast1.attr('cy'))>svg.getBoundingClientRect().bottom||Number(childast1.attr('cx'))<0 || Number(childast1.attr('cx'))>svg.getBoundingClientRect().right)
        .subscribe(()=>childast1.elem.remove())

        let childast2 = new Elem(svg, 'circle').attr('id','smallasteroid').attr('cx', Number(small_ast.getAttribute('cx'))-50).attr('cy', Number(small_ast.getAttribute('cy'))+50)
        .attr('r', 10).attr("moveX",-0.1).attr("moveY",0.1).attr('tag','g').attr('fill', '#DAA520').attr('style','stroke:yellow');
        //This observable is used to make sure the SECOND small asteroid moves
        Observable.interval(1)
        .map(()=>childast2
        .attr('cx', Number(childast2.attr('moveX'))+Number(childast2.attr('cx')))
        .attr('cy',Number(childast2.attr('moveY'))+Number(childast2.attr('cy'))))
        .filter(()=>Number(childast2.attr('cy'))<0 || Number(childast2.attr('cy'))>svg.getBoundingClientRect().bottom||Number(childast2.attr('cx'))<0 || Number(childast2.attr('cx'))>svg.getBoundingClientRect().right)
        .subscribe(()=>childast2.elem.remove())
        
        
        //update the score
        score = score+10;
        return small_ast
      }).map((small_ast)=>small_ast.remove()).subscribe(()=>bullet.elem.remove())
    ).subscribe(()=>console.log("bullets out"))

    //This observable is used to keep track if the bullet collides with the small asteroids and update the score
    Observable.interval(1).subscribe(()=>
      Observable.fromArray(Array.from(small_ast)).filter(g=>g.getAttribute('id')=="smallasteroid")
      .filter((small_ast)=>check_collision(Number(small_ast.getAttribute('cx')),Number(small_ast.getAttribute('cy'))
        ,Number(small_ast.getAttribute('r')),Number(bullet.attr("cx")),Number(bullet.attr("cy")),Number(bullet.attr('r'))))
      .map((small_ast)=>{small_ast.remove();score = score+5}).subscribe(()=>bullet.elem.remove()))

  })
}

//----------I UNCOMMENTED THE GIVEN CODE TO IMPLEMENT A START BUTTON----------------------------------
// // the following simply runs your asteroids function on window load.  Make sure to leave it in place.
// if (typeof window != 'undefined')
//   window.onload = ()=>{
//     asteroids();
//   }
function startGame(){
  asteroids();
}