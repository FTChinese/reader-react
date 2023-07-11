# Reader Center

This app provides features for FTC user to manage account and subscription.

## Development

This project is generated by [Vite](https://vitejs.dev/)

To run this app locally, you must:

1. Setup MySQL with appropriate db schema;
2. Install Go;
3. Compile and run subscription-api;
4. Compile and run ftacademy
5. Run this app `npm run dev`.

Or you can proxy requests to production version of ftacademy by chaning `proxy` in `vite.config.ts`.

Or you can use [mockjs](http://mockjs.com/) to build a mocking backend service.

Pay attention:

* Never touch the `index.html` file unde project root. This file is generated. Instead you should edit files under `scripts/template` file and then run `npm run html-dev` to update this file.
* To upgrade bootstrap used in the `index.html`, update it in the `package.json` and then run `npm run html-dev`.

## Deployment workflow

Run `npm run publish` command, which will generate build bundle.

By default, `vite build` will generate a production bundle for js and css. It will also copy `index.html` file into `dist`. However, the URLs for js and css will probably not what you want in a production envirionment. `scripts/lib/deploy.ts` file provides a `prependAssetsUrl` function to modify these URLs with JSDOM.

The `npm run publish` performs these steps:

1. Run `npm version <major|minor|patch>` to increase version.
2. Run `vite build` to generate production bundler.
3. Run `npm run deploy` to
    1. Add a prefix to each JS and CSS URLs in `dist/index.html` file and save it as `dist/home.html`.
    2. geenerate a version file based on package.json field, then save it as `dist/client_version_reader`
    3. Copy `dist/assets/*js,css` files to SVN
    4. Copy `dist/client_version_reader` to the root of `superyard`
    5. Copy `dist/home.html` to `ftacademy/web/template/reader` directory.
4. In backend project `ftacademy`, commint the updated files and then add a new version tag.

Then you should commit SVN and rebuild Go binary in Jenkins.

Folder layouts on my machine are as follows:

```
$HOME
  |-- svn-online
    |-- ftac (SVN repository)
  |-- GolandProjects
    |-- ftacademy (the backend project)
    |-- reaader-react (thie project)
```

To copy production files into different folder structure, modiy `scripts/deploy.prod.ts` to suit your needs./

## Scripts Commands

* `dev` for local development
* `build` generated production html, js and css into `dist` directory
* `html-dev` update `index.html` file
* `deploy` modified `dist/index.html` by chaning js and css urls to production ones, and then copy js, css, and html to respective folders.
* `publish` Run `build` and `deploy` commands sequentially.

## Testing Payment

1. Enable test mode: in any of this app's url, append query parameter `?test=true`. This will initialize Stripe SDK with test publishable key.

2. Login with any of the test account found in Superyard. You will find a horizontal highlighted banner remiding you current mode and account type.

When you are in dev environment, any account is treated as a testing one.

## Stripe Integration

Stripe provides two versions of frontend SDK:

* Vanilla JS [Stripe.js](https://stripe.com/docs/js)
* React [Stripe.js](https://stripe.com/docs/stripe-js/react)

[Build a subscription integration](https://stripe.com/docs/billing/subscriptions/build-subscription)描述了在网页中创建订阅的前后端流程。这个流程先创建订阅，但是处于未支付状态，然后通过返回的[Subscription](https://stripe.com/docs/api/subscriptions/object)中的`latest_invoice.payment_intent`字段获取[PaymentIntents](https://stripe.com/docs/api/payment_intents/object)，使用Payment Intents的`client_secret`才能调用Stripe.js的[PaymentElement](https://stripe.com/docs/js/element/payment_element)显示表单要求用户输入支付信息。在用户输入支付信息之前，这个subscription的状态是`incomplete`，这时我们知道用户的状态是未支付的，可以暂时不提供服务。

但是，当我们通过[Combining trials with add_invoice_items](https://stripe.com/docs/billing/subscriptions/trials#combine-trial-add-invoice-items)在subscription中加入付费试用时，由于Stripe默认的试用是免费的，这种状态下创建的订阅不会生成`client_secret`，也就无法收集支付信息，而此时的订阅处于`trialing`状态，而不是`incomplete`。因此，最好在创建订阅前收集到支付信息，这需要用到[SetupIntents](https://stripe.com/docs/api/setup_intents)。Setup Intents的用途就是仅收集支付信息而不支付。Stripe.js中也提供相关的功能。

此处的实现采用了的流程如下：

1. 通过我方服务器，请求Stripe API为当前用户创建一个Setup Intent，获取该对象中包含的`client_secret`；

2. 把`client_scret`传递给React Stripe.js中的`Elements`，在它下面再创建`PaymentElement`，就可以显示输入支付方式的表单；

3. 用户点击保存后，调用Stripe.js的[confirmSetup](https://stripe.com/docs/js/setup_intents/confirm_setup)方法，此时应保存下本次订阅相关的数据存储到localStorage，以备跳转后使用；

4. Confirm setup成功后跳转到你指定的URL，在URL上会加上一些参数：

    * `setup_intent`: setup intent id;

    * `setup_intent_client_secret`：即步骤1中获取的`client_secret`;

    * `redirect_status`: 成功后为`succeeded`。

5. 调用Stripe.js的[retrieveSetupIntent](https://stripe.com/docs/js/setup_intents/retrieve_setup_intent)来获取到更新后的Setup Intent，此时它的`payment_method`字段就有值了。注意获取更新后的Setup Intent也可以通过请求我方服务器转发的方式获取，但是这种方式获取的数据可能尚未更新，因此用在前端调用Stripe SDK更稳妥。

6. 用上述`payment_method`，请求我方服务器获取[PaymentMethods](https://stripe.com/docs/api/payment_methods)的数据，可以把本次使用的支付方式显示给用户。

7. 提交服务器创建订阅时一并提交这个Payment Method的id，这个支付方式就成为本次订阅的扣款来源。

### Coupon

See [Discounts for subscriptions](https://stripe.com/docs/billing/subscriptions/coupons). Pay particular attention to **Coupon duration** section.
