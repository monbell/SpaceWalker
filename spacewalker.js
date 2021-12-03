import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

export class Assignment3 extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.center =  Mat4.identity().times(Mat4.translation(-15,-9,0));
        this.startScreen = true;
        this.collided = false;
        this.startScreenUFODirection = "R";
        this.defaultCamera = Mat4.translation(0, 0, -35);
        this.moveInitialUFO = true;
        this.shiftCameraFast = false;
        this.end = false

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            ufo_top: new defs.Subdivision_Sphere(4),
            ufo_bottom: new defs.Torus(50, 50),
            circle: new defs.Subdivision_Sphere(4),
            triangle: new defs.Triangle(),
            meteor: new defs.Subdivision_Sphere(2),
            planet_1: new defs.Subdivision_Sphere(4),
            rings: new defs.Torus(50, 50),
            s1: new defs.Cube(4,4),
            expTri: new defs.Triangle(),
            navarre: new defs.Subdivision_Sphere(3),
        };

        this.randomPosition = []
        for (let i = 0; i < 400; i++) {
            if(i % 3 == 0 || i % 5 == 0) {
                this.randomPosition.push(-Math.random()*20.0);
            } else {
                this.randomPosition.push(Math.random()*20.0);
            }
        }

        this.positions = []
        for (let i = 0; i < 8; i++) {
            this.positions.push(-20+i*5)
        }

        this.rand = Math.floor(Math.random()*this.positions.length);
        this.ring_planet_loc = this.positions[this.rand]; // random position; remove that position
        this.positions.splice(this.rand, 1);
        this.ring_planet_speed = Math.random()*10 + 10; 
        
        this.rand = Math.floor(Math.random()*this.positions.length);
        this.planet_loc = this.positions[this.rand]; // random position; remove that position
        this.positions.splice(this.rand, 1);
        this.planet_speed = Math.random()*10 + 10; 

        this.rand = Math.floor(Math.random()*this.positions.length);
        this.star_loc = this.positions[this.rand]; // random position; remove that position
        this.positions.splice(this.rand, 1);
        this.star_speed = Math.random()*10 + 10; 
        
        this.rand = Math.floor(Math.random()*this.positions.length);
        this.meteor_loc = this.positions[this.rand]; // random position; remove that position
        this.positions.splice(this.rand, 1);
        this.meteor_speed = Math.random()*10 + 10; 

        this.rand = Math.floor(Math.random()*this.positions.length);
        this.ring_planet_loc_2 = this.positions[this.rand]; // random position; remove that position
        this.positions.splice(this.rand, 1);
        this.ring_planet_speed_2 = Math.random()*10 + 10; 

        this.rand = Math.floor(Math.random()*this.positions.length);
        this.planet_loc_2 = this.positions[this.rand]; // random position; remove that position
        this.positions.splice(this.rand, 1);
        this.planet_speed_2 = Math.random()*10 + 10;

        this.rand = Math.floor(Math.random()*this.positions.length);
        this.star_loc_2 = this.positions[this.rand]; // random position; remove that position
        this.positions.splice(this.rand, 1);
        this.star_speed_2 = Math.random()*10 + 10; 

        this.rand = Math.floor(Math.random()*this.positions.length);
        this.meteor_loc_2 = this.positions[this.rand]; // random position; remove that position
        this.positions.splice(this.rand, 1);
        this.meteor_speed_2 = Math.random()*10 + 10; 
                
        this.ufo_loc = Math.random() * 20 - 10;
        this.n_loc = Math.random() * 20 - 10;

        // *** Materials
        this.materials = {
            background_mat: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, color: hex_color("#ffffff")}),
            ufo_mat: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, color: hex_color("#808080")}),
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            meteor_mat: new Material(new Gouraud_Shader(),
                {ambient: 1, diffusivity: .6, color: hex_color("#505050")}),
            shooting_star_mat: new Material(new defs.Phong_Shader(),
                {ambient: .7, diffusivity: .6, color: hex_color("#D4AF37")}),
            planet_1_mat: new Material(new defs.Phong_Shader(),
                {ambient: .5, diffusivity: 1, color: hex_color("#ff814f")}),
            planet_2_mat: new Material(new defs.Phong_Shader(),
                {ambient: .5, diffusivity: 1, color: hex_color("#24877c")}),
            rings_mat: new Material(new Gouraud_Shader(),
                {ambient: .5, diffusivity: .6, color: hex_color("#D4AF37")}),
            explosion_mat: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, color: hex_color("#D4AF37")}),
            n_mat_Gouraud: new Material(new Gouraud_Shader(),
                {ambient:.5, diffusivity:1, color:hex_color("#05e632")}),
            n_mat_Phong: new Material(new defs.Phong_Shader(),
                {ambient:.5, diffusivity:1, color:hex_color("#05e632")}),
            heart_mat: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, color: hex_color("#FF0000")}),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Start Game", ["x"], () => { 
            if (this.startScreen == true)
            {
                setTimeout(() => {  
                    this.startScreen = false;
                    this.center =  Mat4.identity().times(Mat4.translation(-25,this.ufo_loc,0));
                    this.shiftCameraFast = true;
                    this.attached(Mat4.inverse(this.center).times(Mat4.translation(0,0,-3)));
                    this.shiftCameraFast = false;
                    this.attached = () => this.defaultCamera;

                }, 500);
                this.moveInitialUFO = false;
                this.attached = () => Mat4.inverse(this.center).times(Mat4.translation(0,0,-3));
            }

        });
        this.new_line();
        this.key_triggered_button("Right", ["d"], () => {
            if (this.end==false && this.startScreen==false && this.collided == false)
            {
                this.center = this.center.times(Mat4.translation(1,0,0))
            }
        });
        this.new_line();
        this.key_triggered_button("Left", ["a"], () => {
            if (this.end==false && this.startScreen==false && this.collided == false)
            {
                this.center = this.center.times(Mat4.translation(-1,0,0))
            }
        });
        this.new_line();
        this.key_triggered_button("Up", ["w"], () => {
            if (this.end==false && this.startScreen==false && this.collided == false)
            {
                this.center = this.center.times(Mat4.translation(0,1,0))
            }
        });
        this.new_line();
        this.key_triggered_button("Down", ["s"], () => {
            if (this.end==false && this.startScreen==false && this.collided == false)
            {
                this.center = this.center.times(Mat4.translation(0,-1,0))
            }
        });
        this.new_line();
        this.key_triggered_button("Restart", ["r"], () => {
            if (this.startScreen==false)
            {
                this.center =  Mat4.identity().times(Mat4.translation(-15,-9,0));
                this.startScreen = true;
                this.collided = false;
                this.startScreenUFODirection = "R";
                this.defaultCamera = Mat4.translation(0, 0, -35);
                this.moveInitialUFO = true;
                this.shiftCameraFast = false;
                this.end = false;
                this.attached = () => this.defaultCamera;

            }
        });





    }

    display(context, program_state) {
            // display():  Called once per frame of animation.
            // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
            if (!context.scratchpad.controls) {
                this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
                // Define the global camera and projection matrices, which are stored in program_state.
                program_state.set_camera(Mat4.translation(0, 0, -35));
            }

            program_state.projection_transform = Mat4.perspective(
                Math.PI / 4, context.width / context.height, .1, 1000);
                
                
            if(this.attached && this.attached() !== null) {
                var desired = this.attached()
                if (this.shiftCameraFast == true)
                {
                    program_state.camera_inverse = desired
                }
                else{
                    program_state.camera_inverse = desired.map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.3))
                }
                    
            }
            else {
                    program_state.set_camera(Mat4.translation(0, 0, -35));
            }

            const t = program_state.animation_time/1000, dt = program_state.animation_delta_time/1000;
            let bool
            let colorChange
            let red = color(0, 0, 0, 1);
            let size
            let k = t/2.5
            if((t%10) < 5) {
                bool = true
            }
            else {
                bool = false
            }

            if(bool) {
                colorChange = color(1, 1, (k%2), 1);
                size = 1 + (k%2)
            }
            else {
                colorChange = color(1, 1, (1 - k%2), 1);
                size = 4 - (1 + (k%2))
            }

            program_state.projection_transform = Mat4.perspective(Math.PI/4, context.width / context.height, .1, 2000);

            const light_position = vec4(0, 10, 6, 1);
            // The parameters of the Light are: position, color, size
            program_state.lights = [new Light(light_position, color(1,1,1,1), 10**(1+(1%2)))];

            this.material_transform = Mat4.identity();

            var letter_change = Math.floor(t*3) % 12;

            for (let i = 0; i < 400; i++) {
                this.material_transform = Mat4.identity().times(Mat4.translation(this.randomPosition[i]*2.0, this.randomPosition[i+2], 0)).times(Mat4.scale(.15, .15, 0)).times(Mat4.rotation(Math.PI*1.65, 0, 0, 1));
                this.shapes.triangle.draw(context, program_state, this.material_transform, this.materials.background_mat.override({color: colorChange}));
                this.material_transform = this.material_transform.times(Mat4.rotation(Math.PI, 0, 0, 1)).times(Mat4.translation(0, -1, 0));
                this.shapes.triangle.draw(context, program_state, this.material_transform, this.materials.background_mat.override({color: colorChange}));
            }

        if (this.startScreen){


            var linePosition = Mat4.identity().times(Mat4.translation(0,-2.5,0))
            this.material_transform = linePosition.times(Mat4.scale(18, 0.25, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: hex_color("86f0b0")}));

            var letterColor = color(0,0,0,0);
            var defaultLetterColor = hex_color("0fd9aa");
            if (letter_change == 0){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var sPosition = Mat4.identity().times(Mat4.translation(-16,1,0))
            this.material_transform = sPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = sPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = sPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = sPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(0.75,-9,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = sPosition.times(Mat4.translation(1.75,-1.5,0).times(Mat4.scale(0.25, 1, 0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            
            if (letter_change == 1){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var pPosition = sPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = pPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = pPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = pPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = pPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = pPosition.times(Mat4.translation(1.75,0,0).times(Mat4.scale(0.25, 1, 0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));

            if (letter_change == 2){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var aPosition = pPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = aPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(7,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.translation(1.75,0,0).times(Mat4.scale(0.25, 1, 0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));

            if (letter_change == 3){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var cPosition = aPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = cPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = cPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = cPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = cPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-9,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));

            if (letter_change == 4){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var ePosition = cPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = ePosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = ePosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = ePosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = ePosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = ePosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-9,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));

            if (letter_change == 5){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var wPosition = ePosition.times(Mat4.translation(5.5,0,0))
            this.material_transform = wPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = wPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = wPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(7,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = wPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-9,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = wPosition.times(Mat4.translation(1.75,0,0).times(Mat4.scale(0.25, 1, 0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = wPosition.times(Mat4.scale(0.25, 1.0, 0).times(Mat4.translation(3.5,-1.5,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            
            if (letter_change == 6){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            aPosition = wPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = aPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(7,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = aPosition.times(Mat4.translation(1.75,0,0).times(Mat4.scale(0.25, 1, 0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));

            if (letter_change == 7){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var lPosition = aPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = lPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = lPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = lPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-9,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            
            if (letter_change == 8){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var kPosition = lPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = kPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = kPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = kPosition.times(Mat4.translation(1,-1.5,0))
            this.material_transform = this.material_transform.times(Mat4.rotation(Math.PI / 4, 0, 0, 1)).times(Mat4.scale(0.25,1.25,0))
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = kPosition.times(Mat4.translation(1,0,0))
            this.material_transform = this.material_transform.times(Mat4.rotation(-Math.PI / 4, 0, 0, 1)).times(Mat4.scale(0.25,1.25,0))
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            
            if (letter_change == 9){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            ePosition = kPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = ePosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = ePosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = ePosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = ePosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = ePosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-9,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            
            if (letter_change == 10){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            var rPosition = ePosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = rPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = rPosition.times(Mat4.scale(0.25, 1.25, 0).times(Mat4.translation(0,-1,0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = rPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = rPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = rPosition.times(Mat4.translation(1.75,0,0).times(Mat4.scale(0.25, 1, 0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = rPosition.times(Mat4.translation(1,-1.5,0))
            this.material_transform = this.material_transform.times(Mat4.rotation(Math.PI / 4, 0, 0, 1)).times(Mat4.scale(0.25,1.25,0))
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            
            if (letter_change == 11){ letterColor = color(1,1,1,1)}
            else {letterColor = defaultLetterColor}
            sPosition = rPosition.times(Mat4.translation(2.5,0,0))
            this.material_transform = sPosition.times(Mat4.scale(0.25, 1, 0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = sPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = sPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(1,-3,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = sPosition.times(Mat4.scale(1, 0.25, 0)).times(Mat4.translation(0.75,-9,0));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));
            this.material_transform = sPosition.times(Mat4.translation(1.75,-1.5,0).times(Mat4.scale(0.25, 1, 0)));
            this.shapes.s1.draw(context, program_state, this.material_transform, this.materials.ufo_mat.override({color: letterColor}));

            if(this.center[0][3] == 15) {
                this.startScreenUFODirection = "L"
            }
            if(this.center[0][3] == -15) {
                this.startScreenUFODirection = "R"
            }
            if (this.moveInitialUFO == true)
            {
                if (this.startScreenUFODirection == 'L')
                {
                    this.center = this.center.times(Mat4.translation(-0.25,0,0));
                }
                else{
                    this.center = this.center.times(Mat4.translation(0.25,0,0));

                }
            }
            this.ufo_transform = this.center.times(Mat4.scale(2,1.5,1.5)).times(Mat4.translation(0,.4,0));
            this.shapes.ufo_top.draw(context, program_state, this.ufo_transform, this.materials.ufo_mat.override({color: color(.5,.5,1,1)}));

            this.ufo_transform = this.center.times(Mat4.rotation(Math.PI,0,1,1,0)).times(Mat4.scale(4,1.7,1));
            this.shapes.ufo_bottom.draw(context, program_state, this.ufo_transform, this.materials.ufo_mat);

            this.ufo_transform = this.center.times(Mat4.rotation(Math.PI,0,1,1,0)).times(Mat4.scale(4,1.7,1));
            this.shapes.ufo_bottom.draw(context, program_state, this.ufo_transform, this.materials.ufo_mat);

            this.circle_transform = this.ufo_transform.times(Mat4.translation(0,1,0)).times(Mat4.scale(.05,.15,.15));
            this.circle_base = this.circle_transform
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            this.circle_transform = this.circle_base.times(Mat4.translation(-4,-.5,0));
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            this.circle_transform = this.circle_base.times(Mat4.translation(4,-.5,0));
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            this.circle_transform = this.circle_base.times(Mat4.translation(-8,-1,0));
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            this.circle_transform = this.circle_base.times(Mat4.translation(8,-1,0));
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            this.circle_transform = this.circle_base.times(Mat4.translation(-12,-1.5,0));
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            this.circle_transform = this.circle_base.times(Mat4.translation(12,-1.5,0));
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            this.circle_transform = this.circle_base.times(Mat4.translation(-16,-2.75,0));
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            this.circle_transform = this.circle_base.times(Mat4.translation(16,-2.75,0));
            this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);

        }
        else
        {
            
            this.planet_n = Mat4.identity().times(Mat4.translation(23,this.n_loc,0)).times(Mat4.scale(3,3,3));
            //this.shapes.navarre.draw(context, program_state, this.planet_n, this.materials.n_mat_Phong);
            
            if(((t%10)%2).toString()[0] == '0'){
                this.shapes.navarre.draw(context,program_state,this.planet_n,this.materials.n_mat_Phong);
            } else {
                this.shapes.navarre.draw(context, program_state, this.planet_n, this.materials.n_mat_Gouraud);
            }
            
            this.diff = this.center[1][3] - this.n_loc;
            //console.log(this.diff);
            if(this.center[0][3] > 15 && Math.abs(this.diff) < 6) {
                this.end = true;
            }


            if(!this.end) {
                if(t%5.5 < 0.05 && t%5.5 > -0.05) {

                    if(this.positions.length == 0) {
                        for (let i = 0; i < 8; i++) {
                            this.positions.push(-20+i*5)
                        }
                    } 

                    this.rand = Math.floor(Math.random()*this.positions.length);
                    this.ring_planet_loc = this.positions[this.rand]; // random position; remove that position
                    this.positions.splice(this.rand, 1);
                    this.ring_planet_speed = Math.random()*10 + 10; 

                    this.rand = Math.floor(Math.random()*this.positions.length);
                    this.planet_loc = this.positions[this.rand]; // random position; remove that position
                    this.positions.splice(this.rand, 1);
                    this.planet_speed = Math.random()*10 + 10; 

                    this.rand = Math.floor(Math.random()*this.positions.length);
                    this.star_loc = this.positions[this.rand]; // random position; remove that position
                    this.positions.splice(this.rand, 1);
                    this.star_speed = Math.random()*10 + 10; 

                    this.rand = Math.floor(Math.random()*this.positions.length);
                    this.meteor_loc = this.positions[this.rand]; // random position; remove that position
                    this.positions.splice(this.rand, 1);
                    this.meteor_speed = Math.random()*10 + 10; 
                }


                if((t+2.25)%5.5 < 0.05 && (t+2.25)%5.5 > -0.05) {
                    if(this.positions.length == 0) {
                        for (let i = 0; i < 8; i++) {
                            this.positions.push(-20+i*5)
                        }
                    }

                    this.rand = Math.floor(Math.random()*this.positions.length);
                    this.ring_planet_loc_2 = this.positions[this.rand]; // random position; remove that position
                    this.positions.splice(this.rand, 1);
                    this.ring_planet_speed_2 = Math.random()*10 + 10; 

                    this.rand = Math.floor(Math.random()*this.positions.length);
                    this.planet_loc_2 = this.positions[this.rand]; // random position; remove that position
                    this.positions.splice(this.rand, 1);
                    this.planet_speed_2 = Math.random()*10 + 10;

                    this.rand = Math.floor(Math.random()*this.positions.length);
                    this.star_loc_2 = this.positions[this.rand]; // random position; remove that position
                    this.positions.splice(this.rand, 1);
                    this.star_speed_2 = Math.random()*10 + 10; 

                    this.rand = Math.floor(Math.random()*this.positions.length);
                    this.meteor_loc_2 = this.positions[this.rand]; // random position; remove that position
                    this.positions.splice(this.rand, 1);
                    this.meteor_speed_2 = Math.random()*10 + 10; 
                }


                this.meteor_transform = Mat4.identity().times(Mat4.translation(this.meteor_loc,20+(-(t%5.5)*this.meteor_speed),0)).times(Mat4.scale(.5,.5,.5));
                this.shapes.meteor.draw(context, program_state, this.meteor_transform, this.materials.meteor_mat);
                if( ((this.meteor_transform[1][3] - this.center[1][3]) < 3 && (this.meteor_transform[1][3] - this.center[1][3]) > -3) && ((this.meteor_transform[0][3] - this.center[0][3]) < 4.5 && (this.meteor_transform[0][3] - this.center[0][3]) > -4.5)) { // collision detection
                    this.collided = true;
                }

                this.meteor_transform_2 = Mat4.identity().times(Mat4.translation(this.meteor_loc_2,20+(-((t+2.25)%5.5)*this.meteor_speed_2),0)).times(Mat4.scale(.5,.5,.5));
                this.shapes.meteor.draw(context, program_state, this.meteor_transform_2, this.materials.meteor_mat);
                if( ((this.meteor_transform_2[1][3] - this.center[1][3]) < 3 && (this.meteor_transform_2[1][3] - this.center[1][3]) > -3) && ((this.meteor_transform_2[0][3] - this.center[0][3]) < 4.5 && (this.meteor_transform_2[0][3] - this.center[0][3]) > -4.5)) { // collision detection
                    this.collided = true;
                }


                this.shooting_star_transform = Mat4.identity().times(Mat4.translation(this.star_loc,20+(-(t%5.5)*this.star_speed),0)).times(Mat4.rotation(Math.PI*1.25,0,0,1)).times(Mat4.scale(.75, 1.3, 1));
                this.shapes.triangle.draw(context, program_state, this.shooting_star_transform, this.materials.shooting_star_mat);
                this.shooting_star_transform = this.shooting_star_transform.times(Mat4.rotation(Math.PI,0,0,1)).times(Mat4.translation(-.7,-.7,0));
                this.shapes.triangle.draw(context, program_state, this.shooting_star_transform, this.materials.shooting_star_mat); 
                if( ((this.shooting_star_transform[1][3] - this.center[1][3]) < 3 && (this.shooting_star_transform[1][3] - this.center[1][3]) > -3) && ((this.shooting_star_transform[0][3] - this.center[0][3]) < 4.5 && (this.shooting_star_transform[0][3] - this.center[0][3]) > -4.5)) { // collision detection
                    this.collided = true;
                }                


                this.shooting_star_transform_2 = Mat4.identity().times(Mat4.translation(this.star_loc_2,20+(-((t+2.25)%5.5)*this.star_speed_2),0)).times(Mat4.rotation(Math.PI*1.25,0,0,1)).times(Mat4.scale(.75, 1.3, 1));
                this.shapes.triangle.draw(context, program_state, this.shooting_star_transform_2, this.materials.shooting_star_mat);
                this.shooting_star_transform_2 = this.shooting_star_transform_2.times(Mat4.rotation(Math.PI,0,0,1)).times(Mat4.translation(-.7,-.7,0));
                this.shapes.triangle.draw(context, program_state, this.shooting_star_transform_2, this.materials.shooting_star_mat);
                if( ((this.shooting_star_transform_2[1][3] - this.center[1][3]) < 3 && (this.shooting_star_transform_2[1][3] - this.center[1][3]) > -3) && ((this.shooting_star_transform_2[0][3] - this.center[0][3]) < 4.5 && (this.shooting_star_transform_2[0][3] - this.center[0][3]) > -4.5)) { // collision detection
                    this.collided = true;
                } 


                this.planet_transform = Mat4.identity().times(Mat4.translation(this.planet_loc,20+(-(t%5.5)*this.planet_speed), 0)).times(Mat4.scale(.75,.75,.75));
                this.shapes.planet_1.draw(context, program_state, this.planet_transform, this.materials.planet_1_mat);
                if( ((this.planet_transform[1][3] - this.center[1][3]) < 3 && (this.planet_transform[1][3] - this.center[1][3]) > -3) && ((this.planet_transform[0][3] - this.center[0][3]) < 4.5 && (this.planet_transform[0][3] - this.center[0][3]) > -4.5)) { // collision detection
                    this.collided = true;
                }

                this.planet_transform_2 = Mat4.identity().times(Mat4.translation(this.planet_loc_2,20+(-((t+2.25)%5.5)*this.planet_speed_2), 0)).times(Mat4.scale(.75,.75,.75));
                this.shapes.planet_1.draw(context, program_state, this.planet_transform_2, this.materials.planet_1_mat);
                if( ((this.planet_transform_2[1][3] - this.center[1][3]) < 3 && (this.planet_transform_2[1][3] - this.center[1][3]) > -3) && ((this.planet_transform_2[0][3] - this.center[0][3]) < 4.5 && (this.planet_transform_2[0][3] - this.center[0][3]) > -4.5)) { // collision detection
                    this.collided = true;
                }

                this.planet_transform = Mat4.identity().times(Mat4.translation(this.ring_planet_loc,20+(-(t%5.5)*this.ring_planet_speed),0));
                this.shapes.planet_1.draw(context, program_state, this.planet_transform, this.materials.planet_2_mat);
                this.rings_transform = this.planet_transform.times(Mat4.rotation(Math.PI,0,1,1,0)).times(Mat4.scale(2,2,.05));
                this.shapes.rings.draw(context, program_state, this.rings_transform, this.materials.rings_mat);
                if( ((this.rings_transform[1][3] - this.center[1][3]) < 3 && (this.rings_transform[1][3] - this.center[1][3]) > -3) && ((this.rings_transform[0][3] - this.center[0][3]) < 6 && (this.rings_transform[0][3] - this.center[0][3]) > -6
                )) { // collision detection
                    this.collided = true;
                }

                this.planet_transform = Mat4.identity().times(Mat4.translation(this.ring_planet_loc_2,20+(-((t+2.25)%5.5)*this.ring_planet_speed_2),0));
                this.shapes.planet_1.draw(context, program_state, this.planet_transform, this.materials.planet_2_mat);
                this.rings_transform_2 = this.planet_transform.times(Mat4.rotation(Math.PI,0,1,1,0)).times(Mat4.scale(2,2,.05));
                this.shapes.rings.draw(context, program_state, this.rings_transform_2, this.materials.rings_mat);
                if( ((this.rings_transform_2[1][3] - this.center[1][3]) < 3 && (this.rings_transform_2[1][3] - this.center[1][3]) > -3) && ((this.rings_transform_2[0][3] - this.center[0][3]) < 6 && (this.rings_transform_2[0][3] - this.center[0][3]) > -6)) { // collision detection
                    this.collided = true;
                }
            }
            else {
                this.y = (this.center[1][3] + this.n_loc + this.n_loc + 4) / 3.0;
                console.log(this.center[0][3])
                this.attached = () => Mat4.identity().times(Mat4.translation(-20,-this.y,-25));
                
                this.heart_transform = Mat4.identity().times(Mat4.translation(19.9,this.n_loc+5,0));
                this.shapes.circle.draw(context, program_state, this.heart_transform, this.materials.heart_mat);
                this.heart_transform = Mat4.identity().times(Mat4.translation(18.1,this.n_loc+5,0));
                this.shapes.circle.draw(context, program_state, this.heart_transform, this.materials.heart_mat);
                this.heart_transform = Mat4.identity().times(Mat4.translation(19,this.n_loc+2.75,0)).times(Mat4.rotation(Math.PI*.25,0,0,1,0)).times(Mat4.scale(2.55,2.55,0));
                this.shapes.triangle.draw(context, program_state, this.heart_transform, this.materials.heart_mat)
            }

            if (this.collided == true)
            {
                var explosionCenter = this.center.times(Mat4.translation(0, 1, 2));

                var numberTris = 40;
                for (let i = 0; i < numberTris; i++) {
                    explosionCenter = explosionCenter.times(Mat4.rotation(i * Math.PI/numberTris, 0, 0, 1))
                    this.material_transform = explosionCenter.times(Mat4.scale(0.75, 0.5, 0.5));
                    this.shapes.expTri.draw(context, program_state, this.material_transform, this.materials.explosion_mat.override({color:  hex_color("#eded2d")}));
                    this.material_transform = explosionCenter.times(Mat4.scale(1.5, 0.5, 0.5));
                    this.shapes.expTri.draw(context, program_state, this.material_transform, this.materials.explosion_mat.override({color: hex_color("#eded2d")}));
                    this.material_transform = explosionCenter.times(Mat4.scale(2.25, 0.5,0.5));
                    this.shapes.expTri.draw(context, program_state, this.material_transform, this.materials.explosion_mat.override({color: hex_color("#ffab24")}));
                    this.material_transform = explosionCenter.times(Mat4.scale(3, 0.5, 0.5));
                    this.shapes.expTri.draw(context, program_state, this.material_transform, this.materials.explosion_mat.override({color: hex_color("#d6220b")}));
                
                }


                function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
                    
                sleep(400).then(() => {
                    this.collided = false;                              
                    this.center = Mat4.identity().times(Mat4.translation(-25,this.ufo_loc,0));   
                });
            }
            else
            {
                this.ufo_transform = this.center.times(Mat4.scale(2,1.5,1.5)).times(Mat4.translation(0,.4,0));
                this.shapes.ufo_top.draw(context, program_state, this.ufo_transform, this.materials.ufo_mat.override({color: color(.5,.5,1,1)}));

                this.ufo_transform = this.center.times(Mat4.rotation(Math.PI,0,1,1,0)).times(Mat4.scale(4,1.7,1));
                this.shapes.ufo_bottom.draw(context, program_state, this.ufo_transform, this.materials.ufo_mat);

                this.ufo_transform = this.center.times(Mat4.rotation(Math.PI,0,1,1,0)).times(Mat4.scale(4,1.7,1));
                this.shapes.ufo_bottom.draw(context, program_state, this.ufo_transform, this.materials.ufo_mat);

                this.circle_transform = this.ufo_transform.times(Mat4.translation(0,1,0)).times(Mat4.scale(.05,.15,.15));
                this.circle_base = this.circle_transform
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
                this.circle_transform = this.circle_base.times(Mat4.translation(-4,-.5,0));
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
                this.circle_transform = this.circle_base.times(Mat4.translation(4,-.5,0));
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
                this.circle_transform = this.circle_base.times(Mat4.translation(-8,-1,0));
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
                this.circle_transform = this.circle_base.times(Mat4.translation(8,-1,0));
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
                this.circle_transform = this.circle_base.times(Mat4.translation(-12,-1.5,0));
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
                this.circle_transform = this.circle_base.times(Mat4.translation(12,-1.5,0));
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
                this.circle_transform = this.circle_base.times(Mat4.translation(-16,-2.75,0));
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
                this.circle_transform = this.circle_base.times(Mat4.translation(16,-2.75,0));
                this.shapes.circle.draw(context, program_state, this.circle_transform, this.materials.meteor_mat);
            }
        }
    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;
        varying vec4 VERTEX_COLOR; // NOTE: ADDED

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;     
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){      
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                
                VERTEX_COLOR = vec4( shape_color.xyz * ambient, shape_color.w ); // NOTE: ADDED
                VERTEX_COLOR.xyz += phong_model_lights( normalize( N ), vertex_worldspace ); // NOTE: ADDED                            
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                // Compute an initial (ambient) color:
                // NOTE: COMMENTED OUT gl_FragColor = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                // NOTE: COMMENTED OUT gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
                gl_FragColor = VERTEX_COLOR; // NOTE: ADDED
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}