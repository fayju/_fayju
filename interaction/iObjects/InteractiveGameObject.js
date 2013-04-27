// 
//  InteractiveGameObject.js
//  Assets
//  
//  Created by Gareth Bushell on 2010-10-13.
//  Copyright 2010 fayju. All rights reserved.
// 
class InteractiveGameObject extends MonoBehaviour{
	
	function Start(){

	}
	// =====================
	// = INTERACTION STUFF =
	// =====================
	function grabThisObject(rayCastManager:GameObject){
 		//print("hello");
		rayCastManager.SendMessage("performPickUp", gameObject);
		//inform people
	}
	function onBeginTouch(io:InteractionObject){
 
	}
	function onMoveTouch(io:InteractionObject){
	
	}
	function onLostTouch(io:InteractionObject){
	
	}
	function onStationaryTouch(io:InteractionObject){
	
	}
	function onEndTouch(io:InteractionObject){
		//open a url
	}	
	function onCancelTouch(io:InteractionObject){
	 
	}


// =====================
// = INTERACTION STUFF =
// =====================/*
}