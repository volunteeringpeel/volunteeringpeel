# Code Structure

## TSX files

All .tsx files begin with imports, as specified by the tslint. However, the imports are split up to
make them easier to organize. The groups are as follows:

1. Library Imports. These are imports from `node_modules`.
2. App Imports. These are imports from `@app`.
3. Component Imports. These are non-controlled components from `@app/components`.
4. Controller Imports. These are controlled components (with `react-router` or `react-redux` or
   something else) from `@app/controllers`.
