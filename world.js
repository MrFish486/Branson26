import * as rapier from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat'
import * as three from 'https://esm.sh/three'


var global_name;

rapier.init().then(async () => {
	window.addEventListener("beforeunload", async () => {
		await fetch(`/remove.php?name=${name}`);
	})
	let otplayers=[]
	let jumpTime=true 
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
	const textureLoader=new three.TextureLoader()
	const texture=textureLoader.load('assets/noai.png')
	const mat=new three.MeshBasicMaterial({map:texture})
	const groundMesh=new three.Mesh(new three.BoxGeometry(20,1,20),mat)
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

	global_name = name;

	async function animate (){
		otplayers.forEach(p => {
			scene.remove(p)
		})
		otplayers=[]
		let pos= playerBody.translation()
		let rayStart= { x: pos.x, y: pos.y, z: pos.z }
		rayStart.y-=1
		let ray= new rapier.Ray(rayStart,{ x: 0, y: -1, z: 0 })
		let hit= world.castRay(ray,0.3,true,undefined,undefined,playerBody)
		if (keys.has('Space')&&hit){
                playerBody.setLinvel({x:0,y:10,z:-4},true)
                jumpTime=false
                let q=setInterval(()=>{
                    if (playerBody.linvel().y<=0){
                        clearInterval(q)
                        jumpTime=true

                    }
                },1)
                
            }
		let vel=playerBody.linvel()
		playerMesh.position.set(pos.x,pos.y,pos.z)
		
		let opp = await fetch(`/move.php?x=${pos.x}&y=${pos.y}&z=${pos.z}&name=${name}`);

		let dat = await opp.json();
		
		//if (!opp.success) window.location.href = "/invalid.php";

		let players = dat.users;
	
		if (players == undefined) console.log(dat, name)

		for (let i = 0; i < players.length; i ++) {
			let px = players[i].x;
			let py = players[i].y;
			let pz = players[i].z;
			let pn = players[i].name;
			let newPlayer=new three.Mesh(playerGeo,new three.MeshPhongMaterial({color:0xffffff}))
			newPlayer.position.set(px,py,pz)
			scene.add(newPlayer)
			
			otplayers.push(newPlayer)
			console.log(pn);
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
		camera.position.set(pos.x, pos.y + 2, pos.z + 3)
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