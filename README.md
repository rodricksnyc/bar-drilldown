# Looker Custom Vis Template (with TypeScript)
An empty Hello World template with basic configuration for building a Looker custom visualization. Spin up a local development bundle with
`npm install` and `npm start`.

To render a custom visualization in your Looker instance, add a `visualization` parameter to your project's `manifest.lkml` file.
Deploy this change to production, navigate to an explore in your instance, and under the visualizations tab choose the new custom visualization
that you defined. You may need to set your browser to allow localhost's https certificate (navigate to `https://localhost:8080/bundle.js` > advanced > proceed)

<img width="557" alt="image" src="https://user-images.githubusercontent.com/93162346/192617937-c4f2ce7b-6ee8-4bd4-9466-8b2fbb3ea718.png">
<img width="1196" alt="image" src="https://user-images.githubusercontent.com/93162346/192617391-e624a2ea-9b30-44dd-ae47-c28c1c86faf7.png">


Here are helpful resources for developing a Looker custom vis:
- https://github.com/looker/custom_visualizations_v2/blob/master/docs/getting_started.md
- https://github.com/looker/custom_visualizations_v2
- https://cloud.google.com/looker/docs/reference/param-manifest-visualization

