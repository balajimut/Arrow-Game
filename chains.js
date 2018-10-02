var Example = Example || {};
var circleArray = [];
var constrainArray = [];
var currentSelectedCircle;
var currentConstrainObject;
var lineWidth = 3;
var arrowList = [];
var arrowPointList = [];

Example.chains = function() {
	var body = document.getElementsByTagName('body')[0];
	var button = document.createElement('button');
	button.textContent = "Play";
	body.appendChild(button);
	button.onclick = function(){
		arrowList.forEach(function(arrow,index){
			arrow.isStatic = false;
			var arrowObject = arrowPointList[index];
			var newArrowObject = createArrow(arrowObject.x,arrowObject.y,arrowObject.x1,arrowObject.y1,true);
			World.add(world,newArrowObject);
			 Body.applyForce( newArrowObject, {x: newArrowObject.position.x-150, y: newArrowObject.position.y}, {x: -0.03, y: 0});
//			Body.applyForce( newArrowObject, {x: newArrowObject.position.x, y: newArrowObject.position.y}, {x: -15, y: 0});
		});
	};
	//Declare Variables...
	var Engine = Matter.Engine, 
		Render = Matter.Render, 
		Runner = Matter.Runner, 
		Body = Matter.Body, 
		Composite = Matter.Composite, 
		Composites = Matter.Composites, 
		Constraint = Matter.Constraint, 
		MouseConstraint = Matter.MouseConstraint, 
		Mouse = Matter.Mouse, 
		World = Matter.World, 
		Bodies = Matter.Bodies,
		Events = Matter.Events,
		Vertices = Matter.Vertices;
	// create engine
	var engine = Engine.create(), world = engine.world;

	// create renderer
	var render = Render.create({
		element : document.body,
		engine : engine,
		options : {
			width : 800,
			height : 600,
			background : 'transparent',
			showAngleIndicator : false,
			showCollisions : false,
			showVelocity : false,
			wireframes : false
		}
	});

	Render.run(render);

	// create runner
	var runner = Runner.create();
	Runner.run(runner, engine);

	// add bodies
	var group = Body.nextGroup(true);
	var ropeC = Composites.stack(100, 50, 1, 20, 1, 1, function(x, y) {
		return Bodies.rectangle(x - 40, y, 50, 20, {
			render : {
				fillStyle : '#03A9F4'
			},
			collisionFilter : {
				group : group
			},
			chamfer : 5
		});
	});

	Composites.chain(ropeC, 0.3, 0, -0.3, 0, {
		render : {
			visible : false
		},
		stiffness : 1,
		length : 0
	});
	Composite.add(ropeC, Constraint.create({
		bodyB : ropeC.bodies[0],
		pointB : {
			x : 0,
			y : 0
		},
		pointA : {
			x : ropeC.bodies[0].position.x,
			y : ropeC.bodies[0].position.y
		},
		render : {
			visible : false
		},
		stiffness : 0.5
	}));

	World.add(world, [ ropeC, Constraint.create({
		pointA : {
			x : ropeC.bodies[ropeC.bodies.length - 1].position.x,
			y : ropeC.bodies[ropeC.bodies.length - 1].position.y
		},
		bodyB : ropeC.bodies[ropeC.bodies.length - 1],
		pointB : {
			x : 0,
			y : 0
		},
		render : {
			visible : false
		},
		length : 0,
		stiffness : 0.9
	})
	// Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true }

	]);

	// add mouse control
	var mouse = Mouse.create(render.canvas), mouseConstraint = MouseConstraint
			.create(engine, {
				mouse : mouse,
				constraint : {
					stiffness : 0.2,
					render : {
						visible : false
					}
				}
			});

	// mouseConstraint
	Events.on(mouseConstraint, "startdrag", function(event) {
		var currentObject = event.body;
		var currentIndex;
		if (!!currentObject) {
			currentIndex = circleArray.indexOf(currentObject);
			if (currentIndex !== -1) {
				currentSelectedCircle = currentObject;
				currentConstrainObject = constrainArray[currentIndex];
			}
		}
	});
	Events.on(mouseConstraint, "mousedown", function(event) {
		var currentObject = event.body;
		var currentIndex;
		if (!!currentObject) {
			currentIndex = circleArray.indexOf(currentObject);
			if (currentIndex !== -1) {
				currentSelectedCircle = currentObject;
				currentConstrainObject = constrainArray[currentIndex];
			}
		}
	});
	Events.on(mouseConstraint, "mousemove", function(event) {
		if (event.mouse.button === 0 && !!currentSelectedCircle) {
			currentSelectedCircle.position = JSON.parse(JSON
					.stringify(event.mouse.position));
			currentConstrainObject.pointA = JSON.parse(JSON
					.stringify(event.mouse.position));
		}
	});
	Events.on(mouseConstraint, "mouseup", function(event) {

		currentConstrainObject = undefined;
	});
	Events.on(mouseConstraint, "enddrag", function(event) {
		if (currentSelectedCircle === undefined) {
			var points = JSON
					.parse(JSON.stringify(event.mouse.mouseupPosition));
			var circleObject = Bodies.circle(points.x, points.y, 14, {
				isStatic : true,
				render : {
					zIndex : 10,
					fillStyle : 'rgba(156,39,176,0.5)'
				}
			});
			var constrainObject = Constraint.create({
				pointA : points,
				bodyB : event.body,
				pointB : {
					x : 0,
					y : 0
				},
				length : 0,
				stiffness : 0.9,
				render : {
					visible : false
				}
			});
			circleArray.push(circleObject);
			constrainArray.push(constrainObject);
			World.add(world, circleObject);
			World.add(world, constrainObject);
		}
		currentSelectedCircle = undefined;
	});

	World.add(world, mouseConstraint);
	World.add(world,createArrow(610,110,800,200));
	World.add(world,createArrow(610,210,800,300));
	World.add(world,createArrow(610,260,800,450,true));
	World.add(world, Bodies.rectangle(200, 100, 50, 50))
	
	var pointsString ='100 100 100 200 200 200 200 100 100 100';
	pointsString= '610 110 790 200 794 191 610 110';
	var testBody = Bodies.fromVertices(100, 100, Vertices.fromPath(pointsString), {
			render : {
				fillStyle : '#e91e63',
				strokeStyle : '#e91e63',
				lineWidth : 1
			}
		}, true);
	World.add(world,testBody);
	World.add(world,Bodies.rectangle(30, 740, 1520, 380, { 
        isStatic: true, 
        chamfer: { radius: 20 }
    }));
	// World.add(world, Bodies.circle(10, 10, 12, {
	// isStatic : true,
	// render : {
	// fillStyle : 'rgba(3,169,244,0.2)'
	// }
	// }));

	// keep the mouse in sync with rendering
	render.mouse = mouse;

	// fit the render viewport to the scene
	Render.lookAt(render, {
		min : {
			x : 0,
			y : 0
		},
		max : {
			x : 700,
			y : 600
		}
	});
//	mainLoop();
	// context for MatterTools.Demo
	return {
		engine : engine,
		runner : runner,
		render : render,
		canvas : render.canvas,
		stop : function() {
			Matter.Render.stop(render);
			Matter.Runner.stop(runner);
		}
	};
	function createArrow(x, y, x1, y1,nonStatic) {

		var staticValue = true;
		if(nonStatic){
			staticValue = false;
		}else{
			arrowPointList.push({'x':x,'y':y,'x1':x1,'y1':y1});
		}
		var headlen = 10; // length of head in pixels
		var angle = Math.atan2(y1 - y, x1 - x);

		var endX1 = x1 - headlen * Math.cos(angle - Math.PI / 6);
		var endY1 = y1 - headlen * Math.sin(angle - Math.PI / 6);

		var endX2 = x1 - headlen * Math.cos(angle + Math.PI / 6);
		var endY2 = y1 - headlen * Math.sin(angle + Math.PI / 6);

		var pointsString = x + ' ' + y + ' ' + ' '+
		endX1 + ' ' + endY1 + ' ' + endX2 + ' ' + endY2 + ' '+
		x + ' ' + y;
		console.log(pointsString);
		var arrow = Bodies.fromVertices(x, y, Vertices.fromPath(pointsString), {
			isStatic : staticValue,
			render : {
				fillStyle : '#e91e63',
				strokeStyle : '#e91e63',
				lineWidth : 1
			}
		}, true);
		if(!nonStatic){
			arrowList.push(arrow);
		}
		return arrow;
	};
//	 window.lastLoop = Date.now();
//	function mainLoop() {
//	    Engine.update(engine, (Date.now() - window.lastLoop));
//	    requestAnimationFrame(mainLoop);
//	    window.lastLoop = Date.now();
//	}
	   
};