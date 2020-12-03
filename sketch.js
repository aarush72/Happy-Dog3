var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedroom,garden,washroom;
var bedroomImage,gardenImage,washroomImage
var gameState

function preload() {
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");

bedroomImage = loadImage("Images/BedRoom.png");
gardenImage = loadImage("Images/Garden.png");
washroomImage = loadImage("Images/WashRoom.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(950,120);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(1050,120);
  addFood.mousePressed(addFoods);

  gameStateRef = database.ref("gameState");
  gameStateRef.on("value",function(data){
    gameState = data.val();
  })

}

function draw() {
  background("lightgreen");
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 50,50);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",50,50);
   }else{
     text("Last Feed : "+ lastFed + " AM", 50,50);
   }

   
   if(gameState !==  "Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
   }
   else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }

   currentTime = hour();

   if(currentTime==(lastFed+1)){
      update("Playing")
     foodObj.garden();
   }
   else if(currentTime==(lastFed+2)){
      update("Sleeping")
      foodObj.bedroom();
   }
   else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing")
   }
   else{
    update("Hungry")
    foodObj.display();
   }

  drawSprites();
}


function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}



function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
database.ref("/").update({
gameState : state
})

}