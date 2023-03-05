import type { HelmetServerState } from "react-helmet-async";

type TTemplate = {
  header: string;
  footer: string;
};

export const getHtmlTemplate = (props: {
  helmetData: HelmetServerState;
  scriptTags: string;
  styleTags: string;
}): TTemplate => ({
  header: `
    <!DOCTYPE html>
      <html lang="en">
        <head>
            <title>tower defense</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
            ${props.styleTags}
            ${props.helmetData.title.toString()}
            ${props.helmetData.meta.toString()}
        </head>
        <body>
          <noscript>
            <b>Enable JavaScript to run this app.</b>
          </noscript>
          <div id="root">`,
  footer: `</div>
          ${props.scriptTags}
        </body>
      </html>
  `,
});
