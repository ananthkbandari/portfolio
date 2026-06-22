OPTIONAL: IN-BROWSER 3D MODELS
==============================

Any project can show a rotatable 3D model. The viewer (Google's
<model-viewer>) loads ONLY on projects that have a model, so projects
without one stay fast.

Supported format: .glb  (or .gltf). NOT .stl directly.

HOW TO ADD A 3D MODEL TO A PROJECT
----------------------------------
1. Export/convert your part to .glb:
     - From SOLIDWORKS: File > Save As > glTF Binary (*.glb) if available,
       OR export an .STL and convert it (next line).
     - Free STL -> GLB conversion: https://products.aspose.app/3d/conversion/stl-to-glb
       or the free desktop tool "Blender" (Import STL, then File > Export > glTF Binary).
2. Keep it small — decimate/simplify to roughly 5–15 MB so it loads quickly.
3. Host it:
     - Small enough (<25 MB) and you're happy committing it: place the .glb
       in this folder and force-add it (Git ignores .glb-adjacent binaries by
       default in some setups):   git add -f assets/models/your-part.glb
       Then set  "model": "assets/models/your-part.glb"  in data/projects.json.
     - Larger: upload to a GitHub Release (like the CAD files) and use that
       public URL as the "model" value.

If a project's "model" value is an empty string "", no viewer is shown.
