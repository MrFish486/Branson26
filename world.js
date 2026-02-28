import * as rapier from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat'
import * as three from 'https://esm.sh/three'



rapier.init().then(async () => {

	//init world, player
	const world = new rapier.World({x:0,y:-9.81,z:0})
	const ground=rapier.ColliderDesc.cuboid(10,2,10)
	world.createCollider(ground)

	const playerDesc= rapier.RigidBodyDesc.dynamic()
	playerDesc.setTranslation(0,10,0)
	const playerBody= world.createRigidBody(playerDesc)
	const colliderDesc= rapier.ColliderDesc.capsule(1,1)
	world.createCollider(colliderDesc,playerBody)
	
	const canvas=document.getElementById("canvas")

	const scene=new three.Scene()
	const renderer=new three.WebGLRenderer({antialais:true,canvas:canvas})
	renderer.setSize(canvas.clientWidth,canvas.clientHeight,false)
	const camera=new three.PerspectiveCamera(75,2,0.1,100)
	const light = new three.DirectionalLight(0xFFFFFF,6)
	light.position.set(0,20,5)
	const Alight = new three.AmbientLight(0x404040, 5)
	camera.position.set(3, 3, 3)
	
	scene.add(light,Alight)

	const groundMesh=new three.Mesh(new three.BoxGeometry(20,1,20))
	scene.add(groundMesh)

	var keys=new Set()
	window.addEventListener("keydown",(event)=>{
		keys.add(event.code)
	})
	window.addEventListener("keyup",(event)=>{
		keys.delete(event.code)
	})
	
	const playerGeo=new three.CapsuleGeometry(1,2,30,30,1)
	const playerMesh=new three.Mesh(playerGeo,new three.MeshPhongMaterial({color:0x00FF00}))
	camera.lookAt(playerMesh.position.x,playerMesh.position.y,playerMesh.position.z)
	scene.add(playerMesh)
	renderer.render(scene, camera) 
	
	setInterval(()=>{world.step()},16)

	let n = await fetch("/name.php");

	const name = (await n.json()).name;

	async function animate (){
		let pos= playerBody.translation()
		let vel=playerBody.linvel()
		playerMesh.position.set(pos.x,pos.y,pos.z)
		
		let opp = await fetch(`/move.php?x=${pos.x}&y=${pos.y}&z=${pos.z}&name=${name}`);

	let dat = await opp.json();
		
		//if (!opp.success) window.location.href = "/invalid.php";

		let players = dat.users;

		for (let i = 0; i < players.length; i ++) {
			let px = players[i].x;
			let py = players[i].y;
			let pz = players[i].z;
			let pn = players[i].name;
			let newPlayer=new three.Mesh(playerGeo,new three.MeshPhongMaterial({color:0x00FF00}))
			newPlayer.position.set(px,py,pz)
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
		if (keys.has())
		
		playerBody.setLinvel({x:vell.x,y:vell.y,z:vell.z},true)

		requestAnimationFrame(animate)
		//write player code above this request
		camera.position.set(pos.x, pos.y + 2, pos.z + 3)
		camera.lookAt(pos.x, pos.y, pos.z)
		renderer.render(scene, camera)
	}
	requestAnimationFrame(animate)




	
})
