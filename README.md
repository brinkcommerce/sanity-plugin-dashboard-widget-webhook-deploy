# sanity-dashboard-widget-webhook-deploy

Sanity Studio Dashboard Widget for triggering webhook deploys.

## Installing

### Install the dashboard plugin

To get dashboard support in Sanity Studio in general:

`sanity install @sanity/dashboard`

### Install the Netlify widget plugin

`sanity install dashboard-widget-webhook-deploy`

## Configuring

1. Implement your own dashboardConfig. In your `sanity.json` file, append the following line to the `parts` array:

```json
{
  "implements": "part:@sanity/dashboard/config",
  "path": "src/dashboardConfig.js"
}
```

2. Create the file `src/dashboardConfig.js` and inlcude the `webhook-deploy` widget config like this:

```js
export default {
  widgets: [
    {
      name: 'webhook-deploy',
      options: {
        builds: [
          {
            name: 'SE',
            buildHook: 'https://webhook.example.se',
            siteUrl: 'example.se',
          },
        ],
        previews: [
          {
            name: 'SE',
            previewHook: 'https://webhook.preview.example.com',
            previewUrl: 'https://preview-example.com/',
          },
        ],
        overrideStrings: {
          title: 'Deploy to production',
          previewTitle: 'Previw',
          previewLinkText: 'Go to preview site',
          previewButtonText: 'Start preview server',
          errorMessage: 'Could not deploy',
        },
      },
    },
  ],
}
```
