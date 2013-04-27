// 
//  AutoRotation.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-08-02.
//  Copyright 2012 fayju. All rights reserved.
// 
#pragma strict
var rAxis:Vector3 = Vector3(0,1,0);
var initialDelay:float = 0;
var pauseTime:float = 3;
var spinTime:float = 0.2;
var rotationAmount:float = -180;
var forceUpRot:boolean = false;
private var lastRot:float = 0;
private var startRot:float = 0;
private var passTime:float;
private var trans:Transform;
private var rotating:boolean = false;
var yoyo:boolean = false;
var useSinBob:boolean = false;
private var sinh:float = 0.0;
private var middleLoc:float = 0;
var isAnimating:boolean = true;
function Start(){

	if(forceUpRot){
		rAxis = transform.up;
	}
	trans = transform;
	if(useSinBob){
		sinh = 0;
		middleLoc = trans.localPosition.y;
	}
	passTime = Time.time + initialDelay;
	StartCoroutine("performUpdate");
}
function OnDisable(){
	isAnimating = false;
}
function OnEnable(){
//any thing disabled to be re enables
}
function performUpdate(){
	 while(isAnimating){
		var mills:float = Time.time - passTime;
			var passed:float = 0;
			if(rotating){
				passed = mills/spinTime;
				if(passed >= 1){
					passed = 1;
				}
				var yoyoFact:float = passed;
				if(yoyo ){
					yoyoFact = Mathf.Sin(passed*Mathf.PI);
				}
					trans.RotateAround(trans.position, rAxis, -lastRot + startRot + rotationAmount*yoyoFact );
					lastRot = startRot + rotationAmount*yoyoFact;
				if(passed == 1){
					rotating = false;
					passTime = Time.time;
				}
			}else{
					passed = mills/pauseTime;
						if(passed >= 1){
							rotating = true;
							passTime = Time.time;
						}
		
			}
			if(useSinBob){
				sinh = sinh + 1;//Time.deltaTime*60;
				if(sinh > 360){
					sinh = sinh - 360;
				}
			  trans.localPosition.y  = middleLoc+ Mathf.Sin(sinh*Mathf.PI/180.0)*5;
			}
		 yield;
	}
	 
}