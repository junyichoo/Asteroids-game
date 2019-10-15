"use strict";
function asteroids() {
    const svg = document.getElementById("canvas");
    const small_ast = svg.getElementsByTagName('circle');
    let score = 0;
    let subscore = 0;
    let life = 3;
    let level = 1;
    let multiplier = 1;
    let g = new Elem(svg, 'g')
        .attr("transform", "translate(300 300)")
        .attr("x", 300)
        .attr("y", 300)
        .attr("propelX", 0)
        .attr("propelY", 0)
        .attr("angleXY", 0);
    let ship = new Elem(svg, 'polygon', g.elem)
        .attr("points", "-15,20 15,20 0,-20")
        .attr("style", "fill:white;stroke:green;stroke-width:1");
    const transformMatrix = (e) => new WebKitCSSMatrix(window.getComputedStyle(e.elem).webkitTransform), radToDeg = (rad) => rad * 180 / Math.PI + 90, degToRad = (degree) => degree * (Math.PI / 180), keydown = Observable.fromEvent(document, "keydown");
    function getScore() {
        document.getElementById('score').innerHTML = "SCORE: " + String(score);
    }
    function getLife() {
        document.getElementById('life').innerHTML = "LIFE: " + String(life);
    }
    function upLevel() {
        document.getElementById('level').innerHTML = "LEVEL: " + String(level);
    }
    let check_collision = (x1, y1, r1, x2, y2, r2) => { return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)) <= Math.abs(r1 + r2); };
    Observable.interval(50).map(() => {
        getLife();
        getScore();
        upLevel();
    }).filter(() => life < 1).map(() => { svg.remove(); g.elem.remove(); })
        .subscribe(() => {
        document.write('<h1 style =  "transition: .5s; -moz-transition: .5s; -webkit-transition: .5s; -o-transition: .5s; font-family: georgia,garamond,serif;"><center>Asteroids Game(Programming Paradigm Assignment 1)</center></h1>');
        document.write('<center><p style = "color:red;font-family:georgia,garamond,serif;font-size:50px;font-weight:bold;">GAME OVER</p></center>');
        document.write('<center><p style = "color:blue;font-family:georgia,garamond,serif;font-size:30px;font-weight:bold;">Your final score is ' + String(score) + '</p></center>');
        document.write('<center><p style = "color:blue;font-family:georgia,garamond,serif;font-size:30px;font-weight:bold;">Please press the button below to restart the game,mate!</p></center>');
        document.write('<center><button onclick="location.reload()" style= "background-color: grey border: none;color: black;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;">RESTART</button></center>');
    });
    Observable.interval(10)
        .filter(() => score > 30).map(() => { level = 2, multiplier = multiplier * 0.5; })
        .filter(() => score > 50).map(() => { level = 3, multiplier = multiplier * 0.5; })
        .filter(() => score > 100).subscribe(() => { level = 4, multiplier = multiplier * 0.5; });
    keydown.filter((e) => e.code == "KeyI")
        .map(() => g.attr('propelX', 3 * Math.sin(degToRad(Number(g.attr("angleXY")))) + Number(g.attr("propelX")))
        .attr('propelY', -3 * Math.cos(degToRad(Number(g.attr("angleXY")))) + Number(g.attr("propelY")))).subscribe(() => console.log("nais"));
    keydown.filter((e) => e.code == "KeyK")
        .map(() => g.attr('propelX', -3 * Math.sin(degToRad(Number(g.attr("angleXY")))) + Number(g.attr("propelX")))
        .attr('propelY', 3 * Math.cos(degToRad(Number(g.attr("angleXY")))) + Number(g.attr("propelY")))).subscribe(() => console.log("nais"));
    keydown.filter((e) => e.code == "KeyL").subscribe(() => g.attr("transform", "translate(" + transformMatrix(g).m41 + " " + transformMatrix(g).m42 + ")" + "rotate(" + (Number(g.attr("angleXY")) + 15) + ")")
        .attr("angleXY", (Number(g.attr("angleXY")) + 15)));
    keydown.filter((e) => e.code == "KeyJ").subscribe(() => g.attr("transform", "translate(" + transformMatrix(g).m41 + " " + transformMatrix(g).m42 + ")" + "rotate(" + (Number(g.attr("angleXY")) - 15) + ")")
        .attr("angleXY", (Number(g.attr("angleXY")) - 15)));
    Observable.interval(50)
        .map(() => g.attr("transform", "translate(" + (Number(g.attr("x"))) + " " + (Number(g.attr("y"))) + ")" + "rotate(" + Number(g.attr("angleXY")) + ")")
        .attr('x', (Number(g.attr("x")) + Number(g.attr("propelX"))))
        .attr('y', (Number(g.attr("y")) + Number(g.attr("propelY")))))
        .subscribe(() => console.log("normal movement"));
    Observable.interval(50).filter(() => transformMatrix(g).m42 + 10 < 0).map(() => g.attr('y', (svg.getBoundingClientRect().bottom)))
        .subscribe(() => console.log("goes up"));
    Observable.interval(50).filter(() => transformMatrix(g).m42 > svg.getBoundingClientRect().bottom).map(() => g.attr('y', 0))
        .subscribe(() => console.log("goes down"));
    Observable.interval(50).filter(() => transformMatrix(g).m41 > svg.getBoundingClientRect().right).map(() => g.attr('x', svg.getBoundingClientRect().left))
        .subscribe(() => console.log("goes right"));
    Observable.interval(50).filter(() => transformMatrix(g).m41 + 10 < svg.getBoundingClientRect().left).map(() => g.attr('x', svg.getBoundingClientRect().right))
        .subscribe(() => console.log("goes left"));
    Observable.interval(3000 * multiplier)
        .subscribe(() => {
        let x_movement = Math.random() * 5, y_movement = Math.random() * 5;
        let ast = new Elem(svg, 'circle').attr('id', 'asteroid').attr('cx', 0).attr('cy', 0)
            .attr('r', 30).attr('moveX', x_movement).attr('moveY', y_movement)
            .attr('fill', '#8B4513').attr('style', 'stroke:yellow');
        Observable.interval(100)
            .map(() => ast
            .attr('cx', Number(ast.attr('moveX')) + Number(ast.attr('cx')))
            .attr('cy', Number(ast.attr('moveY')) + Number(ast.attr('cy'))))
            .subscribe(() => console.log("asteroids moving"));
        Observable.interval(1)
            .filter(() => Number(ast.attr('cy')) < 0)
            .subscribe(() => ast.attr('cy', Number(svg.getBoundingClientRect().bottom)));
        Observable.interval(1)
            .filter(() => Number(ast.attr('cy')) > (svg.getBoundingClientRect().bottom + 5))
            .subscribe(() => ast.attr('cy', 0));
        Observable.interval(1)
            .filter(() => Number(ast.attr('cx')) > (svg.getBoundingClientRect().right + 5))
            .subscribe(() => ast.attr('cx', 0));
        Observable.interval(1)
            .filter(() => Number(ast.attr('cx')) < 0)
            .subscribe(() => ast.attr('cx', svg.getBoundingClientRect().right));
    });
    Observable.interval(10)
        .map(() => Observable.fromArray(Array.from(small_ast)).filter(g => g.getAttribute('id') == "asteroid")
        .filter((small_ast) => check_collision(Number(small_ast.getAttribute('cx')), Number(small_ast.getAttribute('cy')), Number(small_ast.getAttribute('r')), Number(g.attr("x")), Number(g.attr("y")), 0))
        .map(() => life = life - 1)
        .subscribe(() => g.attr("transform", "translate(300 300)")
        .attr("x", 300)
        .attr("y", 300)
        .attr("propelX", 0)
        .attr("propelY", 0)
        .attr("angleXY", 0)))
        .subscribe(() => console.log("collision happens"));
    Observable.interval(10)
        .map(() => Observable.fromArray(Array.from(small_ast)).filter(g => g.getAttribute('id') == "smallasteroid")
        .filter((small_ast) => check_collision(Number(small_ast.getAttribute('cx')), Number(small_ast.getAttribute('cy')), Number(small_ast.getAttribute('r')), Number(g.attr("x")), Number(g.attr("y")), 0))
        .map(() => life = life - 1)
        .subscribe(() => g.attr("transform", "translate(300 300)")
        .attr("x", 300)
        .attr("y", 300)
        .attr("propelX", 0)
        .attr("propelY", 0)
        .attr("angleXY", 0)))
        .subscribe(() => console.log("collision happens"));
    keydown.filter((e) => e.code == "Space")
        .subscribe(() => {
        let bullet = new Elem(svg, 'circle').attr('id', 'bullet').attr('cx', transformMatrix(g).m41).attr('cy', transformMatrix(g).m42)
            .attr('r', 4).attr('angle', Number(g.attr("angleXY")))
            .attr('propelX', 0).attr('propelY', 0)
            .attr('fill', '#95B3D7');
        Observable.interval(1).takeUntil(Observable.interval(3000))
            .map(() => bullet
            .attr('propelX', 10 * Math.sin(degToRad(Number(bullet.attr("angle")))))
            .attr('propelY', -10 * Math.cos(degToRad(Number(bullet.attr("angle"))))))
            .map(() => bullet
            .attr('cx', (Number(bullet.attr("cx")) + Number(bullet.attr("propelX"))))
            .attr('cy', (Number(bullet.attr("cy")) + Number(bullet.attr("propelY")))))
            .subscribe(() => console.log(bullet.attr("propelY")));
        Observable.interval(1)
            .filter(() => Number(bullet.attr('cy')) < 0 || Number(bullet.attr('cy')) > svg.getBoundingClientRect().bottom || Number(bullet.attr('cx')) < 0 || Number(bullet.attr('cx')) > svg.getBoundingClientRect().right)
            .subscribe(() => bullet.elem.remove());
        Observable.interval(10).map(() => Observable.fromArray(Array.from(small_ast)).filter(g => g.getAttribute('id') == "asteroid")
            .filter((small_ast) => check_collision(Number(small_ast.getAttribute('cx')), Number(small_ast.getAttribute('cy')), Number(small_ast.getAttribute('r')), Number(bullet.attr("cx")), Number(bullet.attr("cy")), Number(bullet.attr('r'))))
            .map((small_ast) => {
            let childast1 = new Elem(svg, 'circle').attr('id', 'smallasteroid').attr('cx', Number(small_ast.getAttribute('cx')) + 50).attr('cy', Number(small_ast.getAttribute('cy')) + 50)
                .attr('r', 10).attr("moveX", 0.1).attr("moveY", -0.1).attr('tag', 'g')
                .attr('fill', '#DAA520').attr('style', 'stroke:yellow');
            Observable.interval(1)
                .map(() => childast1
                .attr('cx', Number(childast1.attr('moveX')) + Number(childast1.attr('cx')))
                .attr('cy', Number(childast1.attr('moveY')) + Number(childast1.attr('cy'))))
                .filter(() => Number(childast1.attr('cy')) < 0 || Number(childast1.attr('cy')) > svg.getBoundingClientRect().bottom || Number(childast1.attr('cx')) < 0 || Number(childast1.attr('cx')) > svg.getBoundingClientRect().right)
                .subscribe(() => childast1.elem.remove());
            let childast2 = new Elem(svg, 'circle').attr('id', 'smallasteroid').attr('cx', Number(small_ast.getAttribute('cx')) - 50).attr('cy', Number(small_ast.getAttribute('cy')) + 50)
                .attr('r', 10).attr("moveX", -0.1).attr("moveY", 0.1).attr('tag', 'g').attr('fill', '#DAA520').attr('style', 'stroke:yellow');
            Observable.interval(1)
                .map(() => childast2
                .attr('cx', Number(childast2.attr('moveX')) + Number(childast2.attr('cx')))
                .attr('cy', Number(childast2.attr('moveY')) + Number(childast2.attr('cy'))))
                .filter(() => Number(childast2.attr('cy')) < 0 || Number(childast2.attr('cy')) > svg.getBoundingClientRect().bottom || Number(childast2.attr('cx')) < 0 || Number(childast2.attr('cx')) > svg.getBoundingClientRect().right)
                .subscribe(() => childast2.elem.remove());
            score = score + 10;
            return small_ast;
        }).map((small_ast) => small_ast.remove()).subscribe(() => bullet.elem.remove())).subscribe(() => console.log("bullets out"));
        Observable.interval(1).subscribe(() => Observable.fromArray(Array.from(small_ast)).filter(g => g.getAttribute('id') == "smallasteroid")
            .filter((small_ast) => check_collision(Number(small_ast.getAttribute('cx')), Number(small_ast.getAttribute('cy')), Number(small_ast.getAttribute('r')), Number(bullet.attr("cx")), Number(bullet.attr("cy")), Number(bullet.attr('r'))))
            .map((small_ast) => { small_ast.remove(); score = score + 5; }).subscribe(() => bullet.elem.remove()));
    });
}
function startGame() {
    asteroids();
}
//# sourceMappingURL=asteroids.js.map