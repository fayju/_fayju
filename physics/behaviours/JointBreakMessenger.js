#pragma strict

var target:GameObject;
function OnJointBreak(breakForce : float) {
       Debug.Log("A joint has just been broken!, force: " + breakForce);
		 if(!target)
		 return;
		 target.SendMessage("OnJointBreak");
  }