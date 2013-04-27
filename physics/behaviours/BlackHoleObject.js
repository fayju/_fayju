#pragma strict
// 
//  BlackHoleObject.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-04-27.
//  Copyright 2012 fayju. All rights reserved.
// 

enum BlackHoleMode {REPEL , ATTRACT}
class BlackHoleObject extends MonoBehaviour{
	
	public var radius:float = 8;
	public var strength:float = 10;
	
	public var useTorque:boolean = true;
	public var torqueStrength:float = 10.0;
	
	public var objTransform:Transform;
	public var forceField:Transform;
	public var upVector:Vector3 = Vector3(0,1,0);
	public var fMode:BlackHoleMode = BlackHoleMode.REPEL;
	public var useMassFactor:boolean = false;
	private var cameraTransform:Transform;
 	function Start(){
		if(!objTransform){
			objTransform = transform;
		}
		UpdateCenter.DefaultCenter().addUpdateObject(gameObject);
		cameraTransform = Definitions.GetInstance().MainCamera().transform;
	}
	
	function performUpdate(){
		
		forceFieldLookAtCamera();
		switch(fMode){
			case BlackHoleMode.REPEL:
				doRepell();
			break;
			case BlackHoleMode.ATTRACT:
				doAttract();
			break;
			
		}
		 
	}
	function forceFieldLookAtCamera () {
		if(forceField){
			forceField.LookAt(cameraTransform.position,   Vector3.up);
		}
	}
	
	function doAttract(){
		var hits : RaycastHit[];
	    
	    var p1 : Vector3 = objTransform.position;
	    //var p2 : Vector3 = Vector3(0,1,0);
	     var layerMask = 1 << 0 | 1 << 4 | 1 << 8 | 1 << 13 | 1 << 14;
	    hits = Physics.SphereCastAll (p1, radius, upVector, Mathf.Infinity, layerMask);

	    
	    for (var i = 0;i < hits.Length;i++) {
	        var hit : RaycastHit = hits[i];
	        var rigidbody =  hit.collider.rigidbody;
	        if (rigidbody) {
	           var dist:float = hits[i].distance;
				var fact:float = (radius - dist)/radius;
				fact = Mathf.Clamp(fact, 0,1);
				var diff:Vector3 = -objTransform.position + hits[i].point;
				diff.Normalize();
				if(useMassFactor){
					fact = fact*rigidbody.mass;
				}
				rigidbody.AddForceAtPosition(-diff*strength*fact, hits[i].point,ForceMode.Force);
				
				if(useTorque){
					//get the right angle vector
					var rv:Vector3 = Vector3.Cross(diff, upVector);
				
					rigidbody.AddTorque(-rv*torqueStrength*fact,  ForceMode.Force);
				}
	
	        }
	    }
	}
	function doRepell(){
		var hits : RaycastHit[];
	    
	    var p1 : Vector3 = objTransform.position;
	    //var p2 : Vector3 = Vector3(0,1,0);
	     var layerMask = 1 << 0 | 1 << 4 | 1 << 8 | 1 << 13 | 1 << 14;
	    hits = Physics.SphereCastAll (p1, radius, upVector, Mathf.Infinity, layerMask);

	    
	    for (var i = 0;i < hits.Length;i++) {
	        var hit : RaycastHit = hits[i];
	        var rigidbody =  hit.collider.rigidbody;
	        if (rigidbody) {
	           var dist:float = hits[i].distance;
				var fact:float = (radius - dist)/radius;
				fact = Mathf.Clamp(fact, 0,1);
				var diff:Vector3 = -objTransform.position + hits[i].point;
				diff.Normalize();
						if(useMassFactor){
							fact = fact*rigidbody.mass;
						}
				
				rigidbody.AddForceAtPosition(diff*strength*fact, hits[i].point,ForceMode.Force);
				
				if(useTorque){
					//get the right angle vector
					var rv:Vector3 = Vector3.Cross(diff, upVector);
					rigidbody.AddTorque(rv*torqueStrength*fact,  ForceMode.Force);
				}
	
	        }
	    }
	}


}