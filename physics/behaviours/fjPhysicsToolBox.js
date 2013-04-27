#pragma strict
// 
//  fjPhysicsToolBox.js
//  Assets
//  
//  Created by Gareth Bushell on 2013-03-19.
//  Copyright 2013 fayju. All rights reserved.
// 
static var instance:fjPhysicsToolBox;
static function GetInstance():fjPhysicsToolBox{
	if(!instance){
		var go:GameObject = GameObject.Find("_fjPhysicsToolBoxGameObject");
		if(go == null){
			go = new GameObject("_fjPhysicsToolBoxGameObject");
		}
		instance = go.GetComponent(fjPhysicsToolBox);
		if(!instance){
			instance = go.AddComponent(fjPhysicsToolBox);
			instance.deltaPhysics =  Time.deltaTime;
		}
	}

	return instance;
}

/*PHYSICS COMMANDS*/
protected var deltaPhysics:float = 1.0/60.0;
function FixedUpdate(){
	deltaPhysics =  Time.deltaTime;
}
function PointExplosion(pos:Vector3,minRadius:float,radius:float,forceMuliplier:float,duration:float, upwardfact:float){
		var hits:RaycastHit[] =  Physics.SphereCastAll (pos, radius, Vector3(0,1,0),radius);//,layerMask);
		for(var hit:RaycastHit in hits){
			var rb:Rigidbody = hit.rigidbody;
			if(rb){
				if(!rb.isKinematic){
					if(rb.IsSleeping()){
						rb.WakeUp();
					}
					
				 
					
					var explosionVector:Vector3 = -pos + rb.position;
				
				//rb.AddForce(-rb.velocity*rb.mass);
					var dist:float = explosionVector.magnitude;
					
					if(dist < radius + minRadius ){
						
						var dFact:float = 1;
						if(dist > minRadius){
							dFact = Mathf.Sin((90.0*(radius - (dist- minRadius))/radius)*Mathf.Deg2Rad);
						}
					
					  	var massFact:float = rb.mass/200.0;
						massFact = massFact > 1 ? 1.0 : massFact < 0.1 ? 0.1 : massFact;
							explosionVector.y = explosionVector.y + upwardfact*dFact*massFact;
							explosionVector.Normalize();
						StartAddingForce(rb, dFact*forceMuliplier, duration, explosionVector);
						
					}
				}
		 
			}
		
		}
}
function StartAddingForceDecreasing(rb:Rigidbody, force:float, duration:float , throwDirection:Vector3 ){
	
 


	var aForce:Vector3 = throwDirection * 500.0*force;
	var totalCounts:float = duration;
	var counts:float = totalCounts;
	var passed:float = 0;
		while(passed < duration){
		
			if(rb != null){
				passed = passed + deltaPhysics;
				var fact:float =  1 -easeOutExpo(0,duration,passed)/duration;
				rb.AddForce(aForce*fact*deltaPhysics);
			}
			yield new WaitForFixedUpdate();
		}		 
 
}
private function easeOutExpo( start:float, end:float,  value:float):float{
	end -= start;
	return end * (-Mathf.Pow(2, -10 * value / 1) + 1) + start;
}
function StartAddingForce(rb:Rigidbody, force:float, duration:float , throwDirection:Vector3){
	
 


	var aForce:Vector3 = throwDirection * 500.0*force;
	var totalCounts:float = duration;
	var counts:float = totalCounts;
		while(counts > 0){
		
			if(rb != null){
				var fact:float =  (counts/totalCounts);
				counts = counts - deltaPhysics;
	//			 Debug.Log(aForce*fact*deltaPhysics);
				rb.AddForce(aForce*fact*deltaPhysics);
			}
			yield new WaitForFixedUpdate();
		}		 
 
}