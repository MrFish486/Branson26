import * as rapier from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat'
import * as three from 'https://esm.sh/three'
import { OrbitControls } from 'https://esm.sh/three/addons/controls/OrbitControls.js'

var circlePoint = (theta, r) => {
	const x = r * Math.cos(theta);
	const y = r * Math.sin(theta);
	return {x : x, y : y};
}

var global_name;

rapier.init().then(async () => {
	document.getElementById("leave").onclick = async () => {
		await fetch(`/remove.php?name=${name}`);
	}
	let otplayers=[]
	let jumpTime=true
	let playerTheta = Math.PI * 0.5;
	let playerR = 3;
	let playerZ = 5;
	//init world, player
	const canvas=document.getElementById("canvas")
	const world = new rapier.World({x:0,y:-9.81,z:0})
	const ground=rapier.ColliderDesc.cuboid(20,2,20)
	world.createCollider(ground)
	const scene=new three.Scene()
	const renderer=new three.WebGLRenderer({antialais:true,canvas:canvas})
	renderer.setSize(canvas.clientWidth,canvas.clientHeight,false)
	const camera=new three.PerspectiveCamera(75,2,0.1,100)
	const light = new three.DirectionalLight(0xFFFFFF,6)
	light.position.set(0,20,5)
	const Alight = new three.AmbientLight(0x404040, 5)
	camera.position.set(3, 3, 3)

	scene.add(light,Alight)
	const textureLoader=new three.TextureLoader()
	const wallTexture=textureLoader.load('/assets/wall.png')
	const wall=new three.MeshBasicMaterial({map:wallTexture})

	const wall1=rapier.ColliderDesc.cuboid(20,10,2)
	wall1.setTranslation(0,10,20)

	const wall1Geo=new three.BoxGeometry(40,20,4)
	const wall1Mesh=new three.Mesh(wall1Geo,wall)
	wall1Mesh.position.set(0,10,20)
	

	const wall2=rapier.ColliderDesc.cuboid(20,10,2)
	wall2.setTranslation(0,10,-20)
	
	const wall2Geo=new three.BoxGeometry(40,20,4)
	const wall2Mesh=new three.Mesh(wall2Geo,wall)
	wall2Mesh.position.set(0,10,-20)

	const wall3=rapier.ColliderDesc.cuboid(2,10,20)
	wall3.setTranslation(-20,10,0)

	const wall3Geo=new three.BoxGeometry(4,20,40)
	const wall3Mesh=new three.Mesh(wall3Geo,wall)
	wall3Mesh.position.set(-20,10,0)

	const wall4=rapier.ColliderDesc.cuboid(2,10,20)
	wall4.setTranslation(20,10,0)

	const wall4Geo=new three.BoxGeometry(4,20,40)
	const wall4Mesh=new three.Mesh(wall4Geo,wall)
	wall4Mesh.position.set(20,10,0)

	world.createCollider(wall1)
	world.createCollider(wall2)
	world.createCollider(wall3)
	world.createCollider(wall4)
	scene.add(wall1Mesh,wall2Mesh,wall3Mesh,wall4Mesh)
	const playerDesc= rapier.RigidBodyDesc.dynamic()
	playerDesc.setTranslation(0,10,0)
	const playerBody= world.createRigidBody(playerDesc)
	const colliderDesc= rapier.ColliderDesc.capsule(1,1)
	world.createCollider(colliderDesc,playerBody)
	
	

	
	
	const texture=textureLoader.load('/assets/floor.png')
	const mat=new three.MeshBasicMaterial({map:texture})
	const groundMesh=new three.Mesh(new three.BoxGeometry(40,1,40),mat)
	scene.add(groundMesh)

	var keys=new Set()
	window.addEventListener("keydown",(event)=>{
		keys.add(event.code)
	})
	window.addEventListener("keyup",(event)=>{
		keys.delete(event.code)
	})
	

	let n = await fetch("/name.php");

	let n_ = (await n.json());
	const name = n_.name;
	const ownCol = n_.color;

	global_name = name;

	const playerGeo=new three.CapsuleGeometry(1,2,30,30,1)
	const playerMesh=new three.Mesh(playerGeo,new three.MeshPhongMaterial({color:new three.Color(ownCol)}))
	camera.lookAt(playerMesh.position.x,playerMesh.position.y,playerMesh.position.z)
	scene.add(playerMesh)

	renderer.render(scene, camera) 
	
	setInterval(()=>{world.step()},16)

	async function animate (){
		otplayers.forEach(p => {
			scene.remove(p)
		})
		otplayers=[]
		let pos= playerBody.translation()
		let NCP = circlePoint(playerTheta, playerR);
		NCP.z = playerZ;
		console.log(NCP);
		camera.position.set(NCP.x + pos.x, NCP.z, NCP.y + pos.z);
		if (keys.has('Space')&&playerBody.linvel().y>=-0.05&&playerBody.linvel().y<=0.05){
                	playerBody.setLinvel({x:0,y:10,z:-4},true)
	        }
		if (keys.has('ArrowLeft')) {
			playerTheta = (playerTheta + 0.03)
		}
		if (keys.has('ArrowRight')) {
			playerTheta = (playerTheta - 0.03)
		}
		if (keys.has('Period')) {
			playerR = (playerR + 0.03)
		}
		if (keys.has('Comma')) {
			playerR = (playerR - 0.03)
		}
		if (keys.has('ArrowUp')) {
			playerZ = (playerZ + 0.1)
		}
		if (keys.has('ArrowDown')) {
			playerZ = (playerZ - 0.1)
		}
		let vel=playerBody.linvel()
		playerMesh.position.set(pos.x,pos.y,pos.z)
		
		let opp = await fetch(`/move.php?x=${pos.x}&y=${pos.y}&z=${pos.z}&name=${name}`);

		let dat = await opp.json();

		let players = dat.users;

		//console.log(dat,name)

		if (!dat.success || players == undefined) window.location.href = "/invalid.php";


		for (let i = 0; i < players.length; i ++) {
			let px = players[i].x;
			let py = players[i].y;
			let pz = players[i].z;
			let pn = players[i].name;
			let newPlayer=new three.Mesh(playerGeo,new three.MeshPhongMaterial({color:new three.Color(players[i].color)}))
			newPlayer.position.set(px,py,pz)
			scene.add(newPlayer)
			
			otplayers.push(newPlayer)
		}

		//name.php returns own name
		//move.php sets your position (given name, x, y, and z), and returns the position of everybody else
		//message.php sends a message (given name and message), and returns the messages
		//getmessages.php returns the messages
		
		let vell = {x:0,y:vel.y,z:0};

		if (keys.has('KeyA')) vell.x -= 5;
		if (keys.has('KeyD')) vell.x += 5;
		if (keys.has('KeyW')) vell.z -= 5;
		if (keys.has('KeyS')) vell.z += 5;
		
		playerBody.setLinvel({x:vell.x,y:vell.y,z:vell.z},true)
		if (pos.y<-5) playerBody.setTranslation({x:0,y:10,z:0})

		
		requestAnimationFrame(animate)
		//write player code above this request
		//camera.position.set(pos.x, pos.y + 2, pos.z + 3)
		camera.lookAt(pos.x, pos.y, pos.z)
		renderer.render(scene, camera)
	}
	requestAnimationFrame(animate)


})

document.getElementById("csm").onkeydown = async (e) => {
	if (e.key == "Enter") {
		await fetch(`/message.php?name=${global_name}&message=${document.getElementById("csm").value}`)
		document.getElementById("csm").value = "";
	}
}

setInterval(async () => {
	let messages = (await fetch(`/getmessages.php`));
	messages = (await messages.json()).messages
	document.getElementById("sent").innerHTML = "";
	messages.forEach(message => {
		document.getElementById("sent").innerText += message
		document.getElementById("sent").innerHTML += "<br>";
	});
	
}, 100)
