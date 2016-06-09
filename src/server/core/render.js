// import fs from 'fs';
// import config from 'config';
// import {
//   provide,
//   enableProdMode,
//   expressEngine,
//   REQUEST_URL,
//   ORIGIN_URL,
//   BASE_URL,
//   NODE_ROUTER_PROVIDERS,
//   NODE_HTTP_PROVIDERS,
//   ExpressEngineConfig
// } from 'angular2-universal';
// import { DOCUMENT } from 'angular2/platform/common_dom';
// import RootComponent from '~/src/client/components/root/';

// // enableProdMode();

// export default async function renderApp(ctx, next) {

//   try {

//     fs.readFile(filePath, (err, content) => {

//       if (err) {

//         return done(err);

//       }

//       // convert to string
//       const clientHtml: string = content.toString();

//       // TODO: better build scripts abstraction
//       if (config.get('render.server') === false && config.get('render.client') === false) {

//         return done(null, clientHtml);

//       }
//       if (config.get('render.server') === false && config.get('render.client') !== false) {

//         return done(null, buildClientScripts(clientHtml, options));

//       }

//       // bootstrap and render component to string
//       const _options = options;
//       if (!EXPRESS_PLATFORM) {

//         const _template = clientHtml;
//         const _Bootloader = Bootloader;
//         let bootloader = _options.bootloader;
//         if (_options.bootloader) {

//           bootloader = _Bootloader.create(_options.bootloader);

//         } else {

//           let doc = _Bootloader.parseDocument(_template);
//           _options.document = doc;
//           _options.template = _options.template || _template;
//           bootloader = _Bootloader.create(_options);

//         }
//         EXPRESS_PLATFORM = bootloader;

//       }

//       EXPRESS_PLATFORM.serializeApplication(null, _options.reuseProviders === false ? null : _options.providers)
//         .then(html => done(null, buildClientScripts(html, options)))
//         .catch(e => {

//           console.error(e.stack);
//           // if server fail then return client html
//           done(null, buildClientScripts(clientHtml, options));

//         });

//     });

//   } catch (e) {

//     done(e);

//   }

//   // const baseUrl = '/';
//   // const url = ctx.url || '/';

//   // const config: ExpressEngineConfig = {
//   //   directives: [RootComponent],
//   //   platformProviders: [
//   //     // provide(ORIGIN_URL, { useValue: 'http://localhost:3000' }),
//   //     provide(BASE_URL, { useValue: baseUrl })
//   //   ],
//   //   providers: [
//   //     provide(REQUEST_URL, { useValue: url }),
//   //     NODE_ROUTER_PROVIDERS,
//   //     NODE_HTTP_PROVIDERS
//   //   ],
//   //   async: true,
//   //   preboot: false // { appRoot: 'app' } // your top level app component selector
//   // };

//   // ctx.body = ctx.render('index', config);

// }

// function buildClientScripts(html, options): string {
//   if (!options || !options.buildClientScripts) { return html; }
//   return html
//     .replace(
//       selectorRegExpFactory('preboot'),
//       ((options.preboot === false) ? '' : prebootScript(options))
//     )
//     .replace(
//       selectorRegExpFactory('angular'),
//       ((options.angular === false) ? '' : angularScript(options))
//     )
//     .replace(
//       selectorRegExpFactory('bootstrap'),
//       ((options.bootstrap === false) ? (
//         bootstrapButton +
//         bootstrapFunction(options)
//       ) : (
//         (
//           (options.client === undefined || options.server === undefined) ?
//           '' : (options.client === false) ? '' : bootstrapButton
//         ) +
//         bootstrapFunction(options) +
//         ((options.client === false) ? '' : bootstrapApp)
//       ))
//     );
// }
