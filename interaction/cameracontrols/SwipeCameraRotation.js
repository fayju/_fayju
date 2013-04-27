#pragma strict
// 
//  SwipeCameraRotation.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-07-31.
//  Copyright 2012 fayju. All rights reserved.
// 

class SwipeCameraRotation extends InteractiveGameObject{
	
		private var gatheredMomentum:Vector2 = Vector2(0,0);
		//screen denity?
		private var cam:Camera;
		private var screenDensity:Vector2;
		
		
		 

		private var zoomDelta:float = 0;
		private var spinDelta:float = 0;

		private var pinchDelta:float = 0;
		private var pinchAngleDelta:float;
		private var controlTouch:ProxyTouch;
		private var pinchGap:float = -1;
		private var pinchVector:Vector2 = Vector2(0,0);
		private var pinchActive:boolean = false;
		
		function Start(){
			super.Start();
			//ScreenDensity
	 
				screenDensity = Vector2(960.0,640.0);
				//change with orientation
		 
		}
 		function pinchAndTurn():boolean{
					var remainingTouches:ProxyTouch[] =ProxyTouchManager.DefaultManager().getTouches();
					pinchActive = false;
					var useTouch:boolean = false;

					//pinch and top rotation
					useTouch  =  true;//!Application.isEditor;


					if(!useTouch){
						//use the input axis

						spinDelta = Input.GetAxis("Horizontal");
						zoomDelta = -Input.GetAxis("Vertical")*20.0;
						if(spinDelta != 0 || zoomDelta != 0){
							pinchActive = true;
						}
					}else{

						if(remainingTouches && controlTouch){
							if(remainingTouches.Length >= 1){
									var evt:ProxyTouch = remainingTouches[0];
									//Debug.Log(remainingTouches.Length +"  fid "+evt.fingerId +" "+ controlTouch.fingerId);
									//this means that we have a spare touch, it can be used for zoom

							 	if(evt.fingerId != controlTouch.fingerId){//make sure its not the same one
									var pos2:Vector2 = Vector2(evt.position.x/Screen.width,evt.position.y/Screen.height );
									var pos1:Vector2 = Vector2(controlTouch.position.x/Screen.width,controlTouch.position.y/Screen.height );
									pos1.x = pos1.x*960.0;
									pos1.y = pos1.y*640.0;

									pos2.x = pos2.x*960.0;
									pos2.y = pos2.y*640.0;

									var newPinchGap:float = Vector2.Distance(pos2, pos1) ;
									if(pinchGap == -1){
										pinchDelta = 0;
									}else{
										pinchDelta = -(-pinchGap + newPinchGap)*0.1;
									}

									pinchGap = newPinchGap;
									//the delta must cross a threashold to activate a zoom;
									//calculate the angle change 
									var newPinchVector:Vector2 =  -controlTouch.position + evt.position;
									newPinchVector.Normalize();
									if(pinchVector.magnitude > 0){
										pinchAngleDelta = Vector2.Angle(pinchVector, newPinchVector );	
									}else{
										pinchAngleDelta = 0;
									}
									pinchVector = newPinchVector;
									if(pinchAngleDelta > 10 || pinchAngleDelta < -10){
										pinchDelta = 0;
									}
									pinchActive = true;
								}
							}

							if(!pinchActive){
								pinchGap = -1;//no pinching
								pinchDelta = 0;
								pinchAngleDelta = 0;
								pinchVector = Vector2(0,0);
							}

							spinDelta = pinchAngleDelta;//Mathf.Clamp(pinchAngleDelta, -1.0, 1.0);

							var minDelta:float =10;
							if(pinchDelta > minDelta*Time.deltaTime || pinchDelta < -minDelta*Time.deltaTime){

									var targ:float = pinchDelta < 0 ? -pinchDelta : pinchDelta ;//Mathf.Clamp(pinchDelta, -1.0, 1.0);
									targ = pinchDelta - minDelta*Time.deltaTime;
								//	targ = Mathf.Clamp(targ, -1, 1);
									zoomDelta =targ*20.0;// zoomDelta +(-zoomDelta + targ)*0.1*Time.deltaTime;
							}else{
								zoomDelta =0;// zoomDelta +(-zoomDelta)*0.1*Time.deltaTime ;
							}
						}
					}
					return pinchActive;
		}
		
		// =====================
		// = INTERACTION STUFF =
		// =====================
		
		function GetCameraInteraction():Vector2{
			
			return gatheredMomentum;
		}
		function onBeginTouch(io:InteractionObject):void{
				gatheredMomentum.x = 0;
				gatheredMomentum.y = 0;
				controlTouch = io.evt;
		 
		}
		function onMoveTouch(io:InteractionObject):void{
			 
				var deltapos:Vector2 = Vector2(io.evt.deltaPosition.x/Screen.width*1.0,io.evt.deltaPosition.y/Screen.height*1.0);
				gatheredMomentum.x = deltapos.x*screenDensity.x*0.1;///(io.evt.deltaTime);
				gatheredMomentum.y = deltapos.y*screenDensity.y*0.1;
				gatheredMomentum.x = Mathf.Clamp(gatheredMomentum.x, -1, 1);
				gatheredMomentum.y = Mathf.Clamp(gatheredMomentum.y, -1, 1);
		 
			 	controlTouch = io.evt;

		}
		function onStationaryTouch(io:InteractionObject):void{
				gatheredMomentum.x = 0;
				gatheredMomentum.y = 0;
			controlTouch = io.evt;
		}
		function onLostTouch(io:InteractionObject):void{
				controlTouch = null;
		}
		function onEndTouch(io:InteractionObject):void{
			//open a url
				controlTouch = null;
		}	
		function onCancelTouch(io:InteractionObject):void{
				controlTouch = null;
		}


	// =====================
	// = INTERACTION STUFF =
	// =====================/*
	
}