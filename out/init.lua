-- Compiled with roblox-ts v1.3.3
local container = Instance.new("WorldModel")
local part = Instance.new("Part")
local gui = Instance.new("SurfaceGui")
local frame = Instance.new("Frame")
gui.Face = Enum.NormalId.Back
gui.Adornee = part
gui.SizingMode = Enum.SurfaceGuiSizingMode.FixedSize
gui.CanvasSize = Vector2.new(100, 100)
gui.Parent = script
frame.BorderSizePixel = 0
frame.BackgroundColor3 = Color3.new()
frame.Size = UDim2.fromScale(1, 1)
frame.Position = UDim2.new()
frame.Parent = gui
part.Locked = true
part.CanTouch = false
part.CanCollide = false
part.CanQuery = false
part.Transparency = 0.7
part.Material = Enum.Material.Glass
part.Color = Color3.new(1, 0, 0)
part.Size = Vector3.new(8, 8, 0.01)
local _result = owner.Character
if _result ~= nil then
	_result = _result:FindFirstChild("HumanoidRootPart")
	if _result ~= nil then
		_result = _result:IsA("Part")
	end
end
if _result then
	local _cFrame = (owner.Character:FindFirstChild("HumanoidRootPart")).CFrame
	local _cFrame_1 = CFrame.new(0, 5, -4)
	part.CFrame = _cFrame * _cFrame_1
end
part.Parent = container
container.Parent = script
local Camera
do
	Camera = setmetatable({}, {
		__tostring = function()
			return "Camera"
		end,
	})
	Camera.__index = Camera
	function Camera.new(...)
		local self = setmetatable({}, Camera)
		return self:constructor(...) or self
	end
	function Camera:constructor()
		self.position = Vector3.new()
		self.rotation = Vector3.new()
		self.focalLength = 0.6
	end
	function Camera:project(x, y, z, pos, rot)
		local _rotation = self.rotation
		rot = rot - _rotation
		local v = Vector3.new(x, y, z)
		local XY = math.cos(rot.Y) * v.Y - math.sin(rot.Y) * v.Z
		local XZ = math.sin(rot.Y) * v.Y + math.cos(rot.Y) * v.Z
		local YZ = math.cos(rot.X) * XZ - math.sin(rot.X) * v.X
		local YX = math.sin(rot.X) * XZ + math.cos(rot.X) * v.X
		local ZX = math.cos(rot.Z) * YX - math.sin(rot.Z) * XY
		local ZY = math.sin(rot.Z) * YX + math.cos(rot.Z) * XY
		local sf = self.focalLength / (self.focalLength + YZ + pos.Z - self.position.Z)
		local X = (ZX + pos.X - self.position.X) * sf
		local Y = (ZY + pos.Y - self.position.Y) * sf
		local canvas = gui.CanvasSize
		if canvas.X < canvas.Y then
			Y /= canvas.Y / canvas.X
		elseif canvas.X > canvas.Y then
			X /= canvas.X / canvas.Y
		end
		return { X, Y }
	end
end
local Renderer
do
	Renderer = setmetatable({}, {
		__tostring = function()
			return "Renderer"
		end,
	})
	Renderer.__index = Renderer
	function Renderer.new(...)
		local self = setmetatable({}, Renderer)
		return self:constructor(...) or self
	end
	function Renderer:constructor(camera)
		self.camera = camera
	end
	function Renderer:point(x, y)
		local point = Instance.new("TextBox")
		point.Text = ""
		point.Size = UDim2.fromScale(0.01, 0.01)
		point.Position = UDim2.fromScale(x + 0.5, -y + 0.5)
		point.BorderSizePixel = 0
		point.BackgroundColor3 = Color3.new(1, 1, 1)
		point.Visible = true
		point.Parent = frame
		return point
	end
	function Renderer:drawPath(p1, p2)
		local line = self:point(0, 0)
		local x1 = p1.Position.X.Scale
		local y1 = p1.Position.Y.Scale
		local x2 = p2.Position.X.Scale
		local y2 = p2.Position.Y.Scale
		local _vector2 = Vector2.new(x1, y1)
		local _vector2_1 = Vector2.new(x2, y2)
		local distance = (_vector2 - _vector2_1).Magnitude
		line.Size = UDim2.fromScale(distance, 0.01)
		line.Rotation = math.atan2(y2 - y1, x2 - x1) * (180 / math.pi)
		line.Position = UDim2.fromScale((x1 + x2) * 0.5, (y1 + y2) * 0.5)
		line.AnchorPoint = Vector2.new(0.5, 0.5)
		return line
	end
end
local camera = Camera.new()
return {
	part = part,
}
