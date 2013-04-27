// 
//  InteractiveScene.js
//  Assets
//  
//  Created by Gareth Bushell on 2011-01-20.
//  Copyright 2011 fayju. All rights reserved.
// 
// 
class InteractiveScene extends MonoBehaviour{
	//public variables
	var mainCamera:Transform;
	var syncCameras:boolean = true;//for background etc
	var interfaceRayCastmanager:RayCastManager; //for interface layers via the interfaceCamera
	var mainRayCastManager:RayCastManager; //for objects in space via the main camera 
	var useSceneRayCast:boolean = false;//are we detecting interaction on objects in the scene as well as interface

 
	protected var GameReady:boolean = false;
	protected var excessTouches:int = 0;

	private var forceStartGame:boolean = false;
	private var gameStartCount:int = 0;
	private var framewait:int = 1;
	
	//accelerometer
	protected var accel:Vector3;
	protected var calibrationMatrix : Matrix4x4;
	//gamestates
	protected var isPaused:boolean = false;
	protected var gameOver:boolean = false;
	protected 	var useInterface:boolean = true;
	
	// =====================
	// = LOADING FUNCTIONS =
	// =====================
	//the scene may need to load from the resouces folder
	function OnResourceLoaded(notification: Notification):void{
		Debug.Log("reoursces loaded");
			///so this would be intercepted
	 		StartPostLoad();
		  	forceStartGame = true;
	}
	function StartGameReady():void{
		if(gameStartCount > framewait){
			Debug.Log("start everything");
			//this dispatches to all listeners that they can go ahead and sort their start routines
		 //	NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnStartGameReady");
			//hide loading display (iphone only)
			#if UNITY_IPHONE
			//EtceteraBinding.hideActivityView();
			#endif
		 	GameReady = true;
		}else{
			gameStartCount++;
		}
	}
	function Awake():void{
		//listen for any resources that need to be loaded
		NotificationCenter.DefaultCenter().AddObserver(gameObject, "OnGameEnded");
		// /NotificationCenter.DefaultCenter().AddObserver(gameObject, "OnGameOver");
		
		calibrateAccelerometer ();
		//find the main camera
	
	
		//if waiting for things to load
	//	NotificationCenter.DefaultCenter().AddObserver(gameObject, "OnResourceLoaded");
		//else
	 //	StartPostLoad();
	  //	forceStartGame = true;

	}
	function StartPostLoad():void{
		
			var mainCam:GameObject = Definitions.GetInstance().MainCamera();
			if(mainCam != null){
				mainCamera = mainCam.transform;
			}else{

			}
			
			if(mainCamera != null){

				if(useSceneRayCast){
					mainRayCastManager = mainCam.GetComponent(RayCastManager) as RayCastManager;
					if(!mainRayCastManager){
						mainRayCastManager = mainCam.AddComponent(RayCastManager) as RayCastManager;
					}
					mainRayCastManager.layerMask =   1 << 11;//default
				//	mainRayCastManager.swipeController = Definitions.GetInstance().GetSwipeController();
					//	mainRayCastManager.layerMask  = ~mainRayCastManager.layerMask;
					useSceneRayCast = false; 

				}
			}
	
		//we may have had to load this in
		var ui:GameObject = Definitions.GetInstance().InterfaceCamera();
		if(ui == null){
			Debug.Log("WARNING :: NO Interface camera ");
			//ui = new GameObject("InterfaceCamera");
			//interfaceRayCastmanager = ui.AddComponent(RayCastManager) as RayCastManager;
			//set default level
		}else{
			interfaceRayCastmanager = ui.GetComponent(RayCastManager) as RayCastManager;
		}
		if(interfaceRayCastmanager){
			interfaceRayCastmanager.layerMask = 1 << 8 | 1 << 9;
		}else{
			useInterface = false;
		}
		
		
		forceStartGame = true;
	}
	// =========================
	// = APPLICATION FUNCTIONS =
	// =========================
	function OnApplicationPause(tempBool:boolean):void{
		if(tempBool){
		
		}else{
			
		//isPaused = false;
		}
	}
	
	// ========================
	// = GAME UPDATE FUNCTION =
	// ========================
	function ProcessTouches():void{

		//gather touches
	 
		var remainingTouches:ProxyTouch[] =ProxyTouchManager.DefaultManager().touches();;//Input.touches;

		//distribute to raycasters
		if(useInterface){
			remainingTouches = interfaceRayCastmanager.updateTouch(remainingTouches ); 
		}
		if(useSceneRayCast && !gameOver){
			if(mainRayCastManager){
				remainingTouches = mainRayCastManager.updateTouch(remainingTouches);
			}
		}

		ProxyTouchManager.DefaultManager().setTouches(remainingTouches);
		excessTouches =0;
		//remaining begin touches
		for(var rt:ProxyTouch in remainingTouches){
			if(rt.phase == ProxyTouchPhase.Began){
				excessTouches++;
			}
		}
		
	}
	function FixedUpdate(){
			if(GameReady){
				
			}
	}	
	function LateUpdate(){
			//background camera must follow 
			if(GameReady){
				if(mainCamera != null){
					//update camera coods if needed (eg sync with bg cam)
				}
	
			}
	}
	function Update():void{
		//orientation stuff
	
		EnvironmentCenter.DefaultCenter().orientateDevice();
		ProcessTouches();
		if(GameReady){

	  	}else{
			if(forceStartGame){
				StartGameReady();
			}
		}
	}
	
	// =======================
	// = GAME OVER FUNCTIONS =
	// =======================
	function OnGameEnded(){
	 
			if(!gameOver){
				//update score 
				 
					gameOver = true;	
				}
	}
	function OnGameOver():void{
		//is there a delay?
	//	actualGameOver();
	}
	function actualGameOver():void{
		if(!gameOver){
			//update score 
				GameReady = false;
			 	Invoke("goNextScene", 1.0);
				endGame();
				gameOver = true;	
			}
		
	}
	function endGame():void{
		
	}
	function goNextScene():void{
	}
	
	// ===========================
	// = ACCELEROMETER FUNCTIONS =
	// ===========================
	function processAccelerometer():Vector3{
			var accel: Vector3 = Input.acceleration;
			accel.Normalize();

			var newAccel:Vector3 = getAccelerometer(accel) ;//rectifyAcceleration*accel;
			//cameraController.updateAccelerometer(newAccel, cameraDummy, cameraTransform);
			return newAccel;

	}
	function calibrateAccelerometer () { 
		//commit this to player prefs
	   var wantedDeadZone : Vector3 =Vector3(-0.7, -0, -0.7);//Input.acceleration;//Vector3(0,-1,0);//Input.acceleration; 0,-0.95,-025//Vector3(-0.7, -0, -0.7);//I
	  	print("deadzone :"+wantedDeadZone.x+" "+wantedDeadZone.y +" "+wantedDeadZone.z);
		createCalibrationMatrix(wantedDeadZone);

	} 
	function createCalibrationMatrix(wantedDeadZone:Vector3):void{
		var rotateQuaternion : Quaternion = Quaternion.FromToRotation(new Vector3(0.0, 0.0, -1.0), wantedDeadZone); 

	   //create identity matrix ... rotate our matrix to match up with down vec 
	   var matrix : Matrix4x4 = Matrix4x4.TRS(Vector3.zero, rotateQuaternion, new Vector3(1.0, 1.0, 1.0)); 

	   //get the inverse of the matrix 
	   calibrationMatrix = matrix.inverse;
	}

	//Whenever you need an accelerator value from the user 
	//call this function to get the 'calibrated' value 
	function getAccelerometer (accelerator : Vector3) { 
			var qrot:Quaternion;
	   var accel : Vector3;
			//qrot = Quaternion.AngleAxis(270, Vector3(0,0,1));
			//qrot*
				accel = calibrationMatrix.MultiplyVector(accelerator);
	/*
		switch(	iPhoneSettings.screenOrientation ){
				case iPhoneScreenOrientation.LandscapeLeft:
				accel =calibrationMatrix.MultiplyVector(accelerator); 
		 		break;
				case iPhoneScreenOrientation.LandscapeRight:
					qrot = Quaternion.AngleAxis(180, Vector3(0,0,1));
					accel = qrot*calibrationMatrix.MultiplyVector(accelerator); 
				break;
				case iPhoneScreenOrientation.Portrait:
					qrot = Quaternion.AngleAxis(270, Vector3(0,0,1));
						accel = qrot*calibrationMatrix.MultiplyVector(accelerator);
				break;
				case iPhoneScreenOrientation.PortraitUpsideDown:
					qrot = Quaternion.AngleAxis(90, Vector3(0,0,1));
						accel = qrot*calibrationMatrix.MultiplyVector(accelerator);
				break;
			}*/
	
	   return accel; 
	}
}