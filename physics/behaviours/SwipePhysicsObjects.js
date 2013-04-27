#pragma strict
// 
//  SwipePhysicsObjects.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-07-24.
//  Copyright 2012 fayju. All rights reserved.
// 
//more specifically a ragdoll
class SwipePhysicsObjects extends InteractiveGameObject{
	
	private var gatheredMomentum:Vector2 = Vector2(0,0);
	//screen denity?
	private var cam:Camera;
	private var screenDensity:Vector2;
	
	private var targetBody:Rigidbody;
	function Start(){
		super.Start();
		//ScreenDensity
	 
			screenDensity = Vector2(960,640);
			//change with orientation
		 
	}
	function checkHitObject(pos:Vector2):boolean{
		return false;
		/*
		var cameraObject:GameObject = Definitions.GetInstance().MainCamera();
		if(!cam){
			cam = cameraObject.camera;
		}
	    var ray : Ray = cam.ScreenPointToRay (Vector3(pos.x,pos.y,0));
	 	var hit : RaycastHit;
		var layerMask = 1 << 11;
		    if (Physics.Raycast (ray,hit, 100, layerMask)) {
				//does it have a rigidbody?
				//has it already been swipped?
				if(hit.rigidbody){
					var rb:Rigidbody = hit.rigidbody;
					var strength:float = 10.0;
					if(Application.isEditor){
					//	strength = 1.0;
					}
					var limb:RagDollLimb;// = rb.gameObject.GetComponent(RagDollLimb) as RagDollLimb;
				
					var wasLocked:boolean = false;
			 
						if(limb){
							wasLocked = limb.GetLockedState();
							var xVector:Vector3;
							var yVector:Vector3;
							var throwVector:Vector3;
							if(wasLocked){	
								limb.UnlockBody();
								//we have to break frog here
								xVector = cameraObject.transform.right;
								yVector =cameraObject.transform.up;
								var quart:Quaternion = Quaternion.AngleAxis(45, xVector);
								yVector =  quart*yVector;
								throwVector = (xVector*gatheredMomentum.x  + gatheredMomentum.y*yVector);//.Normalize();
								if(throwVector.magnitude > rb.mass*60){
									 throwVector.Normalize();
									throwVector = throwVector*rb.mass*60;
								}
								//throwVector.Normalize();
								Debug.Log("force aplied "+throwVector+" "+rb.mass+" "+strength);
								rb.AddForceAtPosition( throwVector*rb.mass*strength,hit.point,ForceMode.Force);
								return true;// to say that the swipe has made contact
							}else{
								//here add spin
									xVector = cameraObject.transform.up;
									yVector =cameraObject.transform.right;
									throwVector = (-xVector*gatheredMomentum.x  + gatheredMomentum.y*yVector);
								 rb.AddTorque ( throwVector*rb.mass*strength*900,ForceMode.Force);
								throwVector = (xVector*gatheredMomentum.x  + gatheredMomentum.y*yVector);//.Normalize();
								//throwVector.Normalize();
								rb.AddForceAtPosition( throwVector*rb.mass*strength*0.1,hit.point,ForceMode.Force);
							 
								return true;// to say that the swipe has made contact
							}
						}
				}
		       // var distanceToGround = hit.distance;
		    }
		return false;
		*/
		}
		// =====================
		// = INTERACTION STUFF =
		// =====================

		function onBeginTouch(io:InteractionObject):void{
				gatheredMomentum.x = 0;
				gatheredMomentum.y = 0;
			//	Debug.Log("swipe has started");
		}
		
		function onMoveTouch(io:InteractionObject):void{
				/*//	Debug.Log("swipe has moved");
				var deltapos:Vector2 = Vector2(io.evt.deltaPosition.x/Screen.width,io.evt.deltaPosition.y/Screen.height);
				deltapos = Vector2(deltapos.x*screenDensity.x,deltapos.y*screenDensity.y)/(io.evt.deltaTime);
				gatheredMomentum = gatheredMomentum*0.8 + deltapos*0.2;*/
				
				var deltapos:Vector2 = Vector2(io.evt.deltaPosition.x/Screen.width*1.0,io.evt.deltaPosition.y/Screen.height*1.0);
				gatheredMomentum.x = deltapos.x*screenDensity.x*0.1;///(io.evt.deltaTime);
				gatheredMomentum.y = deltapos.y*screenDensity.y*0.1;
				gatheredMomentum.x = Mathf.Clamp(gatheredMomentum.x, -1, 1);
				gatheredMomentum.y = Mathf.Clamp(gatheredMomentum.y, -1, 1);
				
				
				//do we need to check more than once?
				var minCheckLength:float = 5.0;
				var hitPos:Vector2 =io.evt.position;
				var deltaVector:Vector2 = io.evt.deltaPosition;
				var travelDist:float = deltaVector.magnitude;
				if(travelDist > minCheckLength){
					
				
					var lastPos:Vector2 = hitPos - deltaVector;
					var gaps:int = Mathf.Floor(travelDist/minCheckLength);
					deltaVector.Normalize();
					deltaVector = deltaVector*(minCheckLength);
					var doCheck:boolean = true;
					for(var i:int = 0; i < gaps; i++){
						if(doCheck){
							lastPos = lastPos + deltaVector;
							if(checkHitObject(lastPos)){
								doCheck = false;
								break;
							}
						}
					}
			 		//Debug.Log(travelDist);
				}else{
					//just check the landpos
					checkHitObject(hitPos);
				}
					
			 
		}
		function onLostTouch(io:InteractionObject):void{

		}
		function onStationaryTouch(io:InteractionObject):void{
			gatheredMomentum = gatheredMomentum*0.5;
		}
		function onEndTouch(io:InteractionObject):void{
			//open a url
		}	
		function onCancelTouch(io:InteractionObject):void{

		}


	// =====================
	// = INTERACTION STUFF =
	// =====================/*
	
}