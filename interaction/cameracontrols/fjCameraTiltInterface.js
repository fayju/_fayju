// 
//  fjCameraTiltInterface.js
//  Assets
//  
//  Created by Gareth Bushell on 2013-04-22.
//  Copyright 2013 Gareth Bushell. All rights reserved.
// 

class fjCameraTiltInterface extends MonoBehaviour{
	
	var applyTilt:boolean = true;
	private var gyroBool:boolean = false;
	private var useCameraTilt:boolean = false;
	private var gyro:Gyroscope;
	
	var applyGravity:boolean = false;
	private var startGravity: Vector3;
	var gravityFactor : float = 1;
	
	var lookAtTarget:Transform;
	
	var accelUse : float = 1;
	var movementScale:float = 1.0;
 
	protected var lastAcceleration: Vector3;
	protected var accelDelta : Vector3 = Vector3(0,0,0);
	protected var currentAccel:Vector3 = Vector3(0,0,0);
	protected var newGravity:Vector3;
	 
	
	//var bodies:HashArray = new HashArray();
	
	

	
	protected var startCameraLoc:Vector3;
	private var cameraTransform:Transform;
	
	private static var instance : fjCameraTiltInterface;

	static function GetInstance () : fjCameraTiltInterface {
	    // If the defaultCenter doesn't already exist, we need to create it
	    if (!instance) {
	        // Because the NotificationCenter is a component, we have to create a GameObject to attach it to.
			instance = FindObjectOfType(fjCameraTiltInterface);
			if(instance == null){
	       	 var tiltController: GameObject = new GameObject("_fjCameraTiltInterface");
		        // Add the NotificationCenter component, and set it as the defaultCenter
		        instance = tiltController.AddComponent(fjCameraTiltInterface);
			}
			
			
	    }

	    return instance;
	}
	function init(){
		//nothing
	}

	function Start(){
		
		ProxyTouchManager.DefaultManager().startTouching();
			this.useGUILayout = false;
		 	//set up the gyro scope
			gyroBool = SystemInfo.supportsGyroscope;
			if(gyroBool){
			
				gyro = Input.gyro;
				gyro.enabled = true;
			}
			
		   var accel: Vector3 = Input.acceleration;
			lastAcceleration = accel;
				
				
			//get the transform
			cameraTransform = Definitions.GetInstance().MainCamera().transform;
			startCameraLoc = cameraTransform.position;
	
			/* perhaps this should be handled else where 
			Screen.sleepTimeout = SleepTimeout.NeverSleep;//unless in box select or game over
			Screen.orientation = ScreenOrientation.Portrait;
			Screen.autorotateToPortrait = false;
			Screen.autorotateToLandscapeLeft = false;
			Screen.autorotateToLandscapeRight = false;
			Screen.autorotateToPortraitUpsideDown = false;
			*/
			
		  
		 	//Physics.gravity = Vector3(0,-startGravity*gravityFactor, 0);
		 	startGravity = (Physics.gravity)*gravityFactor;
			Physics.gravity = startGravity;
 			newGravity = Physics.gravity;
			
		
			/*
			var rbs : Rigidbody[] = FindObjectsOfType(Rigidbody) as Rigidbody[];
		    for (var body : Rigidbody in rbs) {
		       // if(!body.isKinematic ){
					bodies.Add(body);
			//	}
		    }
		*/
				processAccelerometer();
				updateCamera();
		
			
		}
	/*	function Update () { 
			if ((Input.deviceOrientation != DeviceOrientation.Portrait) || (Screen.orientation != ScreenOrientation.Portrait)){ 
						Screen.orientation = ScreenOrientation.Portrait;
			}
		 
		}*/
	 	function FixedUpdate(){
			processAccelerometer();
			updateCamera();
		}
		function updateCamera(){
			
			 
				if(applyTilt && (gyroBool || Application.isEditor)){
						cameraTransform = Definitions.GetInstance().MainCamera().transform;
					
					if(cameraTransform){//not in boxNavigation
						
							var targetLook: Vector3 = lookAtTarget.position +  Vector3(currentAccel.x*1.5, currentAccel.y*1.5,0)*movementScale; //cameraTransform.position + Vector3(currentAccel.x*3,-30, currentAccel.y*1.0);
							cameraTransform.position = startCameraLoc + Vector3(-currentAccel.x*8, -currentAccel.y*8.0,0)*movementScale; //cameraTransform.position+ (-cameraTransform.position +targetLook)*0.1;;
							cameraTransform.LookAt(targetLook , Vector3(0,1,0));
					}
				}
		}
 		function processAccelerometer(){
				var xRot: float;
				var yRot: float;
			
				
				var accel: Vector3 = Input.acceleration;
					#if UNITY_EDITOR
						var mp:Vector3 = Input.mousePosition;
						mp.x =2*(( mp.x/Screen.width) - 0.5);
						mp.y =2*(( mp.y/Screen.height) - 0.5);
						mp.x = mp.x < -1 ? -1 : mp.x > 1 ? 1: mp.x;
						mp.y = mp.y < -1 ? -1 : mp.y > 1 ? 1: mp.y;
				 
						accel.x = mp.x;
						accel.y = mp.y;
						accel.z = -( 1- 1.7*mp.magnitude/2.0); 
						
					#endif
						 
				//if(lastAcceleration){
			
				accel.Normalize();
				xRot = accel.x;
				yRot = accel.y;
				xRot = xRot > accelUse ? accelUse : xRot;
				xRot = xRot < -accelUse ? -accelUse : xRot;
				yRot = yRot > accelUse ? accelUse : yRot;
				yRot = yRot < -accelUse ? -accelUse : yRot;
					accelDelta = -accel + lastAcceleration;
					var nextAccel:Vector3 = accel;
					if(gyroBool){
	
						if(!Application.isEditor && gyro.enabled){
							accel = gyro.gravity;
						
							accelDelta = -gyro.gravity + lastAcceleration;
							nextAccel = gyro.gravity;
						}
					}
				
				
			
				var accelMag: float = accelDelta.magnitude;
				currentAccel = accel;
				
				
				if(applyGravity){
					newGravity = Vector3(accel.x,accel.y,accel.z);
					newGravity.Normalize();
					Physics.gravity = newGravity*startGravity.magnitude;
				}
				
				 
				lastAcceleration = nextAccel;
		
		
		}

 
}