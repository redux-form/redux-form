[<img src="https://raw.githubusercontent.com/erikras/redux-form/master/logo.png" align="right" class="logo" height="100" width="165"/>](http://erikras.github.io/redux-form/)

# redux-form

---

[![NPM Version](https://img.shields.io/npm/v/redux-form.svg?style=flat)](https://www.npmjs.com/package/redux-form)
[![NPM Downloads](https://img.shields.io/npm/dm/redux-form.svg?style=flat)](https://npmcharts.com/compare/redux-form?minimal=true)
[![Build Status](https://img.shields.io/travis/erikras/redux-form/v6.svg?style=flat)](https://travis-ci.org/erikras/redux-form)
[![codecov.io](https://codecov.io/gh/erikras/redux-form/branch/master/graph/badge.svg)](https://codecov.io/gh/erikras/redux-form)
[![Code Climate](https://codeclimate.com/github/erikras/redux-form/badges/gpa.svg)](https://codeclimate.com/github/erikras/redux-form)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![PayPal donate button](http://img.shields.io/paypal/donate.png?color=yellowgreen)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3QQPTMLGV6GU2)
[![Twitter URL](https://img.shields.io/twitter/url/https/github.com/erikras/redux-form.svg?style=social)](https://twitter.com/intent/tweet?text=With%20@ReduxForm,%20I%20can%20keep%20all%20my%20form%20state%20in%20Redux!%20Thanks,%20@erikras!)
[![Patreon](https://img.shields.io/badge/patreon-support%20the%20author-blue.svg)](https://www.patreon.com/erikras)
[![Backers on Open Collective](https://opencollective.com/redux-form/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/redux-form/sponsors/badge.svg)](#sponsors)

`redux-form` works with [React Redux](https://github.com/reactjs/react-redux) to
enable an html form in [React](https://github.com/facebook/react) to use
[Redux](https://github.com/reactjs/redux) to store all of its state.
[![Beerpay](https://beerpay.io/erikras/redux-form/badge.svg)](https://beerpay.io/erikras/redux-form)

## ⚠️ ATTENTION ⚠️

If you're just getting started with your application and are looking for a form solution, the [general consensus of the community](https://twitter.com/acemarke/status/1124771065115185152) is that you should _not_ put your form state in Redux. The author of Redux Form took all of the lessons he learned about form use cases from maintaining Redux Form and built [🏁 React Final Form](https://github.com/final-form/react-final-form#-react-final-form), which he recommends you use if you are just starting your project. It's also pretty easy to migrate to from Redux Form, because the `<Field>` component APIs are so similar. [Here is a blog post](https://codeburst.io/final-form-the-road-to-the-checkered-flag-cd9b75c25fe) where he explains his reasoning, or [there are two talks](https://github.com/final-form/react-final-form#videos) if you prefer video. [Formik](https://jaredpalmer.com/formik/) is also a nice solution.

The only good reason, [in the author's view](https://twitter.com/erikras/status/1035082880341483520), to use Redux Form in your application is if you need _really_ tight coupling of your form data with Redux, specifically if you need to subscribe to it and modify it from parts of your application far from your form component, e.g. on another route. If you don't have that requirement, use [🏁 React Final Form](https://github.com/final-form/react-final-form#-react-final-form).

## Installation

`npm install --save redux-form`

## Documentation

- [Getting Started](https://redux-form.com/8.2.2/docs/GettingStarted.md/)
- [Examples](https://redux-form.com/8.2.2/examples/)
- [API](https://redux-form.com/8.2.2/docs/api/)
- [FAQ](https://redux-form.com/8.2.2/docs/faq/)
- [Release Notes](https://github.com/erikras/redux-form/releases)
- [Older Documentation](https://redux-form.com/8.2.2/docs/DocumentationVersions.md/)

## 🏖 Code Sandboxes 🏖

You can play around with `redux-form` in these sandbox versions of the Examples.

- [Simple Form](https://codesandbox.io/s/mZRjw05yp)
- [Synchronous Validation](https://codesandbox.io/s/pQj03w7Y6)
- [Field-Level Validation](https://codesandbox.io/s/PNQYw1kVy)
- [Submit Validation](https://codesandbox.io/s/XoA5vXDgA)
- [Asynchronous Blur Validation](https://codesandbox.io/s/nKlYo387)
- [Initializing From State](https://codesandbox.io/s/MQnD536Km)
- [Field Arrays](https://codesandbox.io/s/Ww4QG1Wx)
- [Remote Submit](https://codesandbox.io/s/ElYvJR21K)
- [Normalizing](https://codesandbox.io/s/L8KWERjDw)
- [Immutable JS](https://codesandbox.io/s/ZVGJQBJMw)
- [Selecting Form Values](https://codesandbox.io/s/gJOBWZMRZ)
- [Wizard Form](https://codesandbox.io/s/0Qzz3843)

## Videos

| [![A Practical Guide to Redux Form – React Alicante 2017](docs/ReactAlicante2017.gif)](https://youtu.be/ey7H8h4ERHg) |
| :------------------------------------------------------------------------------------------------------------------: |
|                              **A Practical Guide to Redux Form – React Alicante 2017**                               |

| [![Abstracting Form State with Redux Form – JS Channel 2016](docs/JSChannel2016.gif)](https://youtu.be/eDTi7lYR1VU) |
| :-----------------------------------------------------------------------------------------------------------------: |
|                            **Abstracting Form State with Redux Form – JS Channel 2016**                             |

## Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/erikras/redux-form/graphs/contributors"><img src="https://opencollective.com/redux-form/contributors.svg?width=890&button=false" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/redux-form#backer)]

<a href="https://opencollective.com/redux-form#backers" target="_blank"><img src="https://opencollective.com/redux-form/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/redux-form#sponsor)]

<a href="https://opencollective.com/redux-form/sponsor/0/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/1/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/2/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/3/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/4/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/5/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/6/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/7/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/8/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/redux-form/sponsor/9/website" target="_blank"><img src="https://opencollective.com/redux-form/sponsor/9/avatar.svg"></a>
