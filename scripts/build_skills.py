import os
import zipfile
import json
import shutil

SKILLS_DIR = os.path.join('assets', 'Lab', 'hermes-skills')
ZIPS_DIR = os.path.join('assets', 'Lab', 'zips')
MANIFEST_PATH = os.path.join('assets', 'Lab', 'skills.json')

if not os.path.exists(ZIPS_DIR):
    os.makedirs(ZIPS_DIR)

skills_manifest = []

for item in os.listdir(SKILLS_DIR):
    item_path = os.path.join(SKILLS_DIR, item)
    if os.path.isdir(item_path):
        zip_filename = f"{item}.zip"
        zip_filepath = os.path.join(ZIPS_DIR, zip_filename)
        
        # Zip the directory contents
        with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(item_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, item_path)
                    zipf.write(file_path, arcname)
        
        # Determine icon based on keyword heuristics
        icon_name = "box" 
        item_lower = item.lower()
        if "dev" in item_lower or "authoring" in item_lower:
            icon_name = "terminal"
        elif "agent" in item_lower or "persona" in item_lower or "ml" in item_lower:
            icon_name = "brain"
        elif "search" in item_lower or "research" in item_lower:
            icon_name = "flask-conical"
        elif "docker" in item_lower or "deploy" in item_lower or "auxiliary" in item_lower:
            icon_name = "server"
        elif "audit" in item_lower or "bypass" in item_lower or "pirate" in item_lower:
            icon_name = "shield-alert"
        elif "coin" in item_lower:
            icon_name = "coins"

        title = item.replace("-", " ").title()
        
        skills_manifest.append({
            "id": item,
            "title": title,
            "icon": icon_name,
            "downloadUrl": f"../assets/Lab/zips/{zip_filename}"
        })

with open(MANIFEST_PATH, 'w') as f:
    json.dump(skills_manifest, f, indent=2)

print(f"Successfully packaged {len(skills_manifest)} skills and generated skills.json manifest.")
