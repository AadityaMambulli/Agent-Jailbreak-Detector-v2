import json
import sys
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

notebook_path = os.path.join("notebooks", "metrics_analysis.ipynb")
with open(notebook_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

print(f"Loaded {notebook_path} with {len(nb['cells'])} cells.")

exec_globals = {
    "__name__": "__main__",
    "__file__": os.path.abspath(notebook_path),
}

# Change working directory to notebooks to mimic notebook runtime environment
os.chdir("notebooks")
try:
    for idx, cell in enumerate(nb["cells"]):
        if cell["cell_type"] == "code":
            source = "".join(cell["source"])
            print(f"\n--- Executing Code Cell {idx+1} ---")
            exec(source, exec_globals)
            plt.close("all")
    print("\n=======================================================")
    print("SUCCESS: All notebook cells executed with 0 errors!")
    print("=======================================================")
finally:
    os.chdir("..")
