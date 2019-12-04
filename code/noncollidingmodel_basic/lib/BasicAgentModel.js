var WINDOWBORDERSIZE = 10;
var HUGE = 999999; //Sometimes useful when testing for big or small numbers
var animationDelay = 200; //controls simulation and transition speed
var isRunning = false; // used in simStep and toggleSimStep
var surface; // Set in the redrawWindow function. It is the D3 selection of the svg drawing surface
var simTimer; // Set in the initialization function

//The drawing surface will be divided into logical cells
var maxCols = 40;
var maxRows = 40;

var cellWidth; //cellWidth is calculated in the redrawWindow function
var cellHeight; //cellHeight is calculated in the redrawWindow function

//You are free to change images to suit your purpose. These images came from icons-land.com.
// The copyright rules for icons-land.com require a backlink on any page where they appear.
// See the credits element on the html page for an example of how to comply with this rule.

const urlSquirtle = "images/squirtle.png";
const urlPikachu = "images/pikachu.png";
const urlCharmander = "images/charmander.png";
const urlEevee = "images/eeve.png";
const urlBulbasaur = "images/bulbasaur.png";

var characters = ["squirtle","pikachu","charmander","bulbasaur","eevee"];

////////////////
const urlTable = "images/newtable.png";
const urlDrinksdispenser = "images/drink_dispenser.png";
const urlChair = "images/newchair.png";
const urlCashier = "images/cashier.png";
const urlEntrance ="images/door2.png"

///////////////
//Initializing all the locations for the tables
var tableRow_1 = 5.5;
var tableCol_1 = 10;

var tableRow_2 = 5.5;
var tableCol_2 = 20;

var tableRow_3 = 5.5;
var tableCol_3 = 30;

var tableRow_4 = 10;
var tableCol_4 = 10;

var tableRow_5 = 10;
var tableCol_5 = 20;

var tableRow_6 = 10;
var tableCol_6 = 30;

///////////////

///////////////
//Positioning of the seats (4 seats per table)

var chairRowlist = [chairRow_1a,chairRow_1b,chairRow_1c,chairRow_1d,chairRow_2a,chairRow_2b,chairRow_2c,chairRow_2d,chairRow_3a,chairRow_3b,chairRow_3c,chairRow_3d,chairRow_4a,chairRow_4b,chairRow_4c,chairRow_4d,chairRow_5a,chairRow_5b,chairRow_5c,chairRow_5d,chairRow_6a,chairRow_6b,chairRow_6c,chairRow_6d];
var chairCollist = [chairCol_1a,chairCol_1b,chairCol_1c,chairCol_1d,chairCol_2a,chairCol_2b,chairCol_2c,chairCol_2d,chairCol_3a,chairCol_3b,chairCol_3c,chairCol_3d,chairCol_4a,chairCol_4b,chairCol_4c,chairCol_4d,chairCol_5a,chairCol_5b,chairCol_5c,chairCol_5d,chairCol_6a,chairCol_6b,chairCol_6c,chairCol_6d];

var chairRow_1a = 4.5;
var chairCol_1a = 10.5;
var chairRow_1b = 7.5;
var chairCol_1b = 10.5;
var chairRow_1c = 6;
var chairCol_1c = 9;
var chairRow_1d = 6;
var chairCol_1d = 12;

var chairRow_2a = 4.5;
var chairCol_2a = 20.5;
var chairRow_2b = 7.5;
var chairCol_2b = 20.5;
var chairRow_2c = 6;
var chairCol_2c = 19;
var chairRow_2d = 6;
var chairCol_2d = 22;

var chairRow_3a = 4.5;
var chairCol_3a = 30.5;
var chairRow_3b = 7.5;
var chairCol_3b = 30.5;
var chairRow_3c = 6;
var chairCol_3c = 29;
var chairRow_3d = 6;
var chairCol_3d = 32;

var chairRow_4a = 9;
var chairCol_4a = 10.5;
var chairRow_4b = 12;
var chairCol_4b = 10.5;
var chairRow_4c = 10.5;
var chairCol_4c = 9;
var chairRow_4d = 10.5;
var chairCol_4d = 12;

var chairRow_5a = 9;
var chairCol_5a = 20.5;
var chairRow_5b = 12;
var chairCol_5b = 20.5;
var chairRow_5c = 10.5;
var chairCol_5c = 19;
var chairRow_5d = 10.5;
var chairCol_5d = 22;

var chairRow_6a = 9;
var chairCol_6a = 30.5;
var chairRow_6b = 12;
var chairCol_6b = 30.5;
var chairRow_6c = 10.5;
var chairCol_6c = 29;
var chairRow_6d = 10.5;
var chairCol_6d = 32;

///////////////
//Positioning of the cashier and entrance

//////////////
//Positioning of the cashier, entrance, drinks machine

var cashierRow = 16;
var cashierCol = 36;

var entranceRow = 16;
var entranceCol = 20;

var drinkdispenserRow = 10;
var drinkdispenserCol = 36;

/////////////


//a customer enters the hospital UNORDERED; he or she then is QUEUEING to be EATING by a cashier;
// then ORDERING with the cashier; then EATING;
// When the customer is EATEN he or she leaves the clinic immediately at that point.

const UNORDERED = 0;
const WAITING = 1;
const STAGING = 2;
const ORDERING = 3;
const ORDERED = 4;
const ORDERING2 = 5;
const EATING = 6;
const EATEN = 7;
const EXITED = 8;
const REJECTED = 9;

// The cashier can be either BUSY treating a customer, or IDLE, waiting for a customer
const IDLE = 0;
const BUSY = 1;

// There are two types of staticmembers in our system: cashiers and entrances

const CASHIER = 0;
const ENTRANCE = 1;
const DRINKMACHINE = 2;

// customers is a dynamic list, initially empty
var customers = [];
// staticmembers is a static list, populated with a entrance and a cashier
var staticmembers = [
  {"type":CASHIER,"label":"Jenny","location":{"row":cashierRow,"col":cashierCol},"state":IDLE},
  {"type":DRINKMACHINE,"label":"Drink dispenser","location":{"row":drinkdispenserRow,"col":drinkdispenserCol},"state":IDLE},
  {"type":ENTRANCE,"label":"Pokemon Alfresco","location":{"row":entranceRow,"col":entranceCol},"state":IDLE}
];
var cashier = staticmembers[0]; // the cashier is the first element of the staticmembers list.

// We can section our screen into different areas. In this model, the waiting area and the staging area are separate.
var areas =[
 {"label":"Waiting Area","startRow":cashierRow,"numRows":1,"startCol":26,"numCols":8,"color":"pink"},
 {"label":"Staging Area","startRow":cashierRow,"numRows":1,"startCol":cashierCol-2,"numCols":1,"color":"red"},
 {"label":"Drinks Area","startRow":drinkdispenserRow,"numRows":1,"startCol":drinkdispenserCol-5,"numCols":5,"color":"blue"},
 {"label":"Ordering Area","startRow":cashierRow,"numRows":1,"startCol":cashierCol-1,"numCols":1,"color":"white"}
];
var waitingRoom = areas[0]; // the waiting room is the first element of the areas array

var currentTime = 0;
var statistics = [
{"name":"Average time spent in restaurant by Customer: ","location":{"row":15,"col":1},"cumulativeValue":0,"count":0},
{"name":"Average time spent in queue by Customer: ","location":{"row":16,"col":1},"cumulativeValue":0,"count":0},
{"name":"Average percentage of rejected Customers: ","location":{"row":17,"col":1},"cumulativeValue":0,"count":0}
];

// There are 6 tables
const TABLE1 = 0;
const TABLE2 = 1;
const TABLE3 = 2;
const TABLE4 = 3;
const TABLE5 = 4;
const TABLE6 = 5;
// create all the tables in a list
var tablesIN = [
  {"type":TABLE1,"label":"Table1","location":{"row":tableRow_1,"col":tableCol_1},"state":IDLE},
  {"type":TABLE2,"label":"Table2","location":{"row":tableRow_2,"col":tableCol_2},"state":IDLE},
  {"type":TABLE3,"label":"Table3","location":{"row":tableRow_3,"col":tableCol_3},"state":IDLE},
  {"type":TABLE4,"label":"Table4","location":{"row":tableRow_4,"col":tableCol_4},"state":IDLE},
  {"type":TABLE5,"label":"Table5","location":{"row":tableRow_5,"col":tableCol_5},"state":IDLE},
  {"type":TABLE6,"label":"Table6","location":{"row":tableRow_6,"col":tableCol_6},"state":IDLE},
];

var Table1 = tablesIN[0]; //the first table is the first thing in the table list
var Table2 = tablesIN[1];
var Table3 = tablesIN[2];
var Table4 = tablesIN[3];
var Table5 = tablesIN[4];
var Table6 = tablesIN[5];

// There are 6 x 4 = 24 chairs
const CHAIR1a = 0;
const CHAIR1b = 1;
const CHAIR1c = 2;
const CHAIR1d = 3;
const CHAIR2a = 4;
const CHAIR2b = 5;
const CHAIR2c = 6;
const CHAIR2d = 7;
const CHAIR3a = 8;
const CHAIR3b = 9;
const CHAIR3c = 10;
const CHAIR3d = 11;
const CHAIR4a = 12;
const CHAIR4b = 13;
const CHAIR4c = 14;
const CHAIR4d = 15;
const CHAIR5a = 16;
const CHAIR5b = 17;
const CHAIR5c = 18;
const CHAIR5d = 19;
const CHAIR6a = 20;
const CHAIR6b = 21;
const CHAIR6c = 22;
const CHAIR6d = 23;

//Creating a list for all the chairs
var chairsIN = [
  {"type":CHAIR1a,"label":"Chair1a","location":{"row":chairRow_1a,"col":chairCol_1a},"state":IDLE},
  {"type":CHAIR1b,"label":"Chair1b","location":{"row":chairRow_1b,"col":chairCol_1b},"state":IDLE},
  {"type":CHAIR1c,"label":"Chair1c","location":{"row":chairRow_1c,"col":chairCol_1c},"state":IDLE},
  {"type":CHAIR1d,"label":"Chair1d","location":{"row":chairRow_1d,"col":chairCol_1d},"state":IDLE},
  {"type":CHAIR2a,"label":"Chair2a","location":{"row":chairRow_2a,"col":chairCol_2a},"state":IDLE},
  {"type":CHAIR2b,"label":"Chair2b","location":{"row":chairRow_2b,"col":chairCol_2b},"state":IDLE},
  {"type":CHAIR2c,"label":"Chair2c","location":{"row":chairRow_2c,"col":chairCol_2c},"state":IDLE},
  {"type":CHAIR2d,"label":"Chair2d","location":{"row":chairRow_2d,"col":chairCol_2d},"state":IDLE},
  {"type":CHAIR3a,"label":"Chair3a","location":{"row":chairRow_3a,"col":chairCol_3a},"state":IDLE},
  {"type":CHAIR3b,"label":"Chair3b","location":{"row":chairRow_3b,"col":chairCol_3b},"state":IDLE},
  {"type":CHAIR3c,"label":"Chair3c","location":{"row":chairRow_3c,"col":chairCol_3c},"state":IDLE},
  {"type":CHAIR3d,"label":"Chair3d","location":{"row":chairRow_3d,"col":chairCol_3d},"state":IDLE},
  {"type":CHAIR4a,"label":"Chair4a","location":{"row":chairRow_4a,"col":chairCol_4a},"state":IDLE},
  {"type":CHAIR4b,"label":"Chair4b","location":{"row":chairRow_4b,"col":chairCol_4b},"state":IDLE},
  {"type":CHAIR4c,"label":"Chair4c","location":{"row":chairRow_4c,"col":chairCol_4c},"state":IDLE},
  {"type":CHAIR4d,"label":"Chair4d","location":{"row":chairRow_4d,"col":chairCol_4d},"state":IDLE},
  {"type":CHAIR5a,"label":"Chair5a","location":{"row":chairRow_5a,"col":chairCol_5a},"state":IDLE},
  {"type":CHAIR5b,"label":"Chair5b","location":{"row":chairRow_5b,"col":chairCol_5b},"state":IDLE},
  {"type":CHAIR5c,"label":"Chair5c","location":{"row":chairRow_5c,"col":chairCol_5c},"state":IDLE},
  {"type":CHAIR5d,"label":"Chair5d","location":{"row":chairRow_5d,"col":chairCol_5d},"state":IDLE},
  {"type":CHAIR6a,"label":"Chair6a","location":{"row":chairRow_6a,"col":chairCol_6a},"state":IDLE},
  {"type":CHAIR6b,"label":"Chair6b","location":{"row":chairRow_6b,"col":chairCol_6b},"state":IDLE},
  {"type":CHAIR6c,"label":"Chair6c","location":{"row":chairRow_6c,"col":chairCol_6c},"state":IDLE},
  {"type":CHAIR6d,"label":"Chair6d","location":{"row":chairRow_6d,"col":chairCol_6d},"state":IDLE},
];


// The probability of a customer arrival needs to be less than the probability of a departure, else an infinite queue will build.
// You also need to allow travel time for customers to move from their seat in the waiting room to get close to the cashier.
// So don't set probDeparture too close to probArrival.
var probArrival = 0.2;
var probOrdered = 0.9;
var probEaten = 0.01;
var probNoDrinks = 0.6;
var probDrinks = 0.9;
var probEntrycondition = 1;

// We can have different types of customers (A and B) according to a probability, probTypeA.
// This version of the simulation makes no difference between A and B customers except for the display image
// Later assignments can build on this basic structure.


// To manage the queues, we need to keep track of customerIDs.
var nextcustomerID_A = 0; // increment this and assign it to the next admitted customer of type A // increment this and assign it to the next admitted customer of type B
var nextorderingcustomerID_A = 1; //this is the id of the next customer of type A to be EATING by the cashier //this is the id of the next customer of type B to be EATING by the cashier


// declarations of waiting room
var EMPTY = 0;
var OCCUPIED = 1;

var waitingSeats = [];

var seatCount = 8;

// This next function is executed when the script is loaded. It contains the page initialization code.
(function() {
	// Your page initialization code goes here
	// All elements of the DOM will be available here
	window.addEventListener("resize", redrawWindow); //Redraw whenever the window is resized
	simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds
	document.getElementById("title").textContent = "Pokemon Alfresco Restaurant Simulation";
	redrawWindow();
})();

// We need a function to start and pause the the simulation.
function toggleSimStep(){
	//this function is called by a click event on the html page.
	// Search BasicAgentModel.html to find where it is called.
	isRunning = !isRunning;
	console.log("isRunning: "+isRunning);
}

function redrawWindow(){
	isRunning = false; // used by simStep
	window.clearInterval(simTimer); // clear the Timer
	animationDelay = 200 - document.getElementById("slider1").value;
	simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds

	// Re-initialize simulation variables

	nextCustomerID_A = 0;
	nextorderingCustomerID_A =1;
	currentTime = 0;
	cashier.state=IDLE;
	statistics[0].cumulativeValue=0;
	statistics[0].count=0;
	statistics[1].cumulativeValue=0;
	statistics[1].count=0;
	statistics[2].cumulativeValue=0;
	statistics[2].count=0;
	customers = [];


	//resize the drawing surface; remove all its contents;
	var drawsurface = document.getElementById("surface");
	var creditselement = document.getElementById("credits");
	var w = window.innerWidth;
	var h = window.innerHeight;
	var surfaceWidth =(w - 3*WINDOWBORDERSIZE);
	var surfaceHeight= (h-creditselement.offsetHeight - 3*WINDOWBORDERSIZE);


	drawsurface.style.width = surfaceWidth+"px";
	drawsurface.style.height = surfaceHeight+"px";
	drawsurface.style.left = WINDOWBORDERSIZE/2+'px';
	drawsurface.style.top = WINDOWBORDERSIZE/2+'px';
	//drawsurface.style.border = "thick solid #0000FF"; //The border is mainly for debugging; okay to remove it
	drawsurface.innerHTML = ''; //This empties the contents of the drawing surface, like jQuery erase().

	// Compute the cellWidth and cellHeight, given the size of the drawing surface
	numCols = maxCols;
	numRows = maxRows;
	cellWidth = surfaceWidth/numCols;
	numRows = Math.ceil(surfaceHeight/cellWidth);
	cellHeight = surfaceHeight/numRows;

	//waitingSeats = []

	waitingSeats = Array.apply(null,{length:seatCount}).map(Function.call,Number);

	//Now use the map function to replace each element of waitingSeats with an object identifying the row, column and state of the seat
	waitingSeats = waitingSeats.map(function(d,i){var state = EMPTY;
		var row = waitingRoom.startRow;
		var col = waitingRoom.startCol + i - (row-waitingRoom.startRow)*waitingRoom.numCols;
		var waitingseatnum = i;
		return {"row":row, "col":col,"state":state, "waitingseatnum":waitingseatnum};
	});

	//waitingSeats.state = EMPTY

	// In other functions we will access the drawing surface using the d3 library.
	//Here we set the global variable, surface, equal to the d3 selection of the drawing surface
	surface = d3.select('#surface');
	surface.selectAll('*').remove(); // we added this because setting the inner html to blank may not remove all svg elements
	surface.style("font-size","100%");
	surface.style("font-colour","white");
	// rebuild contents of the drawing surface

	updateSurface();
};

// The window is resizable, so we need to translate row and column coordinates into screen coordinates x and y
function getLocationCell(location){
	var row = location.row;
	var col = location.col;
	var x = (col-1)*cellWidth; //cellWidth is set in the redrawWindow function
	var y = (row-1)*cellHeight; //cellHeight is set in the redrawWindow function
	return {"x":x,"y":y};
}

function updateSurface(){
	// This function is used to create or update most of the svg elements on the drawing surface.
	// See the function removeDynamicAgents() for how we remove svg elements

	//Select all svg elements of class "customer" and map it to the data list called
	var allcustomers = surface.selectAll(".customer").data(customers);

	// If the list of svg elements is longer than the data list, the excess elements are in the .exit() list
	// Excess elements need to be removed:
	allcustomers.exit().remove(); //remove all svg elements associated with entries that are no longer in the data list
	// (This remove function is needed when we resize the window and re-initialize the customers array)

	// If the list of svg elements is shorter than the data list, the new elements are in the .enter() list.
	// The first time this is called, all the elements of data will be in the .enter() list.
	// Create an svg group ("g") for each new entry in the data list; give it class "customer"
	var newcustomers = allcustomers.enter().append("g").attr("class","customer");
	//Append an image element to each new customer svg group, position it according to the location data, and size it to fill a cell
	// Also note that we can choose a different image to represent the customer based on the customer type
	newcustomers.append("svg:image")
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
	 .attr("width", Math.min(cellWidth,cellHeight)+"px")
	 .attr("height", Math.min(cellWidth,cellHeight)+"px")
	 .attr("xlink:href",function(d){if (d.character=="squirtle") return urlSquirtle; else if (d.character == "pikachu") return urlPikachu; else if (d.character == 'charmander') return urlCharmander; else if (d.character == 'bulbasaur') return urlBulbasaur; else return urlEevee});

	// For the existing customers, we want to update their location on the screen
	// but we would like to do it with a smooth transition from their previous position.
	// D3 provides a very nice transition function allowing us to animate transformations of our svg elements.

	//First, we select the image elements in the allcustomers list
	var images = allcustomers.selectAll("image");
	// Next we define a transition for each of these image elements.
	// Note that we only need to update the attributes of the image element which change
	images.transition()
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
	 .duration(animationDelay).ease('linear'); // This specifies the speed and type of transition we want.

	// customers will leave the clinic when they have been EATEN.
	// That will be handled by a different function: removeDynamicAgents

	//Select all svg elements of class "staticmember" and map it to the data list called staticmembers
	var allstaticmembers = surface.selectAll(".staticmember").data(staticmembers);
	//This is not a dynamic class of agents so we only need to set the svg elements for the entering data elements.
	// We don't need to worry about updating these agents or removing them
	// Create an svg group ("g") for each new entry in the data list; give it class "staticmember"
	var newstaticmembers = allstaticmembers.enter().append("g").attr("class","staticmember");
	newstaticmembers.append("svg:image")
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
	 .attr("width", Math.min(cellWidth,cellHeight)+"px")
	 .attr("height", Math.min(cellWidth,cellHeight)+"px")
	 .attr("xlink:href",function(d){if (d.type==CASHIER) return urlCashier; if (d.type==DRINKMACHINE) return urlDrinksdispenser; if (d.type == ENTRANCE) return urlEntrance; else return urlEntrance;});

	// It would be nice to label the staticmembers, so we add a text element to each new staticmember group
	newstaticmembers.append("text")
    .attr("x", function(d) { var cell= getLocationCell(d.location); return (cell.x+cellWidth)+"px"; })
    .attr("y", function(d) { var cell= getLocationCell(d.location); return (cell.y+cellHeight/2)+"px"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.label; });

	// The simulation should serve some purpose
	// so we will compute and display the average length of stay of each customer type.
	// We created the array "statistics" for this purpose.
	// Here we will create a group for each element of the statistics array (two elements)
	var allstatistics = surface.selectAll(".statistics").data(statistics);
	var newstatistics = allstatistics.enter().append("g").attr("class","statistics");
	// For each new statistic group created we append a text label
	newstatistics.append("text")
	.attr("x", function(d) { var cell= getLocationCell(d.location); return (cell.x+cellWidth)+"px"; })
    .attr("y", function(d) { var cell= getLocationCell(d.location); return (cell.y+cellHeight/2)+"px"; })
    .attr("dy", ".35em")
    .text("");

	// The data in the statistics array are always being updated.
	// So, here we update the text in the labels with the updated information.
	allstatistics.selectAll("text").text(function(d) {
		var avgLengthOfStay = d.cumulativeValue/(Math.max(1,d.count)); // cumulativeValue and count for each statistic are always changing
		return d.name+avgLengthOfStay.toFixed(1); }); //The toFixed() function sets the number of decimal places to display

	// Finally, we would like to draw boxes around the different areas of our system. We can use d3 to do that too.
	var allareas = surface.selectAll(".areas").data(areas);
	var newareas = allareas.enter().append("g").attr("class","areas");
	// For each new area, append a rectangle to the group
	//newareas.append("rect")
	//.attr("x", function(d){return (d.startCol-1)*cellWidth;})
	//.attr("y",  function(d){return (d.startRow-1)*cellHeight;})
	//.attr("width",  function(d){return d.numCols*cellWidth;})
	//.attr("height",  function(d){return d.numRows*cellWidth;})
	//.style("fill", function(d) { return d.color; })
	//.style("stroke","black")
	//.style("stroke-width",1);

	//For this simulation we will display an empty seat for each cell in the waiting area
	var allseats = surface.selectAll(".seats").data(waitingSeats);
	var newseats = allseats.enter().append("g").attr("class","seats");

	//For each new seat, append a chair image
	/*newseats.append("svg:image")
	.attr("x",function(d){var cell = getLocationCell(d); return cell.x+"px"})
	.attr("y",function(d){var cell = getLocationCell(d); return cell.y+"px"})
	.attr("width",Math.min(cellWidth *2,cellHeight*2)+"px")
	.attr("height",Math.min(cellWidth,cellHeight)+"px")
	.attr("xlink:href",urlChair);*/

  //////////////  Tables
	var alltables = surface.selectAll(".tables").data(tablesIN);
 	//This is not a dynamic class of agents so we only need to set the svg elements for the entering data elements.
 	// We don't need to worry about updating these agents or removing them
 	// Create an svg group ("g") for each new entry in the data list; give it class "staticmember"
 	var newtables = alltables.enter().append("g").attr("class","tables");

 	newtables.append("svg:image")
 	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
 	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
 	 .attr("width", Math.min(cellWidth *2,cellHeight*2)+"px")
 	 .attr("height", Math.min(cellWidth *2,cellHeight*2)+"px")
 	 .attr("xlink:href",function(d){return urlTable});

   ////////////// Chairs
  var allchairs = surface.selectAll(".chairs").data(chairsIN);
 	var newchairs = allchairs.enter().append("g").attr("class","chairs");

 	newchairs.append("svg:image")
 	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
 	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
 	 .attr("width", Math.min(cellWidth,cellHeight)+"px")
 	 .attr("height", Math.min(cellWidth,cellHeight)+"px")
 	 .attr("xlink:href", urlChair);

}


function addDynamicAgents(){
	// customers are dynamic agents: they enter the clinic, wait, get EATING, and then leave
	// We have entering customers of two types "A" and "B"
	// We could specify their probabilities of arrival in any simulation step separately
	// Or we could specify a probability of arrival of all customers and then specify the probability of a Type A arrival.
	// We have done the latter. probArrival is probability of arrival a customer and probTypeA is the probability of a type A customer who arrives.
	// First see if a customer arrives in this sim step.
	if (Math.random()< probArrival){
		var newcustomer = {"id":1,"type":"A","location":{"row":25,"col":20}, "seatNum":null, "character":'bulbasaur',
		"target":{"row":entranceRow,"col": entranceCol},"state":UNORDERED,"timeAdmitted":0};
		if (Math.random()<probEntrycondition) newcustomer.type = "A";
		//else newcustomer.type = "B";

		var characterNum = Math.floor(Math.random() * characters.length);
		newcustomer.character = characters[characterNum];

		customers.push(newcustomer);
	}

}

function updateCustomer(customerIndex){
	//customerIndex is an index into the customers data array
	customerIndex = Number(customerIndex); //it seems customerIndex was coming in as a string
	var customer = customers[customerIndex];
	// get the current location of the customer
	var row = customer.location.row;
	var col = customer.location.col;
	var type = customer.type;
	var state = customer.state;




	// determine if customer has arrived at destination
	var hasArrived = (Math.abs(customer.target.row-row)+Math.abs(customer.target.col-col))==0;

	// Behavior of customer depends on his or her state
	switch(state){
		case UNORDERED:
			if (hasArrived){
				customer.timeAdmitted = currentTime;
				statistics[2].count++; // number of customers who have arrived at entrance
				// pick a random spot in the waiting area to queue
				var emptySeats = waitingSeats.filter(function(d){return d.state==EMPTY;});

				if (emptySeats.length>0){

					customer.state = WAITING;
					var emptySeat = emptySeats[Math.floor(Math.random()*emptySeats.length)];
					//var emptySeatNum = Math.max.apply(Math, emptySeats.map(function(o) { return o.waitingseatnum; }))
					//var emptySeat = emptySeats.filter(function(d){return d.waitingseatnum==emptySeatNum;});
					emptySeat.state=OCCUPIED;
					customer.target.row = emptySeat.row;
					customer.target.col = emptySeat.col;
					// entrance assigns a sequence number to each admitted customer to govern order of treatment
					if (customer.type=="A") customer.id = ++nextcustomerID_A;

				} else {
					// There are no empty seats. We must reject this customer.
					customer.state = REJECTED;
					customer.target.row = 20;
					customer.target.col = 17;
					statistics[2].cumulativeValue = (statistics[2].cumulativeValue + 1*100); // count of rejected customers in percentage terms
          var percentagerejected = statistics[2].cumulativeValue/statistics[2].count;
          //console.log(percentagerejected);
          //console.log(statistics[1].count)
				}
			}

		break;
		case WAITING:
			var emptySeatRow = 0;
			var emptySeatCol = 0;
			switch (type){

				case "A":
					if (customer.id == nextorderingcustomerID_A){
						emptySeatRow = customer.target.row
						emptySeatCol = customer.target.col
						customer.target.row = cashierRow;
						customer.target.col = cashierCol-2;
						customer.state = STAGING;

					}

				break;

				}
				//create
				var newEmptySeat = waitingSeats.filter(function(d){return d.row == emptySeatRow && d.col == emptySeatCol})
				if (newEmptySeat.length >0) newEmptySeat[0].state = EMPTY;

		break;
		case STAGING:
			// Queueing behavior depends on the customer priority
			// For this model we will give access to the cashier on a first come, first served basis
			if (hasArrived){
				//The customer is staged right next to the cashier
				if (cashier.state == IDLE){
					// the cashier is IDLE so this customer is the first to get access
					cashier.state = BUSY;
					customer.state = ORDERING;
					customer.target.row = cashierRow;
					customer.target.col = cashierCol-1;
					if (customer.type == "A") nextorderingcustomerID_A++;
				}
			}
		break;
		case ORDERING:
			// Complete treatment randomly according to the probability of departure

			if (Math.random()< probOrdered){
				var availableseats = chairsIN.filter(function(d){return d.state==IDLE});
				if(availableseats.length != 0){
				var chairNum = Math.floor(Math.random() * availableseats.length);
				cashier.state = IDLE;
				var chairType = availableseats[chairNum].type
				chairsIN[chairType].state = BUSY;
				customer.seatNum = chairType;
				customer.target.row = customer.location.row - 1;
				customer.target.col = customer.location.col;
				customer.state = ORDERED;
				var timeInQueue = currentTime - customer.timeAdmitted;
        console.log("Time in Queue: " + timeInQueue)
				statistics[1].cumulativeValue = statistics[1].cumulativeValue+timeInQueue;
				statistics[1].count = statistics[1].count + 1;
				}
			}

		break;

		case ORDERED:
		if (hasArrived) {
			if (Math.random() <probNoDrinks){
				customer.state = EATING;
				targetChair = customer.seatNum;
				customer.target.row = chairsIN[targetChair].location.row;
				customer.target.col = chairsIN[targetChair].location.col;
			}

			else{
				customer.state = ORDERING2;
				customer.target.row = drinkdispenserRow;
				customer.target.col = drinkdispenserCol -1;
			}
			}
		break;


		case ORDERING2:
			if (hasArrived){
				if (Math.random()<probDrinks){
				customer.state = EATING;
				targetChair = customer.seatNum;
				customer.target.row = chairsIN[targetChair].location.row;
				customer.target.col = chairsIN[targetChair].location.col;
				}
			}
		break;

		case EATING:
			if (hasArrived){
				if (Math.random()< probEaten){
				customer.state = EATEN;
				customer.target.row = entranceRow -1;
				customer.target.col = entranceCol;
				// compute statistics for EATEN customer

			}
			}
		break;
		case EATEN:
			if (hasArrived){
				customer.state = EXITED;
				var timeInRestaurant = currentTime - customer.timeAdmitted;
        //console.log("Time in Restaurant: " + timeInRestaurant)
				var stats = statistics[0];
				stats.cumulativeValue = stats.cumulativeValue+timeInRestaurant;
				stats.count = stats.count + 1;
				customer.target.row = maxRows;
				customer.target.col = entranceCol;
				if (customer.seatNum != null){
				chairsIN[customer.seatNum].state = IDLE;
			}
		}
		break;
		case REJECTED:
			if (hasArrived){
				customer.state = EXITED;
			}
			break;

		default:
		break;
	}
	// set the destination row and column
	var targetRow = customer.target.row;
	var targetCol = customer.target.col;
	// compute the distance to the target destination
	var rowsToGo = targetRow - row;
	var colsToGo = targetCol - col;
	// set the speed
	var cellsPerStep = 1;
	// compute the cell to move to
	var newRow = row + Math.min(Math.abs(rowsToGo),cellsPerStep)*Math.sign(rowsToGo);
	var newCol = col + Math.min(Math.abs(colsToGo),cellsPerStep)*Math.sign(colsToGo);
	// update the location of the customer
	customer.location.row = newRow;
	customer.location.col = newCol;

}

function removeDynamicAgents(){
	// We need to remove customers who have been EATEN.
	//Select all svg elements of class "customer" and map it to the data list called customers
	var allcustomers = surface.selectAll(".customer").data(customers);
	//Select all the svg groups of class "customer" whose state is EXITED
	var eatencustomers = allcustomers.filter(function(d,i){return d.state==EXITED;});
	// Remove the svg groups of EXITED customers: they will disappear from the screen at this point
	eatencustomers.remove();

	// Remove the EXITED customers from the customers list using a filter command
	customers = customers.filter(function(d){return d.state!=EXITED;});
	// At this point the customers list should match the images on the screen one for one
	// and no customers should have state EXITED
}


function updateDynamicAgents(){
	// loop over all the agents and update their states
	for (var customerIndex in customers){
		updateCustomer(customerIndex);
	}
	updateSurface();
}

function simStep(){
	//This function is called by a timer; if running, it executes one simulation step
	//The timing interval is set in the page initialization function near the top of this file
	if (isRunning){ //the isRunning variable is toggled by toggleSimStep
		// Increment current time (for computing statistics)
		currentTime++;
		// Sometimes new agents will be created in the following function
		addDynamicAgents();
		// In the next function we update each agent
		updateDynamicAgents();
		// Sometimes agents will be removed in the following function
		removeDynamicAgents();
	}
}
