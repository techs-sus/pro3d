declare const owner: Player;
const container = new Instance("WorldModel");
const part = new Instance("Part");
const gui = new Instance("SurfaceGui");
const frame = new Instance("Frame");
gui.Face = Enum.NormalId.Back;
gui.Adornee = part;
gui.SizingMode = Enum.SurfaceGuiSizingMode.FixedSize;
gui.CanvasSize = new Vector2(100, 100);
gui.Parent = script;
frame.BorderSizePixel = 0;
frame.BackgroundColor3 = new Color3();
frame.Size = UDim2.fromScale(1, 1);
frame.Position = new UDim2();
frame.Parent = gui;
part.Locked = true;
part.CanTouch = false;
part.CanCollide = false;
part.CanQuery = false;
part.Transparency = 0.7;
part.Material = Enum.Material.Glass;
part.Color = new Color3(1, 0, 0);
part.Size = new Vector3(8, 8, 0.01);
if (owner.Character?.FindFirstChild("HumanoidRootPart")?.IsA("Part")) {
	part.CFrame = (owner.Character.FindFirstChild("HumanoidRootPart") as Part).CFrame.mul(new CFrame(0, 5, -4));
}
part.Parent = container;
container.Parent = script;

class Camera {
	position: Vector3 = new Vector3(0, 1, -2);
	rotation: Vector3 = new Vector3();
	focalLength: number = 0.6;
	public project(x: number, y: number, z: number, pos: Vector3, rot: Vector3): [number, number] {
		rot = rot.sub(this.rotation);
		const v = new Vector3(x, y, z);
		let XY = math.cos(rot.Y) * v.Y - math.sin(rot.Y) * v.Z;
		let XZ = math.sin(rot.Y) * v.Y + math.cos(rot.Y) * v.Z;
		let YZ = math.cos(rot.X) * XZ - math.sin(rot.X) * v.X;
		let YX = math.sin(rot.X) * XZ + math.cos(rot.X) * v.X;
		let ZX = math.cos(rot.Z) * YX - math.sin(rot.Z) * XY;
		let ZY = math.sin(rot.Z) * YX + math.cos(rot.Z) * XY;
		let sf = this.focalLength / (this.focalLength + YZ + pos.Z - this.position.Z);
		let X = (ZX + pos.X - this.position.X) * sf;
		let Y = (ZY + pos.Y - this.position.Y) * sf;

		const canvas = gui.CanvasSize;
		if (canvas.X < canvas.Y) {
			Y /= canvas.Y / canvas.X;
		} else if (canvas.X > canvas.Y) {
			X /= canvas.X / canvas.Y;
		}
		return [X, Y];
	}
}
let vertices = [
	[1, 1, -1],
	[1, -1, -1],
	[-1, -1, -1],
	[-1, 1, -1],
	[1, 1, 1],
	[1, -1, 1],
	[-1, -1, 1],
	[-1, 1, 1],
];
class Renderer {
	public readonly camera: Camera;
	public world: Folder;
	constructor(camera: Camera, world?: Folder | undefined) {
		this.camera = camera;
		this.world = world || new Instance("Folder");
	}
	private point(x: number, y: number) {
		const point = new Instance("TextBox");
		point.Text = "";
		point.Size = UDim2.fromScale(0.01, 0.01);
		point.Position = UDim2.fromScale(x + 0.5, -y + 0.5);
		point.BorderSizePixel = 0;
		point.BackgroundColor3 = new Color3(1, 1, 1);
		point.Visible = true;
		point.Parent = frame;
		return point;
	}
	private drawPath(p1: TextBox, p2: TextBox) {
		const line = this.point(0, 0);
		const x1 = p1.Position.X.Scale;
		const y1 = p1.Position.Y.Scale;
		const x2 = p2.Position.X.Scale;
		const y2 = p2.Position.Y.Scale;
		const distance = new Vector2(x1, y1).sub(new Vector2(x2, y2)).Magnitude;
		line.Size = UDim2.fromScale(distance, 0.01);
		line.Rotation = math.atan2(y2 - y1, x2 - x1) * (180 / math.pi);
		line.Position = UDim2.fromScale((x1 + x2) * 0.5, (y1 + y2) * 0.5);
		line.AnchorPoint = new Vector2(0.5, 0.5);
		return line;
	}
	public render() {
		// clear frame

		frame.ClearAllChildren();
		let descendants = this.world.GetDescendants();
		let renderVertices: Vector3[] = [];
		descendants.forEach((v) => {
			if (v.IsA("Part")) {
				let size = v.Size;
				vertices.forEach((vertice) => {
					renderVertices.push(
						part.CFrame.mul(new CFrame((size.X / 2) * vertice[0], (size.Y / 2) * vertice[1], (size.Z / 2) * vertice[2]))
							.Position,
					);
				});
			}
		});
		renderVertices.forEach((v) => {
			let [x, y] = this.camera.project(v.X, v.Y, v.Z, Vector3.zero, Vector3.zero);
			this.point(x, y);
		});
	}
}

const camera = new Camera();
const renderer = new Renderer(camera);
let world_part = new Instance("Part");
world_part.Size = Vector3.one;
world_part.Parent = renderer.world;
task.spawn(() => {
	while (true) {
		world_part.CFrame = world_part.CFrame.mul(new CFrame(0.01, 0, 0));
		task.wait(1);
		renderer.render();
	}
});

export { part };
