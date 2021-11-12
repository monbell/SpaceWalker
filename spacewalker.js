import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

export class Assignment3 extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
        };

        // *** Materials
        this.materials = {
            test_sphere: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: .6, color: hex_color("#ffffff")}),
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")})
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => null);
        this.new_line();
        this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => this.attached = () => this.planet_1);
        this.key_triggered_button("Attach to planet 2", ["Control", "2"], () => this.attached = () => this.planet_2);
        this.new_line();
        this.key_triggered_button("Attach to planet 3", ["Control", "3"], () => this.attached = () => this.planet_3);
        this.key_triggered_button("Attach to planet 4", ["Control", "4"], () => this.attached = () => this.planet_4);
        this.new_line();
        this.key_triggered_button("Attach to moon", ["Control", "m"], () => this.attached = () => this.moon);
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        console.log(this.attached)
        if(this.attached && this.attached() !== null) {
            this.desired = Mat4.inverse(this.attached().times(Mat4.translation(0,0,5)));
        }
        else {
            this.desired = this.initial_camera_location;
        }
        program_state.camera_inverse = this.desired.map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.1))

        const t = program_state.animation_time/1000, dt = program_state.animation_delta_time/1000;
        let bool
        let colorChange
        let size
        let k = t/2.5
        if((t%10) < 5) {
            bool = true
        }
        else {
            bool = false
        }

        if(bool) {
            colorChange = color(1, (k%2), (k%2), 1);
            size = 1 + (k%2)
        }
        else {
            colorChange = color(1, (1 - k%2), (1 - k%2), 1);
            size = 4 - (1 + (k%2))
        }
        
        program_state.projection_transform = Mat4.perspective(Math.PI/4, context.width / context.height, .1, 2000);

        const light_position = vec4(0, 5, 5, 1);
        // The parameters of the Light are: position, color, size
        program_state.lights = [new Light(light_position, colorChange, 10**(1+(k%2)))];
       
        this.sun_transform = Mat4.identity().times(Mat4.scale(size, size, size));
        this.shapes.sphere.draw(context, program_state, this.sun_transform, this.materials.test_sphere.override({color: colorChange}));
    }
}